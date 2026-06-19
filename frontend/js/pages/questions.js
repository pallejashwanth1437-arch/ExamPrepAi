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
      <div class="scanner-container">
        <div class="scanner-bar"></div>
        <div style="font-size: 54px; margin-bottom: 20px; filter: drop-shadow(0 0 10px var(--accent));">❓</div>
        <h2 style="font-weight: 800; margin-bottom: 12px; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">Predicting Exam Questions...</h2>
        <p style="color: var(--text2); text-align: center; font-size: 13.5px; max-width: 420px; line-height: 1.6;">Gemini is scanning the document text to predict likely exam questions, difficulty ratings, and topic tags.</p>
      </div>
    `;
  } else if (!questionsData || questionsData.length === 0) {
    contentHTML = `
      <div style="text-align: center; padding: 50px 20px; color: var(--text3); font-size: 13px;" class="glass-card animate-fade-in">
        Select a document and click "Predict Questions" to parse your study materials.
      </div>
    `;
  } else {
    contentHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px">
        ${questionsData.map((q, i) => `
          <div class="glass-card glow animate-fade-in delay-${Math.min(i + 2, 8)}" style="padding: 16px 20px;">
            <div class="accordion-header" style="display: flex; align-items: center; gap: 14px;" onclick="const panel = document.getElementById('ans-panel-${i}'); panel.classList.toggle('open'); this.querySelector('.arrow-ico').style.transform = panel.classList.contains('open') ? 'rotate(90deg)' : '';">
              <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(99, 102, 241, 0.12); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0; color: var(--accent3)">
                ${i + 1}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 14.5px; font-weight: 700; color: var(--text1); line-height: 1.4">${q.q}</div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px">
                  <span class="badge-pill badge-purple">${q.type || 'Exam Question'}</span>
                  <span class="badge-pill ${q.diff === 'Hard' ? 'badge-red' : q.diff === 'Medium' ? 'badge-amber' : 'badge-green'}">${q.diff || 'Medium'}</span>
                  <span class="badge-pill badge-cyan">${q.topic || 'General'}</span>
                </div>
              </div>
              <span class="arrow-ico" style="font-size: 12px; color: var(--text3); transition: transform 0.3s ease; margin: 0 6px;">▶</span>
            </div>
            <div id="ans-panel-${i}" class="accordion-panel">
              <div style="padding: 16px; margin-top: 14px; background: rgba(255,255,255,0.01); border: 1.5px dashed var(--border); border-radius: 12px; display: flex; flex-direction: column; gap: 12px;">
                <div style="font-size: 12.5px; color: var(--text2); line-height: 1.5;">Need help answering this question? You can ask the AI study assistant to generate a detailed model answer or copy the question.</div>
                <div style="display: flex; gap: 8px;">
                  <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); selectDoc('${state.selectedDocId}'); sendChatMsg('Answer this exam question in detail: ${q.q.replace(/'/g, "\\'").replace(/"/g, '\\"') }'); navigate('chat');" style="font-weight: 700;">⚡ Ask AI to Answer</button>
                  <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); navigator.clipboard.writeText(\`${q.q.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`); alert('Question copied!');" style="font-weight: 600;">📋 Copy Question</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  return `
    <div class="page active" style="padding: 24px">
      <div class="page-header animate-fade-in">
        <h1 style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">❓ Predicted Questions</h1>
        <p style="color: var(--text2)">AI-predicted exam questions based on your uploaded study material</p>
      </div>
      
      <div class="glass-card animate-fade-in delay-1" style="margin-bottom: 20px">
        <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center">
          <select id="questions-doc-select" onchange="selectDoc(this.value)" style="width: auto">
            ${state.DOCS.filter(d => d.status === 'ready').map(d => `<option value="${d.id}" ${state.selectedDocId === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
          </select>
          ${state.DOCS.filter(d => d.status === 'ready').length === 0 ? `
            <span style="color: var(--red); font-size: 11px;">⚠️ Please upload a PDF first.</span>
          ` : ''}
          <button class="btn btn-primary btn-sm" style="margin-left: auto; padding: 8px 16px; font-weight: 700;" onclick="generateQuestions()">⚡ Predict Questions</button>
        </div>
      </div>
      
      ${contentHTML}
    </div>
  `;
}

