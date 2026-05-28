import { Store, getWeight } from '../store.js';

function renderWeightCells(targetId, list) {
  const wrap = document.getElementById(targetId);
  wrap.innerHTML = list.map(w => `
    <div class="weight-cell ${w.calibrate ? 'cal' : ''}" data-key="${w.key}">
      <div class="ex">${w.name}</div>
      <div class="val tabular">${w.unit === 'BW' ? 'BW' : (w.weight || '—')}<span class="unit">${w.unit}</span></div>
    </div>
  `).join('');
  wrap.querySelectorAll('.weight-cell').forEach(cell => {
    cell.addEventListener('click', () => editWeight(cell.dataset.key));
  });
}

function editWeight(key) {
  const w = getWeight(key);
  if (!w || w.unit === 'BW' || !Store.editable) return;
  const cells = document.querySelectorAll(`.weight-cell[data-key="${key}"]`);
  if (!cells.length) return;
  cells.forEach(cell => {
    const valEl = cell.querySelector('.val');
    const current = w.weight || '';
    valEl.innerHTML = `<input class="inline-edit tabular" type="number" step="0.5" value="${current}" autofocus>`;
    const input = valEl.querySelector('input');
    input.focus(); input.select();
    const commit = () => {
      const v = parseFloat(input.value);
      if (!isNaN(v) && v !== w.weight) {
        const prev = w.weight;
        Store.update(s => {
          for (const cat of Object.values(s.working_weights)) {
            const found = cat.find(x => x.key === key);
            if (found) { found.weight = v; if (found.calibrate) delete found.calibrate; }
          }
        }, `Update weight: ${w.name} ${prev || '—'} → ${v} kg`);
      } else {
        if (Store.onRender) Store.onRender();
      }
    };
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') input.blur();
      if (e.key === 'Escape') { if (Store.onRender) Store.onRender(); }
    });
  });
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
