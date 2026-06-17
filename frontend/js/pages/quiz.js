import { state, notify, generateQuizFromServer, selectDoc } from '../state.js';

export function startQuiz() {
  state.quizState = {
    q: 0,
    selected: null,
    answered: false,
    score: 0,
    started: true,
    finished: false
  };
  notify();
}

export function resetQuiz() {
  state.quizState = {
    q: 0,
    selected: null,
    answered: false,
    score: 0,
    started: false,
    finished: false
  };
  notify();
}

export function selectOpt(i) {
  if (state.quizState.answered) return;
  state.quizState.selected = i;
  state.quizState.answered = true;
  
  if (i === state.QUIZ_DATA[state.quizState.q].correct) {
    state.quizState.score++;
  }
  notify();
}

export function nextQ() {
  if (state.quizState.q >= state.QUIZ_DATA.length - 1) {
    state.quizState.finished = true;
    if (typeof window.recordQuiz === 'function') {
      window.recordQuiz(state.quizState.score, state.QUIZ_DATA.length);
    }
    notify();
    return;
  }
  state.quizState.q++;
  state.quizState.selected = null;
  state.quizState.answered = false;
  notify();
}

export function generateAndStartQuiz() {
  const docSelect = document.getElementById('quiz-doc-select');
  const docId = docSelect ? docSelect.value : state.selectedDocId;
  
  if (!docId) {
    alert("Please upload and select a document in the Documents tab first.");
    return;
  }
  
  const countSelect = document.getElementById('quiz-question-count');
  const numQuestions = countSelect ? parseInt(countSelect.value) : 5;
  
  const diffSelect = document.getElementById('quiz-difficulty');
  const difficulty = diffSelect ? diffSelect.value : 'Medium';
  
  const types = [];
  if (document.getElementById('quiz-type-mcq')?.checked) types.push('MCQ');
  if (document.getElementById('quiz-type-tf')?.checked) types.push('True/False');
  
  if (types.length === 0) {
    alert("Please select at least one question type.");
    return;
  }
  
  generateQuizFromServer(numQuestions, difficulty, types);
}

// Bind methods globally
window.startQuiz = startQuiz;
window.resetQuiz = resetQuiz;
window.selectOpt = selectOpt;
window.nextQ = nextQ;
window.selectDoc = selectDoc;
window.generateAndStartQuiz = generateAndStartQuiz;

export function renderQuizzes() {
  const { quizState, QUIZ_DATA } = state;

  if (state.isGeneratingQuiz) {
    return `
      <div class="page active" style="padding: 24px">
        <div style="max-width: 600px; margin: 80px auto; text-align: center">
          <div style="font-size: 54px; margin-bottom: 20px" class="typing-dot">⚡</div>
          <h2 style="font-weight: 800; margin-bottom: 12px; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">Generating AI Quiz...</h2>
          <p style="color: var(--text2)">Gemini is analyzing your document context and generating quiz questions. This will take a few seconds.</p>
        </div>
      </div>
    `;
  }

  if (quizState.finished) {
    const pct = Math.round((quizState.score / QUIZ_DATA.length) * 100);
    return `
      <div class="page active" style="padding: 24px">
        <div style="max-width: 600px; margin: 0 auto; text-align: center">
          <div style="font-size: 64px; margin-bottom: 16px">${pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚'}</div>
          <h1 style="font-size: 28px; font-weight: 800; margin-bottom: 8px">Quiz Complete!</h1>
          <p style="color: var(--text2); margin-bottom: 28px">Here are your results</p>
          <div class="glass-card" style="margin-bottom: 20px">
            <div style="display: flex; justify-content: space-around; margin-bottom: 20px">
              <div style="text-align: center">
                <div style="font-size: 36px; font-weight: 800; color: ${pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--amber)' : 'var(--red)'}">${pct}%</div>
                <div style="font-size: 12px; color: var(--text3)">Score</div>
              </div>
              <div style="text-align: center">
                <div style="font-size: 36px; font-weight: 800; color: var(--green)">${quizState.score}</div>
                <div style="font-size: 12px; color: var(--text3)">Correct</div>
              </div>
              <div style="text-align: center">
                <div style="font-size: 36px; font-weight: 800; color: var(--red)">${QUIZ_DATA.length - quizState.score}</div>
                <div style="font-size: 12px; color: var(--text3)">Wrong</div>
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${pct}%; background: linear-gradient(90deg, var(--green), var(--cyan))"></div>
            </div>
          </div>
          <div class="glass-card" style="text-align: left; margin-bottom: 20px">
            <div class="sec-title" style="margin-bottom: 14px">📖 Review</div>
            ${QUIZ_DATA.map((q, i) => `
              <div style="margin-bottom: 14px; padding: 12px; background: var(--bg2); border-radius: 10px">
                <div style="font-size: 13px; font-weight: 600; margin-bottom: 6px">${i + 1}. ${q.q}</div>
                <div style="font-size: 12px; color: var(--green); margin-bottom: 4px">✓ ${q.opts[q.correct]}</div>
                <div style="font-size: 12px; color: var(--text2)">${q.exp}</div>
              </div>
            `).join('')}
          </div>
          <div style="display: flex; gap: 10px; justify-content: center">
            <button class="btn btn-primary" onclick="resetQuiz()">🔄 Retake Quiz</button>
            <button class="btn btn-outline" onclick="navigate('quizzes')">📝 New Quiz</button>
          </div>
        </div>
      </div>
    `;
  }
  
  if (!quizState.started) {
    return `
      <div class="page active" style="padding: 24px">
        <div class="page-header">
          <h1>📝 Quiz Generator</h1>
          <p>Configure and generate AI-powered quizzes from your documents</p>
        </div>
        <div class="grid-2">
          <div class="glass-card">
            <div class="sec-title" style="margin-bottom: 16px">⚙️ Quiz Configuration</div>
            <div class="form-row">
              <label>Select Document</label>
              <select id="quiz-doc-select" onchange="selectDoc(this.value)">
                ${state.DOCS.filter(d => d.status === 'ready').map(d => `<option value="${d.id}" ${state.selectedDocId === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
              </select>
              ${state.DOCS.filter(d => d.status === 'ready').length === 0 ? `
                <div style="color: var(--red); font-size: 11px; margin-top: 4px">⚠️ No ready documents found. Please upload a PDF first.</div>
              ` : ''}
            </div>
            <div class="form-row">
              <label>Number of Questions</label>
              <select id="quiz-question-count">
                <option value="3">3 Questions</option>
                <option value="5" selected>5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
              </select>
            </div>
            <div class="form-row">
              <label>Difficulty Level</label>
              <select id="quiz-difficulty">
                <option value="Easy">Easy</option>
                <option value="Medium" selected>Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div class="form-row">
              <label>Question Types</label>
              <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 4px">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 400; margin-bottom: 0; color: var(--text2)">
                  <input type="checkbox" id="quiz-type-mcq" checked style="width: auto"> MCQ (Multiple Choice)
                </label>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 400; margin-bottom: 0; color: var(--text2)">
                  <input type="checkbox" id="quiz-type-tf" checked style="width: auto"> True / False
                </label>
              </div>
            </div>
            <button class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 8px" onclick="generateAndStartQuiz()">⚡ Generate & Start Quiz</button>
          </div>
          
          <div>
            <div class="glass-card" style="margin-bottom: 14px">
              <div class="sec-title" style="margin-bottom: 12px">📊 Your Quiz Stats</div>
              ${[
                { l: 'Total Quizzes', v: '28', c: 'purple' },
                { l: 'Best Score', v: '96%', c: 'green' },
                { l: 'Avg Score', v: '84%', c: 'cyan' },
                { l: 'Streak', v: '3 days', c: 'amber' }
              ].map(s => `
                <div class="analytic-row">
                  <div class="analytic-label">${s.l}</div>
                  <div style="flex: 1"></div>
                  <div class="badge-pill badge-${s.c}">${s.v}</div>
                </div>
              `).join('')}
            </div>
            <div class="glass-card">
              <div class="sec-title" style="margin-bottom: 10px">🕒 Recent Quizzes</div>
              ${[
                { name: 'Cell Biology', score: 88, date: 'Today' },
                { name: 'Organic Chem', score: 76, date: 'Yesterday' },
                { name: 'Thermodynamics', score: 92, date: 'Jun 12' }
              ].map(q => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border)">
                  <div>
                    <div style="font-size: 13px; font-weight: 500">${q.name}</div>
                    <div style="font-size: 11px; color: var(--text3)">${q.date}</div>
                  </div>
                  <span class="badge-pill ${q.score >= 80 ? 'badge-green' : 'badge-amber'}">${q.score}%</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const qIndex = quizState.q;
  const q = QUIZ_DATA[qIndex];
  const pct = (qIndex / QUIZ_DATA.length) * 100;

  return `
    <div class="page active" style="padding: 24px">
      <div style="max-width: 640px; margin: 0 auto">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px">
          <span style="font-size: 13px; color: var(--text2)">Question ${qIndex + 1} of ${QUIZ_DATA.length}</span>
          <span class="badge-pill badge-cyan">⏱ Active</span>
        </div>
        <div class="progress-bar" style="margin-bottom: 24px; height: 4px">
          <div class="progress-fill" style="width: ${pct}%; background: linear-gradient(90deg, var(--accent), var(--cyan))"></div>
        </div>
        <div class="glass-card" style="margin-bottom: 20px">
          <div style="font-size: 17px; font-weight: 700; line-height: 1.4">${q.q}</div>
        </div>
        ${q.opts.map((opt, i) => `
          <div class="quiz-opt ${
            quizState.answered && i === q.correct ? 'correct' : 
            quizState.answered && i === quizState.selected && i !== q.correct ? 'wrong' : 
            quizState.selected === i && !quizState.answered ? 'selected' : ''
          }" onclick="selectOpt(${i})">
            <div class="opt-letter">${'ABCD'[i]}</div>
            <span>${opt}</span>
          </div>
        `).join('')}
        
        ${quizState.answered ? `
          <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 10px; padding: 14px; margin-top: 12px; font-size: 13px; color: var(--text2)">
            💡 <strong>Explanation:</strong> ${q.exp}
          </div>` : ''
        }
        
        <div style="display: flex; justify-content: space-between; margin-top: 20px">
          <button class="btn btn-outline" ${qIndex === 0 ? 'disabled' : ''} onclick="if(${qIndex} > 0) { state.quizState.q--; state.quizState.selected=null; state.quizState.answered=false; notify(); }">← Previous</button>
          ${quizState.answered ? `
            <button class="btn btn-primary" onclick="nextQ()">${qIndex === QUIZ_DATA.length - 1 ? 'Finish Quiz 🎉' : 'Next →'}</button>
          ` : `
            <button class="btn btn-outline" onclick="selectOpt(-1)">Skip</button>
          `}
        </div>
      </div>
    </div>
  `;
}

