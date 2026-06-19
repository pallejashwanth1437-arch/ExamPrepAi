import { state } from './state.js';

export function renderSidebar() {
  const items = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'documents', icon: '📁', label: 'Documents' },
    { id: 'chat', icon: '💬', label: 'AI Chat' },
    { id: 'quizzes', icon: '📝', label: 'Quizzes' },
    { id: 'flashcards', icon: '🃏', label: 'Flashcards' },
    { id: 'summaries', icon: '📄', label: 'Summaries' },
    { id: 'questions', icon: '❓', label: 'Important Qs' },
    { id: 'analytics', icon: '📊', label: 'Analytics' }
  ];
  
  const bottom = [
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];
  
  return `
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-icon">⚡</div>
        <span class="logo-text">ExamPrep AI</span>
      </div>
      <nav class="nav">
        <div class="nav-label">Main</div>
        ${items.map(i => `
          <button class="nav-item${state.currentPage === i.id ? ' active' : ''}" onclick="navigate('${i.id}')">
            <span class="nav-icon">${i.icon}</span>${i.label}
          </button>
        `).join('')}
        <div class="nav-label" style="margin-top: 8px">Account</div>
        ${bottom.map(i => `
          <button class="nav-item${state.currentPage === i.id ? ' active' : ''}" onclick="navigate('${i.id}')">
            <span class="nav-icon">${i.icon}</span>${i.label}
          </button>
        `).join('')}
        <button class="nav-item" onclick="logout()" style="color: var(--red); margin-top: 4px;">
          <span class="nav-icon">🚪</span>Log Out
        </button>
      </nav>
      <div class="sidebar-bottom">
        <div class="user-mini" onclick="navigate('profile')">
          <div class="avatar">${state.user?.initials || 'PJ'}</div>
          <div class="user-info">
            <div class="user-name">${state.user?.name || 'Palle Jashwanth'}</div>
            <div class="user-plan">⭐ Pro Plan</div>
          </div>
        </div>
      </div>
    </aside>
  `;
}

export function renderTopbar() {
  const titles = {
    dashboard: 'Dashboard',
    documents: 'Documents',
    chat: 'AI Chat',
    quizzes: 'Quiz Generator',
    flashcards: 'Flashcards',
    summaries: 'AI Summaries',
    questions: 'Important Questions',
    analytics: 'Analytics',
    profile: 'Profile',
    settings: 'Settings'
  };
  
  const currentTitle = titles[state.currentPage] || 'Dashboard';
  
  return `
    <header class="topbar">
      <div class="page-title">📍 ${currentTitle}</div>
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search documents, notes, chats…">
      </div>
      <div class="topbar-right">
        <div class="icon-btn" style="position: relative">
          🔔<span class="badge"></span>
        </div>
        <div class="icon-btn" onclick="navigate('landing')">🏠</div>
        <div class="avatar" style="width: 34px; height: 34px; font-size: 13px; cursor: pointer" onclick="navigate('profile')">${state.user?.initials || 'PJ'}</div>
      </div>
    </header>
  `;
}

export function toggleMobileMenu() {
  const app = document.querySelector('.app');
  if (app) {
    app.classList.toggle('menu-open');
  }
}
window.toggleMobileMenu = toggleMobileMenu;

export function renderNavbar() {
  const items = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'documents', label: 'Documents' },
    { id: 'chat', label: 'AI Chat' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'summaries', label: 'Summaries' },
    { id: 'questions', label: 'Important Qs' },
    { id: 'analytics', label: 'Analytics' }
  ];

  return `
    <header class="navbar-horizontal">
      <div class="nav-left">
        <button class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Toggle Navigation Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text2);"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <span class="lp-nav-logo" style="font-size: 19px; font-weight: 800; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.02em; cursor: pointer;" onclick="navigate('dashboard')">ExamPrep AI</span>
        <nav class="nav-links">
          ${items.map(i => `
            <button class="nav-link${state.currentPage === i.id ? ' active' : ''}" onclick="navigate('${i.id}')">
              ${i.label}
            </button>
          `).join('')}
        </nav>
      </div>
      <div class="nav-right">
        <div class="icon-btn" style="position: relative; display: flex; align-items: center;" onclick="alert('No new notifications')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text2);"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <span class="badge"></span>
        </div>
        <div class="user-dropdown">
          <div class="avatar" style="width: 36px; height: 36px; font-size: 13.5px; cursor: pointer; background: var(--accent); color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 700; border: 1.5px solid rgba(255,255,255,0.1);">
            ${state.user?.initials || 'PJ'}
          </div>
          <div class="dropdown-menu">
            <div class="dropdown-user-info">
              <div class="dropdown-username">${state.user?.name || 'Palle Jashwanth'}</div>
              <div class="dropdown-email">${state.user?.email || 'pallejeshwanth1437@gmail.com'}</div>
            </div>
            <hr class="dropdown-divider">
            <button class="dropdown-item" onclick="navigate('profile')">Profile</button>
            <button class="dropdown-item" onclick="navigate('settings')">Settings</button>
            <hr class="dropdown-divider">
            <button class="dropdown-item logout-item" onclick="logout()">Log Out</button>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Mobile Navigation Drawer Overlay -->
    <div class="drawer-overlay" onclick="toggleMobileMenu()"></div>
    
    <!-- Mobile Slide-out Drawer Panel -->
    <div class="mobile-drawer">
      <div class="drawer-header">
        <span class="lp-nav-logo" style="font-size: 19px; font-weight: 800; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.02em;">ExamPrep AI</span>
        <button class="drawer-close-btn" onclick="toggleMobileMenu()">×</button>
      </div>
      <nav class="drawer-links">
        ${items.map(i => `
          <button class="drawer-link${state.currentPage === i.id ? ' active' : ''}" onclick="navigate('${i.id}'); toggleMobileMenu();">
            ${i.label}
          </button>
        `).join('')}
      </nav>
      <div style="flex: 1;"></div>
      <hr style="border: 0; border-top: 1px solid var(--border); margin: 16px 0;">
      <div class="user-mini" onclick="navigate('profile'); toggleMobileMenu();" style="display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 6px;">
        <div class="avatar" style="width: 34px; height: 34px; font-size: 13px; background: var(--accent); color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 700;">
          ${state.user?.initials || 'PJ'}
        </div>
        <div class="user-info">
          <div class="user-name" style="font-size: 13px; font-weight: 600; color: var(--text1);">${state.user?.name || 'Palle Jashwanth'}</div>
          <div class="user-plan" style="font-size: 11px; color: var(--accent3);">⭐ Pro Plan</div>
        </div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="logout(); toggleMobileMenu();" style="margin-top: 12px; justify-content: center; width: 100%; font-weight: 700; padding: 8px;">🚪 Log Out</button>
    </div>
  `;
}

