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
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 48px; margin-bottom: 16px" class="typing-dot">📄</div>
        <h3 style="font-weight: 700; margin-bottom: 6px">Generating Study Notes...</h3>
        <p style="color: var(--text3); font-size: 13px">Gemini is summarizing the document contents. Please wait.</p>
      </div>
    `;
  } else if (state.summaryText) {
    outputHTML = `
      <div class="glass-card" style="margin-bottom: 12px">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px">
          <span>📄</span>
          <div>
            <div style="font-size: 13px; font-weight: 600">${activeDocName}</div>
            <div style="font-size: 11px; color: var(--text3)">Summary generated via Gemini AI</div>
          </div>
        </div>
        <div class="summary-block" style="max-height: 480px; overflow-y: auto;">
          ${formatSummaryMarkdown(state.summaryText)}
        </div>
        <div style="display: flex; gap: 8px; margin-top: 12px">
          <button class="btn btn-outline btn-sm" onclick="navigator.clipboard.writeText(\`${state.summaryText.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`); alert('Copied to clipboard!');">📋 Copy Text</button>
          <button class="btn btn-outline btn-sm" onclick="navigate('chat')">💬 Chat with Context</button>
        </div>
      </div>
    `;
  } else {
    outputHTML = `
      <div style="text-align: center; padding: 50px 20px; color: var(--text3); font-size: 13px;" class="glass-card">
        Select a document, choose a summary type, and click "Generate Summary" to compile AI study notes.
      </div>
    `;
  }

  return `
    <div class="page active" style="padding: 24px">
      <div class="page-header">
        <h1>📄 AI Summaries</h1>
        <p>Generate comprehensive summaries and study notes instantly</p>
      </div>
      
      <div class="grid-2" style="margin-bottom: 20px">
        <div class="glass-card">
          <div class="sec-title" style="margin-bottom: 14px">⚙️ Generate Summary</div>
          <div class="form-row">
            <label>Select Document</label>
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
          <button class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 10px" onclick="generateSummary()">⚡ Generate Summary</button>
        </div>
        
        <div>
          ${outputHTML}
        </div>
      </div>
    </div>
  `;
}

