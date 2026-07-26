import { defaultState } from './data/default-state.js';
import { setStatus } from './ui/status.js';
import { WORKER_URL } from './config.js';

// Ticks batch for up to a minute; anchor events (complete session, weight
// edit, week advance) pass { flush: true } and commit the whole batch at once.
const BATCH_MS = 60000;

export const Store = {
  state: null,
  sha: null,
  password: null,
  saveTimer: null,
  pendingMsgs: [],
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

  update(mutator, message, opts = {}) {
    if (!this.state || !this.password) return;
    mutator(this.state);
    this.dirty = true;
    if (message) this.pendingMsgs.push(message);
    setStatus('pending');
    if (this.onRender) this.onRender();
    if (opts.flush) {
      clearTimeout(this.saveTimer);
      this.save();
    } else {
      this.scheduleSave();
    }
  },

  scheduleSave() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.save(), BATCH_MS);
  },

  // Best-effort flush when the page is being hidden/closed: whatever is
  // pending goes out now via a keepalive fetch, which survives unload.
  flushNow() {
    if (!this.dirty || !this.state || !this.password) return;
    clearTimeout(this.saveTimer);
    this.save(null, { keepalive: true });
  },

  // Subject = the latest (most significant) action; every earlier action in
  // the batch is preserved as a body line, so the journal loses nothing.
  composeMessage(msgs) {
    if (!msgs.length) return 'Update state';
    if (msgs.length === 1) return msgs[0];
    return msgs[msgs.length - 1] + '\n\n'
      + msgs.slice(0, -1).map(m => '- ' + m).join('\n');
  },

  async save(forceMsg, opts = {}) {
    if (!this.state || !this.password) return;
    setStatus('saving');
    const batch = this.pendingMsgs.slice();
    const msg = forceMsg || this.composeMessage(batch);
    try {
      const res = await fetch(`${WORKER_URL}/state`, {
        method: 'POST',
        headers: { 'X-App-Password': this.password, 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: this.state, sha: this.sha, message: msg }),
        keepalive: !!opts.keepalive
      });
      // Stale write — newer state on the server (e.g. another tab committed since
      // we loaded). Reload fresh rather than clobber it: the rejected local edit is
      // dropped, never the commit. ponytail: drop one tap, not the journal.
      if (res.status === 409) {
        await this.load();
        if (this.onRender) this.onRender();
        this.dirty = false;
        this.pendingMsgs = [];
        setStatus('synced', 'Reloaded — newer data on server');
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      const { sha } = await res.json();
      this.sha = sha;
      // Only drop what this save carried — actions logged mid-flight stay pending.
      this.pendingMsgs = this.pendingMsgs.slice(batch.length);
      this.dirty = this.pendingMsgs.length > 0;
      if (this.dirty) this.scheduleSave();
      setStatus(this.dirty ? 'pending' : 'synced');
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
