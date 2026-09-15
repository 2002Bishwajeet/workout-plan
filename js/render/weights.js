import { Store } from '../store.js';
import { torStreak, suggestionFor, TOR_TARGET } from '../progression.js';
import { weightControlHTML, bindWeightControls } from '../ui/weight-editor.js';

// Primary strength lifts and the session type whose log entries drive
// their top-of-range streak (see js/progression.js).
const PRIMARY_SESSION = { bench: 'push-1', ohp: 'push-1', deadlift: 'pull-1', leg_press: 'legs-1', dip: 'upper-1' };

function torStatusHTML(w) {
  const sid = PRIMARY_SESSION[w.key];
  if (!sid) return '';
  const streak = torStreak(Store.state.log, sid, w.key, w.changed_at);
  const sug = suggestionFor(w, streak);
  return sug
    ? `<div class="tor-status ready tabular">Top ${TOR_TARGET}/${TOR_TARGET} → ${sug.target} kg</div>`
    : `<div class="tor-status tabular">Top ${Math.min(streak, TOR_TARGET)}/${TOR_TARGET}</div>`;
}

function sparklineHTML(w) {
  const hist = (Store.state.weight_history || []).filter(h => h.key === w.key);
  if (hist.length < 2) return '';
  const vals = hist.map(h => h.to);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const W = 56, H = 18;
  const pts = vals.map((v, i) => {
    const x = ((i / (vals.length - 1)) * W).toFixed(1);
    const y = (H - ((v - min) / range) * (H - 3) - 1.5).toFixed(1);
    return `${x},${y}`;
  }).join(' ');
  return `<svg class="sparkline" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">
    <polyline points="${pts}" fill="none" stroke="var(--torch)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

function prBadgeHTML(w) {
  if (!w.weight || w.unit === 'BW' || typeof w.weight !== 'number') return '';
  const hist = (Store.state.weight_history || []).filter(h => h.key === w.key);
  if (!hist.length) return '';
  const maxEver = Math.max(...hist.map(h => h.to));
  return w.weight >= maxEver ? '<span class="pr-badge">PR</span>' : '';
}

function renderWeightCells(targetId, list) {
  const wrap = document.getElementById(targetId);
  if (!wrap) return;
  wrap.innerHTML = list.map(w => `
    <div class="weight-cell ${w.calibrate ? 'cal' : ''}" data-key="${w.key}">
      <div class="ex">${w.name}</div>
      <div class="val-row">
        <div class="val">${weightControlHTML(w)}</div>
        ${prBadgeHTML(w)}
      </div>
      ${sparklineHTML(w)}
      ${torStatusHTML(w)}
    </div>
  `).join('');
  bindWeightControls(wrap);
}

export function renderWeights() {
  if (!Store.state) return;
  const ww = Store.state.working_weights;
  const snapshot = [
    ww.push[0], ww.push[1], ww.push[2], ww.pull[0], ww.pull[1],
    ww.push[3], ww.legs[3], ww.acc[0], ww.acc[1]
  ].filter(Boolean);
  renderWeightCells('weightsGrid', snapshot);
  renderWeightCells('weightsPush', ww.push);
  renderWeightCells('weightsPull', ww.pull);
  renderWeightCells('weightsLegs', ww.legs);
  renderWeightCells('weightsAcc',  ww.acc);
  document.getElementById('pushMeta').textContent = `${ww.push.length} lifts`;
  document.getElementById('pullMeta').textContent = `${ww.pull.length} lifts`;
  const calibrating = ww.legs.filter(l => l.calibrate).length;
  document.getElementById('legsMeta').textContent = `${ww.legs.length} lifts${calibrating ? ` · ${calibrating} calibrating` : ''}`;
  document.getElementById('accMeta').textContent  = `${ww.acc.length} lifts`;
}
