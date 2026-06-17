import { state } from '../state.js';

export function renderProfile() {
  const meta = [
    { icon: '🎓', label: state.user?.college || 'BITS Pilani', sub: 'College' },
    { icon: '📚', label: state.user?.course || 'B.Tech CSE', sub: 'Course' },
    { icon: '📅', label: 'Batch 2022', sub: 'Year' }
  ];

  const analytics = state.user?.analytics || {
    questionsAsked: 0,
    quizzesDone: 0,
    avgScore: 0,
    flashcards: 0,
    studyTime: 0,
    summaries: 0,
    streak: 1
  };

  const achievements = [
    { icon: '⏱️', val: `${analytics.studyTime}h`, label: 'Study Hours' },
    { icon: '📁', val: state.DOCS.length.toString(), label: 'Documents' },
    { icon: '📝', val: analytics.quizzesDone.toString(), label: 'Quizzes Done' },
    { icon: '🃏', val: analytics.flashcards.toString(), label: 'Flashcards' },
    { icon: '🔥', val: `${analytics.streak} days`, label: 'Study Streak' },
    { icon: '🎯', val: `${Math.round(analytics.avgScore)}%`, label: 'Avg Score' }
  ];

  return `
    <div class="page active" style="padding: 24px">
      <div style="max-width: 680px; margin: 0 auto">
        <div style="background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 20px">
          <div class="profile-cover"></div>
          <div style="padding: 48px 24px 24px; position: relative">
            <div class="profile-avatar" style="position: absolute; top: -36px; left: 24px">${state.user?.initials || 'PJ'}</div>
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px">
              <div>
                <div style="font-size: 20px; font-weight: 800">${state.user?.name || 'Palle Jashwanth'}</div>
                <div style="font-size: 13px; color: var(--text2)">${state.user?.email || 'pallejeshwanth1437@gmail.com'}</div>
              </div>
              <div style="display: flex; gap: 8px">
                <span class="badge-pill badge-purple">⭐ Pro Plan</span>
                <button class="btn btn-outline btn-sm">✏️ Edit Profile</button>
              </div>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border-top: 1px solid var(--border)">
            ${meta.map(i => `
              <div style="background: var(--card); padding: 16px; text-align: center">
                <div style="font-size: 18px; margin-bottom: 4px">${i.icon}</div>
                <div style="font-size: 13px; font-weight: 600">${i.label}</div>
                <div style="font-size: 11px; color: var(--text3)">${i.sub}</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="sec-title" style="margin-bottom: 14px">🏆 Achievements</div>
        <div class="grid-3" style="margin-bottom: 20px">
          ${achievements.map(a => `
            <div class="achieve-card">
              <div class="achieve-icon">${a.icon}</div>
              <div class="achieve-val">${a.val}</div>
              <div class="achieve-label">${a.label}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="glass-card">
          <div class="sec-title" style="margin-bottom: 16px">✏️ Profile Information</div>
          <div class="grid-2">
            <div class="form-row"><label>Full Name</label><input type="text" id="profile-name" value="${state.user?.name || 'Palle Jashwanth'}"></div>
            <div class="form-row"><label>Email</label><input type="email" id="profile-email" value="${state.user?.email || 'pallejeshwanth1437@gmail.com'}"></div>
            <div class="form-row"><label>College</label><input type="text" id="profile-college" value="${state.user?.college || 'BITS Pilani'}"></div>
            <div class="form-row"><label>Course</label><input type="text" id="profile-course" value="${state.user?.course || 'B.Tech CSE'}"></div>
          </div>
          <button class="btn btn-primary" onclick="
            updateProfile(
              document.getElementById('profile-name').value,
              document.getElementById('profile-email').value,
              document.getElementById('profile-college').value,
              document.getElementById('profile-course').value
            )
          ">Save Changes</button>
        </div>
      </div>
    </div>
  `;
}
