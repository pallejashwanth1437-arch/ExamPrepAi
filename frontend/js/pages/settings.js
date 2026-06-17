export function renderSettings() {
  const sections = [
    {
      title: '🎨 Appearance',
      items: [
        { label: 'Dark Mode', sub: 'Use dark theme (recommended)', on: true },
        { label: 'Compact Mode', sub: 'Reduce spacing for more content', on: false },
        { label: 'Animations', sub: 'Enable smooth UI animations', on: true }
      ]
    },
    {
      title: '🔔 Notifications',
      items: [
        { label: 'Study Reminders', sub: 'Daily study reminder at 8:00 PM', on: true },
        { label: 'Quiz Results', sub: 'Notify when quiz results are ready', on: true },
        { label: 'Weekly Report', sub: 'Send weekly progress email', on: false }
      ]
    },
    {
      title: '🤖 AI Preferences',
      items: [
        { label: 'Streaming Responses', sub: 'Show AI responses as they generate', on: true },
        { label: 'Auto-Suggestions', sub: 'Show suggested questions in chat', on: true },
        { label: 'Citation Links', sub: 'Show source page numbers in answers', on: true }
      ]
    }
  ];

  return `
    <div class="page active" style="padding: 24px">
      <div style="max-width: 600px; margin: 0 auto">
        <div class="page-header">
          <h1>⚙️ Settings</h1>
          <p>Manage your account preferences and application settings</p>
        </div>
        
        ${sections.map(section => `
          <div class="glass-card" style="margin-bottom: 16px">
            <div class="sec-title" style="margin-bottom: 14px">${section.title}</div>
            ${section.items.map(item => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border)">
                <div>
                  <div style="font-size: 13px; font-weight: 600">${item.label}</div>
                  <div style="font-size: 12px; color: var(--text3)">${item.sub}</div>
                </div>
                <button class="toggle${item.on ? ' on' : ''}" onclick="this.classList.toggle('on')"></button>
              </div>
            `).join('')}
          </div>
        `).join('')}
        
        <div class="glass-card" style="margin-bottom: 16px">
          <div class="sec-title" style="margin-bottom: 14px">💾 Data Management</div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap">
            <button class="btn btn-outline" onclick="alert('Export request submitted!')">📤 Export All Data</button>
            <button class="btn btn-outline" onclick="alert('Downloading reports...')">📊 Download Report</button>
            <button class="btn btn-danger" onclick="confirm('Are you sure you want to delete your account?')">🗑 Delete Account</button>
          </div>
        </div>
        
        <div class="glass-card">
          <div class="sec-title" style="margin-bottom: 4px">💎 Subscription</div>
          <div style="font-size: 12px; color: var(--text3); margin-bottom: 14px">You're on the Pro Plan</div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px">
            <span class="badge-pill badge-purple">⭐ Pro • ₹999/month</span>
            <span style="font-size: 12px; color: var(--green)">Active until Jul 17, 2026</span>
          </div>
          <div style="display: flex; gap: 8px">
            <button class="btn btn-outline btn-sm">Manage Billing</button>
            <button class="btn btn-danger btn-sm">Cancel Plan</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
