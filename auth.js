/**
 * Aurelia Hotel & Restaurant Management - Authentication Controller
 * Handles user authentication, session persistence, inline form validation,
 * view transitions, route guarding, and UI state synchronization.
 * Includes offline/local fallback support so login works reliably in all environments.
 */

(function () {
  'use strict';

  // API Base URL configuration:
  // - If running directly on backend server (port 3000): use window.location.origin
  // - If running via Live Server (port 5500, etc.), Vite, or file:// protocol: route to http://localhost:3000
  // - If deployed on production domain: use window.location.origin
  function getApiBaseUrl() {
    try {
      const loc = window.location;
      if (!loc || !loc.href) return 'http://localhost:3000';

      // 1. If currently served directly from node server.js on port 3000
      if (loc.port === '3000') {
        return loc.origin;
      }

      // 2. If running locally (VS Code Live Server on 5500, Vite, file:// protocol)
      const isLocal = !loc.hostname || loc.hostname === 'localhost' || loc.hostname === '127.0.0.1' || loc.protocol === 'file:';
      if (isLocal) {
        const host = loc.hostname === '127.0.0.1' ? '127.0.0.1' : 'localhost';
        return `http://${host}:3000`;
      }

      // 3. Static host without Node.js backend (e.g. GitHub Pages, Vercel, Netlify)
      const isStaticHost = loc.hostname && (
        loc.hostname.includes('github.io') ||
        loc.hostname.includes('vercel.app') ||
        loc.hostname.includes('netlify.app') ||
        loc.hostname.includes('pages.dev') ||
        loc.hostname.includes('surge.sh')
      );
      if (isStaticHost) {
        return null;
      }

      return loc.origin || null;
    } catch (e) {
      return 'http://localhost:3000';
    }
  }

  const API_BASE = getApiBaseUrl();

  const STORAGE_KEY_TOKEN = 'aurelia_auth_token';
  const STORAGE_KEY_USER = 'aurelia_auth_user';
  const STORAGE_KEY_LOCAL_USERS = 'aurelia_local_users';

  // Application Auth State
  const AuthState = {
    isAuthenticated: false,
    currentUser: null,
    token: localStorage.getItem(STORAGE_KEY_TOKEN) || sessionStorage.getItem(STORAGE_KEY_TOKEN) || null
  };

  // Seed default admin and manager in local registry if not present
  function getLocalUsers() {
    const defaultList = [
      {
        id: 'usr-adaline',
        name: 'Adaline Lively',
        email: 'adalinea@gmail.com',
        password: 'password123',
        role: 'Front Desk Supervisor'
      },
      {
        id: 'usr-admin',
        name: 'Hotel Manager',
        email: 'admin@aureliahotel.com',
        password: 'admin123',
        role: 'General Manager'
      }
    ];

    try {
      const stored = localStorage.getItem(STORAGE_KEY_LOCAL_USERS);
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          defaultList.forEach(defUser => {
            if (!list.some(u => u.email && u.email.toLowerCase() === defUser.email.toLowerCase())) {
              list.push(defUser);
            }
          });
          return list;
        }
      }
    } catch (e) { }

    localStorage.setItem(STORAGE_KEY_LOCAL_USERS, JSON.stringify(defaultList));
    return defaultList;
  }

  function saveLocalUser(userObj) {
    const list = getLocalUsers();
    const existingIndex = list.findIndex(u => u.email.toLowerCase() === userObj.email.toLowerCase());
    if (existingIndex >= 0) {
      list[existingIndex] = userObj;
    } else {
      list.push(userObj);
    }
    localStorage.setItem(STORAGE_KEY_LOCAL_USERS, JSON.stringify(list));
  }

  /**
   * Sync any local offline users from localStorage into SQLite auth.db
   */
  async function syncLocalUsersToDatabase() {
    if (!API_BASE) return;
    try {
      const localUsers = getLocalUsers();
      for (const u of localUsers) {
        if (!u.email || !u.password || u.email.toLowerCase() === 'adalinea@gmail.com') continue;
        await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: u.name, email: u.email, password: u.password, role: u.role || 'Front Desk Supervisor' })
        }).catch(() => { });
      }
    } catch (e) { }
  }

  // DOM Elements Cache
  const DOM = {
    sessionLoader: null,
    authContainer: null,
    dashboardWrapper: null,
    mobileHeader: null,
    loginCard: null,
    registerCard: null,
    forgotCard: null,
    logoutModal: null,
    loginForm: null,
    registerForm: null,
    forgotForm: null,
    userProfileCapsule: null,
    userAvatarBadge: null,
    userNameBadge: null,
    userRoleBadge: null
  };

  function $(id) {
    return document.getElementById(id);
  }

  /**
   * Initialize DOM references
   */
  function initDOM() {
    DOM.sessionLoader = $('app-session-loader');
    DOM.authContainer = $('auth-container');
    DOM.dashboardWrapper = $('app-dashboard-wrapper');
    DOM.mobileHeader = $('app-mobile-header');
    DOM.loginCard = $('auth-card-login');
    DOM.registerCard = $('auth-card-register');
    DOM.forgotCard = $('auth-card-forgot');
    DOM.logoutModal = $('modal-logout-confirm');

    DOM.loginForm = $('form-login');
    DOM.registerForm = $('form-register');
    DOM.forgotForm = $('form-forgot');

    DOM.userProfileCapsule = $('user-profile-capsule');
    DOM.userNameBadge = $('topbar-user-name');
    DOM.userRoleBadge = $('topbar-user-role');
    DOM.userAvatarBadge = $('topbar-user-avatar');
  }

  /**
   * Display or hide error alert in a given form card
   */
  function showAlert(containerId, message, type = 'error') {
    const alertBox = $(containerId);
    if (!alertBox) return;

    if (!message) {
      alertBox.classList.add('hidden');
      alertBox.style.display = 'none';
      alertBox.textContent = '';
      return;
    }

    alertBox.style.display = 'flex';
    alertBox.className = 'p-3.5 mb-5 rounded-lg text-xs leading-relaxed flex items-start gap-2.5 transition-all';
    if (type === 'error') {
      alertBox.className += ' bg-rose-50 border border-rose-200 text-rose-800';
      alertBox.innerHTML = `
        <svg class="w-4 h-4 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>${escapeHtml(message)}</span>
      `;
    } else if (type === 'success') {
      alertBox.className += ' bg-emerald-50 border border-emerald-200 text-emerald-800';
      alertBox.innerHTML = `
        <svg class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>${escapeHtml(message)}</span>
      `;
    } else {
      alertBox.className += ' bg-blue-50 border border-blue-200 text-blue-800';
      alertBox.innerHTML = `
        <svg class="w-4 h-4 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>${escapeHtml(message)}</span>
      `;
    }
    alertBox.classList.remove('hidden');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Set button loading state
   */
  function setButtonLoading(btnId, isLoading, defaultText = 'Sign In to Aurelia') {
    const btn = $(btnId);
    if (!btn) return;
    if (isLoading) {
      btn.disabled = true;
      btn.dataset.originalHtml = btn.innerHTML;
      btn.innerHTML = `
        <span class="inline-flex items-center justify-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Signing In...</span>
        </span>
      `;
      btn.classList.add('opacity-75', 'cursor-not-allowed');
    } else {
      btn.disabled = false;
      btn.innerHTML = btn.dataset.originalHtml || defaultText;
      btn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  }

  /**
   * View switcher between login, register, and forgot cards
   */
  function showView(view) {
    initDOM();
    if (DOM.authContainer) {
      DOM.authContainer.classList.remove('hidden');
      DOM.authContainer.style.display = 'flex';
    }

    if (DOM.dashboardWrapper) {
      DOM.dashboardWrapper.classList.add('hidden');
      DOM.dashboardWrapper.style.display = 'none';
    }

    // Manage view classes on auth-card-frame for reel-inspired curved sliding transitions
    const cardFrame = $('auth-card-frame');
    if (cardFrame) {
      cardFrame.classList.remove('view-login', 'view-register', 'view-forgot');
      cardFrame.classList.add('view-' + view);
    }

    // Keep cards in DOM without display:none so CSS sliding animations play seamlessly
    if (DOM.loginCard) DOM.loginCard.classList.remove('hidden');
    if (DOM.registerCard) DOM.registerCard.classList.remove('hidden');
    if (DOM.forgotCard) DOM.forgotCard.classList.remove('hidden');

    if (typeof updateCharacterSpeechForView === 'function') {
      updateCharacterSpeechForView(view);
    }

    showAlert('alert-login', '');
    showAlert('alert-register', '');
    showAlert('alert-forgot', '');
  }

  /**
   * Update Dashboard User Profile Displays
   */
  function syncUserProfile(user) {
    if (!user) return;

    if (DOM.userNameBadge) {
      DOM.userNameBadge.textContent = user.name || 'Adaline Lively';
    }

    if (DOM.userRoleBadge) {
      DOM.userRoleBadge.textContent = user.role || 'Front Desk Supervisor';
    }

    const topGreeting = $('topbar-welcome-title');
    if (topGreeting) {
      const firstName = (user.name || 'Adaline').split(' ')[0];
      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
      topGreeting.textContent = `${timeGreeting}, ${firstName}!`;
    }

    const avatarBtn = $('topbar-user-avatar');
    const avatarText = $('topbar-user-avatar-text');
    const avatarImg = $('topbar-user-avatar-img');
    const initials = (user.name || 'Adaline Lively')
      .split(' ')
      .filter(Boolean)
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AL';

    if (user.avatar && avatarImg) {
      avatarImg.src = user.avatar;
      avatarImg.classList.remove('hidden');
      if (avatarText) avatarText.classList.add('hidden');
    } else {
      if (avatarImg) avatarImg.classList.add('hidden');
      if (avatarText) {
        avatarText.textContent = initials;
        avatarText.classList.remove('hidden');
      } else if (avatarBtn) {
        avatarBtn.textContent = initials;
      }
    }
  }

  /**
   * Show Dashboard UI & Hide Auth UI
   */
  function renderAuthenticatedState(user) {
    AuthState.isAuthenticated = true;
    AuthState.currentUser = user;

    initDOM();

    // 1. Hide Loader
    if (DOM.sessionLoader) {
      DOM.sessionLoader.classList.add('hidden');
      DOM.sessionLoader.style.display = 'none';
    }

    // 2. Hide Auth Container
    if (DOM.authContainer) {
      DOM.authContainer.classList.add('hidden');
      DOM.authContainer.style.display = 'none';
    }

    // 3. Reveal Dashboard Wrapper
    if (DOM.dashboardWrapper) {
      DOM.dashboardWrapper.classList.remove('hidden');
      DOM.dashboardWrapper.style.display = 'flex';
    }

    // 4. Reveal Mobile Header if viewport is small
    if (DOM.mobileHeader) {
      DOM.mobileHeader.classList.remove('hidden');
    }

    // 5. Sync profile details
    syncUserProfile(user);

    // 6. Determine target section based on page path and hash
    const currentPath = (window.location.pathname || '').toLowerCase();
    let pageDefaultSec = null;
    if (currentPath.includes('hr-employee-list')) pageDefaultSec = 'hr-documents';
    else if (currentPath.includes('employee-list')) pageDefaultSec = 'employees';
    else if (currentPath.includes('add-employee')) pageDefaultSec = 'add-employee';
    else if (currentPath.includes('hr-document')) pageDefaultSec = 'hr-documents';
    else if (currentPath.includes('holiday')) pageDefaultSec = 'holidays';
    else if (currentPath.includes('billing.html') || currentPath.endsWith('billing')) pageDefaultSec = 'billing';
    else if (currentPath.includes('order.html') || currentPath.endsWith('order')) pageDefaultSec = 'orders';
    else if (currentPath.includes('menu.html') || currentPath.endsWith('menu')) pageDefaultSec = 'menu';
    else if (currentPath.includes('customer.html') || currentPath.endsWith('customer')) pageDefaultSec = 'customers';
    else if (currentPath.includes('analytics.html') || currentPath.endsWith('analytics')) pageDefaultSec = 'analytics';
    else if (currentPath.includes('all_department')) pageDefaultSec = 'all-departments';
    else if (currentPath.includes('add_department')) pageDefaultSec = 'add-department';

    if (pageDefaultSec) {
      // On standalone HR pages: maintain page's own section, never bounce back to dashboard
      if (!window.location.hash || ['#login', '#register', '#forgot', '#dashboard'].includes(window.location.hash)) {
        window.location.hash = '#' + pageDefaultSec;
      }
    } else {
      // On index.html: default to #dashboard
      if (!window.location.hash || ['#login', '#register', '#forgot'].includes(window.location.hash)) {
        window.location.hash = '#dashboard';
      }
    }

    // 7. Explicitly switch section to target
    const targetSection = pageDefaultSec ||
      ((window.location.hash && !['#login', '#register', '#forgot'].includes(window.location.hash))
        ? window.location.hash.replace('#', '')
        : 'dashboard');

    if (typeof window.switchSection === 'function') {
      window.switchSection(targetSection);
    } else if (typeof window.syncSectionWithHash === 'function') {
      window.syncSectionWithHash();
    } else {
      const dashSec = $('section-dashboard');
      if (dashSec) dashSec.classList.remove('hidden');
    }

    if (typeof window.renderSidebarBadges === 'function') {
      window.renderSidebarBadges();
    }

    // Clean any query string from URL if form submission polluted it
    if (window.location.search) {
      const cleanUrl = window.location.pathname + (window.location.hash || '#dashboard');
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  /**
   * Show Auth UI & Hide Dashboard UI
   */
  function renderUnauthenticatedState(targetView = 'login') {
    AuthState.isAuthenticated = false;
    AuthState.currentUser = null;

    initDOM();

    if (DOM.sessionLoader) {
      DOM.sessionLoader.classList.add('hidden');
      DOM.sessionLoader.style.display = 'none';
    }

    if (DOM.dashboardWrapper) {
      DOM.dashboardWrapper.classList.add('hidden');
      DOM.dashboardWrapper.style.display = 'none';
    }

    if (DOM.mobileHeader) {
      DOM.mobileHeader.classList.add('hidden');
    }

    showView(targetView);
  }

  /**
   * Verify Session via API or Cached State
   */
  async function checkSession() {
    initDOM();
    if (DOM.sessionLoader) {
      DOM.sessionLoader.classList.remove('hidden');
      DOM.sessionLoader.style.display = 'flex';
    }

    // If user explicitly requests #login, show login page
    if (window.location.hash === '#login') {
      renderUnauthenticatedState('login');
      return;
    }

    const token = AuthState.token;
    const cachedUserStr = localStorage.getItem(STORAGE_KEY_USER) || sessionStorage.getItem(STORAGE_KEY_USER);

    // First try backend API if token exists and API_BASE is configured
    if (token) {
      if (API_BASE) {
        try {
          const response = await fetch(`${API_BASE}/api/auth/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            if (data.authenticated && data.user) {
              renderAuthenticatedState(data.user);
              return;
            }
          } else if (response.status === 404 || response.status === 405 || response.status >= 500) {
            // Server API missing or error: validate using cached user
            if (cachedUserStr) {
              try {
                const cachedUser = JSON.parse(cachedUserStr);
                renderAuthenticatedState(cachedUser);
                return;
              } catch (e) { }
            }
          }
        } catch (err) {
          // Fallback to cached user if server is offline
          if (cachedUserStr) {
            try {
              const cachedUser = JSON.parse(cachedUserStr);
              renderAuthenticatedState(cachedUser);
              return;
            } catch (e) { }
          }
        }
      } else if (cachedUserStr) {
        // Pure static mode: validate directly with cached session
        try {
          const cachedUser = JSON.parse(cachedUserStr);
          renderAuthenticatedState(cachedUser);
          return;
        } catch (e) { }
      }
    }

    // Default to unauthenticated login view
    renderUnauthenticatedState('login');
  }

  /**
   * Perform Login
   */
  async function handleLogin(e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    initDOM();
    showAlert('alert-login', '');

    const emailInput = $('login-email');
    const passwordInput = $('login-password');
    const rememberMeInput = $('login-remember');

    const email = (emailInput?.value || '').trim();
    const password = (passwordInput?.value || '').trim();
    const rememberMe = Boolean(rememberMeInput?.checked);

    if (!email) {
      showAlert('alert-login', 'Please enter your registered email address.');
      emailInput?.focus();
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('alert-login', 'Please enter a valid email address.');
      emailInput?.focus();
      return false;
    }

    if (!password) {
      showAlert('alert-login', 'Please enter your account password.');
      passwordInput?.focus();
      return false;
    }

    setButtonLoading('btn-login-submit', true);

    // Local / Offline authentication helper
    function loginLocally() {
      const localUsers = getLocalUsers();
      const matchedUser = localUsers.find(u =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
      );

      if (matchedUser) {
        const token = 'local-token-' + Date.now();
        const safeUser = {
          id: matchedUser.id || ('usr-' + Date.now()),
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role || 'Front Desk Supervisor'
        };

        AuthState.token = token;
        if (rememberMe) {
          localStorage.setItem(STORAGE_KEY_TOKEN, token);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(safeUser));
        } else {
          sessionStorage.setItem(STORAGE_KEY_TOKEN, token);
          sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(safeUser));
          localStorage.removeItem(STORAGE_KEY_TOKEN);
          localStorage.removeItem(STORAGE_KEY_USER);
        }

        setButtonLoading('btn-login-submit', false);
        renderAuthenticatedState(safeUser);
        return false;
      }

      showAlert('alert-login', 'Invalid email address or password.');
      setButtonLoading('btn-login-submit', false);
      return false;
    }

    // In static mode (e.g. Vercel), authenticate immediately using localStorage
    if (!API_BASE) {
      return loginLocally();
    }

    // 1. Try Live Server API
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        const token = data.token;
        const user = data.user;
        AuthState.token = token;

        if (rememberMe) {
          localStorage.setItem(STORAGE_KEY_TOKEN, token);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        } else {
          sessionStorage.setItem(STORAGE_KEY_TOKEN, token);
          sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
          localStorage.removeItem(STORAGE_KEY_TOKEN);
          localStorage.removeItem(STORAGE_KEY_USER);
        }

        saveLocalUser({ ...user, password });

        setButtonLoading('btn-login-submit', false);
        renderAuthenticatedState(user);
        return false;
      } else if (res.status === 404 || res.status === 405 || res.status >= 500) {
        // Backend API route not found on this host (e.g. Vercel static host or proxy)
        console.warn(`[Auth API] Server returned ${res.status}. Falling back to local offline credentials.`);
        return loginLocally();
      } else {
        const data = await res.json().catch(() => ({}));
        // If 401 or backend check failed, verify if valid in local user registry before failing
        const localUsers = getLocalUsers();
        const matched = localUsers.find(u =>
          u.email && u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
        );
        if (matched) {
          console.warn('[Auth API] Server rejected credentials but valid local credentials found. Logging in locally.');
          return loginLocally();
        }

        showAlert('alert-login', data.error || 'Invalid email address or password.');
        setButtonLoading('btn-login-submit', false);
        return false;
      }

    } catch (netErr) {
      // 2. Offline / Local Fallback Mode
      console.warn('Authentication API unreachable. Using local user registry:', netErr);
      return loginLocally();
    }
  }

  /**
   * Perform Registration
   */
  async function handleRegister(e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    initDOM();
    showAlert('alert-register', '');

    const nameInput = $('reg-name');
    const emailInput = $('reg-email');
    const passwordInput = $('reg-password');
    const confirmInput = $('reg-confirm-password');
    const termsInput = $('reg-terms');

    const name = (nameInput?.value || '').trim();
    const email = (emailInput?.value || '').trim();
    const password = (passwordInput?.value || '').trim();
    const confirmPassword = (confirmInput?.value || '').trim();
    const termsAccepted = Boolean(termsInput?.checked);

    if (!name) {
      showAlert('alert-register', 'Full Name is required.');
      nameInput?.focus();
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showAlert('alert-register', 'Please enter a valid work email address.');
      emailInput?.focus();
      return false;
    }

    if (!password || password.length < 6) {
      showAlert('alert-register', 'Password must be at least 6 characters long.');
      passwordInput?.focus();
      return false;
    }

    if (password !== confirmPassword) {
      showAlert('alert-register', 'Passwords do not match. Please verify your entries.');
      confirmInput?.focus();
      return false;
    }

    if (!termsAccepted) {
      showAlert('alert-register', 'You must agree to the Aurelia Service Terms & Hospitality Guidelines to continue.');
      return false;
    }

    setButtonLoading('btn-register-submit', true, 'Creating Account...');

    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      email,
      password,
      role: 'Front Desk Supervisor'
    };

    // 1. Try Backend API (persists into SQLite auth.db)
    let savedToDatabase = false;
    let serverWarning = null;

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role: newUser.role })
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          savedToDatabase = true;
          if (data.user && data.user.id) {
            newUser.id = data.user.id;
          }
        } else if (res.status === 404) {
          // Endpoint not found on static/local proxy host; fallback to local storage
          console.warn('[Auth Server] Backend route 404 at ' + API_BASE + ', saving to local registry.');
        } else {
          // Specific backend validation or duplicate error (400, 409, 500)
          showAlert('alert-register', data.error || 'Failed to create account.');
          setButtonLoading('btn-register-submit', false, 'Create Staff Account');
          return false;
        }
      } catch (err) {
        console.warn('[Auth Server] Backend API unreachable at ' + API_BASE + ':', err);
        serverWarning = 'Backend server (node server.js) is offline. Saved locally in browser session.';
      }
    }

    // Always cache locally as well for offline resilience
    saveLocalUser(newUser);

    setButtonLoading('btn-register-submit', false, 'Create Staff Account');
    DOM.registerForm?.reset();

    showView('login');
    if ($('login-email')) {
      $('login-email').value = email;
    }

    if (savedToDatabase) {
      showAlert('alert-login', 'Staff account created and saved to auth.db! You can now sign in.', 'success');
    } else {
      showAlert('alert-login', serverWarning || 'Account created successfully! Please sign in with your credentials.', 'success');
    }
    return false;
  }

  /**
   * Handle Password Recovery
   */
  async function handleForgotPassword(e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    initDOM();
    showAlert('alert-forgot', '');

    const emailInput = $('forgot-email');
    const email = (emailInput?.value || '').trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showAlert('alert-forgot', 'Please enter a valid email address.');
      emailInput?.focus();
      return false;
    }

    setButtonLoading('btn-forgot-submit', true, 'Sending Instructions...');

    if (API_BASE) {
      try {
        await fetch(`${API_BASE}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
          credentials: 'include'
        });
      } catch (e) { }
    }

    setButtonLoading('btn-forgot-submit', false, 'Send Reset Instructions');
    showAlert('alert-forgot', 'If an account exists, recovery instructions have been sent.', 'success');
    if (emailInput) emailInput.value = '';
    return false;
  }

  /**
   * Show Logout Confirmation Dialog
   */
  function showLogoutConfirmation() {
    initDOM();
    if (DOM.logoutModal) {
      DOM.logoutModal.classList.remove('hidden');
      DOM.logoutModal.style.display = 'flex';
    } else {
      if (confirm('Are you sure you want to log out of the Aurelia POS System?')) {
        handleLogout();
      }
    }
  }

  /**
   * Hide Logout Confirmation Dialog
   */
  function hideLogoutConfirmation() {
    initDOM();
    if (DOM.logoutModal) {
      DOM.logoutModal.classList.add('hidden');
      DOM.logoutModal.style.display = 'none';
    }
  }

  /**
   * Execute Logout
   */
  async function handleLogout() {
    hideLogoutConfirmation();

    const token = AuthState.token;
    if (API_BASE && token && !token.startsWith('local-token-')) {
      try {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });
      } catch (e) { }
    }

    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
    sessionStorage.removeItem(STORAGE_KEY_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_USER);
    AuthState.token = null;

    DOM.loginForm?.reset();
    renderUnauthenticatedState('login');
    showAlert('alert-login', 'You have been securely logged out.', 'info');
  }

  let updateCharacterSpeechForView = null;

  /**
   * 3D Concierge Character Animation & Interactive Speech Engine (Instagram Reel Inspired)
   * Provides dynamic 3D parallax tracking following mouse cursor position,
   * animated speech bubble responses when focusing fields or clicking character,
   * playful bounces, and smooth perspective tilting.
   */
  function initCharacterInteraction() {
    const authContainer = $('auth-container');
    const charStage = $('auth-3d-character-stage');
    const charFigure = $('character-figure-container');
    const charSprite = $('character-sprite-wrapper');
    const bubble = $('character-speech-bubble');
    const bubbleText = $('speech-bubble-text');
    const cardFrame = $('auth-card-frame');

    if (!authContainer || !charStage || !bubble || !bubbleText) return;

    let revertTimer = null;
    let defaultSpeech = 'Here is your form! ✨';

    function setSpeech(text, isTemporary = false, durationMs = 3200) {
      if (revertTimer) {
        clearTimeout(revertTimer);
        revertTimer = null;
      }
      bubbleText.textContent = text;
      // Re-trigger bubble spring pop animation
      bubble.classList.remove('speech-bubble-pop-anim');
      void bubble.offsetWidth;
      bubble.classList.add('speech-bubble-pop-anim');

      if (isTemporary) {
        revertTimer = setTimeout(() => {
          bubbleText.textContent = defaultSpeech;
          bubble.classList.remove('speech-bubble-pop-anim');
          void bubble.offsetWidth;
          bubble.classList.add('speech-bubble-pop-anim');
        }, durationMs);
      }
    }

    updateCharacterSpeechForView = function (view) {
      if (view === 'login') {
        defaultSpeech = 'Here is your form! ✨';
      } else if (view === 'register') {
        defaultSpeech = 'Create a new account! 🌟';
      } else if (view === 'forgot') {
        defaultSpeech = "Let's recover your password! 🔑";
      }
      setSpeech(defaultSpeech);
    };

    // 1. Interactive Form Focus & Click Reactions
    const emailInput = $('login-email');
    const passInput = $('login-password');
    const staffTab = $('tab-login-staff');
    const adminTab = $('tab-login-admin');
    const quickDemoBtn = $('btn-quick-demo');

    emailInput?.addEventListener('focus', () => {
      setSpeech('Enter your work email ✉️');
    });
    emailInput?.addEventListener('blur', () => {
      setSpeech(defaultSpeech);
    });

    passInput?.addEventListener('focus', () => {
      setSpeech('Shh... keep it secure! 🔒');
    });
    passInput?.addEventListener('blur', () => {
      setSpeech(defaultSpeech);
    });

    staffTab?.addEventListener('click', () => {
      setSpeech('Front Desk Staff ready! 🛎️', true, 2600);
    });

    adminTab?.addEventListener('click', () => {
      setSpeech('Welcome Hotel Manager! 👔', true, 2600);
    });

    quickDemoBtn?.addEventListener('click', () => {
      setSpeech('Demo credentials loaded! ⚡', true, 2600);
    });

    // 2. Playful Click on Character
    const characterGreetings = [
      'At your service! Ready to sign in? 😊',
      'Here to help you manage Aurelia! 🛎️',
      'Ready for today\'s hotel shift! ✨',
      'Have a great, productive day! 🌟'
    ];
    let greetingIndex = 0;

    const charBreathe = $('character-breathe-container');

    function triggerCharacterGreeting() {
      const greeting = characterGreetings[greetingIndex % characterGreetings.length];
      greetingIndex++;
      setSpeech(greeting, true, 3500);

      const bounceTarget = charBreathe || charSprite;
      if (bounceTarget) {
        bounceTarget.classList.remove('character-idle-anim');
        bounceTarget.classList.add('character-clicked-bounce');
        setTimeout(() => {
          bounceTarget.classList.remove('character-clicked-bounce');
          bounceTarget.classList.add('character-idle-anim');
        }, 650);
      }
    }

    charFigure?.addEventListener('click', triggerCharacterGreeting);
    bubble?.addEventListener('click', triggerCharacterGreeting);

    // 3. REAL-TIME 3D EYESIGHT & GAZE TRACKING ENGINE
    // As cursor moves across the screen, the 3D boy's head, face and eyesight pivot dynamically to follow it.
    let targetHeadRotY = 0, targetHeadRotX = 0;
    let currentHeadRotY = 0, currentHeadRotX = 0;
    let targetHeadX = 0, targetHeadY = 0;
    let currentHeadX = 0, currentHeadY = 0;

    let targetCardRotX = 0, targetCardRotY = 0, targetCardX = 0, targetCardY = 0;
    let currentCardRotX = 0, currentCardRotY = 0, currentCardX = 0, currentCardY = 0;

    let isTrackingMouse = false;
    let rafId = null;

    function updateEyesight() {
      // Smooth lerp (0.14 for natural neck & eyesight response)
      currentHeadRotY += (targetHeadRotY - currentHeadRotY) * 0.14;
      currentHeadRotX += (targetHeadRotX - currentHeadRotX) * 0.14;
      currentHeadX += (targetHeadX - currentHeadX) * 0.14;
      currentHeadY += (targetHeadY - currentHeadY) * 0.14;

      currentCardRotX += (targetCardRotX - currentCardRotX) * 0.1;
      currentCardRotY += (targetCardRotY - currentCardRotY) * 0.1;
      currentCardX += (targetCardX - currentCardX) * 0.1;
      currentCardY += (targetCardY - currentCardY) * 0.1;

      // Rotate 3D boy's head, face & eyesight to point directly towards cursor
      if (charSprite) {
        charSprite.style.transform = `perspective(850px) rotateY(${currentHeadRotY.toFixed(2)}deg) rotateX(${currentHeadRotX.toFixed(2)}deg) translate3d(${currentHeadX.toFixed(2)}px, ${currentHeadY.toFixed(2)}px, 0)`;
      }

      // Subtle complementary card frame depth response
      if (cardFrame) {
        cardFrame.style.transform = `perspective(1000px) rotateX(${currentCardRotX.toFixed(2)}deg) rotateY(${currentCardRotY.toFixed(2)}deg) translate3d(${currentCardX.toFixed(2)}px, ${currentCardY.toFixed(2)}px, 0)`;
      }

      const isStillMoving = Math.abs(targetHeadRotY - currentHeadRotY) > 0.05 ||
        Math.abs(targetHeadRotX - currentHeadRotX) > 0.05 ||
        Math.abs(targetHeadX - currentHeadX) > 0.05;

      if (isTrackingMouse || isStillMoving) {
        rafId = requestAnimationFrame(updateEyesight);
      } else {
        rafId = null;
        if (!isTrackingMouse) {
          if (charSprite) charSprite.style.transform = '';
          if (cardFrame) cardFrame.style.transform = '';
        }
      }
    }

    function ensureEyesightLoop() {
      if (!rafId) {
        rafId = requestAnimationFrame(updateEyesight);
      }
    }

    // Global window tracking: Eyesight & head follow cursor across the whole screen, card & inputs
    window.addEventListener('mousemove', (e) => {
      isTrackingMouse = true;
      if (!charSprite) return;

      const figRect = charSprite.getBoundingClientRect();
      // Center of boy's eyes in viewport (roughly 48% X, 21% Y of character)
      const eyeCenterX = figRect.left + figRect.width * 0.48;
      const eyeCenterY = figRect.top + figRect.height * 0.21;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;

      // Normalization relative to half-screen dimensions
      const halfW = Math.max(300, window.innerWidth * 0.5);
      const halfH = Math.max(300, window.innerHeight * 0.5);

      const normX = Math.max(-1.15, Math.min(1.15, deltaX / halfW));
      const normY = Math.max(-1.15, Math.min(1.15, deltaY / halfH));

      // Head and eyesight rotate directly towards cursor
      targetHeadRotY = normX * 24; // Up to 27.6 deg rotation towards cursor
      targetHeadRotX = -normY * 16; // Up to 18.4 deg pitch towards cursor
      targetHeadX = normX * 8;
      targetHeadY = normY * 5;

      // Complementary subtle 3D card tilt
      targetCardX = -normX * 5;
      targetCardY = -normY * 4;
      targetCardRotY = normX * 3;
      targetCardRotX = -normY * 2;

      ensureEyesightLoop();
    });

    document.addEventListener('mouseleave', () => {
      isTrackingMouse = false;
      targetHeadRotY = 0;
      targetHeadRotX = 0;
      targetHeadX = 0;
      targetHeadY = 0;
      targetCardX = 0;
      targetCardY = 0;
      targetCardRotY = 0;
      targetCardRotX = 0;
      ensureEyesightLoop();
    });
  }

  /**
   * Password Show/Hide Toggle
   */
  function setupPasswordToggles() {
    document.querySelectorAll('[data-toggle-password]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = button.getAttribute('data-toggle-password');
        const targetInput = $(targetId);
        if (!targetInput) return;

        const isPassword = targetInput.type === 'password';
        targetInput.type = isPassword ? 'text' : 'password';

        const eyeOpen = button.querySelector('.eye-open');
        const eyeClosed = button.querySelector('.eye-closed');
        if (eyeOpen && eyeClosed) {
          eyeOpen.classList.toggle('hidden', isPassword);
          eyeClosed.classList.toggle('hidden', !isPassword);
        }
      });
    });
  }

  /**
   * Interactive Moveable Orb Animation
   */
  function initMovableOrb() {
    const visualPanel = $('auth-visual-panel');
    const orbWrapper = $('movable-orb-wrapper');
    if (!visualPanel || !orbWrapper) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;

    visualPanel.addEventListener('mousemove', (e) => {
      if (isDragging) return;
      const rect = visualPanel.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const targetX = x * 0.12;
      const targetY = y * 0.12;
      orbWrapper.style.transform = `translate3d(${targetX.toFixed(1)}px, ${targetY.toFixed(1)}px, 0)`;
    });

    visualPanel.addEventListener('mouseleave', () => {
      if (isDragging) return;
      orbWrapper.style.transform = 'translate3d(0, 0, 0)';
    });

    orbWrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - currentX;
      startY = e.clientY - currentY;
      orbWrapper.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
      orbWrapper.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      orbWrapper.style.transition = 'transform 0.5s ease-out';
      orbWrapper.style.transform = 'translate3d(0, 0, 0)';
      currentX = 0;
      currentY = 0;
    });
  }

  /**
   * Bind event listeners
   */
  function bindEvents() {
    initDOM();

    // Initialize interactive panels (3D Character or Moveable Orb)
    initCharacterInteraction();
    initMovableOrb();

    // Form submissions
    DOM.loginForm?.addEventListener('submit', handleLogin);
    DOM.registerForm?.addEventListener('submit', handleRegister);
    DOM.forgotForm?.addEventListener('submit', handleForgotPassword);

    // Direct button click binds
    $('btn-login-submit')?.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogin(e);
    });
    $('btn-register-submit')?.addEventListener('click', (e) => {
      e.preventDefault();
      handleRegister(e);
    });
    $('btn-forgot-submit')?.addEventListener('click', (e) => {
      e.preventDefault();
      handleForgotPassword(e);
    });

    // Role switcher tab listeners
    const staffRoleBtn = $('tab-login-staff');
    const adminRoleBtn = $('tab-login-admin');
    const emailField = $('login-email');
    const passField = $('login-password');

    function setActiveRoleTab(activeBtn, inactiveBtn) {
      if (!activeBtn || !inactiveBtn) return;
      activeBtn.className = 'role-tab flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all bg-[#14213d] text-white shadow-sm shadow-[#14213d]/30';
      inactiveBtn.className = 'role-tab flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-slate-600 hover:text-slate-900';
    }

    staffRoleBtn?.addEventListener('click', () => {
      setActiveRoleTab(staffRoleBtn, adminRoleBtn);
      if (emailField) emailField.value = 'adalinea@gmail.com';
      if (passField) passField.value = 'password123';
    });

    adminRoleBtn?.addEventListener('click', () => {
      setActiveRoleTab(adminRoleBtn, staffRoleBtn);
      if (emailField) emailField.value = 'admin@aureliahotel.com';
      if (passField) passField.value = 'admin123';
    });

    // Register Role Tabs
    const regStaffBtn = $('tab-reg-staff');
    const regAdminBtn = $('tab-reg-admin');
    regStaffBtn?.addEventListener('click', () => {
      setActiveRoleTab(regStaffBtn, regAdminBtn);
    });
    regAdminBtn?.addEventListener('click', () => {
      setActiveRoleTab(regAdminBtn, regStaffBtn);
    });

    // Quick demo 1-click button
    $('btn-quick-demo')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (emailField) emailField.value = 'adalinea@gmail.com';
      if (passField) passField.value = 'password123';
      handleLogin(e);
    });

    // Social buttons demo login
    $('btn-social-linkedin')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (emailField) emailField.value = 'adalinea@gmail.com';
      if (passField) passField.value = 'password123';
      handleLogin(e);
    });

    $('btn-social-google')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (emailField) emailField.value = 'adalinea@gmail.com';
      if (passField) passField.value = 'password123';
      handleLogin(e);
    });

    // View toggle links and side welcome buttons (Instagram Reel sliding toggle)
    $('btn-goto-register')?.addEventListener('click', (e) => {
      e.preventDefault();
      showView('register');
    });
    $('btn-side-register')?.addEventListener('click', (e) => {
      e.preventDefault();
      showView('register');
    });
    $('btn-goto-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      showView('login');
    });
    $('btn-side-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      showView('login');
    });
    $('btn-goto-forgot')?.addEventListener('click', (e) => {
      e.preventDefault();
      showView('forgot');
    });
    $('btn-forgot-back-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      showView('login');
    });

    // Logout confirmation buttons
    $('btn-confirm-logout')?.addEventListener('click', handleLogout);
    $('btn-cancel-logout')?.addEventListener('click', hideLogoutConfirmation);
    $('modal-logout-backdrop')?.addEventListener('click', hideLogoutConfirmation);

    // Profile capsule click
    DOM.userProfileCapsule?.addEventListener('click', (e) => {
      e.stopPropagation();
      showLogoutConfirmation();
    });

    // Sidebar bottom logout button
    $('btn-sidebar-logout')?.addEventListener('click', (e) => {
      e.preventDefault();
      showLogoutConfirmation();
    });

    $('btn-mobile-logout')?.addEventListener('click', (e) => {
      e.preventDefault();
      showLogoutConfirmation();
    });

    // Listen for #login hash
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#login' && !AuthState.isAuthenticated) {
        renderUnauthenticatedState('login');
      }
    });

    setupPasswordToggles();
  }

  // Export to global window object
  window.Auth = {
    state: AuthState,
    checkSession,
    showView,
    login: handleLogin,
    register: handleRegister,
    forgotPassword: handleForgotPassword,
    logout: handleLogout,
    showLogoutConfirmation,
    hideLogoutConfirmation,
    syncUserProfile,
    isAuthenticated: () => AuthState.isAuthenticated
  };

  // Seed default account & sync any local user accounts into auth.db
  getLocalUsers();
  syncLocalUsersToDatabase();

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initDOM();
      bindEvents();
      checkSession();
      syncLocalUsersToDatabase();
    });
  } else {
    initDOM();
    bindEvents();
    checkSession();
    syncLocalUsersToDatabase();
  }

})();
