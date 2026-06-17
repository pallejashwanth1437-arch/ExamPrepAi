import { state, notify, generateFlashcardsFromServer, selectDoc } from '../state.js';

export function flipCard() {
  state.cardState.flipped = !state.cardState.flipped;
  notify();
}

export function nextCard() {
  if (!state.FLASHCARDS.length) return;
  state.cardState.idx = (state.cardState.idx + 1) % state.FLASHCARDS.length;
  state.cardState.flipped = false;
  notify();
}

export function prevCard() {
  if (!state.FLASHCARDS.length) return;
  state.cardState.idx = (state.cardState.idx - 1 + state.FLASHCARDS.length) % state.FLASHCARDS.length;
  state.cardState.flipped = false;
  notify();
}

export function markKnown() {
  state.cardState.known.add(state.cardState.idx);
  state.cardState.unknown.delete(state.cardState.idx);
  nextCard();
}

export function markUnknown() {
  state.cardState.unknown.add(state.cardState.idx);
  state.cardState.known.delete(state.cardState.idx);
  nextCard();
}

export function shuffleCards() {
  if (!state.FLASHCARDS.length) return;
  state.cardState.idx = Math.floor(Math.random() * state.FLASHCARDS.length);
  state.cardState.flipped = false;
  notify();
}

// Bind globally
window.flipCard = flipCard;
window.nextCard = nextCard;
window.prevCard = prevCard;
window.markKnown = markKnown;
window.markUnknown = markUnknown;
window.shuffleCards = shuffleCards;
window.selectDoc = selectDoc;

export function renderFlashcards() {
  const { cardState, FLASHCARDS } = state;

  if (state.isGeneratingCards) {
    return `
      <div class="page active" style="padding: 24px">
        <div style="max-width: 600px; margin: 80px auto; text-align: center">
          <div style="font-size: 54px; margin-bottom: 20px" class="typing-dot">🃏</div>
          <h2 style="font-weight: 800; margin-bottom: 12px; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">Generating AI Flashcards...</h2>
          <p style="color: var(--text2)">Gemini is analyzing your document context and creating flashcards. This will take a few seconds.</p>
        </div>
      </div>
    `;
  }

  if (!FLASHCARDS || FLASHCARDS.length === 0) {
    return `
      <div class="page active" style="padding: 24px">
        <div class="page-header">
          <h1>🃏 Flashcards</h1>
          <p>Review and memorize key concepts with AI-generated flashcards</p>
        </div>
        <div style="max-width: 500px; margin: 40px auto; text-align: center">
          <div style="font-size: 54px; margin-bottom: 16px">🃏</div>
          <h2 style="font-weight: 800; margin-bottom: 8px">No Flashcards Available</h2>
          <p style="color: var(--text2); margin-bottom: 24px">Select a document and generate AI flashcards to test your knowledge.</p>
          
          <div class="glass-card" style="text-align: left; margin-bottom: 20px">
            <div class="form-row">
              <label>Select Document</label>
              <select id="flashcard-doc-select" onchange="selectDoc(this.value)">
                ${state.DOCS.filter(d => d.status === 'ready').map(d => `<option value="${d.id}" ${state.selectedDocId === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
              </select>
              ${state.DOCS.filter(d => d.status === 'ready').length === 0 ? `
                <div style="color: var(--red); font-size: 11px; margin-top: 4px">⚠️ No ready documents found. Please upload a PDF first.</div>
              ` : ''}
            </div>
            <button class="btn btn-primary" style="width: 100%; justify-content: center" onclick="generateFlashcardsFromServer()">⚡ Generate Flashcards</button>
          </div>
        </div>
      </div>
    `;
  }

  const card = FLASHCARDS[cardState.idx];
  const progressPct = ((cardState.idx + 1) / FLASHCARDS.length) * 100;

  return `
    <div class="page active" style="padding: 24px">
      <div class="page-header">
        <h1>🃏 Flashcards</h1>
        <p>Review and memorize key concepts with AI-generated flashcards</p>
      </div>
      
      <div style="max-width: 640px; margin: 0 auto">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px">
          <span style="font-size: 13px; color: var(--text2)">${cardState.idx + 1} / ${FLASHCARDS.length} cards</span>
          <div style="display: flex; gap: 6px">
            <span class="badge-pill badge-green">✓ Known: ${cardState.known.size}</span>
            <span class="badge-pill badge-red">✗ Review: ${cardState.unknown.size}</span>
          </div>
        </div>
        
        <div class="progress-bar" style="margin-bottom: 24px; height: 4px">
          <div class="progress-fill" style="width: ${progressPct}%; background: linear-gradient(90deg, var(--accent), var(--cyan))"></div>
        </div>
        
        <div class="flashcard-scene" onclick="flipCard()">
          <div class="flashcard${cardState.flipped ? ' flipped' : ''}">
            <div class="card-face card-front">
              <div class="card-label">QUESTION — CLICK TO FLIP</div>
              <div class="card-q">${card.q}</div>
            </div>
            <div class="card-face card-back">
              <div class="card-label">ANSWER</div>
              <div class="card-a">${card.a}</div>
            </div>
          </div>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 16px">
          <button class="btn btn-outline" onclick="prevCard()">← Previous</button>
          <button class="btn btn-ghost" onclick="flipCard()">${cardState.flipped ? '↩ Question' : '💡 Show Answer'}</button>
          <button class="btn btn-outline" onclick="nextCard()">Next →</button>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 24px">
          <button class="btn btn-danger" onclick="markUnknown()">✗ Need Review</button>
          <button class="btn btn-success" onclick="markKnown()">✓ Got It!</button>
        </div>
        
        <div style="display: flex; gap: 8px; justify-content: center">
          <button class="btn btn-outline btn-sm" onclick="shuffleCards()">🔀 Shuffle</button>
          <button class="btn btn-primary btn-sm" onclick="generateFlashcardsFromServer()">🔄 Regenerate</button>
          <button class="btn btn-outline btn-sm" onclick="navigate('documents')">📁 Back to Docs</button>
        </div>
      </div>
    </div>
  `;
}

