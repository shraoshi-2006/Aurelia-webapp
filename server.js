/**
 * Aurelia Hotel & Restaurant Management - Secure Authentication Server
 * Built with Node.js built-in HTTP, SQLite (node:sqlite) and Crypto (node:crypto).
 * Zero external dependencies required.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'auth.db');

// =============================================================================
// 1. DATABASE INITIALIZATION & SCHEMA
// =============================================================================
const db = new DatabaseSync(DB_FILE);

// Enable WAL mode for high concurrency
db.exec('PRAGMA journal_mode = WAL;');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Front Desk Supervisor',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Password Hashing Helper (scrypt with salt)
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password, salt, expectedHash) {
  const hash = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, 'hex');
  if (hash.length !== expected.length) return false;
  return crypto.timingSafeEqual(hash, expected);
}

// Seed default administrative user if users table is empty
const countStmt = db.prepare('SELECT COUNT(*) AS total FROM users');
const { total } = countStmt.get();

if (total === 0) {
  const seedSalt = crypto.randomBytes(16).toString('hex');
  const seedHash = hashPassword('password123', seedSalt);
  const insertSeed = db.prepare(`
    INSERT INTO users (id, name, email, password_hash, salt, role, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertSeed.run(
    'usr-adaline',
    'Adaline Lively',
    'adalinea@gmail.com',
    seedHash,
    seedSalt,
    'Front Desk Supervisor',
    new Date().toISOString()
  );
  console.log(' [Auth DB] Seeded initial default account: adalinea@gmail.com / password123');
}

// =============================================================================
// 2. HTTP SERVER & ROUTING
// =============================================================================
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

function sendJson(res, statusCode, data, headers = {}) {
  const req = res.req;
  const origin = (req && req.headers && req.headers['origin']) || '*';
  const allowOrigin = origin === 'null' ? '*' : origin;
  const allowCredentials = allowOrigin === '*' ? 'false' : 'true';
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': allowCredentials,
    ...headers
  });
  res.end(body);
}

function getSessionToken(req) {
  // Check Authorization Bearer header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  // Check Cookie header
  const cookies = parseCookies(req.headers['cookie']);
  return cookies['aurelia_session'] || null;
}

const server = http.createServer((req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    const origin = req.headers['origin'] || '*';
    const allowOrigin = origin === 'null' ? '*' : origin;
    const allowCredentials = allowOrigin === '*' ? 'false' : 'true';
    res.writeHead(204, {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': allowCredentials
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // ===========================================================================
  // API ROUTE: GET /api/auth/me (Check Session & Get Active User)
  // ===========================================================================
  if (req.method === 'GET' && pathname === '/api/auth/me') {
    const token = getSessionToken(req);
    if (!token) {
      return sendJson(res, 401, { authenticated: false, message: 'No session token provided.' });
    }

    const sessionStmt = db.prepare(`
      SELECT s.token, s.expires_at, u.id, u.name, u.email, u.role
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ?
    `);
    const session = sessionStmt.get(token);

    if (!session) {
      return sendJson(res, 401, { authenticated: false, message: 'Session does not exist.' });
    }

    if (session.expires_at < Date.now()) {
      // Clean up expired session
      db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
      return sendJson(res, 401, { authenticated: false, message: 'Session expired.' });
    }

    return sendJson(res, 200, {
      authenticated: true,
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role
      }
    });
  }

  // ===========================================================================
  // API ROUTE: POST /api/auth/register (Create Account)
  // ===========================================================================
  if (req.method === 'POST' && pathname === '/api/auth/register') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const name = (payload.name || '').trim();
        const email = (payload.email || '').trim().toLowerCase();
        const password = (payload.password || '').trim();
        const role = (payload.role || 'Front Desk Supervisor').trim();

        // Validation
        if (!name) {
          return sendJson(res, 400, { error: 'Full Name is required.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          return sendJson(res, 400, { error: 'Please provide a valid email address.' });
        }

        if (!password || password.length < 6) {
          return sendJson(res, 400, { error: 'Password must be at least 6 characters long.' });
        }

        // Check duplicate email
        const existingStmt = db.prepare('SELECT id FROM users WHERE email = ?');
        const existing = existingStmt.get(email);
        if (existing) {
          return sendJson(res, 409, { error: 'An account with this email address already exists.' });
        }

        // Hash password securely with salt
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = hashPassword(password, salt);
        const userId = 'usr-' + crypto.randomUUID();

        const insertStmt = db.prepare(`
          INSERT INTO users (id, name, email, password_hash, salt, role, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        insertStmt.run(userId, name, email, hash, salt, role, new Date().toISOString());

        console.log(` [Auth Server] New user registered: ${name} (${email})`);
        return sendJson(res, 201, {
          success: true,
          message: 'Account created successfully! You can now sign in with your credentials.',
          user: { id: userId, name, email, role }
        });
      } catch (err) {
        console.error(' [Auth Server Error] Register error:', err);
        return sendJson(res, 500, { error: 'Internal server error while creating account.' });
      }
    });
    return;
  }

  // ===========================================================================
  // API ROUTE: POST /api/auth/login (Authenticate & Issue Session)
  // ===========================================================================
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const email = (payload.email || '').trim().toLowerCase();
        const password = (payload.password || '').trim();
        const rememberMe = Boolean(payload.rememberMe);

        if (!email || !password) {
          return sendJson(res, 400, { error: 'Email and password are required.' });
        }

        const userStmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = userStmt.get(email);

        if (!user) {
          return sendJson(res, 401, { error: 'Invalid email address or password.' });
        }

        const isValid = verifyPassword(password, user.salt, user.password_hash);
        if (!isValid) {
          return sendJson(res, 401, { error: 'Invalid email address or password.' });
        }

        // Generate 32-byte session token
        const token = crypto.randomBytes(32).toString('hex');
        // Expiry: 30 days if rememberMe, 24 hours otherwise
        const durationMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const expiresAt = Date.now() + durationMs;

        const sessionStmt = db.prepare(`
          INSERT INTO sessions (token, user_id, expires_at, created_at)
          VALUES (?, ?, ?, ?)
        `);
        sessionStmt.run(token, user.id, expiresAt, new Date().toISOString());

        console.log(` [Auth Server] User logged in: ${user.name} (${user.email}) - Remember: ${rememberMe}`);

        // Set-Cookie Header
        const cookieMaxAge = Math.floor(durationMs / 1000);
        const cookieHeader = `aurelia_session=${token}; Max-Age=${cookieMaxAge}; Path=/; HttpOnly; SameSite=Lax`;

        return sendJson(res, 200, {
          success: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }, {
          'Set-Cookie': cookieHeader
        });
      } catch (err) {
        console.error(' [Auth Server Error] Login error:', err);
        return sendJson(res, 500, { error: 'Internal server error during authentication.' });
      }
    });
    return;
  }

  // ===========================================================================
  // API ROUTE: POST /api/auth/logout (Revoke Session)
  // ===========================================================================
  if (req.method === 'POST' && pathname === '/api/auth/logout') {
    const token = getSessionToken(req);
    if (token) {
      db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    }
    const clearCookie = 'aurelia_session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax';
    return sendJson(res, 200, { success: true, message: 'Logged out successfully.' }, {
      'Set-Cookie': clearCookie
    });
  }

  // ===========================================================================
  // API ROUTE: POST /api/auth/forgot-password (Password Recovery Notice)
  // ===========================================================================
  if (req.method === 'POST' && pathname === '/api/auth/forgot-password') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const email = (payload.email || '').trim().toLowerCase();
        const user = db.prepare('SELECT id, name FROM users WHERE email = ?').get(email);

        if (user) {
          console.log(` [Auth Server] Password recovery requested for: ${user.name} (${email})`);
        }

        // Generic safe response to prevent user enumeration
        return sendJson(res, 200, {
          success: true,
          message: 'If an account exists with this email, recovery instructions have been sent.'
        });
      } catch (err) {
        return sendJson(res, 500, { error: 'Failed to process password recovery.' });
      }
    });
    return;
  }

  // ===========================================================================
  // STATIC ASSET SERVING
  // ===========================================================================
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(__dirname, safePath);

  // Security check: ensure path is within directory
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If HTML route not found, fallback to index.html for SPA support
      const indexPath = path.join(__dirname, 'index.html');
      fs.readFile(indexPath, (indexErr, content) => {
        if (indexErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading asset');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(` ✨ Aurelia Hotel Financial Management - Server is RUNNING`);
  console.log(` 🌐 Web Application: http://localhost:${PORT}`);
  console.log(` 🔐 SQLite Authentication Database: ${DB_FILE}`);
  console.log(` 🔑 Demo Login: adalinea@gmail.com / password123`);
  console.log(`=============================================================\n`);
});
