import { Store } from '../store.js';
import { torStreak, suggestionFor, TOR_TARGET } from '../progression.js';
import { weightControlHTML, bindWeightControls } from '../ui/weight-editor.js';

// Primary strength lifts and the session type whose log entries drive
// their top-of-range streak (see js/progression.js).
const PRIMARY_SESSION = { bench: 'push-1', deadlift: 'pull-1', leg_press: 'legs-1', dip: 'upper-1' };

function torStatusHTML(w) {
  const sid = PRIMARY_SESSION[w.key];
  if (!sid) return '';
  const streak = torStreak(Store.state.log, sid, w.key);
  const sug = suggestionFor(w, streak);
  return sug
    ? `<div class="tor-status ready tabular">Top ${TOR_TARGET}/${TOR_TARGET} → ${sug.target} kg</div>`
    : `<div class="tor-status tabular">Top ${Math.min(streak, TOR_TARGET)}/${TOR_TARGET}</div>`;
}

function renderWeightCells(targetId, list) {
  const wrap = document.getElementById(targetId);
  if (!wrap) return;
  wrap.innerHTML = list.map(w => `
    <div class="weight-cell ${w.calibrate ? 'cal' : ''}" data-key="${w.key}">
      <div class="ex">${w.name}</div>
      <div class="val">${weightControlHTML(w)}</div>
      ${torStatusHTML(w)}
    </div>
  `).join('');
  bindWeightControls(wrap);
}

export function renderWeights() {
  if (!Store.state) return;
  const ww = Store.state.working_weights;
  const snapshot = [
    ww.push[0], ww.push[1], ww.pull[0], ww.pull[1],
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
