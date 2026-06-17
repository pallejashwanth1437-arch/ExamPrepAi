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
      <div class="page-header">
        <h1>📊 Analytics</h1>
        <p>Track your learning progress and identify areas for improvement</p>
      </div>
      
      <div class="grid-4" style="margin-bottom: 24px">
        ${stats.map(s => `
          <div class="stat-card ${s.c}">
            <div class="stat-label">${s.i} ${s.l}</div>
            <div class="stat-val">${s.v}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="grid-2" style="margin-bottom: 20px">
        <div class="glass-card">
          <div class="sec-title" style="margin-bottom: 16px">📈 Subject Performance</div>
          ${subjects.map(s => `
            <div class="analytic-row">
              <div class="analytic-label">${s.s}</div>
              <div class="analytic-bar-wrap">
                <div class="analytic-bar-fill" style="width: ${s.v}%; background: ${s.c}"></div>
              </div>
              <div class="analytic-val">${s.v}%</div>
            </div>
          `).join('')}
        </div>
        
        <div class="glass-card">
          <div class="sec-title" style="margin-bottom: 16px">📆 Weekly Study Time (hrs)</div>
          <div class="chart-bar" style="height: 140px">
            ${chartData.map(b => `
              <div class="bar-col">
                <div style="font-size: 10px; color: var(--text3); margin-bottom: 3px">${b.v}h</div>
                <div class="bar" style="height: ${(b.v / 5) * 100}%; background: linear-gradient(180deg, var(--cyan), rgba(6, 182, 212, 0.4))"></div>
                <div class="bar-label">${b.d}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div class="grid-2">
        <div class="glass-card">
          <div class="sec-title" style="margin-bottom: 14px">💪 Strong Topics</div>
          ${['Cell Division', "Newton's Laws", 'Ionic Bonding', 'Photosynthesis'].map(t => `
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid var(--border)">
              <span>✅</span>
              <span style="font-size: 13px">${t}</span>
              <span class="badge-pill badge-green" style="margin-left: auto">Strong</span>
            </div>
          `).join('')}
        </div>
        
        <div class="glass-card">
          <div class="sec-title" style="margin-bottom: 14px">🎯 Needs Attention</div>
          ${['Electrochemistry', 'Thermodynamics 2nd Law', 'Stereochemistry', 'Reaction Kinetics'].map(t => `
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid var(--border)">
              <span>⚠️</span>
              <span style="font-size: 13px">${t}</span>
              <span class="badge-pill badge-amber" style="margin-left: auto">Review</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
