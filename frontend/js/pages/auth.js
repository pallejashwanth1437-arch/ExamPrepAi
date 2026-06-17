import { state, navigate } from '../state.js';

export async function handleLogin() {
  const email = document.getElementById('login-email')?.value?.trim();
  const pass = document.getElementById('login-pass')?.value?.trim();
  
  if (!email || !pass) {
    alert("Please enter both your email and password.");
    return;
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Authentication failed");
    }

    state.user = data.user;
    try {
      localStorage.setItem('examprep_user', JSON.stringify(state.user));
    } catch (err) {
      console.error("Failed to save user in localStorage:", err);
    }
    
    navigate('dashboard');
  } catch (err) {
    console.error("Login error:", err);
    alert(err.message);
  }
}

export async function handleSignup() {
  const name = document.getElementById('signup-name')?.value?.trim();
  const email = document.getElementById('signup-email')?.value?.trim();
  const pass = document.getElementById('signup-pass')?.value?.trim();
  const confirm = document.getElementById('signup-confirm-pass')?.value?.trim();
  
  if (!name || !email || !pass || !confirm) {
    alert("Please fill out all input fields.");
    return;
  }
  
  if (pass !== confirm) {
    alert("Passwords do not match. Please verify your password confirmation.");
    return;
  }

  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }

    state.user = data.user;
    try {
      localStorage.setItem('examprep_user', JSON.stringify(state.user));
    } catch (err) {
      console.error("Failed to save user in localStorage:", err);
    }

    navigate('dashboard');
  } catch (err) {
    console.error("Signup error:", err);
    alert(err.message);
  }
}

// Bind globally for inline HTML trigger buttons
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;

export function renderLogin() {
  return `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-icon">⚡</div>
          <span class="logo-text">ExamPrep AI</span>
        </div>
        <div class="auth-title">Welcome back</div>
        <div class="auth-sub">Sign in to continue your learning journey</div>
        <button class="google-btn" onclick="loginWithGoogle()">
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2a10 10 0 0 0-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9a8.78 8.78 0 0 0 2.7-6.62z"/><path fill="#34A853" d="M9 18a8.6 8.6 0 0 0 5.96-2.18l-2.9-2.26a5.4 5.4 0 0 1-8.06-2.85H.96v2.34A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M4 10.71a5.4 5.4 0 0 1 0-3.42V4.95H.96a9 9 0 0 0 0 8.1L4 10.71z"/><path fill="#EA4335" d="M9 3.58a4.86 4.86 0 0 1 3.44 1.35l2.58-2.58A8.64 8.64 0 0 0 9 0 9 9 0 0 0 .96 4.95L4 7.29A5.37 5.37 0 0 1 9 3.58z"/></svg>
          Continue with Google
        </button>
        <div class="divider">or</div>
        <div class="form-row">
          <label>Email</label>
          <input type="email" placeholder="you@university.edu" id="login-email">
        </div>
        <div class="form-row">
          <label>Password</label>
          <input type="password" placeholder="••••••••" id="login-pass" onkeydown="if(event.key==='Enter'){handleLogin()}">
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; font-size: 12px">
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; margin-bottom: 0; font-weight: 400; color: var(--text2)">
            <input type="checkbox" style="width: auto"> Remember me
          </label>
          <a href="#" style="color: var(--accent3); text-decoration: none">Forgot password?</a>
        </div>
        <button class="btn btn-primary" style="width: 100%; justify-content: center; padding: 11px" onclick="handleLogin()">Sign In →</button>
        <div class="auth-footer">Don't have an account? <a href="#" onclick="navigate('signup')">Sign up free</a></div>
      </div>
    </div>
  `;
}

export function renderSignup() {
  return `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-icon">⚡</div>
          <span class="logo-text">ExamPrep AI</span>
        </div>
        <div class="auth-title">Create account</div>
        <div class="auth-sub">Start your AI-powered study journey today</div>
        <button class="google-btn" onclick="loginWithGoogle()">
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2a10 10 0 0 0-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9a8.78 8.78 0 0 0 2.7-6.62z"/><path fill="#34A853" d="M9 18a8.6 8.6 0 0 0 5.96-2.18l-2.9-2.26a5.4 5.4 0 0 1-8.06-2.85H.96v2.34A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M4 10.71a5.4 5.4 0 0 1 0-3.42V4.95H.96a9 9 0 0 0 0 8.1L4 10.71z"/><path fill="#EA4335" d="M9 3.58a4.86 4.86 0 0 1 3.44 1.35l2.58-2.58A8.64 8.64 0 0 0 9 0 9 9 0 0 0 .96 4.95L4 7.29A5.37 5.37 0 0 1 9 3.58z"/></svg>
          Continue with Google
        </button>
        <div class="divider">or</div>
        <div class="form-row">
          <label>Full Name</label>
          <input type="text" placeholder="Rahul Sharma" id="signup-name">
        </div>
        <div class="form-row">
          <label>Email</label>
          <input type="email" placeholder="you@university.edu" id="signup-email">
        </div>
        <div class="form-row">
          <label>Password</label>
          <input type="password" placeholder="Create a strong password" id="signup-pass">
        </div>
        <div class="form-row">
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password" id="signup-confirm-pass" onkeydown="if(event.key==='Enter'){handleSignup()}">
        </div>
        <button class="btn btn-primary" style="width: 100%; justify-content: center; padding: 11px; margin-top: 4px" onclick="handleSignup()">Create Account →</button>
        <div class="auth-footer">Already have an account? <a href="#" onclick="navigate('login')">Sign in</a></div>
      </div>
    </div>
  `;
}

