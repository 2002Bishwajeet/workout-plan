let _store = null;

export function initStatus(store) {
  _store = store;
}

export function setStatus(status, detail) {
  const pill = document.getElementById('syncPill');
  const lbl  = document.getElementById('syncLbl');
  const foot = document.getElementById('footStatus');
  pill.dataset.status = status;
  const labels = {
    synced:  'Synced',
    pending: 'Pending',
    saving:  detail || 'Syncing',
    error:   'Error',
    offline: 'Offline'
  };
  lbl.textContent = labels[status] || status;
  pill.title = detail ? `${labels[status]} — ${detail}` : labels[status];
  foot.textContent = `${labels[status]}${_store?.config ? ' · ' + new URL(_store.config.workerUrl).hostname : ''}`;
}
