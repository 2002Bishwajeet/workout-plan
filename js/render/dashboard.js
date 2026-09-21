import { Store } from '../store.js';
import { sessionsForWeek } from '../data/sessions.js';
import { blockForWeek } from '../data/programme.js';
import { ensureHealthLoaded, healthWorkouts, matchWorkout } from '../health.js';
import { sessionKeyFor } from '../session-logic.js';
import { torStreak, suggestionFor, primaryKeyFor } from '../progression.js';

let _openSession = null;

export function initDashboard(openSessionFn) {
  _openSession = openSessionFn;

  document.getElementById('advanceWeekBtn').addEventListener('click', () => {
    if (!Store.state || !Store.editable || Store.state.current_week >= 12) return;
    const next = Store.state.current_week + 1;
    const pad = n => String(n).padStart(2, '0');
    Store.update(st => { st.current_week = next; }, `Advance to Week ${pad(next)}`, { flush: true });
  });

  const bwBtn = document.getElementById('bwLogBtn');
  const bwInput = document.getElementById('bwInput');
  if (bwBtn && bwInput) {
    bwBtn.addEventListener('click', () => {
      if (!Store.editable) return;
      const v = parseFloat(bwInput.value);
      if (isNaN(v) || v < 30 || v > 250) return;
      Store.update(st => {
        if (!st.bodyweight_log) st.bodyweight_log = [];
        st.bodyweight_log.push({ date: new Date().toISOString(), weight: v });
        if (st.bodyweight_log.length > 200) st.bodyweight_log.splice(0, st.bodyweight_log.length - 200);
      }, `Log bodyweight: ${v} kg`, { flush: true });
      bwInput.value = '';
    });
    bwInput.addEventListener('keydown', e => { if (e.key === 'Enter') bwBtn.click(); });
  }
}

export function renderBodyweight() {
  const log = (Store.state && Store.state.bodyweight_log) || [];
  const meta = document.getElementById('bwMeta');
  const hist = document.getElementById('bwHistory');
  if (!meta || !hist) return;
  if (!log.length) {
    meta.textContent = 'No entries yet';
    hist.innerHTML = '';
    return;
  }
  const recent = log.slice(-7).reverse();
  const latest = recent[0];
  const prev = recent[1];
  const delta = prev ? (latest.weight - prev.weight) : null;
  meta.textContent = `${latest.weight} kg${delta != null ? (delta >= 0 ? ` +${delta.toFixed(1)}` : ` ${delta.toFixed(1)}`) : ''}`;
  const fmt = d => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
  hist.innerHTML = recent.map(e => `
    <div class="bw-row">
      <span class="bw-date label">${fmt(e.date)}</span>
      <span class="bw-val tabular">${e.weight} kg</span>
    </div>`).join('');
}

export function setDate() {
  const d = new Date();
  document.getElementById('todayDate').textContent =
    d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}

function weekStreak(log, currentWeek, cycle) {
  const SESSION_IDS = ['push-1', 'pull-1', 'legs-1', 'upper-1'];
  const logged = new Set(log.map(l => l.sessionKey));
  let streak = 0;
  for (let w = currentWeek; w >= 1; w--) {
    const done = SESSION_IDS.filter(id => logged.has(sessionKeyFor(cycle, w, id))).length;
    if (done >= 3) streak++;
    else break;
  }
  return streak;
}

export function renderDashboardHero() {
  if (!Store.state) return;
  document.getElementById('blockNum').innerHTML = `<em>${String(blockForWeek(Store.state.current_week)).padStart(2,'0')}</em>`;
  document.getElementById('weekNum').textContent = String(Store.state.current_week).padStart(2,'0');
  const streak = weekStreak(Store.state.log || [], Store.state.current_week || 1, Store.state.cycle);
  const streakEl = document.getElementById('weekStreakVal');
  const streakWrap = document.getElementById('weekStreakWrap');
  if (streakEl) streakEl.textContent = String(streak).padStart(2, '0');
  if (streakWrap) streakWrap.hidden = streak < 2;
  renderLastHr();
}

// Avg HR from the watch workout matching the most recent logged session.
// Stays hidden (dashboard pixel-identical to today) unless watch data
// exists and matches — watch data is read-only, never in Store.
function renderLastHr() {
  const label = document.getElementById('lastHrLabel');
  const val = document.getElementById('lastHrVal');
  if (!label || !val) return;
  ensureHealthLoaded(renderLastHr);
  const log = Store.state?.log || [];
  const last = [...log].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const w = last ? matchWorkout(last.date, healthWorkouts() || []) : null;
  const show = w && w.avg_hr != null;
  label.hidden = val.hidden = !show;
  if (show) val.textContent = `${Math.round(w.avg_hr)} BPM`;
}

// Per-session-type completion across weeks 1..current. A required type done
// in fewer than half of those weeks is flagged "behind" — but only from week 3,
// before that there isn't enough signal to call anything a pattern.
export function renderAdherence() {
  const row = document.getElementById('adherenceRow');
  if (!row || !Store.state) return;
  const week = Store.state.current_week || 1;
  const cycle = Store.state.cycle;
  const logged = new Set((Store.state.log || []).map(l => l.sessionKey));
  row.innerHTML = sessionsForWeek(week).map(s => {
    let hit = 0;
    for (let w = 1; w <= week; w++) if (logged.has(sessionKeyFor(cycle, w, s.id))) hit++;
    const doneNow = logged.has(sessionKeyFor(cycle, week, s.id));
    const behind = !s.optional && week >= 3 && hit < week / 2;
    return `<span class="adh-pill${behind ? ' behind' : ''}" title="${s.title}: completed ${hit} of ${week} weeks">
      <span class="adh-dot${doneNow ? ' on' : ''}"></span>
      <span>${s.title}</span>
      <span class="adh-count tabular">${hit}/${week}</span>
      ${behind ? '<span class="adh-flag">Behind</span>' : ''}
    </span>`;
  }).join('');
}

export function renderCoachReminders() {
  const el = document.getElementById('coachReminders');
  if (!el || !Store.state) return;

  const items = [];
  const ww = Store.state.working_weights || {};
  const log = Store.state.log || [];
  const week = Store.state.current_week || 1;
  const allWeights = [
    ...(ww.push || []), ...(ww.pull || []),
    ...(ww.legs || []), ...(ww.acc || []),
  ];

  // Auto-detect primary lifts ready to step (TOR streak met)
  for (const sessionId of ['push-1', 'pull-1', 'legs-1', 'upper-1']) {
    const key = primaryKeyFor(sessionId, week);
    if (!key) continue;
    const w = allWeights.find(x => x.key === key);
    if (!w) continue;
    const streak = torStreak(log, sessionId, key, w.changed_at);
    const sug = suggestionFor(w, streak);
    if (sug) {
      items.push({ type: 'step', name: w.name, key: w.key, from: w.weight, to: sug.target, unit: w.unit === 'BW' ? 'BW' : 'kg' });
    }
  }

  // Static checks: missing expected keys
  const legsKeys = (ww.legs || []).map(x => x.key);
  if (!legsKeys.includes('hack_sq')) {
    items.push({ type: 'missing', label: 'HACK SQUAT missing from Legs weights — add at 145 kg' });
  }

  if (!items.length) { el.innerHTML = ''; return; }

  el.innerHTML = `<div class="coach-reminders">
    <div class="coach-rem-head">
      <span class="coach-rem-title">Action Required</span>
      <button class="coach-rem-goto" data-view="weights">Update Weights</button>
    </div>
    ${items.map(item => item.type === 'step'
      ? `<div class="coach-rem-item coach-rem-step">
           <span class="coach-rem-arrow">↑</span>
           <span class="coach-rem-name">${item.name}</span>
           <span class="coach-rem-change tabular">${item.from} → ${item.to} ${item.unit}</span>
         </div>`
      : `<div class="coach-rem-item coach-rem-warn">
           <span class="coach-rem-arrow">!</span>
           <span class="coach-rem-name">${item.label}</span>
         </div>`
    ).join('')}
  </div>`;

  el.querySelector('.coach-rem-goto')?.addEventListener('click', e => {
    document.querySelector(`.nav button[data-view="${e.currentTarget.dataset.view}"]`)?.click();
  });
}

export function renderWeekGrid() {
  const grid = document.getElementById('weekGrid');
  const week = Store.state?.current_week || 1;
  document.getElementById('advanceWeekBtn').style.display = week >= 12 ? 'none' : '';
  const dow = new Date().getDay();
  const todayMap = { 1: 'push-1', 2: 'pull-1', 4: 'legs-1', 6: 'upper-1' };
  const todayId = todayMap[dow];

  grid.innerHTML = sessionsForWeek(week).map(s => {
    const key = sessionKeyFor(Store.state?.cycle, week, s.id);
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
