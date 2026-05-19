import { Store } from '../store.js';

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
}

export function renderLog() {
  const wrap = document.getElementById('logEntries');
  const log = Store.state?.log || [];
  document.getElementById('logCount').textContent = String(log.length).padStart(2, '0');
  document.getElementById('loggedCount').textContent = String(log.length).padStart(2, '0');
  if (!log.length) {
    wrap.innerHTML = `<div class="empty-state"><div class="display">No sessions yet</div><p>Complete your first session to commit it to your repo.</p></div>`;
    return;
  }
  const sorted = [...log].sort((a, b) => new Date(b.date) - new Date(a.date));
  wrap.innerHTML = sorted.map(l => `
    <div class="log-entry">
      <div class="date">${fmtDate(l.date)}<div class="sub">Wk ${String(l.week).padStart(2,'0')}</div></div>
      <div><div class="name">${l.name}</div><div class="sub">${l.focus || ''}</div></div>
      <div class="stats">
        <div class="stat"><div class="v tabular">${l.sets}</div><div class="k">Sets</div></div>
        <div class="stat"><div class="v tabular">${(l.vol || 0).toLocaleString()}</div><div class="k">Tonnage</div></div>
      </div>
    </div>
  `).join('');
}
