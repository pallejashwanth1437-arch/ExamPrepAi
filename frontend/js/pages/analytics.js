export function renderAnalytics() {
  const stats = [
    { l: 'Avg Accuracy', v: '84%', c: 'green', i: '🎯' },
    { l: 'Study Time', v: '42h', c: 'purple', i: '⏱' },
    { l: 'Topics Mastered', v: '18', c: 'cyan', i: '🏆' },
    { l: 'Learning Score', v: '92', c: 'amber', i: '⚡' }
  ];

  const subjects = [
    { s: 'Organic Chemistry', v: 84, c: 'var(--accent)' },
    { s: 'Cell Biology', v: 91, c: 'var(--green)' },
    { s: 'Thermodynamics', v: 67, c: 'var(--amber)' },
    { s: 'Mathematics', v: 78, c: 'var(--cyan)' },
    { s: 'Physics', v: 88, c: 'var(--pink)' }
  ];

  const chartData = [
    { d: 'Mon', v: 1.5 },
    { d: 'Tue', v: 3 },
    { d: 'Wed', v: 2.5 },
    { d: 'Thu', v: 4 },
    { d: 'Fri', v: 3.5 },
    { d: 'Sat', v: 5 },
    { d: 'Sun', v: 2 }
  ];

  return `
    <div class="page active" style="padding: 24px">
      <div class="page-header animate-fade-in">
        <h1 style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">📊 Performance Analytics</h1>
        <p style="color: var(--text2)">Track your learning progress, statistics, and identify areas for revision</p>
      </div>
      
      <div class="grid-4" style="margin-bottom: 24px">
        ${stats.map((s, idx) => `
          <div class="stat-card ${s.c} animate-fade-in delay-${idx + 1}">
            <div class="stat-label">${s.i} ${s.l}</div>
            <div class="stat-val">${s.v}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="grid-2" style="margin-bottom: 20px">
        <div class="glass-card animate-fade-in delay-4">
          <div class="sec-title" style="margin-bottom: 20px">📈 Subject Mastery</div>
          <div style="display: flex; flex-direction: column; gap: 14px">
            ${subjects.map(s => `
              <div class="analytic-row">
                <div class="analytic-label">${s.s}</div>
                <div class="analytic-bar-wrap">
                  <div class="analytic-bar-fill bar-width-animate" style="--width: ${s.v}%; background: ${s.c}"></div>
                </div>
                <div class="analytic-val">${s.v}%</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="glass-card animate-fade-in delay-5">
          <div class="sec-title" style="margin-bottom: 16px">📆 Weekly Study Time (hrs)</div>
          <div class="chart-bar" style="height: 140px">
            ${chartData.map(b => `
              <div class="bar-col">
                <div style="font-size: 10px; color: var(--text3); margin-bottom: 3px">${b.v}h</div>
                <div class="bar bar-fill-animate" style="--height: ${(b.v / 5) * 100}%; background: linear-gradient(180deg, var(--cyan), rgba(6, 182, 212, 0.4))"></div>
                <div class="bar-label">${b.d}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div class="grid-2 animate-fade-in delay-6">
        <div class="glass-card">
          <div class="sec-title" style="margin-bottom: 16px">💪 Strong Concepts</div>
          ${['Cell Division', "Newton's Laws", 'Ionic Bonding', 'Photosynthesis'].map(t => `
            <div style="display: flex; align-items: center; gap: 8px; padding: 12px 0; border-bottom: 1px solid var(--border)">
              <span style="font-size: 15px;">✅</span>
              <span style="font-size: 13.5px; font-weight: 550; color: var(--text1);">${t}</span>
              <span class="badge-pill badge-green" style="margin-left: auto">Mastered</span>
            </div>
          `).join('')}
        </div>
        
        <div class="glass-card">
          <div class="sec-title" style="margin-bottom: 16px">🎯 Concepts to Review</div>
          ${['Electrochemistry', 'Thermodynamics 2nd Law', 'Stereochemistry', 'Reaction Kinetics'].map(t => `
            <div style="display: flex; align-items: center; gap: 8px; padding: 12px 0; border-bottom: 1px solid var(--border)">
              <span style="font-size: 15px;">⚠️</span>
              <span style="font-size: 13.5px; font-weight: 550; color: var(--text1);">${t}</span>
              <span class="badge-pill badge-amber" style="margin-left: auto">Needs Review</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
