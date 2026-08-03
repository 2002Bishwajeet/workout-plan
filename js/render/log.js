import { Store } from '../store.js';
import { ensureHealthLoaded, healthWorkouts, matchWorkout, unmatchedWorkouts } from '../health.js';

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
}

function stat(v, k) {
  if (v === undefined || v === null) return '';
  return `<div class="stat"><div class="v tabular">${Math.round(v)}</div><div class="k">${k}</div></div>`;
}

// `type` comes from the Shortcut payload via the Worker, so it is data,
// not a literal — escape before interpolating into innerHTML.
function esc(s) {
  return String(s ?? '').replace(/[&<>"]/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));
}

// Distance keeps 2 dp — stat() rounds to whole numbers, which would turn
// a 24.14 km ride into "24".
function distStat(km) {
  if (typeof km !== 'number' || !Number.isFinite(km)) return '';
  return `<div class="stat"><div class="v tabular">${km.toFixed(2)}</div><div class="k">Km</div></div>`;
}

// A watch workout with no logged session behind it: no week, no sets, no
// tonnage — that data does not exist for a hike or a pre-app gym session.
function watchRow(w) {
  return `
    <div class="log-entry watch">
      <div class="date">${fmtDate(w.start)}</div>
      <div><div class="name">${esc(w.type || 'Workout')}</div><div class="sub">Apple Watch</div></div>
      <div class="stats">
        ${stat(w.duration_min, 'Min')}${distStat(w.distance_km)}${stat(w.avg_hr, 'Avg HR')}${stat(w.max_hr, 'Max HR')}${stat(w.active_kcal, 'Kcal')}
      </div>
    </div>`;
}

// Watch metrics for one log entry, or '' when no workout matches —
// entries without watch data render exactly as before.
function watchStats(entry) {
  const w = matchWorkout(entry.date, healthWorkouts() || []);
  if (!w) return '';
  return stat(w.avg_hr, 'Avg HR') + stat(w.max_hr, 'Max HR') + stat(w.active_kcal, 'Kcal');
}

function sessionRow(l) {
  return `
    <div class="log-entry">
      <div class="date">${fmtDate(l.date)}<div class="sub">Wk ${String(l.week).padStart(2,'0')}</div></div>
      <div><div class="name">${esc(l.name)}</div><div class="sub">${esc(l.focus || '')}</div></div>
      <div class="stats">
        <div class="stat"><div class="v tabular">${l.sets}</div><div class="k">Sets</div></div>
        <div class="stat"><div class="v tabular">${(l.vol || 0).toLocaleString()}</div><div class="k">Tonnage</div></div>
        ${watchStats(l)}
      </div>
    </div>`;
}

export function renderLog() {
  const wrap = document.getElementById('logEntries');
  const log = Store.state?.log || [];
  ensureHealthLoaded(renderLog); // one fetch per page load; re-renders once if data lands
  document.getElementById('logCount').textContent = String(log.length).padStart(2, '0');
  document.getElementById('loggedCount').textContent = String(log.length).padStart(2, '0');
  if (!log.length) {
    wrap.innerHTML = `<div class="empty-state"><div class="display">No sessions yet</div><p>Complete your first session to commit it to your repo.</p></div>`;
    return;
  }
  // One list, one sort key per row: a session's completion timestamp or a
  // workout's start. Counts above stay session-only — a hike is not a
  // programme session and should not inflate them.
  const rows = [
    ...log.map(l => ({ at: l.date, html: () => sessionRow(l) })),
    ...unmatchedWorkouts(log, healthWorkouts() || [])
      .map(w => ({ at: w.start, html: () => watchRow(w) })),
  ].sort((a, b) => new Date(b.at) - new Date(a.at));
  wrap.innerHTML = rows.map(r => r.html()).join('');
}
