import { defaultState } from './data/default-state.js';
import { setStatus } from './ui/status.js';
import { WORKER_URL } from './config.js';

export const Store = {
  state: null,
  sha: null,
  password: null,
  saveTimer: null,
  pendingMsg: null,
  dirty: false,
  onRender: null,

  readPassword() {
    try { return localStorage.getItem('protocol_password'); }
    catch { return null; }
  },

  savePassword(pwd) {
    localStorage.setItem('protocol_password', pwd);
    this.password = pwd;
  },

  clearPassword() {
    localStorage.removeItem('protocol_password');
    this.password = null;
  },

  get editable() { return !!this.password; },

  async load() {
    this.password = this.readPassword();
    setStatus('saving', 'Loading');
    const res = await fetch(`${WORKER_URL}/state`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    this.state = body.state || defaultState();
    this.sha   = body.sha;
    if (!body.state && this.password) {
      await this.save('Initial state');
    } else {
      setStatus(this.password ? 'synced' : 'offline');
    }
    return this.state;
  },

  update(mutator, message) {
    if (!this.state || !this.password) return;
    mutator(this.state);
    this.dirty = true;
    this.pendingMsg = message;
    setStatus('pending');
    if (this.onRender) this.onRender();
    this.scheduleSave();
  },

  scheduleSave() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.save(), 2500);
  },

  async save(forceMsg) {
    if (!this.state || !this.password) return;
    setStatus('saving');
    const msg = forceMsg || this.pendingMsg || 'Update state';
    try {
      const res = await fetch(`${WORKER_URL}/state`, {
        method: 'POST',
        headers: { 'X-App-Password': this.password, 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: this.state, sha: this.sha, message: msg })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      const { sha } = await res.json();
      this.sha = sha;
      this.dirty = false;
      this.pendingMsg = null;
      setStatus('synced');
    } catch (err) {
      console.error('Save failed:', err);
      setStatus('error', err.message);
    }
  }
};

export function getWeight(key) {
  if (!Store.state) return null;
  for (const cat of Object.values(Store.state.working_weights)) {
    const found = cat.find(w => w.key === key);
    if (found) return found;
  }
  return null;
}

export function exerciseWeight(e) {
  if (e.weight !== undefined) return e.weight;
  if (e.weightKey) {
    const w = getWeight(e.weightKey);
    return w ? w.weight : '—';
  }
  return '—';
}

export function fmtWeight(val, unit) {
  if (val === 'BW' || unit === 'BW') return 'BW';
  if (val === '—' || val === 0 || val === undefined || val === null) return '— kg';
  return `${val} kg`;
}
