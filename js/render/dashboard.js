import { Store } from '../store.js';
import { sessionsForWeek } from '../data/sessions.js';
import { blockForWeek } from '../data/programme.js';

let _openSession = null;

export function initDashboard(openSessionFn) {
  _openSession = openSessionFn;

  document.getElementById('advanceWeekBtn').addEventListener('click', () => {
    if (!Store.state || !Store.editable || Store.state.current_week >= 12) return;
    const next = Store.state.current_week + 1;
    const pad = n => String(n).padStart(2, '0');
    Store.update(st => { st.current_week = next; }, `Advance to Week ${pad(next)}`, { flush: true });
  });
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

// Per-session-type completion across weeks 1..current. A required type done
// in fewer than half of those weeks is flagged "behind" — but only from week 3,
// before that there isn't enough signal to call anything a pattern.
export function renderAdherence() {
  const row = document.getElementById('adherenceRow');
  if (!row || !Store.state) return;
  const week = Store.state.current_week || 1;
  const logged = new Set((Store.state.log || []).map(l => l.sessionKey));
  row.innerHTML = sessionsForWeek(week).map(s => {
    let hit = 0;
    for (let w = 1; w <= week; w++) if (logged.has(`${w}-${s.id}`)) hit++;
    const doneNow = logged.has(`${week}-${s.id}`);
    const behind = !s.optional && week >= 3 && hit < week / 2;
    return `<span class="adh-pill${behind ? ' behind' : ''}" title="${s.title}: completed ${hit} of ${week} weeks">
      <span class="adh-dot${doneNow ? ' on' : ''}"></span>
      <span>${s.title}</span>
      <span class="adh-count tabular">${hit}/${week}</span>
      ${behind ? '<span class="adh-flag">Behind</span>' : ''}
    </span>`;
  }).join('');
}

export function renderWeekGrid() {
  const grid = document.getElementById('weekGrid');
  const week = Store.state?.current_week || 1;
  document.getElementById('advanceWeekBtn').style.display = week >= 12 ? 'none' : '';
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
                       : (s.optional ? '<span class="badge">Optional</span>'
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
