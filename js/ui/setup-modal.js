import { Store } from '../store.js';
import { WORKER_URL } from '../config.js';

let _onConnected = null;

export function initSetupModal(onConnectedFn) {
  _onConnected = onConnectedFn;

  document.getElementById('connectBtn').addEventListener('click', async () => {
    const pwd = document.getElementById('inputPwd').value;
    const errEl = document.getElementById('setupErr');
    errEl.classList.remove('show');
    if (!pwd) { errEl.textContent = 'Password required.'; errEl.classList.add('show'); return; }
    try {
      const health = await fetch(`${WORKER_URL}/health`);
      if (!health.ok) throw new Error(`Worker returned ${health.status}`);
    } catch (e) {
      errEl.textContent = `Can't reach Worker — ${e.message}`; errEl.classList.add('show'); return;
    }
    Store.savePassword(pwd);
    try {
      await Store.load();
      closeSetup();
      if (_onConnected) _onConnected();
    } catch (e) {
      errEl.textContent = e.message; errEl.classList.add('show');
      Store.clearPassword();
    }
  });

  document.getElementById('syncPill').addEventListener('click', () => openSetup());
}

export function openSetup(prefillErr) {
  document.getElementById('setupModal').classList.add('open');
  document.getElementById('boot').classList.add('hidden');
  if (Store.password) {
    document.getElementById('inputPwd').value = Store.password;
  }
  const errEl = document.getElementById('setupErr');
  if (prefillErr) { errEl.textContent = prefillErr; errEl.classList.add('show'); }
  else errEl.classList.remove('show');
}

export function closeSetup() {
  document.getElementById('setupModal').classList.remove('open');
}
