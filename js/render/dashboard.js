import { Store } from '../store.js';
import { sessionsForWeek } from '../data/sessions.js';
import { blockForWeek } from '../data/programme.js';

let _openSession = null;

export function initDashboard(openSessionFn) {
  _openSession = openSessionFn;
}

export function setDate() {
  const d = new Date();
  document.getElementById('todayDate').textContent =
    d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}

export function renderDashboardHero() {
  if (!Store.state) return;
  document.getElementById('blockNum').innerHTML = `<em>${String(blockForWeek(Store.state.current_week)).padStart(2,'0')}</em>`;
  document.getElementById('weekNum').textContent = String(Store.state.current_week).padStart(2,'0');
}

export function renderWeekGrid() {
  const grid = document.getElementById('weekGrid');
  const week = Store.state?.current_week || 1;
  const dow = new Date().getDay();
  const todayMap = { 1: 'push-1', 2: 'pull-1', 4: 'legs-1', 6: 'upper-1' };
  const todayId = todayMap[dow];

  grid.innerHTML = sessionsForWeek(week).map(s => {
    const key = `${week}-${s.id}`;
    const done = Store.state?.log?.some(l => l.sessionKey === key);
    const isToday = s.id === todayId && !done;
    const cls = done ? 'done' : (isToday ? 'today' : '');
    const badge = done ? '<span class="badge">Done</span>'
                       : isToday ? '<span class="badge badge-torch">Today</span>'
                       : (s.id === 'upper-1' ? '<span class="badge">Optional</span>'
                                              : '<span class="badge">Upcoming</span>');
    return `
      <button class="session-card ${cls}" data-session="${s.id}">
        <div class="sc-top"><div class="sc-day">${s.day}</div>${badge}</div>
        <div class="sc-title">${s.title}</div>
        <div class="sc-focus">${s.focus}</div>
        <div class="sc-stats">
          <div class="sc-stat"><div class="v tabular">${s.exercises.length}</div><div class="k">Lifts</div></div>
          <div class="sc-stat"><div class="v tabular">${s.exercises.reduce((a,e)=>a+e.sets,0)}</div><div class="k">Sets</div></div>
          <div class="sc-stat"><div class="v">${s.rpe}</div><div class="k">RPE</div></div>
        </div>
      </button>
    `;
  }).join('');
  grid.querySelectorAll('.session-card').forEach(btn => {
    btn.addEventListener('click', () => _openSession(btn.dataset.session));
  });
}
