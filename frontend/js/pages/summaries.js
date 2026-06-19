import { state, generateSummaryFromServer, selectDoc } from '../state.js';

function formatSummaryMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gim, '<h4 style="font-size:14px; font-weight:700; margin-top:14px; margin-bottom:6px; color:var(--accent3)">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 style="font-size:16px; font-weight:800; margin-top:18px; margin-bottom:8px; border-bottom:1px solid var(--border); padding-bottom:4px">$1</h3>')
    .replace(/^# (.*$)/gim, '<h2 style="font-size:18px; font-weight:800; margin-top:22px; margin-bottom:10px; color:var(--text1)">$1</h2>')
    .replace(/^\-\s(.*)$/gm, '• $1')
    .replace(/^\*\s(.*)$/gm, '• $1')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/&lt;span class="key-point"&gt;(.*?)&lt;\/span&gt;/g, '<span class="key-point">$1</span>')
    .replace(/&lt;br&gt;/g, '<br>');
}

export function generateSummary() {
  const docSelect = document.getElementById('summary-doc-select');
  const docId = docSelect ? docSelect.value : state.selectedDocId;

  if (!docId) {
    alert("Please upload and select a document in the Documents tab first.");
    return;
  }

  const typeSelect = document.getElementById('summary-type-select');
  const summaryType = typeSelect ? typeSelect.value : 'Short Summary';

  generateSummaryFromServer(summaryType);
}

// Bind globally
window.generateSummary = generateSummary;
window.selectDoc = selectDoc;

export function renderSummaries() {
  const activeDoc = state.DOCS.find(d => d.id === state.selectedDocId);
  const activeDocName = activeDoc ? activeDoc.name : 'No document selected';

  let outputHTML = '';
  if (state.isGeneratingSummary) {
    outputHTML = `
      <div class="scanner-container">
        <div class="scanner-bar"></div>
        <div style="font-size: 48px; margin-bottom: 16px; filter: drop-shadow(0 0 10px var(--accent));">📄</div>
        <h3 style="font-weight: 700; margin-bottom: 6px; color: var(--text1)">Generating Study Notes...</h3>
        <p style="color: var(--text2); font-size: 13px; text-align: center; max-width: 320px; line-height: 1.5;">Gemini is consolidating chapters and preparing structured summary blocks. Please wait.</p>
      </div>
    `;
  } else if (state.summaryText) {
    outputHTML = `
      <div class="glass-card animate-fade-in" style="margin-bottom: 12px">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px">
          <span style="font-size: 20px;">📄</span>
          <div>
            <div style="font-size: 14px; font-weight: 700; color: var(--text1);">${activeDocName}</div>
            <div style="font-size: 11px; color: var(--text3)">Summary generated via Gemini AI</div>
          </div>
        </div>
        <div class="summary-block" style="max-height: 480px; overflow-y: auto;">
          ${formatSummaryMarkdown(state.summaryText)}
        </div>
        <div style="display: flex; gap: 8px; margin-top: 14px">
          <button class="btn btn-outline btn-sm" onclick="navigator.clipboard.writeText(\`${state.summaryText.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`); alert('Copied to clipboard!');" style="font-weight: 600;">📋 Copy Text</button>
          <button class="btn btn-outline btn-sm" onclick="navigate('chat')" style="font-weight: 600;">💬 Chat with Context</button>
        </div>
      </div>
    `;
  } else {
    outputHTML = `
      <div style="text-align: center; padding: 50px 20px; color: var(--text3); font-size: 13px;" class="glass-card animate-fade-in">
        Select a document, choose a summary type, and click "Generate Summary" to compile AI study notes.
      </div>
    `;
  }

  return `
    <div class="page active" style="padding: 24px">
      <div class="page-header animate-fade-in">
        <h1 style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">📄 AI Summaries</h1>
        <p style="color: var(--text2)">Generate comprehensive summaries and structured study notes instantly</p>
      </div>
      
      <div class="grid-2" style="margin-bottom: 20px">
        <div class="glass-card animate-fade-in delay-1">
          <div class="sec-title" style="margin-bottom: 16px">⚙️ Generate Summary</div>
          <div class="form-row">
            <label>Select Study Material</label>
            <select id="summary-doc-select" onchange="selectDoc(this.value)">
              ${state.DOCS.filter(d => d.status === 'ready').map(d => `<option value="${d.id}" ${state.selectedDocId === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
            ${state.DOCS.filter(d => d.status === 'ready').length === 0 ? `
              <div style="color: var(--red); font-size: 11px; margin-top: 4px">⚠️ No ready documents found. Please upload a PDF first.</div>
            ` : ''}
          </div>
          <div class="form-row">
            <label>Summary Type</label>
            <select id="summary-type-select" style="margin-top: 4px">
              <option value="Short Summary">⚡ Short Summary (Quick highlights)</option>
              <option value="Detailed Summary" selected>📋 Detailed Summary (In-depth chapters)</option>
              <option value="Exam Notes">📖 Exam Notes (Key dates, names, formulas)</option>
              <option value="Revision Notes">🔄 Revision Notes (Question-answer study guide)</option>
            </select>
          </div>
          <button class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 14px; padding: 12px; font-weight: 700;" onclick="generateSummary()">⚡ Generate Summary</button>
        </div>
        
        <div class="animate-fade-in delay-2">
          ${outputHTML}
        </div>
      </div>
    </div>
  `;
}

