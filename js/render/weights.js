import { Store } from '../store.js';
import { weightControlHTML, bindWeightControls } from '../ui/weight-editor.js';

function renderWeightCells(targetId, list) {
  const wrap = document.getElementById(targetId);
  if (!wrap) return;
  wrap.innerHTML = list.map(w => `
    <div class="weight-cell ${w.calibrate ? 'cal' : ''}" data-key="${w.key}">
      <div class="ex">${w.name}</div>
      <div class="val">${weightControlHTML(w)}</div>
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
