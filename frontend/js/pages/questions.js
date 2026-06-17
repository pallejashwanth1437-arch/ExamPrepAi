import { state, generateQuestionsFromServer, selectDoc } from '../state.js';

export function generateQuestions() {
  const docSelect = document.getElementById('questions-doc-select');
  const docId = docSelect ? docSelect.value : state.selectedDocId;

  if (!docId) {
    alert("Please upload and select a document in the Documents tab first.");
    return;
  }

  generateQuestionsFromServer();
}

// Bind globally
window.generateQuestions = generateQuestions;
window.selectDoc = selectDoc;

export function renderQuestions() {
  const { questionsData } = state;

  let contentHTML = '';
  if (state.isGeneratingQuestions) {
    contentHTML = `
      <div style="text-align: center; padding: 60px 20px;" class="glass-card">
        <div style="font-size: 54px; margin-bottom: 20px" class="typing-dot">❓</div>
        <h2 style="font-weight: 800; margin-bottom: 12px; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">Predicting Exam Questions...</h2>
        <p style="color: var(--text2)">Gemini is analyzing your study material to predict likely exam questions and answers. This will take a few seconds.</p>
      </div>
    `;
  } else if (!questionsData || questionsData.length === 0) {
    contentHTML = `
      <div style="text-align: center; padding: 50px 20px; color: var(--text3); font-size: 13px;" class="glass-card">
        Select a document and click "Generate Questions" to predict study questions from your material.
      </div>
    `;
  } else {
    contentHTML = `
      <div style="display: flex; flex-direction: column; gap: 10px">
        ${questionsData.map((q, i) => `
          <div class="glass-card glow">
            <div style="display: flex; align-items: flex-start; gap: 12px">
              <div style="width: 28px; height: 28px; border-radius: 7px; background: var(--bg3); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; color: var(--accent3)">
                ${i + 1}
              </div>
              <div style="flex: 1">
                <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px; line-height: 1.5">${q.q}</div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap">
                  <span class="badge-pill badge-purple">${q.type || 'Exam Question'}</span>
                  <span class="badge-pill ${q.diff === 'Hard' ? 'badge-red' : q.diff === 'Medium' ? 'badge-amber' : 'badge-green'}">${q.diff || 'Medium'}</span>
                  <span class="badge-pill badge-cyan">${q.topic || 'General'}</span>
                </div>
              </div>
              <button class="btn btn-ghost btn-sm" style="flex-shrink: 0" onclick="this.style.color = this.style.color === 'var(--amber)' ? '' : 'var(--amber)';">⭐</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  return `
    <div class="page active" style="padding: 24px">
      <div class="page-header">
        <h1>❓ Important Questions</h1>
        <p>AI-predicted exam questions based on your study material</p>
      </div>
      
      <div class="glass-card" style="margin-bottom: 20px">
        <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center">
          <select id="questions-doc-select" onchange="selectDoc(this.value)" style="width: auto">
            ${state.DOCS.filter(d => d.status === 'ready').map(d => `<option value="${d.id}" ${state.selectedDocId === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
          </select>
          ${state.DOCS.filter(d => d.status === 'ready').length === 0 ? `
            <span style="color: var(--red); font-size: 11px;">⚠️ Please upload a PDF first.</span>
          ` : ''}
          <button class="btn btn-primary btn-sm" style="margin-left: auto" onclick="generateQuestions()">⚡ Generate Questions</button>
        </div>
      </div>
      
      ${contentHTML}
    </div>
  `;
}

