/**
 * Aurelia Hotel & Restaurant Management - Authentication & Static Server
 * Built with Node.js built-in HTTP, SQLite (node:sqlite), and Crypto (node:crypto).
 * Provides local session authentication APIs and serves static/clean-URL pages.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 3000;
const MAX_JSON_BODY_BYTES = 1024 * 1024; // 1 MB guard against oversized request payloads
const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
);
const DB_FILE = isServerless ? path.join('/tmp', 'auth.db') : path.join(__dirname, 'auth.db');

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// =============================================================================
// 1. PASSWORD HASHING & DATABASE INITIALIZATION
// =============================================================================

/**
 * Derive a salted scrypt password hash encoded as hex.
 */
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

/**
 * Verify a plaintext password against a stored hex hash using timing-safe comparison.
 */
function verifyPassword(password, salt, expectedHash) {
  const hash = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, 'hex');
  if (hash.length !== expected.length) return false;
  return crypto.timingSafeEqual(hash, expected);
}

let db = null;
try {
  db = new DatabaseSync(DB_FILE);

  // Enable WAL mode for reliable concurrent reads/writes
  db.exec('PRAGMA journal_mode = WAL;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT,
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

  // Backfill username column on legacy databases if absent
  try {
    db.exec('ALTER TABLE users ADD COLUMN username TEXT;');
  } catch (alterErr) {
    /* Column already exists */
  }

  // Seed initial demo administrator if users table is empty
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM users').get();
  if (total === 0) {
    const seedSalt = crypto.randomBytes(16).toString('hex');
    const seedHash = hashPassword('password123', seedSalt);
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, salt, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
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
} catch (dbErr) {
  console.warn(' [Auth DB] Warning: SQLite initialization fallback:', dbErr.message);
}

// =============================================================================
// 2. HTTP, CORS & BODY PARSING HELPERS
// =============================================================================

/**
 * Parse Cookie HTTP header into a decoded key-value dictionary.
 */
function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = (parts.shift() || '').trim();
    if (!name) return;
    const rawVal = parts.join('=').trim();
    try {
      list[name] = decodeURIComponent(rawVal);
    } catch (e) {
      list[name] = rawVal;
    }
  });
  return list;
}

/**
 * Build standard CORS response headers matching request origin.
 */
function getCorsHeaders(req) {
  const origin = req && req.headers && req.headers['origin'];
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': origin ? 'true' : 'false'
  };
}

/**
 * Send a JSON HTTP response with CORS headers attached.
 */
function sendJson(res, statusCode, data, extraHeaders = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    ...getCorsHeaders(res.req),
    ...extraHeaders
  });
  res.end(JSON.stringify(data));
}

/**
 * Extract bearer token from Authorization header or HttpOnly session cookie.
 */
function getSessionToken(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  const cookies = parseCookies(req.headers['cookie']);
  return cookies['aurelia_session'] || null;
}

/**
 * Guard API endpoints against uninitialized SQLite instances.
 */
function ensureDatabaseReady(res) {
  if (db) return true;
  sendJson(res, 503, { error: 'Authentication database is currently unavailable.' });
  return false;
}

/**
 * Read and parse a bounded JSON request body, handling invalid JSON or oversized payloads cleanly.
 */
function readJsonBody(req, res, onParsed) {
  let body = '';
  let byteLength = 0;
  let aborted = false;

  req.on('data', chunk => {
    if (aborted) return;
    byteLength += chunk.length;
    if (byteLength > MAX_JSON_BODY_BYTES) {
      aborted = true;
      sendJson(res, 413, { error: 'Request payload too large.' });
      req.destroy();
      return;
    }
    body += chunk;
  });

  req.on('end', () => {
    if (aborted) return;
    try {
      onParsed(JSON.parse(body || '{}'));
    } catch (err) {
      sendJson(res, 400, { error: 'Malformed JSON request body.' });
    }
  });
}

/**
 * Stream a static file with no-cache headers and optional 404/500 handling.
 */
function sendFileResponse(res, targetPath, contentType, notFoundStatus = 500) {
  fs.readFile(targetPath, (readErr, content) => {
    if (readErr) {
      res.writeHead(notFoundStatus, { 'Content-Type': 'text/plain' });
      res.end(notFoundStatus === 404 ? '404 Not Found' : 'Error loading asset');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      ...NO_CACHE_HEADERS
    });
    res.end(content);
  });
}

// =============================================================================
// 3. HTTP SERVER, AUTH API ROUTES & STATIC ROUTING
// =============================================================================

const server = http.createServer((req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204, getCorsHeaders(req));
    res.end();
    return;
  }

  let pathname = '/';
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    pathname = decodeURIComponent(parsedUrl.pathname);
  } catch (urlErr) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }

  // API: GET /api/auth/me (Verify Session & Return Active User)
  if (req.method === 'GET' && pathname === '/api/auth/me') {
    if (!ensureDatabaseReady(res)) return;
    const token = getSessionToken(req);
    if (!token) {
      return sendJson(res, 401, { authenticated: false, message: 'No session token provided.' });
    }

    const session = db.prepare(`
      SELECT s.token, s.expires_at, u.id, u.name, u.username, u.email, u.role
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ?
    `).get(token);

    if (!session) {
      return sendJson(res, 401, { authenticated: false, message: 'Session does not exist.' });
    }

    if (session.expires_at < Date.now()) {
      db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
      return sendJson(res, 401, { authenticated: false, message: 'Session expired.' });
    }

    return sendJson(res, 200, {
      authenticated: true,
      user: {
        id: session.id,
        name: session.name,
        username: session.username || '',
        email: session.email,
        role: session.role
      }
    });
  }

  // API: POST /api/auth/register (Create User Account)
  if (req.method === 'POST' && pathname === '/api/auth/register') {
    if (!ensureDatabaseReady(res)) return;
    readJsonBody(req, res, (payload) => {
      try {
        const name = (payload.name || '').trim();
        const username = (payload.username || '').trim().replace(/^@+/, '');
        const email = (payload.email || '').trim().toLowerCase();
        const password = (payload.password || '').trim();
        const role = (payload.role || 'Front Desk Supervisor').trim();

        if (!name) {
          return sendJson(res, 400, { error: 'Full Name is required.' });
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return sendJson(res, 400, { error: 'Please provide a valid email address.' });
        }
        if (!password || password.length < 6) {
          return sendJson(res, 400, { error: 'Password must be at least 6 characters long.' });
        }

        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
          return sendJson(res, 409, { error: 'An account with this email address already exists.' });
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hash = hashPassword(password, salt);
        const userId = 'usr-' + crypto.randomUUID();

        db.prepare(`
          INSERT INTO users (id, name, username, email, password_hash, salt, role, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(userId, name, username, email, hash, salt, role, new Date().toISOString());

        console.log(` [Auth Server] New user registered: ${name} (${email})`);
        return sendJson(res, 201, {
          success: true,
          message: 'Account created successfully! You can now sign in with your credentials.',
          user: { id: userId, name, username, email, role }
        });
      } catch (err) {
        console.error(' [Auth Server Error] Register error:', err);
        return sendJson(res, 500, { error: 'Internal server error while creating account.' });
      }
    });
    return;
  }

  // API: POST /api/auth/login (Authenticate & Issue Session Cookie)
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    if (!ensureDatabaseReady(res)) return;
    readJsonBody(req, res, (payload) => {
      try {
        const email = (payload.email || '').trim().toLowerCase();
        const password = (payload.password || '').trim();
        const rememberMe = Boolean(payload.rememberMe);

        if (!email || !password) {
          return sendJson(res, 400, { error: 'Email and password are required.' });
        }

        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user || !verifyPassword(password, user.salt, user.password_hash)) {
          return sendJson(res, 401, { error: 'Invalid email address or password.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const durationMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        const expiresAt = Date.now() + durationMs;

        db.prepare(`
          INSERT INTO sessions (token, user_id, expires_at, created_at)
          VALUES (?, ?, ?, ?)
        `).run(token, user.id, expiresAt, new Date().toISOString());

        console.log(` [Auth Server] User logged in: ${user.name} (${user.email}) - Remember: ${rememberMe}`);
        const cookieMaxAge = Math.floor(durationMs / 1000);
        const cookieHeader = `aurelia_session=${token}; Max-Age=${cookieMaxAge}; Path=/; HttpOnly; SameSite=Lax`;

        return sendJson(res, 200, {
          success: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            username: user.username || '',
            email: user.email,
            role: user.role
          }
        }, { 'Set-Cookie': cookieHeader });
      } catch (err) {
        console.error(' [Auth Server Error] Login error:', err);
        return sendJson(res, 500, { error: 'Internal server error during authentication.' });
      }
    });
    return;
  }

  // API: POST /api/auth/logout (Revoke Session)
  if (req.method === 'POST' && pathname === '/api/auth/logout') {
    const token = getSessionToken(req);
    if (db && token) {
      db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    }
    return sendJson(res, 200, { success: true, message: 'Logged out successfully.' }, {
      'Set-Cookie': 'aurelia_session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax'
    });
  }

  // API: POST /api/auth/forgot-password (Password Recovery Notice)
  if (req.method === 'POST' && pathname === '/api/auth/forgot-password') {
    if (!ensureDatabaseReady(res)) return;
    readJsonBody(req, res, (payload) => {
      try {
        const email = (payload.email || '').trim().toLowerCase();
        const user = db.prepare('SELECT id, name FROM users WHERE email = ?').get(email);
        if (user) {
          console.log(` [Auth Server] Password recovery requested for: ${user.name} (${email})`);
        }
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

  // Static Asset & Clean-URL HTML Serving
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const requestedRel = (safePath === '/' || safePath === '\\') ? 'index.html' : safePath.replace(/^[/\\]+/, '');
  let filePath = path.resolve(__dirname, requestedRel);

  // Resolve extensionless routes (e.g., /notification -> notification.html or human-resources/*.html)
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    } else {
      const hrCandidateHtml = path.join(__dirname, 'human-resources', path.basename(filePath) + '.html');
      if (fs.existsSync(hrCandidateHtml)) {
        filePath = hrCandidateHtml;
      }
    }
  }

  // Security check: keep resolved paths strictly inside workspace directory
  if (filePath !== __dirname && !filePath.startsWith(__dirname + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const hrCandidate = path.join(__dirname, 'human-resources', path.basename(filePath));
      if (fs.existsSync(hrCandidate) && fs.statSync(hrCandidate).isFile()) {
        return sendFileResponse(res, hrCandidate, MIME_TYPES['.html']);
      }
      return sendFileResponse(res, path.join(__dirname, 'index.html'), MIME_TYPES['.html'], 404);
    }

    const ext = path.extname(filePath).toLowerCase();
    sendFileResponse(res, filePath, MIME_TYPES[ext] || 'application/octet-stream');
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
