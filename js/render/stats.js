import { Store, getWeight } from '../store.js';
import { torStreak, suggestionFor, TOR_TARGET } from '../progression.js';
import { renderCheckins } from './checkins.js';

// Session types in display order; every week uses the same four ids.
const TYPES = [
  ['push-1', 'Push'], ['pull-1', 'Pull'], ['legs-1', 'Legs'], ['upper-1', 'Upper+']
];

// Primary strength lifts and the session type driving their streak.
const PRIMARY_SESSION = { bench: 'push-1', deadlift: 'pull-1', leg_press: 'legs-1', dip: 'upper-1' };

// Latest log entry for a session key (re-completions overwrite older ones).
function entryFor(log, key) {
  for (let i = log.length - 1; i >= 0; i--) if (log[i].sessionKey === key) return log[i];
  return null;
}

function renderVolumeTable(log, week) {
  const weeks = [];
  let maxTotal = 0;
  for (let w = 1; w <= week; w++) {
    const cells = TYPES.map(([id]) => entryFor(log, `${w}-${id}`));
    const total = cells.reduce((a, e) => a + (e ? e.vol : 0), 0);
    maxTotal = Math.max(maxTotal, total);
    weeks.push({ w, cells, total });
  }
  document.getElementById('statsVolTable').innerHTML = `
    <thead><tr>
      <th>Wk</th>${TYPES.map(([, t]) => `<th>${t}</th>`).join('')}<th>Total</th>
    </tr></thead>
    <tbody>${weeks.map(({ w, cells, total }) => `
      <tr class="${w === week ? 'current' : ''}">
        <td class="wk tabular">${String(w).padStart(2, '0')}</td>
        ${cells.map(e => e
          ? `<td class="tabular">${e.vol.toLocaleString()}</td>`
          : '<td class="miss">—</td>').join('')}
        <td class="total tabular">
          <span class="bar" style="width:${maxTotal ? Math.round(total / maxTotal * 100) : 0}%"></span>
          <span class="bar-val">${total ? total.toLocaleString() : '—'}</span>
        </td>
      </tr>`).join('')}
    </tbody>`;
  const done = log.length;
  document.getElementById('statsVolMeta').textContent =
    `${done} sessions · kg tonnage`;
}

function renderProgression(log) {
  document.getElementById('statsProg').innerHTML = Object.keys(PRIMARY_SESSION).map(key => {
    const w = getWeight(key);
    if (!w) return '';
    const streak = torStreak(log, PRIMARY_SESSION[key], key, w.changed_at);
    const sug = suggestionFor(w, streak);
    const current = (w.unit === 'BW' || typeof w.weight !== 'number' || w.weight <= 0)
      ? 'BW' : `${w.weight} kg`;
    return `
      <div class="prog-row">
        <div class="prog-name">${w.name}</div>
        <div class="prog-cur tabular">${current}</div>
        <div class="prog-streak tabular">Top ${Math.min(streak, TOR_TARGET)}/${TOR_TARGET}</div>
        <div class="prog-next tabular ${sug ? 'ready' : ''}">${sug ? `→ ${sug.target} kg` : '—'}</div>
      </div>`;
  }).join('');
}

function renderWeightHistory() {
  const hist = Store.state.weight_history || [];
  const wrap = document.getElementById('statsHistory');
  document.getElementById('statsWhMeta').textContent = `${hist.length} changes`;
  if (!hist.length) {
    wrap.innerHTML = '<div class="wh-empty">Weight changes are recorded from the next edit onward.</div>';
    return;
  }
  const fmt = d => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
  wrap.innerHTML = hist.slice(-20).reverse().map(h => `
    <div class="wh-row">
      <div class="wh-date mono">${fmt(h.date)}</div>
      <div class="wh-name">${h.name}</div>
      <div class="wh-delta tabular">${h.from || '—'} → ${h.to} kg</div>
    </div>`).join('');
}

export function renderStats() {
  if (!Store.state) return;
  const log = Store.state.log || [];
  renderVolumeTable(log, Store.state.current_week || 1);
  renderProgression(log);
  renderWeightHistory();
  const tonnage = log.reduce((a, l) => a + (l.vol || 0), 0);
  document.getElementById('statsTonnage').textContent = tonnage.toLocaleString();
  renderCheckins(); // fetches once; no-op on subsequent renders
}
