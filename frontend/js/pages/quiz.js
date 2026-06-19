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
        <div style="max-width: 600px; margin: 80px auto;">
          <div class="scanner-container">
            <div class="scanner-bar"></div>
            <div style="font-size: 54px; margin-bottom: 20px; filter: drop-shadow(0 0 10px var(--accent));">📝</div>
            <h2 style="font-weight: 800; margin-bottom: 12px; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">Generating AI Quiz...</h2>
            <p style="color: var(--text2); text-align: center; font-size: 13.5px; max-width: 400px; line-height: 1.6;">Gemini is parsing your active document contents to formulate predicted exam questions. This will take a few seconds.</p>
          </div>
        </div>
      </div>
    `;
  }

  if (quizState.finished) {
    const pct = Math.round((quizState.score / QUIZ_DATA.length) * 100);
    return `
      <div class="page active" style="padding: 24px">
        <div style="max-width: 640px; margin: 0 auto; text-align: center">
          <div style="font-size: 64px; margin-bottom: 16px" class="animate-fade-in">${pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚'}</div>
          <h1 style="font-size: 28px; font-weight: 800; margin-bottom: 8px; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent" class="animate-fade-in delay-1">Quiz Complete!</h1>
          <p style="color: var(--text2); margin-bottom: 28px" class="animate-fade-in delay-2">Here are your study results</p>
          
          <div class="glass-card animate-fade-in delay-3" style="margin-bottom: 24px; padding: 24px;">
            <div style="display: flex; justify-content: space-around; margin-bottom: 24px">
              <div style="text-align: center">
                <div style="font-size: 38px; font-weight: 800; font-family: var(--font-heading); color: ${pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--amber)' : 'var(--red)'}">${pct}%</div>
                <div style="font-size: 12px; color: var(--text3); font-weight: 600; text-transform: uppercase; margin-top: 4px">Score</div>
              </div>
              <div style="text-align: center">
                <div style="font-size: 38px; font-weight: 800; font-family: var(--font-heading); color: var(--green)">${quizState.score}</div>
                <div style="font-size: 12px; color: var(--text3); font-weight: 600; text-transform: uppercase; margin-top: 4px">Correct</div>
              </div>
              <div style="text-align: center">
                <div style="font-size: 38px; font-weight: 800; font-family: var(--font-heading); color: var(--red)">${QUIZ_DATA.length - quizState.score}</div>
                <div style="font-size: 12px; color: var(--text3); font-weight: 600; text-transform: uppercase; margin-top: 4px">Incorrect</div>
              </div>
            </div>
            <div class="progress-bar" style="height: 8px; border-radius: 4px;">
              <div class="progress-fill" style="width: ${pct}%; background: linear-gradient(90deg, var(--accent), var(--cyan))"></div>
            </div>
          </div>
          
          <div class="glass-card animate-fade-in delay-4" style="text-align: left; margin-bottom: 24px">
            <div class="sec-title" style="margin-bottom: 16px">📖 Question Review</div>
            <div style="display: flex; flex-direction: column; gap: 12px">
              ${QUIZ_DATA.map((q, i) => `
                <div style="margin-bottom: 4px; padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px">
                  <div style="font-size: 14px; font-weight: 700; margin-bottom: 8px; color: var(--text1);">${i + 1}. ${q.q}</div>
                  <div style="font-size: 13px; color: var(--green); margin-bottom: 6px; font-weight: 600;">✓ ${q.opts[q.correct]}</div>
                  <div style="font-size: 12.5px; color: var(--text2); line-height: 1.5; padding: 10px; background: rgba(99, 102, 241, 0.05); border-radius: 8px; border: 1.5px dashed rgba(99, 102, 241, 0.15)">💡 <strong>Explanation:</strong> ${q.exp}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div style="display: flex; gap: 12px; justify-content: center" class="animate-fade-in delay-5">
            <button class="btn btn-primary" onclick="resetQuiz()" style="font-weight:700;">🔄 Retake Quiz</button>
            <button class="btn btn-outline" onclick="navigate('quizzes')">📝 Configure New</button>
          </div>
        </div>
      </div>
    `;
  }
  
  if (!quizState.started) {
    return `
      <div class="page active" style="padding: 24px">
        <div class="page-header animate-fade-in">
          <h1 style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">📝 Quiz Generator</h1>
          <p style="color: var(--text2)">Configure and generate AI-powered quizzes from your study documents</p>
        </div>
        <div class="grid-2">
          <div class="glass-card animate-fade-in delay-1">
            <div class="sec-title" style="margin-bottom: 20px">⚙️ Quiz Configuration</div>
            <div class="form-row">
              <label>Select Study Material</label>
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
              <label>Difficulty level</label>
              <select id="quiz-difficulty">
                <option value="Easy">Easy</option>
                <option value="Medium" selected>Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div class="form-row">
              <label>Question types</label>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 500; margin-bottom: 0; color: var(--text2)">
                  <input type="checkbox" id="quiz-type-mcq" checked style="width: auto"> Multiple Choice (MCQ)
                </label>
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 500; margin-bottom: 0; color: var(--text2)">
                  <input type="checkbox" id="quiz-type-tf" checked style="width: auto"> True / False
                </label>
              </div>
            </div>
            <button class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 14px; padding: 12px; font-weight: 700;" onclick="generateAndStartQuiz()">⚡ Generate & Start Quiz</button>
          </div>
          
          <div>
            <div class="glass-card animate-fade-in delay-2" style="margin-bottom: 16px">
              <div class="sec-title" style="margin-bottom: 16px">📊 Quiz Statistics</div>
              ${[
                { l: 'Total Quizzes Taken', v: '28', c: 'purple' },
                { l: 'Best Accuracy', v: '96%', c: 'green' },
                { l: 'Average Score', v: '84%', c: 'cyan' },
                { l: 'Study Streak', v: '3 days', c: 'amber' }
              ].map(s => `
                <div class="analytic-row" style="padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,0.03)">
                  <div class="analytic-label">${s.l}</div>
                  <div style="flex: 1"></div>
                  <div class="badge-pill badge-${s.c}">${s.v}</div>
                </div>
              `).join('')}
            </div>
            <div class="glass-card animate-fade-in delay-3">
              <div class="sec-title" style="margin-bottom: 14px">🕒 Recent Performances</div>
              ${[
                { name: 'Cell Biology', score: 88, date: 'Today' },
                { name: 'Organic Chemistry', score: 76, date: 'Yesterday' },
                { name: 'Thermodynamics', score: 92, date: 'Jun 12' }
              ].map(q => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border)">
                  <div>
                    <div style="font-size: 13.5px; font-weight: 600; color: var(--text1);">${q.name}</div>
                    <div style="font-size: 11px; color: var(--text3); margin-top: 2px;">${q.date}</div>
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
      <div style="max-width: 660px; margin: 0 auto">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px" class="animate-fade-in">
          <span style="font-size: 13px; color: var(--text2); font-weight: 600;">Question ${qIndex + 1} of ${QUIZ_DATA.length}</span>
          <span class="badge-pill badge-cyan" style="animation: pulseGlow 1.5s infinite">⏱ Active</span>
        </div>
        <div class="progress-bar animate-fade-in delay-1" style="margin-bottom: 24px; height: 6px; border-radius: 3px;">
          <div class="progress-fill" style="width: ${pct}%; background: linear-gradient(90deg, var(--accent), var(--cyan))"></div>
        </div>
        <div class="glass-card animate-fade-in delay-2" style="margin-bottom: 20px; padding: 24px">
          <div style="font-size: 18px; font-weight: 700; line-height: 1.5; font-family: var(--font-heading); color: var(--text1);">${q.q}</div>
        </div>
        
        <div style="display: flex; flex-direction: column;" class="animate-fade-in delay-3">
          ${q.opts.map((opt, i) => `
            <div class="quiz-opt ${
              quizState.answered && i === q.correct ? 'correct' : 
              quizState.answered && i === quizState.selected && i !== q.correct ? 'wrong' : 
              quizState.selected === i && !quizState.answered ? 'selected' : ''
            }" onclick="selectOpt(${i})">
              <div class="opt-letter">${'ABCD'[i]}</div>
              <span style="color: var(--text1);">${opt}</span>
            </div>
          `).join('')}
        </div>
        
        ${quizState.answered ? `
          <div class="glass-card animate-fade-in" style="background: rgba(99, 102, 241, 0.05); border: 1.5px dashed rgba(99, 102, 241, 0.2); border-radius: 12px; padding: 16px; margin-top: 16px; font-size: 13px; color: var(--text2); line-height: 1.6;">
            💡 <strong>Explanation:</strong> ${q.exp}
          </div>` : ''
        }
        
        <div style="display: flex; justify-content: space-between; margin-top: 24px" class="animate-fade-in delay-4">
          <button class="btn btn-outline" ${qIndex === 0 ? 'disabled' : ''} onclick="if(${qIndex} > 0) { state.quizState.q--; state.quizState.selected=null; state.quizState.answered=false; notify(); }">← Previous</button>
          ${quizState.answered ? `
            <button class="btn btn-primary" onclick="nextQ()" style="padding: 8px 20px; font-weight: 700;">${qIndex === QUIZ_DATA.length - 1 ? 'Finish Quiz 🎉' : 'Next Question →'}</button>
          ` : `
            <button class="btn btn-outline" onclick="selectOpt(-1)">Skip Question</button>
          `}
        </div>
      </div>
    </div>
  `;
}

