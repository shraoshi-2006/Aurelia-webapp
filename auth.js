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
    if (!userObj || !userObj.email) return;
    const list = getLocalUsers();
    const existingIndex = list.findIndex(u => u.email && u.email.toLowerCase() === userObj.email.toLowerCase());
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...userObj };
    } else {
      list.push(userObj);
    }
    localStorage.setItem(STORAGE_KEY_LOCAL_USERS, JSON.stringify(list));
  }

  /**
   * Merge saved profile fields (username, avatar, phone, dept, empId, role)
   * matching THIS exact user's email or id without cross-user leakage.
   */
  function enrichUserProfile(user) {
    if (!user) return user;
    const cleanEmail = (user.email || '').trim().toLowerCase();
    const list = getLocalUsers();
    const localMatch = list.find(u =>
      (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) ||
      (user.id && u.id === user.id)
    ) || {};

    let cachedMatch = {};
    try {
      const cachedRaw = localStorage.getItem(STORAGE_KEY_USER) || sessionStorage.getItem(STORAGE_KEY_USER);
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw);
        const sameEmail = cleanEmail && parsed.email && parsed.email.toLowerCase() === cleanEmail;
        const sameId = user.id && parsed.id && parsed.id === user.id;
        if (sameEmail || sameId) {
          cachedMatch = parsed;
        }
      }
    } catch (e) { }

    const merged = {
      id: user.id || cachedMatch.id || localMatch.id || ('usr-' + Date.now()),
      name: (user.name || cachedMatch.name || localMatch.name || 'Aurelia Staff').trim(),
      username: (user.username || cachedMatch.username || localMatch.username || '').trim().replace(/^@+/, ''),
      email: (user.email || cachedMatch.email || localMatch.email || '').trim(),
      role: (user.role || cachedMatch.role || localMatch.role || 'Front Desk Supervisor').trim(),
      phone: user.phone || cachedMatch.phone || localMatch.phone || '',
      department: user.department || cachedMatch.department || localMatch.department || 'Front Office',
      empId: user.empId || cachedMatch.empId || localMatch.empId || 'EMP-2026-01',
      avatar: user.avatar !== undefined ? user.avatar : (cachedMatch.avatar !== undefined ? cachedMatch.avatar : (localMatch.avatar || null))
    };
    return merged;
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
          body: JSON.stringify({
            name: u.name,
            username: u.username || '',
            email: u.email,
            password: u.password,
            role: u.role || 'Front Desk Supervisor'
          })
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
    userRoleBadge: null,
    userEmailBadge: null
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
    DOM.userEmailBadge = $('topbar-user-email');
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
      if (!btn.dataset.originalHtml) {
        btn.dataset.originalHtml = btn.innerHTML;
      }
      const loadingLabel = btnId === 'btn-register-submit'
        ? 'Creating Account...'
        : (btnId === 'btn-forgot-submit' ? 'Sending...' : 'Signing In...');
      btn.innerHTML = `
        <span class="inline-flex items-center justify-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>${loadingLabel}</span>
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

    if (typeof window.syncAuthBrandingUI === 'function') {
      window.syncAuthBrandingUI();
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
    initDOM();

    const displayName = (user.name || '').trim() || 'Aurelia Staff';
    const userRole = (user.role || '').trim() || 'Front Desk Supervisor';
    const userEmail = (user.email || '').trim();
    const userUsername = (user.username || '').trim().replace(/^@+/, '');

    if (DOM.userNameBadge) {
      DOM.userNameBadge.textContent = displayName;
    }

    if (DOM.userRoleBadge) {
      DOM.userRoleBadge.textContent = userRole;
    }

    if (DOM.userEmailBadge) {
      DOM.userEmailBadge.textContent = userUsername && userEmail
        ? `@${userUsername} · ${userEmail}`
        : (userUsername ? `@${userUsername}` : (userEmail || 'Signed in'));
    }

    if (DOM.userProfileCapsule) {
      const summary = [displayName, userRole, userUsername ? '@' + userUsername : '', userEmail].filter(Boolean).join(' • ');
      DOM.userProfileCapsule.setAttribute('data-instant-tooltip', `${summary} (Click for Profile)`);
      DOM.userProfileCapsule.removeAttribute('title');
    }

    const topGreeting = $('topbar-welcome-title');
    if (topGreeting) {
      const firstName = displayName.split(' ')[0] || 'Guest';
      topGreeting.textContent = `Welcome back, ${firstName}!`;
    }

    const avatarBtn = $('topbar-user-avatar');
    const avatarText = $('topbar-user-avatar-text');
    const avatarImg = $('topbar-user-avatar-img');
    const initials = displayName
      .split(' ')
      .filter(Boolean)
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AU';

    if (user.avatar && avatarImg) {
      avatarImg.src = user.avatar;
      avatarImg.classList.remove('hidden');
      if (avatarText) avatarText.classList.add('hidden');
    } else {
      if (avatarImg) {
        avatarImg.src = '';
        avatarImg.classList.add('hidden');
      }
      if (avatarText) {
        avatarText.textContent = initials;
        avatarText.classList.remove('hidden');
      } else if (avatarBtn) {
        avatarBtn.textContent = initials;
      }
    }
  }

  /**
   * Reset Topbar Profile Placeholders When Logged Out
   */
  function resetUserProfileUI() {
    initDOM();
    if (DOM.userNameBadge) DOM.userNameBadge.textContent = 'Aurelia Staff';
    if (DOM.userRoleBadge) DOM.userRoleBadge.textContent = 'Staff';
    if (DOM.userEmailBadge) DOM.userEmailBadge.textContent = 'staff@aureliahotel.com';
    const topGreeting = $('topbar-welcome-title');
    if (topGreeting) topGreeting.textContent = 'Welcome back!';
    if (DOM.userProfileCapsule) {
      DOM.userProfileCapsule.setAttribute('data-instant-tooltip', 'My Profile');
      DOM.userProfileCapsule.removeAttribute('title');
    }
    const avatarText = $('topbar-user-avatar-text');
    const avatarImg = $('topbar-user-avatar-img');
    if (avatarImg) {
      avatarImg.src = '';
      avatarImg.classList.add('hidden');
    }
    if (avatarText) {
      avatarText.textContent = 'AU';
      avatarText.classList.remove('hidden');
    }
  }

  /**
   * Show Dashboard UI & Hide Auth UI
   */
  function renderAuthenticatedState(user) {
    const enrichedUser = enrichUserProfile(user);
    AuthState.isAuthenticated = true;
    AuthState.currentUser = enrichedUser;

    // Keep cached session in sync with enriched fields
    try {
      if (localStorage.getItem(STORAGE_KEY_USER) || !sessionStorage.getItem(STORAGE_KEY_USER)) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(enrichedUser));
      }
      if (sessionStorage.getItem(STORAGE_KEY_USER)) {
        sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(enrichedUser));
      }
    } catch (e) { }

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
    syncUserProfile(enrichedUser);
    if (typeof window.updateTopbarAvatarUI === 'function') {
      window.updateTopbarAvatarUI(enrichedUser);
    }

    // 6. Determine target section based on page path and hash
    const currentPath = (window.location.pathname || '').toLowerCase();
    let pageDefaultSec = null;
    if (currentPath.includes('hr-employee-list')) pageDefaultSec = 'hr-documents';
    else if (currentPath.includes('employee-list')) pageDefaultSec = 'employees';
    else if (currentPath.includes('add-employee')) pageDefaultSec = 'add-employee';
    else if (currentPath.includes('hr-document')) pageDefaultSec = 'hr-documents';
    else if (currentPath.includes('holiday')) pageDefaultSec = 'holidays';
    else if (currentPath.includes('leave-category')) pageDefaultSec = 'leave-category';
    else if (currentPath.includes('leave-assign')) pageDefaultSec = 'leave-assign';
    else if (currentPath.includes('leave-request')) pageDefaultSec = 'leave-request';
    else if (currentPath.includes('attendance-list')) pageDefaultSec = 'attendance-list';
    else if (currentPath.includes('attendance-report')) pageDefaultSec = 'attendance-report';
    else if (currentPath.includes('salary-grade')) pageDefaultSec = 'salary-grade';
    else if (currentPath.includes('manage-salary')) pageDefaultSec = 'manage-salary';
    else if (currentPath.includes('disburse-salary-update')) pageDefaultSec = 'disburse-salary-update';
    else if (currentPath.includes('pay-slip')) pageDefaultSec = 'pay-slip';
    else if (currentPath.includes('add-bill')) pageDefaultSec = 'add-bill';
    else if (currentPath.includes('billing-details')) pageDefaultSec = 'billing-details';
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

    if (typeof window.renderDashboard === 'function' && targetSection === 'dashboard') {
      window.renderDashboard();
    }

    // Re-sync after section switcher in case any DOM title changed
    syncUserProfile(enrichedUser);
    if (typeof window.updateTopbarAvatarUI === 'function') {
      window.updateTopbarAvatarUI(enrichedUser);
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
    resetUserProfileUI();

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

    if (typeof window.syncAuthBrandingUI === 'function') {
      window.syncAuthBrandingUI();
    }
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

    // 1. Try backend API if API_BASE is configured (using Bearer token header AND HttpOnly cookie)
    if (API_BASE) {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE}/api/auth/me`, {
          method: 'GET',
          headers,
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            if (data.token) {
              AuthState.token = data.token;
              try { localStorage.setItem(STORAGE_KEY_TOKEN, data.token); } catch (e) { }
            }
            renderAuthenticatedState(data.user);
            return;
          }
        }
      } catch (err) {
        // Server offline or connection error - continue to cached validation
      }
    }

    // 2. Validate using cached session from localStorage / sessionStorage
    if (cachedUserStr) {
      try {
        const cachedUser = JSON.parse(cachedUserStr);
        renderAuthenticatedState(cachedUser);
        return;
      } catch (e) { }
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
        const safeUser = enrichUserProfile({
          id: matchedUser.id || ('usr-' + Date.now()),
          name: matchedUser.name,
          username: matchedUser.username || '',
          email: matchedUser.email,
          role: matchedUser.role || 'Front Desk Supervisor',
          phone: matchedUser.phone || '',
          department: matchedUser.department || 'Front Office',
          empId: matchedUser.empId || 'EMP-2026-01',
          avatar: matchedUser.avatar || null
        });

        AuthState.token = token;
        if (rememberMe) {
          localStorage.setItem(STORAGE_KEY_TOKEN, token);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(safeUser));
          sessionStorage.removeItem(STORAGE_KEY_TOKEN);
          sessionStorage.removeItem(STORAGE_KEY_USER);
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
        const user = enrichUserProfile(data.user);
        AuthState.token = token;

        if (rememberMe) {
          localStorage.setItem(STORAGE_KEY_TOKEN, token);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
          sessionStorage.removeItem(STORAGE_KEY_TOKEN);
          sessionStorage.removeItem(STORAGE_KEY_USER);
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
   * Perform Registration & Auto-Sign-In
   */
  async function handleRegister(e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    initDOM();
    showAlert('alert-register', '');

    const nameInput = $('reg-name');
    const usernameInput = $('reg-username');
    const emailInput = $('reg-email');
    const passwordInput = $('reg-password');
    const confirmInput = $('reg-confirm-password');
    const termsInput = $('reg-terms');
    const regAdminBtn = $('tab-reg-admin');

    const name = (nameInput?.value || '').trim();
    const username = (usernameInput?.value || '').trim().replace(/^@+/, '');
    const email = (emailInput?.value || '').trim();
    const password = (passwordInput?.value || '').trim();
    const confirmPassword = (confirmInput?.value || '').trim();
    const termsAccepted = Boolean(termsInput?.checked);
    const selectedRole = (regAdminBtn && regAdminBtn.classList.contains('bg-[#14213d]'))
      ? 'General Manager'
      : 'Front Desk Supervisor';

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

    setButtonLoading('btn-register-submit', true, 'Create Account');

    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      username,
      email,
      password,
      role: selectedRole
    };

    // 1. Try Backend API (persists into SQLite auth.db)
    let savedToDatabase = false;

    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, username, email, password, role: newUser.role })
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          savedToDatabase = true;
          if (data.user && data.user.id) {
            newUser.id = data.user.id;
          }
        } else if (res.status === 404) {
          console.warn('[Auth Server] Backend route 404 at ' + API_BASE + ', saving to local registry.');
        } else {
          showAlert('alert-register', data.error || 'Failed to create account.');
          setButtonLoading('btn-register-submit', false, 'Create Account');
          return false;
        }
      } catch (err) {
        console.warn('[Auth Server] Backend API unreachable at ' + API_BASE + ':', err);
      }
    }

    // 2. Cache in local user registry for offline & cross-page enrichment
    saveLocalUser(newUser);

    // 3. Auto-Sign-In newly registered account so header reflects their details immediately
    let sessionToken = 'local-token-' + Date.now();
    let authenticatedUser = {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      department: selectedRole === 'General Manager' ? 'Executive Administration' : 'Front Office',
      empId: 'EMP-2026-' + String(Math.floor(10 + Math.random() * 89)),
      avatar: null
    };

    if (savedToDatabase && API_BASE) {
      try {
        const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, rememberMe: true }),
          credentials: 'include'
        });
        if (loginRes.ok) {
          const loginData = await loginRes.json();
          if (loginData.token) sessionToken = loginData.token;
          if (loginData.user) {
            authenticatedUser = {
              ...authenticatedUser,
              ...loginData.user,
              username: loginData.user.username || newUser.username
            };
          }
        }
      } catch (loginErr) {
        console.warn('[Auth Server] Auto-login request fell back to local token:', loginErr);
      }
    }

    // Persist department/empId cleanly in local registry for this new user too
    saveLocalUser({ ...newUser, ...authenticatedUser, password });

    AuthState.token = sessionToken;
    try {
      localStorage.setItem(STORAGE_KEY_TOKEN, sessionToken);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authenticatedUser));
      sessionStorage.setItem(STORAGE_KEY_TOKEN, sessionToken);
      sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authenticatedUser));
    } catch (storageErr) { }

    setButtonLoading('btn-register-submit', false, 'Create Account');
    DOM.registerForm?.reset();

    // Immediately show dashboard & display new user's name and details on header
    renderAuthenticatedState(authenticatedUser);
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
    const regNameInput = $('reg-name');
    const regUsernameInput = $('reg-username');
    const regEmailInput = $('reg-email');
    const staffTab = $('tab-login-staff');
    const adminTab = $('tab-login-admin');
    const regStaffTab = $('tab-reg-staff');
    const regAdminTab = $('tab-reg-admin');
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

    regNameInput?.addEventListener('focus', () => {
      setSpeech('Tell us your full name! 📝');
    });
    regNameInput?.addEventListener('blur', () => {
      setSpeech(defaultSpeech);
    });

    regUsernameInput?.addEventListener('focus', () => {
      setSpeech('Pick a cool username! ✨');
    });
    regUsernameInput?.addEventListener('blur', () => {
      setSpeech(defaultSpeech);
    });

    regEmailInput?.addEventListener('focus', () => {
      setSpeech('Enter your account email ✉️');
    });
    regEmailInput?.addEventListener('blur', () => {
      setSpeech(defaultSpeech);
    });

    staffTab?.addEventListener('click', () => {
      setSpeech('Front Desk Staff ready! 🛎️', true, 2600);
    });

    adminTab?.addEventListener('click', () => {
      setSpeech('Welcome Hotel Manager! 👔', true, 2600);
    });

    regStaffTab?.addEventListener('click', () => {
      setSpeech('Staff profile selected! 🛎️', true, 2600);
    });

    regAdminTab?.addEventListener('click', () => {
      setSpeech('Manager profile selected! 👔', true, 2600);
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

  /* ==========================================================================
     GOOGLE IDENTITY & ACCOUNT CHOOSER MODAL (accounts.google.com Theme)
     ========================================================================== */

  const DEFAULT_GOOGLE_ACCOUNTS = [
    {
      name: 'EuphoniousXZyzva Lenscape',
      email: 'lenscape.euphonious@gmail.com',
      avatarText: 'E',
      avatarBg: '#7B1FA2'
    },
    {
      name: 'Piyush Barua',
      email: 'piyushbarua9@gmail.com',
      avatarText: 'P',
      avatarBg: '#D97706'
    },
    {
      name: 'Piyush Barua',
      email: 'piyushbarua77@gmail.com',
      avatarText: 'P',
      avatarBg: '#E11D48'
    },
    {
      name: 'Alur bhay',
      email: 'alurbhay6@gmail.com',
      avatarText: 'A',
      avatarBg: '#0D9488'
    },
    {
      name: 'Piuxhus Bap',
      email: 'baruapiyush8@gmail.com',
      avatarText: 'P',
      avatarBg: '#16A34A'
    },
    {
      name: 'Piyush Barua',
      email: 'piyushbarua432@gmail.com',
      avatarText: 'P',
      avatarBg: '#475569'
    },
    {
      name: 'Pintu Bokshis',
      email: 'pintubokshis@gmail.com',
      avatarText: 'P',
      avatarBg: '#2E7D32'
    }
  ];

  function getGoogleAccountsList() {
    let recent = [];
    try {
      const stored = localStorage.getItem('aurelia_google_recent_accounts');
      if (stored) {
        recent = JSON.parse(stored);
        if (!Array.isArray(recent)) recent = [];
      }
    } catch (e) {
      recent = [];
    }
    const combined = [...recent];
    DEFAULT_GOOGLE_ACCOUNTS.forEach(defAcc => {
      if (!combined.some(a => a.email && a.email.toLowerCase() === defAcc.email.toLowerCase())) {
        combined.push(defAcc);
      }
    });
    return combined;
  }

  function saveCustomGoogleAccount(account) {
    if (!account || !account.email) return;
    try {
      const list = getGoogleAccountsList();
      const existingIdx = list.findIndex(a => a.email.toLowerCase() === account.email.toLowerCase());
      if (existingIdx >= 0) {
        list[existingIdx] = { ...list[existingIdx], ...account };
      } else {
        list.unshift(account);
      }
      localStorage.setItem('aurelia_google_recent_accounts', JSON.stringify(list));
    } catch (e) { }
  }

  function authenticateWithGoogleAccount(accountData) {
    if (!accountData || !accountData.email) return;

    // Check active login tab for role
    const adminRoleBtn = $('tab-login-admin');
    const isAdminActive = adminRoleBtn && (
      adminRoleBtn.classList.contains('bg-[#14213d]') ||
      adminRoleBtn.classList.contains('active')
    );
    const assignedRole = isAdminActive ? 'General Manager' : 'Front Desk Supervisor';
    const assignedDept = isAdminActive ? 'Hotel Administration' : 'Front Office';

    const cleanEmail = accountData.email.trim().toLowerCase();
    const cleanName = (accountData.name || cleanEmail.split('@')[0] || 'Google User').trim();
    const avatar = accountData.avatarImg || null;

    // Ensure user is in local users registry
    const localUsers = getLocalUsers();
    let existing = localUsers.find(u => u.email && u.email.toLowerCase() === cleanEmail);

    let userObj;
    if (existing) {
      userObj = {
        ...existing,
        name: existing.name || cleanName,
        avatar: existing.avatar || avatar,
        authProvider: 'google'
      };
    } else {
      userObj = {
        id: 'usr-g-' + Date.now().toString(36),
        name: cleanName,
        email: cleanEmail,
        password: 'google_oauth_session',
        role: assignedRole,
        department: assignedDept,
        empId: 'EMP-G-' + Math.floor(1000 + Math.random() * 9000),
        avatar: avatar,
        authProvider: 'google'
      };
      saveLocalUser(userObj);
    }

    // Save custom account so it appears in recent list
    saveCustomGoogleAccount({
      name: cleanName,
      email: cleanEmail,
      avatarText: cleanName.charAt(0).toUpperCase(),
      avatarBg: accountData.avatarBg || '#4285F4'
    });

    // Generate valid session token
    const token = 'g_oauth_' + btoa(cleanEmail) + '_' + Date.now();
    AuthState.token = token;

    try {
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userObj));
    } catch (e) { }

    closeGoogleAccountChooserModal();

    if (typeof window.showToast === 'function') {
      window.showToast(`Signed in with Google as ${cleanName}`, 'success');
    }

    renderAuthenticatedState(userObj);
  }

  function getBrandInfoForGoogleChooser() {
    let brandName = 'Aurelia';
    let brandColor = '#FCA311';
    let brandLogoImg = null;

    try {
      if (typeof window.getSavedBrandName === 'function') {
        brandName = window.getSavedBrandName();
      } else {
        brandName = localStorage.getItem('aurelia_custom_brand_name') || 'Aurelia';
      }
      brandName = brandName.trim();

      const themeSettings = localStorage.getItem('aurelia_theme_settings');
      if (themeSettings) {
        const parsed = JSON.parse(themeSettings);
        if (parsed.cardBorder) brandColor = parsed.cardBorder;
      }
      brandLogoImg = localStorage.getItem('aurelia_custom_brand_logo_img') || null;
    } catch (e) { }

    return {
      name: brandName,
      initial: (brandName.charAt(0) || 'A').toUpperCase(),
      color: brandColor,
      logoImg: brandLogoImg
    };
  }

  function openGoogleAccountChooserModal() {
    let modal = $('google-account-chooser-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'google-account-chooser-modal';
      document.body.appendChild(modal);
    }

    const brand = getBrandInfoForGoogleChooser();
    const accounts = getGoogleAccountsList();

    const brandEmblemHtml = brand.logoImg
      ? `<img src="${brand.logoImg}" alt="${escapeHtml(brand.name)}" class="w-12 h-12 rounded-full object-cover border border-[#5f6368] shadow-md mb-3" />`
      : `<div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-md mb-3" style="background-color: ${brand.color}; color: #14213D;">
           ${brand.initial}
         </div>`;

    const accountsRowsHtml = accounts.map(acc => `
      <div class="g-account-item flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-[#303134] cursor-pointer transition-colors group" data-email="${escapeHtml(acc.email)}" data-name="${escapeHtml(acc.name)}" data-bg="${acc.avatarBg || '#4285F4'}">
        <div class="w-9 h-9 rounded-full flex items-center justify-center font-medium text-white text-sm shrink-0 shadow-xs" style="background-color: ${acc.avatarBg || '#4285F4'};">
          ${escapeHtml(acc.avatarText || (acc.name ? acc.name.charAt(0).toUpperCase() : 'G'))}
        </div>
        <div class="flex-1 min-w-0 text-left">
          <div class="text-[14px] font-medium text-[#e8eaed] truncate group-hover:text-white">${escapeHtml(acc.name)}</div>
          <div class="text-[12px] text-[#9aa0a6] truncate">${escapeHtml(acc.email)}</div>
        </div>
      </div>
    `).join('');

    modal.className = 'fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs transition-opacity duration-200';
    modal.innerHTML = `
      <div class="w-full max-w-[480px] bg-[#202124] text-[#e8eaed] rounded-[28px] border border-[#3c4043] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200" style="font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <!-- Header: Google Sign-in bar & Close button -->
        <div class="flex items-center justify-between px-6 pt-5 pb-2">
          <div class="flex items-center gap-2.5">
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span class="text-sm font-medium text-[#e8eaed]">Sign in with Google</span>
          </div>
          <button type="button" id="btn-close-google-modal" class="w-8 h-8 rounded-full flex items-center justify-center text-[#9aa0a6] hover:text-white hover:bg-[#303134] transition-colors cursor-pointer" title="Close">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Main Chooser View -->
        <div id="g-view-chooser" class="px-6 pb-6 pt-2 flex flex-col">
          <div class="mb-4">
            ${brandEmblemHtml}
            <h2 class="text-2xl font-normal text-[#e8eaed] tracking-tight">Choose an account</h2>
            <p class="text-sm text-[#9aa0a6] mt-1">
              to continue to <span class="font-medium text-[#e8eaed]">${escapeHtml(brand.name)}</span>
            </p>
          </div>

          <!-- Accounts List with Dividers -->
          <div class="max-h-[310px] overflow-y-auto space-y-0.5 divide-y divide-[#3c4043]/60 pr-1 -mr-1 custom-scroll">
            ${accountsRowsHtml}

            <!-- Use Another Account Row -->
            <div id="btn-g-show-custom" class="flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-[#303134] cursor-pointer transition-colors group mt-1 pt-3">
              <div class="w-9 h-9 rounded-full border border-[#5f6368] flex items-center justify-center text-[#9aa0a6] group-hover:border-[#8ab4f8] group-hover:text-[#8ab4f8] transition-colors shrink-0">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="text-[14px] font-medium text-[#e8eaed] group-hover:text-white">Use another account</div>
            </div>
          </div>

          <!-- Footer Disclaimer -->
          <div class="mt-5 pt-3 border-t border-[#3c4043]/50 text-[11.5px] leading-relaxed text-[#9aa0a6]">
            To continue, Google will share your name, email address, language preference, and profile picture with ${escapeHtml(brand.name)}. Before using this app, you can review ${escapeHtml(brand.name)}'s <a href="#" class="text-[#8ab4f8] hover:underline" onclick="event.preventDefault();">Privacy Policy</a> and <a href="#" class="text-[#8ab4f8] hover:underline" onclick="event.preventDefault();">Terms of Service</a>.
          </div>
        </div>

        <!-- Custom Account / Use Another Account Form View (Initially Hidden) -->
        <div id="g-view-custom" class="px-6 pb-6 pt-2 flex flex-col hidden">
          <div class="mb-5">
            ${brandEmblemHtml}
            <h2 class="text-2xl font-normal text-[#e8eaed] tracking-tight">Sign in with Google</h2>
            <p class="text-sm text-[#9aa0a6] mt-1">
              Enter any Google Account to continue to <span class="font-medium text-[#e8eaed]">${escapeHtml(brand.name)}</span>
            </p>
          </div>

          <form id="form-g-custom-account" class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-[#9aa0a6] mb-1.5">Email address <span class="text-red-400">*</span></label>
              <input type="email" id="g-custom-email" required placeholder="example@gmail.com"
                class="w-full px-3.5 py-2.5 bg-transparent border border-[#5f6368] rounded-lg text-sm text-[#e8eaed] placeholder-[#80868b] focus:outline-hidden focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] transition-colors" />
            </div>

            <div>
              <label class="block text-xs font-medium text-[#9aa0a6] mb-1.5">Full Name (optional)</label>
              <input type="text" id="g-custom-name" placeholder="Your Name"
                class="w-full px-3.5 py-2.5 bg-transparent border border-[#5f6368] rounded-lg text-sm text-[#e8eaed] placeholder-[#80868b] focus:outline-hidden focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] transition-colors" />
            </div>

            <div id="g-custom-error" class="text-xs text-red-400 hidden"></div>

            <div class="flex items-center justify-between pt-4">
              <button type="button" id="btn-g-back-to-list" class="text-sm font-medium text-[#8ab4f8] hover:text-[#aecbfa] px-3 py-2 rounded-lg transition-colors cursor-pointer">
                Back
              </button>
              <button type="submit" class="px-6 py-2 bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#202124] rounded-full text-sm font-medium transition-colors cursor-pointer shadow-sm">
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Bind modal interactions
    $('btn-close-google-modal')?.addEventListener('click', closeGoogleAccountChooserModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeGoogleAccountChooserModal();
      }
    });

    const onKeydown = (e) => {
      if (e.key === 'Escape') {
        closeGoogleAccountChooserModal();
        window.removeEventListener('keydown', onKeydown);
      }
    };
    window.addEventListener('keydown', onKeydown);

    // Account row click: authenticate
    modal.querySelectorAll('.g-account-item').forEach(item => {
      item.addEventListener('click', () => {
        const email = item.getAttribute('data-email');
        const name = item.getAttribute('data-name');
        const bg = item.getAttribute('data-bg');
        authenticateWithGoogleAccount({ email, name, avatarBg: bg });
      });
    });

    // "Use another account" button click
    $('btn-g-show-custom')?.addEventListener('click', () => {
      $('g-view-chooser')?.classList.add('hidden');
      $('g-view-custom')?.classList.remove('hidden');
      $('g-custom-email')?.focus();
    });

    // "Back" button click in custom view
    $('btn-g-back-to-list')?.addEventListener('click', () => {
      $('g-view-custom')?.classList.add('hidden');
      $('g-view-chooser')?.classList.remove('hidden');
    });

    // Custom form submission
    $('form-g-custom-account')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = ($('g-custom-email')?.value || '').trim();
      const name = ($('g-custom-name')?.value || '').trim();
      const errBox = $('g-custom-error');

      if (!email || !email.includes('@')) {
        if (errBox) {
          errBox.textContent = 'Please enter a valid email address.';
          errBox.classList.remove('hidden');
        }
        return;
      }

      authenticateWithGoogleAccount({
        email: email,
        name: name || email.split('@')[0],
        avatarBg: '#4285F4'
      });
    });
  }

  function closeGoogleAccountChooserModal() {
    const modal = $('google-account-chooser-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.remove();
    }
  }

  function triggerGoogleLogin() {
    const configuredClientId = localStorage.getItem('aurelia_google_client_id');
    if (configuredClientId && window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: configuredClientId,
          scope: 'email profile openid',
          prompt: 'select_account',
          callback: (res) => {
            if (res && res.access_token) {
              fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${res.access_token}` }
              })
                .then(r => r.json())
                .then(profile => {
                  authenticateWithGoogleAccount({
                    name: profile.name,
                    email: profile.email,
                    avatarImg: profile.picture
                  });
                })
                .catch(() => {
                  openGoogleAccountChooserModal();
                });
            }
          }
        });
        tokenClient.requestAccessToken();
        return;
      } catch (err) {
        console.warn('[Google OAuth] Error requesting token client:', err);
      }
    }

    // Default: Open the authentic interactive Google Account Chooser
    openGoogleAccountChooserModal();
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
      triggerGoogleLogin();
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

    // Profile capsule click: let main.js open the User Profile Modal (fallback to logout dialog)
    DOM.userProfileCapsule?.addEventListener('click', (e) => {
      if (typeof window.openUserProfileModal === 'function') {
        return;
      }
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
    triggerGoogleLogin,
    openGoogleAccountChooserModal,
    closeGoogleAccountChooserModal,
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
