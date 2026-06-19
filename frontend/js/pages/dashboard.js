import { state, selectDoc, navigate } from '../state.js';

export function renderDashboard() {
  const analytics = state.user?.analytics || {
    questionsAsked: 847,
    quizzesDone: 28,
    avgScore: 84,
    flashcards: 342,
    studyTime: 42,
    summaries: 19,
    streak: 7
  };

  const stats = [
    { label: 'Documents', val: state.DOCS.length.toString(), color: 'purple', sub: 'Up-to-date', ico: '📁' },
    { label: 'Questions Asked', val: (analytics.questionsAsked ?? 847).toString(), color: 'cyan', sub: '34 today', ico: '💬' },
    { label: 'Quizzes Done', val: (analytics.quizzesDone ?? 28).toString(), color: 'green', sub: '3 this week', ico: '📝' },
    { label: 'Avg Score', val: `${Math.round(analytics.avgScore ?? 84)}%`, color: 'amber', sub: '6% this month', ico: '🎯' },
    { label: 'Flashcards', val: (analytics.flashcards ?? 342).toString(), color: 'pink', sub: '48 today', ico: '🃏' },
    { label: 'Study Time', val: `${analytics.studyTime ?? 42}h`, color: 'purple', sub: 'This month', ico: '⏱' },
    { label: 'Summaries', val: (analytics.summaries ?? 19).toString(), color: 'cyan', sub: 'Generated', ico: '📄' },
    { label: 'Streak', val: (analytics.streak ?? 7).toString(), color: 'amber', sub: 'Days active', ico: '🔥' }
  ];

  const activities = [
    { text: 'Completed "Cell Biology" quiz', sub: 'Score: 88% • 2h ago', col: 'green', ico: '📝' },
    { text: 'Chatted with "Organic Chem PDF"', sub: '18 questions • 4h ago', col: 'cyan', ico: '💬' },
    { text: 'Studied 32 flashcards', sub: 'Known: 24 • Unknown: 8 • 6h ago', col: 'purple', ico: '🃏' },
    { text: 'Uploaded new document', sub: 'Thermodynamics Ch.5 • Yesterday', col: 'amber', ico: '📤' }
  ];

  const chartData = [
    { d: 'Mon', v: 65 },
    { d: 'Tue', v: 72 },
    { d: 'Wed', v: 68 },
    { d: 'Thu', v: 80 },
    { d: 'Fri', v: 88 },
    { d: 'Sat', v: 75 },
    { d: 'Sun', v: 91 }
  ];

  // Bind globally just in case
  window.selectDoc = selectDoc;
  window.navigate = navigate;

  return `
    <div class="page active" style="padding: 24px">
      <div class="page-header animate-fade-in">
        <h1 style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">Good evening, ${state.user?.name || 'Palle Jashwanth'}</h1>
        <p style="color: var(--text2); margin-top: 4px">Here's your study overview. Keep up the great work!</p>
      </div>
      
      <div class="grid-4" style="margin-bottom: 24px">
        ${stats.map((s, idx) => `
          <div class="premium-stat-card ${s.color} animate-fade-in delay-${idx + 1}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px">
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text3)">${s.label}</span>
              <div class="stat-icon-wrap">${s.ico}</div>
            </div>
            <div class="stat-val">${s.val}</div>
            <div class="stat-sub" style="color: ${s.color === 'red' ? 'var(--red)' : 'var(--green)'}">${s.sub}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="grid-2" style="margin-bottom: 24px">
        <div>
          <div class="sec-header animate-fade-in delay-4">
            <div class="sec-title">Weekly Progress</div>
            <span class="sec-action" onclick="navigate('analytics')">View all</span>
          </div>
          <div class="glass-card animate-fade-in delay-5" style="border-radius: 16px; background: linear-gradient(180deg, var(--card), rgba(8, 12, 20, 0.4))">
            <div style="margin-bottom: 16px; font-size: 12px; color: var(--text3)">Quiz scores this week</div>
            <div class="chart-bar">
              ${chartData.map(b => `
                <div class="bar-col">
                  <div class="bar bar-fill-animate" style="--height: ${b.v}%; background: linear-gradient(180deg, var(--accent), rgba(99, 102, 241, 0.3))"></div>
                  <div class="bar-label">${b.d}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div>
          <div class="sec-header animate-fade-in delay-4">
            <div class="sec-title">Recent Activity</div>
            <span class="sec-action">View all</span>
          </div>
          <div class="glass-card animate-fade-in delay-6" style="padding: 0; overflow: hidden; border-radius: 16px;">
            ${activities.map(a => `
              <div class="activity-item" style="display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-bottom: 1px solid var(--border); background: transparent">
                <div class="activity-icon-wrap" style="width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;">
                  ${a.ico}
                </div>
                <div style="flex: 1; min-width: 0">
                  <div style="font-size: 13px; font-weight: 600; color: var(--text1);">${a.text}</div>
                  <div style="font-size: 11px; color: var(--text3); margin-top: 2px">${a.sub}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div class="sec-header animate-fade-in delay-6">
        <div class="sec-title">Your Documents</div>
        <button class="btn btn-outline btn-sm" onclick="navigate('documents')">View All</button>
      </div>
      
      <div class="grid-3">
        ${state.DOCS.length === 0 ? `
          <div class="premium-doc-card animate-fade-in delay-7" style="grid-column: span 3; text-align: center; padding: 40px; color: var(--text3); font-size: 13px;">
            No documents uploaded yet. Go to the Documents tab to upload files.
          </div>
        ` : state.DOCS.slice(0, 3).map((d, idx) => `
          <div class="premium-doc-card animate-fade-in delay-${7 + idx}" style="cursor: pointer" onclick="selectDoc('${d.id}'); navigate('chat');">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px">
              <div style="flex: 1; min-width: 0">
                <div style="font-size: 13.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text1)" title="${d.name}">${d.name}</div>
                <div style="font-size: 11px; color: var(--text3); margin-top: 2px">${d.pages} pages • ${d.date}</div>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px">
              <span class="badge-pill ${d.status === 'ready' ? 'badge-green' : 'badge-amber'}">${d.status === 'ready' ? 'Ready' : 'Processing'}</span>
              <span style="font-size: 11px; color: var(--accent3); font-weight: 500">Study now →</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

