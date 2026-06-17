// Central Application State using a simple Pub/Sub pattern

// Check for Google OAuth callback token in hash
try {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get('access_token');
  if (accessToken) {
    // Clear the hash in the browser URL bar so it looks clean
    window.history.replaceState(null, null, ' ');
    handleGoogleCallback(accessToken);
  }
} catch (err) {
  console.error("Failed to check Google OAuth callback:", err);
}

async function handleGoogleCallback(token) {
  try {
    const userinfoRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    if (!userinfoRes.ok) throw new Error("Failed to fetch user info from Google");
    const userinfo = await userinfoRes.json();
    
    // Call our backend to login/signup this Google user
    const res = await fetch('/api/auth/google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userinfo.name || 'Google User',
        email: userinfo.email
      })
    });
    
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Google auth registration failed");
    }
    
    const data = await res.json();
    state.user = data.user;
    localStorage.setItem('examprep_user', JSON.stringify(state.user));
    state.currentPage = 'dashboard';
    notify();
  } catch (err) {
    console.error("Google authentication error:", err);
    alert("Google authentication failed: " + err.message);
  }
}

// Retrieve persistent user from localStorage if it exists
let savedUser = null;
try {
  const rawUser = localStorage.getItem('examprep_user');
  if (rawUser) {
    savedUser = JSON.parse(rawUser);
  }
} catch (err) {
  console.error("Failed to parse saved user from localStorage:", err);
}

export const state = {
  currentPage: savedUser ? 'dashboard' : 'landing',
  selectedDocId: null, // Tracks currently active document
  user: savedUser,
  
  quizState: {
    q: 0,
    selected: null,
    answered: false,
    score: 0,
    started: false,
    finished: false
  },
  
  cardState: {
    idx: 0,
    flipped: false,
    known: new Set(),
    unknown: new Set()
  },
  
  chatMessages: [
    {
      role: 'ai',
      text: "Hello! 👋 I'm your AI study assistant. Upload a document and ask me anything about it — I can explain concepts, summarize chapters, or quiz you on the material."
    }
  ],
  
  chatInput: '',
  isTyping: false,
  
  // Dynamic API state loaded from server
  DOCS: [],
  QUIZ_DATA: [],
  FLASHCARDS: [],
  summaryText: '',
  questionsData: [],
  
  // Loading indicators
  isGeneratingQuiz: false,
  isGeneratingCards: false,
  isGeneratingSummary: false,
  isGeneratingQuestions: false
};

// Pub/Sub listeners list
const listeners = [];

export function subscribe(listener) {
  listeners.push(listener);
}

export function notify() {
  listeners.forEach(listener => {
    try {
      listener(state);
    } catch (err) {
      console.error("State update listener failed:", err);
    }
  });
}

// Global actions
export function navigate(page) {
  const publicPages = ['landing', 'login', 'signup'];
  if (!publicPages.includes(page) && !state.user) {
    state.currentPage = 'login';
  } else {
    state.currentPage = page;
  }
  notify();
}

export function logout() {
  try {
    localStorage.removeItem('examprep_user');
  } catch (err) {
    console.error("Failed to remove user from localStorage:", err);
  }
  state.user = null;
  state.currentPage = 'landing';
  notify();
}

export async function updateProfile(name, email, college, course) {
  if (!name || !email) {
    alert("Name and email are required fields.");
    return;
  }
  
  const currentEmail = state.user?.email;
  if (!currentEmail) {
    alert("You are not logged in.");
    return;
  }

  try {
    const res = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentEmail,
        name,
        email,
        college,
        course
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to update profile");
    }

    state.user = data.user;
    try {
      localStorage.setItem('examprep_user', JSON.stringify(state.user));
    } catch (err) {
      console.error("Failed to save updated user in localStorage:", err);
    }
    
    notify();
    alert("Profile details updated successfully!");
  } catch (err) {
    console.error("Profile update error:", err);
    alert(err.message);
  }
}

export function selectDoc(docId) {
  state.selectedDocId = docId;
  notify();
}

// API Server Calls

export async function loadDocs() {
  try {
    const res = await fetch('/api/documents');
    if (!res.ok) throw new Error("Failed to load documents");
    state.DOCS = await res.json();
    
    // Set default selected document
    if (!state.selectedDocId && state.DOCS.length > 0) {
      state.selectedDocId = state.DOCS[0].id;
    }
    notify();
  } catch (err) {
    console.error("Error loading documents:", err);
  }
}

export async function uploadDoc(file) {
  try {
    // Inject a temporary loading document
    const tempId = 'temp-' + Date.now();
    state.DOCS.push({
      id: tempId,
      name: file.name,
      pages: '...',
      date: 'Just now',
      chunks: '...',
      status: 'processing'
    });
    notify();

    const formData = new FormData();
    formData.append('file', file);
    if (state.user?.email) {
      formData.append('email', state.user.email);
    }

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error("Upload failed");
    
    const newDoc = await res.json();
    
    // Replace temp doc with actual doc
    const idx = state.DOCS.findIndex(d => d.id === tempId);
    if (idx !== -1) {
      state.DOCS[idx] = newDoc;
    } else {
      state.DOCS.push(newDoc);
    }
    
    // Select the newly uploaded doc
    state.selectedDocId = newDoc.id;

    if (state.user) {
      if (!state.user.analytics) state.user.analytics = {};
      state.user.analytics.studyTime = (state.user.analytics.studyTime || 0) + 1;
      localStorage.setItem('examprep_user', JSON.stringify(state.user));
    }

    notify();
  } catch (err) {
    console.error("Upload error:", err);
    alert("Upload failed. Make sure your backend server is running and .env is configured.");
    state.DOCS = state.DOCS.filter(d => !d.id.startsWith('temp-'));
    notify();
  }
}

export async function deleteDocFromServer(docId) {
  try {
    const res = await fetch(`/api/documents/${docId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error("Failed to delete document");
    
    state.DOCS = state.DOCS.filter(d => d.id !== docId);
    if (state.selectedDocId === docId) {
      state.selectedDocId = state.DOCS.length > 0 ? state.DOCS[0].id : null;
    }
    notify();
  } catch (err) {
    console.error("Delete document error:", err);
  }
}

export async function sendChatToServer(text) {
  state.chatMessages.push({ role: 'user', text });
  state.isTyping = true;
  notify();

  setTimeout(() => {
    const container = document.getElementById('messages-container');
    if (container) container.scrollTop = container.scrollHeight;
  }, 50);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        docId: state.selectedDocId,
        history: state.chatMessages.slice(0, -1),
        email: state.user?.email
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to generate chat response");
    }
    
    const data = await res.json();
    state.isTyping = false;
    state.chatMessages.push({
      role: 'ai',
      text: data.text
    });

    if (state.user) {
      if (!state.user.analytics) state.user.analytics = {};
      state.user.analytics.questionsAsked = (state.user.analytics.questionsAsked || 0) + 1;
      localStorage.setItem('examprep_user', JSON.stringify(state.user));
    }

    notify();

    setTimeout(() => {
      const container = document.getElementById('messages-container');
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  } catch (err) {
    console.error("Chat error:", err);
    state.isTyping = false;
    state.chatMessages.push({
      role: 'ai',
      text: `⚠️ **Error:** ${err.message}`
    });
    notify();
  }
}

export async function generateQuizFromServer(numQuestions, difficulty, types) {
  state.quizState = {
    q: 0,
    selected: null,
    answered: false,
    score: 0,
    started: false,
    finished: false
  };
  state.isGeneratingQuiz = true;
  notify();

  try {
    const res = await fetch('/api/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        docId: state.selectedDocId,
        numQuestions,
        difficulty,
        types
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to generate quiz");
    }

    state.QUIZ_DATA = await res.json();
    state.quizState.started = true;
    state.isGeneratingQuiz = false;
    notify();
  } catch (err) {
    console.error("Quiz generation error:", err);
    alert("Quiz generation failed: " + err.message);
    state.isGeneratingQuiz = false;
    notify();
  }
}

export async function generateFlashcardsFromServer() {
  state.isGeneratingCards = true;
  notify();

  try {
    const res = await fetch('/api/generate-flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docId: state.selectedDocId, email: state.user?.email })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to generate flashcards");
    }

    const cards = await res.json();
    state.FLASHCARDS = cards;
    state.cardState = {
      idx: 0,
      flipped: false,
      known: new Set(),
      unknown: new Set()
    };
    state.isGeneratingCards = false;

    if (state.user && Array.isArray(cards)) {
      if (!state.user.analytics) state.user.analytics = {};
      state.user.analytics.flashcards = (state.user.analytics.flashcards || 0) + cards.length;
      state.user.analytics.studyTime = (state.user.analytics.studyTime || 0) + 1;
      localStorage.setItem('examprep_user', JSON.stringify(state.user));
    }

    notify();
  } catch (err) {
    console.error("Flashcards error:", err);
    alert("Flashcard generation failed: " + err.message);
    state.isGeneratingCards = false;
    notify();
  }
}

export async function generateSummaryFromServer(summaryType) {
  state.isGeneratingSummary = true;
  notify();

  try {
    const res = await fetch('/api/generate-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        docId: state.selectedDocId,
        summaryType,
        email: state.user?.email
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to generate summary");
    }

    const data = await res.json();
    state.summaryText = data.text;
    state.isGeneratingSummary = false;

    if (state.user) {
      if (!state.user.analytics) state.user.analytics = {};
      state.user.analytics.summaries = (state.user.analytics.summaries || 0) + 1;
      state.user.analytics.studyTime = (state.user.analytics.studyTime || 0) + 1;
      localStorage.setItem('examprep_user', JSON.stringify(state.user));
    }

    notify();
  } catch (err) {
    console.error("Summary error:", err);
    alert("Summary generation failed: " + err.message);
    state.isGeneratingSummary = false;
    notify();
  }
}

export async function generateQuestionsFromServer() {
  state.isGeneratingQuestions = true;
  notify();

  try {
    const res = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docId: state.selectedDocId })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to generate questions");
    }

    state.questionsData = await res.json();
    state.isGeneratingQuestions = false;
    notify();
  } catch (err) {
    console.error("Questions error:", err);
    alert("Questions generation failed: " + err.message);
    state.isGeneratingQuestions = false;
    notify();
  }
}

// Record Quiz Score
export async function recordQuiz(score, totalQuestions) {
  const email = state.user?.email;
  if (!email) return;

  try {
    const res = await fetch('/api/auth/record-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, score, totalQuestions })
    });
    if (!res.ok) {
      throw new Error("Failed to record quiz results");
    }
    const data = await res.json();
    if (data.success && data.user) {
      state.user = data.user;
      localStorage.setItem('examprep_user', JSON.stringify(state.user));
      notify();
    }
  } catch (err) {
    console.error("Error recording quiz:", err);
  }
}

export async function loginWithGoogle() {
  try {
    const res = await fetch('/api/auth/config');
    if (!res.ok) throw new Error("Failed to load auth config");
    const config = await res.json();
    
    if (config.googleClientId) {
      const clientId = config.googleClientId;
      const redirectUri = encodeURIComponent(window.location.origin + '/');
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email`;
      window.location.href = oauthUrl;
    } else {
      alert("Real Google Sign-In requires GOOGLE_CLIENT_ID environment variable. Logging you in with a demo Google account for preview...");
      // Fallback: log in with a mock Google account using Palle Jashwanth credentials
      const loginRes = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Palle Jashwanth',
          email: 'pallejeshwanth1437@gmail.com'
        })
      });
      if (!loginRes.ok) {
        throw new Error("Failed to authenticate mock Google user");
      }
      const data = await loginRes.json();
      state.user = data.user;
      localStorage.setItem('examprep_user', JSON.stringify(state.user));
      navigate('dashboard');
    }
  } catch (err) {
    console.error("Google login redirect error:", err);
    alert("Google login failed: " + err.message);
  }
}

// Bind globally for ease of access from HTML inline triggers
window.navigate = navigate;
window.logout = logout;
window.updateProfile = updateProfile;
window.selectDoc = selectDoc;
window.uploadDoc = uploadDoc;
window.deleteDocFromServer = deleteDocFromServer;
window.sendChatToServer = sendChatToServer;
window.generateQuizFromServer = generateQuizFromServer;
window.generateFlashcardsFromServer = generateFlashcardsFromServer;
window.generateSummaryFromServer = generateSummaryFromServer;
window.generateQuestionsFromServer = generateQuestionsFromServer;
window.recordQuiz = recordQuiz;
window.loginWithGoogle = loginWithGoogle;

