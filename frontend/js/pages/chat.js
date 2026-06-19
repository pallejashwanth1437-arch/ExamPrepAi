import { state, notify, sendChatToServer, selectDoc } from '../state.js';

// Simple markdown formatter to display Gemini's rich text nicely
function formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/&lt;span class="key-point"&gt;(.*?)&lt;\/span&gt;/g, '<span class="key-point">$1</span>')
    .replace(/&lt;br&gt;/g, '<br>')
    .replace(/&lt;strong&gt;(.*?)&lt;\/strong&gt;/g, '<strong>$1</strong>');
}

export function sendChatMsg(text) {
  sendChatToServer(text);
  
  // Clear chat input if it was sent from the textarea
  const input = document.getElementById('chat-input');
  if (input) input.value = '';
}

export function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input?.value?.trim();
  if (!text) return;
  sendChatMsg(text);
}

// Bind to window so inline onclick handlers have access
window.sendChatMsg = sendChatMsg;
window.sendChat = sendChat;
window.selectDoc = selectDoc;

export function renderChat() {
  const typingHTML = state.isTyping ? `
    <div class="msg msg-ai animate-fade-in">
      <div class="msg-avatar">⚡</div>
      <div class="msg-bubble" style="padding: 14px 18px">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>` : '';

  const activeDocName = state.DOCS.find(d => d.id === state.selectedDocId)?.name || 'No document selected';
  const readyDocs = state.DOCS.filter(d => d.status === 'ready');
  const mobileSelectorHTML = `
    <div class="chat-mobile-selector-container">
      <span style="font-size: 16px">📄</span>
      <select class="chat-mobile-selector" onchange="selectDoc(this.value)">
        <option value="" ${!state.selectedDocId ? 'selected' : ''}>Choose Study Document...</option>
        ${readyDocs.map(d => `
          <option value="${d.id}" ${state.selectedDocId === d.id ? 'selected' : ''}>
            ${d.name.replace('.pdf', '')} (${d.pages} pages)
          </option>
        `).join('')}
      </select>
    </div>
  `;

  return `
    <div class="page active animate-fade-in" style="padding: 0">
      <div class="chat-layout">
        <div class="chat-docs">
          <div style="font-size: 11px; font-weight: 700; color: var(--text3); margin-bottom: 12px; text-transform: uppercase; letter-spacing: .06em">Documents</div>
          ${state.DOCS.filter(d => d.status === 'ready').map((d) => `
            <div onclick="selectDoc('${d.id}')" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; margin-bottom: 6px; cursor: pointer; background: ${state.selectedDocId === d.id ? 'rgba(99,102,241,0.12)' : 'transparent'}; border: 1px solid ${state.selectedDocId === d.id ? 'rgba(99,102,241,0.3)' : 'transparent'}; transition: all 0.2s ease;">
              <span style="font-size: 16px">📄</span>
              <div style="flex: 1; min-width: 0">
                <div style="font-size: 12.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${state.selectedDocId === d.id ? 'var(--text1)' : 'var(--text2)'}" title="${d.name}">${d.name.replace('.pdf', '')}</div>
                <div style="font-size: 10px; color: var(--text3)">${d.pages} pages</div>
              </div>
            </div>
          `).join('')}
          ${state.DOCS.filter(d => d.status === 'ready').length === 0 ? `
            <div style="font-size: 12px; color: var(--text3); text-align: center; padding: 12px 0;">No documents uploaded.</div>
          ` : ''}
          <div style="margin-top: 20px">
            <div style="font-size: 11px; font-weight: 700; color: var(--text3); margin-bottom: 10px; text-transform: uppercase; letter-spacing: .06em">Active Study Context</div>
            <div style="font-size: 11px; color: var(--accent3); padding: 8px 12px; background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${activeDocName}">
              📖 ${activeDocName.replace('.pdf', '')}
            </div>
          </div>
        </div>
        
        <div class="chat-main">
          ${mobileSelectorHTML}
          <div class="messages" id="messages-container">
            ${state.chatMessages.map(m => `
              <div class="msg msg-${m.role}">
                <div class="msg-avatar">${m.role === 'ai' ? '⚡' : (state.user?.initials || 'PJ')}</div>
                <div class="msg-bubble">
                  ${m.role === 'ai' ? formatMarkdown(m.text) : m.text}
                  ${m.role === 'ai' ? `
                    <div style="display: flex; gap: 6px; margin-top: 8px">
                      <button class="btn btn-ghost btn-sm" style="font-size: 11px; padding: 3px 8px" onclick="navigator.clipboard.writeText(\`${m.text.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`); alert('Copied to clipboard!');">📋 Copy</button>
                    </div>` : ''}
                </div>
              </div>
            `).join('')}
            ${typingHTML}
          </div>
          
          <div class="chat-input-area">
            <div class="suggested-qs animate-fade-in delay-2">
              ${['Summarize this document', 'What are the main topics?', 'Explain the key terms', 'List 3 exam questions'].map(q => `
                <div class="suggested-q" onclick="sendChatMsg('${q}')">${q}</div>
              `).join('')}
            </div>
            <div class="chat-input-wrap animate-fade-in delay-3">
              <textarea class="chat-input" id="chat-input" rows="1" placeholder="Ask anything about your documents…" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChat()}">${state.chatInput}</textarea>
              <button class="btn btn-primary btn-sm" onclick="sendChat()" style="flex-shrink: 0; padding: 6px 14px; font-weight: 700;">Send ↑</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

