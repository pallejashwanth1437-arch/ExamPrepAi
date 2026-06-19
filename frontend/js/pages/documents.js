import { state, uploadDoc, deleteDocFromServer, selectDoc } from '../state.js';

// Delete a document from server
export function deleteDoc(id) {
  if (confirm("Are you sure you want to delete this document? This will delete all parsed content.")) {
    deleteDocFromServer(id);
  }
}

// Open file browse dialog
export function triggerUpload() {
  const fileInput = document.getElementById('pdf-file-input');
  if (fileInput) fileInput.click();
}

// Handle file selection
export function handleFileSelect(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.type !== 'application/pdf') {
    alert("Please upload a PDF file.");
    return;
  }
  uploadDoc(file);
}

// Bind to window for HTML access
window.deleteDoc = deleteDoc;
window.triggerUpload = triggerUpload;
window.handleFileSelect = handleFileSelect;

export function renderDocuments() {
  return `
    <div class="page active" style="padding: 24px">
      <div class="page-header animate-fade-in">
        <h1 style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">📁 Documents Library</h1>
        <p style="color: var(--text2)">Manage your study materials and upload knowledge base files</p>
      </div>
      
      <!-- Hidden file input for real uploads -->
      <input type="file" id="pdf-file-input" accept="application/pdf" style="display: none" onchange="handleFileSelect(this)">
      
      <div class="glass-card animate-fade-in delay-1" style="margin-bottom: 24px">
        <div class="upload-zone" id="dropzone" onclick="triggerUpload()" ondragover="event.preventDefault(); this.classList.add('drag')" ondragleave="this.classList.remove('drag')" ondrop="event.preventDefault(); this.classList.remove('drag'); const dt = event.dataTransfer; if (dt.files.length) { handleFileSelect({files: dt.files}); }">
          <div class="upload-icon">📤</div>
          <div style="font-size: 16px; font-weight: 700; margin-bottom: 6px; color: var(--text1)">Drop your PDFs here</div>
          <div style="font-size: 13px; color: var(--text2); margin-bottom: 16px">or click to browse files</div>
          <button class="btn btn-primary" onclick="event.stopPropagation(); triggerUpload();">Browse Files</button>
          <div style="font-size: 11px; color: var(--text3); margin-top: 10px">Supports PDF • Max 50MB • Up to 500 pages</div>
        </div>
      </div>
      
      <div class="sec-header animate-fade-in delay-2">
        <div class="sec-title">Your Library (${state.DOCS.length})</div>
        <div style="display: flex; gap: 8px">
          <select style="width: auto; padding: 6px 10px; font-size: 12px">
            <option>All Files</option>
          </select>
        </div>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 12px">
        ${state.DOCS.length === 0 ? `
          <div class="glass-card animate-fade-in delay-3" style="text-align: center; padding: 40px; color: var(--text3); font-size: 13px;">
            No documents uploaded yet. Upload a PDF above to get started studying!
          </div>
        ` : state.DOCS.map((d, idx) => `
          <div class="doc-card animate-fade-in delay-${Math.min(idx + 3, 8)}" style="border-color: ${state.selectedDocId === d.id ? 'var(--accent)' : 'var(--border)'}">
            <div class="doc-icon">📄</div>
            <div class="doc-info">
              <div class="doc-name">${d.name}</div>
              <div class="doc-meta">${d.pages} pages • ${d.chunks} chunks • Uploaded ${d.date}</div>
              <div class="doc-actions">
                <button class="btn btn-outline btn-sm" onclick="selectDoc('${d.id}'); navigate('chat')">💬 Chat</button>
                <button class="btn btn-outline btn-sm" onclick="selectDoc('${d.id}'); navigate('quizzes')">📝 Quiz</button>
                <button class="btn btn-outline btn-sm" onclick="selectDoc('${d.id}'); navigate('summaries')">📄 Summary</button>
                <button class="btn btn-danger btn-sm" onclick="deleteDoc('${d.id}')">🗑</button>
              </div>
            </div>
            <span class="badge-pill ${d.status === 'ready' ? 'badge-green' : 'badge-amber'}" style="flex-shrink: 0">
              ${d.status === 'ready' ? '✓ Ready' : '⟳ Processing'}
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

