import { state, subscribe, loadDocs } from './state.js';
import { renderSidebar, renderTopbar, renderNavbar } from './components.js';
import { initParticles } from './utils.js';

import { renderLanding } from './pages/landing.js';
import { renderLogin, renderSignup } from './pages/auth.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderDocuments } from './pages/documents.js';
import { renderChat } from './pages/chat.js';
import { renderQuizzes } from './pages/quiz.js';
import { renderFlashcards } from './pages/flashcards.js';
import { renderSummaries } from './pages/summaries.js';
import { renderQuestions } from './pages/questions.js';
import { renderAnalytics } from './pages/analytics.js';
import { renderProfile } from './pages/profile.js';
import { renderSettings } from './pages/settings.js';

export function render() {
  const root = document.getElementById('root');
  if (!root) return;

  const { currentPage } = state;

  if (currentPage === 'landing') {
    root.innerHTML = renderLanding();
    setTimeout(initParticles, 100);
    return;
  }
  if (currentPage === 'login') {
    root.innerHTML = renderLogin();
    return;
  }
  if (currentPage === 'signup') {
    root.innerHTML = renderSignup();
    return;
  }

  // Render App layout with horizontal header topbar navigation
  root.innerHTML = `
    <div class="app horizontal-layout">
      ${renderNavbar()}
      <div class="main-content">
        <div class="content">
          ${renderPage(currentPage)}
        </div>
      </div>
    </div>
  `;
}

function renderPage(page) {
  switch (page) {
    case 'dashboard':
      return renderDashboard();
    case 'documents':
      return renderDocuments();
    case 'chat':
      return renderChat();
    case 'quizzes':
      return renderQuizzes();
    case 'flashcards':
      return renderFlashcards();
    case 'summaries':
      return renderSummaries();
    case 'questions':
      return renderQuestions();
    case 'analytics':
      return renderAnalytics();
    case 'profile':
      return renderProfile();
    case 'settings':
      return renderSettings();
    default:
      return renderDashboard();
  }
}

// Register router to subscribe to state updates
subscribe(render);

// Initial load of documents from server
loadDocs();

export default render;
