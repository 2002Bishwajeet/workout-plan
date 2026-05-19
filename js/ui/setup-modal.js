import { Store } from '../store.js';

let _onConnected = null;

export function initSetupModal(onConnectedFn) {
  _onConnected = onConnectedFn;

  document.getElementById('connectBtn').addEventListener('click', async () => {
    const url = document.getElementById('inputUrl').value.trim().replace(/\/$/, '');
    const pwd = document.getElementById('inputPwd').value;
    const errEl = document.getElementById('setupErr');
    errEl.classList.remove('show');
    if (!url || !pwd) { errEl.textContent = 'Both fields required.'; errEl.classList.add('show'); return; }
    try {
      const health = await fetch(`${url}/health`);
      if (!health.ok) throw new Error(`Worker /health returned ${health.status}`);
    } catch (e) {
      errEl.textContent = `Can't reach Worker — ${e.message}`; errEl.classList.add('show'); return;
    }
    Store.saveConfig({ workerUrl: url, password: pwd });
    try {
      await Store.load();
      closeSetup();
      if (_onConnected) _onConnected();
    } catch (e) {
      errEl.textContent = e.message; errEl.classList.add('show');
      Store.clearConfig();
    }
  });

  document.getElementById('syncPill').addEventListener('click', () => openSetup());
}

export function openSetup(prefillErr) {
  document.getElementById('setupModal').classList.add('open');
  document.getElementById('boot').classList.add('hidden');
  if (Store.config) {
    document.getElementById('inputUrl').value = Store.config.workerUrl;
    document.getElementById('inputPwd').value = Store.config.password;
  }
  const errEl = document.getElementById('setupErr');
  if (prefillErr) { errEl.textContent = prefillErr; errEl.classList.add('show'); }
  else errEl.classList.remove('show');
}

export function closeSetup() {
  document.getElementById('setupModal').classList.remove('open');
}
