import { defaultState } from './data/default-state.js';
import { setStatus } from './ui/status.js';

export const Store = {
  state: null,
  sha: null,
  config: null,
  saveTimer: null,
  pendingMsg: null,
  dirty: false,
  onRender: null,

  readConfig() {
    try {
      const raw = localStorage.getItem('protocol_config');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  saveConfig(cfg) {
    localStorage.setItem('protocol_config', JSON.stringify(cfg));
    this.config = cfg;
  },

  clearConfig() {
    localStorage.removeItem('protocol_config');
    this.config = null;
  },

  async load() {
    this.config = this.readConfig();
    if (!this.config) { setStatus('offline'); return null; }
    setStatus('saving', 'Loading');
    const res = await fetch(`${this.config.workerUrl.replace(/\/$/, '')}/state`, {
      headers: { 'X-App-Password': this.config.password }
    });
    if (!res.ok) {
      if (res.status === 401) throw new Error('Bad password');
      throw new Error(`HTTP ${res.status}`);
    }
    const body = await res.json();
    this.state = body.state || defaultState();
    this.sha   = body.sha;
    if (!body.state) {
      await this.save('Initial state');
    } else {
      setStatus('synced');
    }
    return this.state;
  },

  update(mutator, message) {
    if (!this.state) return;
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
    if (!this.state || !this.config) return;
    setStatus('saving');
    const msg = forceMsg || this.pendingMsg || 'Update state';
    try {
      const res = await fetch(`${this.config.workerUrl.replace(/\/$/, '')}/state`, {
        method: 'POST',
        headers: { 'X-App-Password': this.config.password, 'Content-Type': 'application/json' },
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
