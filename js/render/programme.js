import { Store } from '../store.js';
import { PROGRAMME, WEEK_FOCUS } from '../data/programme.js';

export function renderProgramme() {
  const grid = document.getElementById('programmeGrid');
  const currentWk = Store.state?.current_week || 1;
  let html = '';
  PROGRAMME.blocks.forEach((blk, bi) => {
    html += `<div class="block-divider"><div class="lbl">Block <em>${String(bi+1).padStart(2,'0')}</em> · ${blk.name}</div><div class="desc">RPE ${blk.rpe} · ${blk.weeks.length} wk</div></div>`;
    blk.weeks.forEach(wk => {
      const isCurrent = wk === currentWk;
      const isDeload = bi === 3;
      const cls = isDeload ? 'deload' : (isCurrent ? 'current' : '');
      html += `
        <div class="week-cell ${cls}">
          <div class="wk-rpe">Wk · RPE ${blk.rpe}</div>
          <div class="wk-num">${String(wk).padStart(2,'0')}<em>/12</em></div>
          <div class="wk-focus">${WEEK_FOCUS[wk]}</div>
        </div>
      `;
    });
  });
  grid.innerHTML = html;
}
