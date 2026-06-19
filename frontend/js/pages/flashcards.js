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
  const scene = document.querySelector('.flashcard-scene');
  if (scene) {
    scene.classList.add('swipe-right');
    setTimeout(() => {
      state.cardState.known.add(state.cardState.idx);
      state.cardState.unknown.delete(state.cardState.idx);
      nextCard();
    }, 450);
  } else {
    state.cardState.known.add(state.cardState.idx);
    state.cardState.unknown.delete(state.cardState.idx);
    nextCard();
  }
}

export function markUnknown() {
  const scene = document.querySelector('.flashcard-scene');
  if (scene) {
    scene.classList.add('swipe-left');
    setTimeout(() => {
      state.cardState.unknown.add(state.cardState.idx);
      state.cardState.known.delete(state.cardState.idx);
      nextCard();
    }, 450);
  } else {
    state.cardState.unknown.add(state.cardState.idx);
    state.cardState.known.delete(state.cardState.idx);
    nextCard();
  }
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
        <div style="max-width: 600px; margin: 80px auto;">
          <div class="scanner-container">
            <div class="scanner-bar"></div>
            <div style="font-size: 54px; margin-bottom: 20px; filter: drop-shadow(0 0 10px var(--accent));">🃏</div>
            <h2 style="font-weight: 800; margin-bottom: 12px; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">Generating AI Flashcards...</h2>
            <p style="color: var(--text2); text-align: center; font-size: 13.5px; max-width: 400px; line-height: 1.6;">Gemini is analyzing your document text to extract core vocabulary and flashcard definitions. Please wait.</p>
          </div>
        </div>
      </div>
    `;
  }

  if (!FLASHCARDS || FLASHCARDS.length === 0) {
    return `
      <div class="page active" style="padding: 24px">
        <div class="page-header animate-fade-in">
          <h1 style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">🃏 Flashcards</h1>
          <p style="color: var(--text2)">Review and memorize key concepts with AI-generated flashcards</p>
        </div>
        <div style="max-width: 500px; margin: 40px auto; text-align: center" class="animate-fade-in delay-1">
          <div style="font-size: 54px; margin-bottom: 16px">🃏</div>
          <h2 style="font-weight: 800; margin-bottom: 8px">No Flashcards Available</h2>
          <p style="color: var(--text2); margin-bottom: 24px">Select a document and generate AI flashcards to test your knowledge.</p>
          
          <div class="glass-card" style="text-align: left; margin-bottom: 20px">
            <div class="form-row">
              <label>Select Study Material</label>
              <select id="flashcard-doc-select" onchange="selectDoc(this.value)">
                ${state.DOCS.filter(d => d.status === 'ready').map(d => `<option value="${d.id}" ${state.selectedDocId === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
              </select>
              ${state.DOCS.filter(d => d.status === 'ready').length === 0 ? `
                <div style="color: var(--red); font-size: 11px; margin-top: 4px">⚠️ No ready documents found. Please upload a PDF first.</div>
              ` : ''}
            </div>
            <button class="btn btn-primary" style="width: 100%; justify-content: center; padding: 12px; font-weight: 700;" onclick="generateFlashcardsFromServer()">⚡ Generate Flashcards</button>
          </div>
        </div>
      </div>
    `;
  }

  const card = FLASHCARDS[cardState.idx];
  const progressPct = ((cardState.idx + 1) / FLASHCARDS.length) * 100;

  return `
    <div class="page active" style="padding: 24px">
      <div class="page-header animate-fade-in">
        <h1 style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">🃏 Flashcards</h1>
        <p style="color: var(--text2)">Review and memorize key concepts with AI-generated flashcards</p>
      </div>
      
      <div style="max-width: 640px; margin: 0 auto">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px" class="animate-fade-in delay-1">
          <span style="font-size: 13px; color: var(--text2); font-weight: 600;">Card ${cardState.idx + 1} of ${FLASHCARDS.length}</span>
          <div style="display: flex; gap: 6px">
            <span class="badge-pill badge-green">✓ Got It: ${cardState.known.size}</span>
            <span class="badge-pill badge-red">✗ Review: ${cardState.unknown.size}</span>
          </div>
        </div>
        
        <div class="progress-bar animate-fade-in delay-2" style="margin-bottom: 28px; height: 6px; border-radius: 3px;">
          <div class="progress-fill" style="width: ${progressPct}%; background: linear-gradient(90deg, var(--accent), var(--cyan))"></div>
        </div>
        
        <div class="flashcard-scene animate-fade-in delay-3" onclick="flipCard()">
          <div class="flashcard${cardState.flipped ? ' flipped' : ''}">
            <div class="card-face card-front">
              <div class="card-label">QUESTION • CLICK TO FLIP</div>
              <div class="card-q">${card.q}</div>
            </div>
            <div class="card-face card-back">
              <div class="card-label">ANSWER • CLICK TO FLIP</div>
              <div class="card-a">${card.a}</div>
            </div>
          </div>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 18px" class="animate-fade-in delay-4">
          <button class="btn btn-outline" onclick="prevCard()">← Prev</button>
          <button class="btn btn-ghost" onclick="flipCard()">${cardState.flipped ? '↩ Show Question' : '💡 Show Answer'}</button>
          <button class="btn btn-outline" onclick="nextCard()">Next →</button>
        </div>
        
        <div style="display: flex; gap: 12px; justify-content: center; margin-bottom: 28px" class="animate-fade-in delay-4">
          <button class="btn btn-danger" style="padding: 10px 20px; font-weight: 700; width: 140px; justify-content: center;" onclick="markUnknown()">✗ Need Review</button>
          <button class="btn btn-success" style="padding: 10px 20px; font-weight: 700; width: 140px; justify-content: center;" onclick="markKnown()">✓ Got It!</button>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center" class="animate-fade-in delay-5">
          <button class="btn btn-outline btn-sm" onclick="shuffleCards()">🔀 Shuffle Cards</button>
          <button class="btn btn-primary btn-sm" onclick="generateFlashcardsFromServer()">🔄 Regenerate All</button>
          <button class="btn btn-outline btn-sm" onclick="navigate('documents')">📁 Study Library</button>
        </div>
      </div>
    </div>
  `;
}

