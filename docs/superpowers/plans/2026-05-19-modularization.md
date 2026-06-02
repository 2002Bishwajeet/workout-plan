# Modularization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split `index.html` (1023 lines) into 14 ES module files — no build step, no bundler, identical behavior.

**Architecture:** Extract CSS to `css/style.css`, JS to `js/` tree with `data/`, `render/`, `ui/` subdirs, wired through a single `<script type="module" src="js/app.js">`. Break Store→renderAll circular dependency via an `onRender` callback.

**Tech Stack:** Vanilla JS (ES modules), CSS, GitHub Pages static hosting.

---

### Task 1: Create Directory Structure

**Files:**
- Create: `css/` directory
- Create: `js/data/` directory
- Create: `js/render/` directory
- Create: `js/ui/` directory

- [ ] **Step 1: Create all directories**

```bash
cd /Users/biswa/Documents/GitHub/workout-plan
mkdir -p css js/data js/render js/ui
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "chore: create module directory structure"
```

---

### Task 2: Extract CSS to `css/style.css`

**Files:**
- Create: `css/style.css`
- Modify: `index.html` — replace `<style>...</style>` block (lines 11–264) with `<link>`

- [ ] **Step 1: Create `css/style.css`**

Extract the full content between `<style>` and `</style>` (lines 12–263 of `index.html`) into `css/style.css`. The file should contain only the CSS rules — no `<style>` tags.

The file starts with:

```css
:root {
  --bg:        #0a0908;
  --surface:   #14110f;
  /* ... all CSS custom properties ... */
}
* { box-sizing: border-box; margin: 0; padding: 0; }
/* ... rest of styles through .boot .status rule ... */
```

And ends with:

```css
.boot .status { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.2em; color: var(--ink-3); text-transform: uppercase; }
```

- [ ] **Step 2: Update `index.html` — replace style block with link**

Replace lines 11–264 (`<style>...</style>`) with:

```html
<link rel="stylesheet" href="css/style.css">
```

- [ ] **Step 3: Verify in browser**

Open `index.html` in a browser (or dev server). All styles should render identically — dark background, Anton headings, torch-orange accents, sharp corners, same layout.

- [ ] **Step 4: Commit**

```bash
git add css/style.css index.html
git commit -m "refactor: extract CSS to css/style.css"
```

---

### Task 3: Extract Static Data Modules

**Files:**
- Create: `js/data/programme.js`
- Create: `js/data/sessions.js`
- Create: `js/data/default-state.js`

- [ ] **Step 1: Create `js/data/programme.js`**

```js
export const PROGRAMME = {
  blocks: [
    { name: 'Volume Base',     weeks: [1,2,3,4],   rpe: '7 — 8',   focus: '4×6-8 strength compounds · 3×10-12 hypertrophy · pike push-ups' },
    { name: 'Intensification', weeks: [5,6,7,8],   rpe: '8 — 8.5', focus: 'Weighted pull-ups + weighted dips primary · deficit pike push-ups' },
    { name: 'Strength Peak',   weeks: [9,10,11],   rpe: '8.5 — 9', focus: 'Low-rep heavy work · calisthenics max-rep testing' },
    { name: 'Deload',          weeks: [12],        rpe: '6 — 7',   focus: '~50% volume · technique focus · prep for next cycle' }
  ]
};

export const WEEK_FOCUS = {
  1: 'Calibration', 2: 'Build', 3: 'Build', 4: 'Block 01 close',
  5: 'Intensify',   6: 'Intensify', 7: 'Intensify', 8: 'Block 02 close',
  9: 'Peak',       10: 'Peak',     11: 'Peak test',
  12: 'Deload'
};
```

- [ ] **Step 2: Create `js/data/sessions.js`**

```js
export const SESSIONS_W1 = [
  { id: 'push-1', day: 'Day 01 · Mon', title: 'Push', focus: 'Bench primary · vertical press · lateral volume', rpe: '7 — 8',
    exercises: [
      { name: 'Barbell Bench Press',  sets: 4, reps: '6-8',    weightKey: 'bench',   rpe: '7-8' },
      { name: 'Incline Barbell Press',sets: 3, reps: '8-10',   weightKey: 'incline_bb', rpe: '7-8' },
      { name: 'Machine Chest Press',  sets: 3, reps: '10-12',  weight: '—', rpe: '7' },
      { name: 'Dumbbell OHP',         sets: 3, reps: '8-10',   weightKey: 'ohp', rpe: '7-8' },
      { name: 'Lateral Raise (DB)',   sets: 3, reps: '12-15',  weightKey: 'lat_raise', rpe: '7-8' },
      { name: 'Tricep Pushdown',      sets: 3, reps: '10-12',  weightKey: 'tri_pd', rpe: '7-8' },
      { name: 'Pike Push-up',         sets: 3, reps: 'AMRAP-1',weight: 'BW', rpe: '8' }
    ]},
  { id: 'pull-1', day: 'Day 02 · Tue', title: 'Pull', focus: 'Deadlift primary · vertical + horizontal volume', rpe: '7 — 8',
    exercises: [
      { name: 'Conventional Deadlift',sets: 4, reps: '5',      weightKey: 'deadlift', rpe: '7-8' },
      { name: 'Pull-up',              sets: 4, reps: '6-8',    weight: 'BW', rpe: '8' },
      { name: 'Chest Supported Row',  sets: 3, reps: '8-10',   weight: '—', rpe: '7-8' },
      { name: 'Lat Pulldown (neutral)',sets: 3, reps: '10-12', weightKey: 'pulldown', rpe: '7' },
      { name: 'Face Pull',            sets: 3, reps: '12-15',  weight: '—', rpe: '7' },
      { name: 'Barbell Curl',         sets: 3, reps: '8-10',   weightKey: 'bb_curl', rpe: '7-8' },
      { name: 'Hammer Curl',          sets: 3, reps: '10-12',  weight: '—', rpe: '7' }
    ]},
  { id: 'legs-1', day: 'Day 03 · Thu', title: 'Legs', focus: 'Calibration · BSS, hack squat, leg press starting weights', rpe: '7 — 8',
    exercises: [
      { name: 'Hack Squat',           sets: 4, reps: '6-8',    weightKey: 'hack_sq', rpe: '7-8', cal: true },
      { name: 'Bulgarian Split Squat',sets: 3, reps: '8-10',   weightKey: 'bss', rpe: '7-8', cal: true },
      { name: 'Leg Press',            sets: 3, reps: '10-12',  weightKey: 'leg_press', rpe: '7', cal: true },
      { name: 'Leg Curl (lying)',     sets: 3, reps: '10-12',  weightKey: 'leg_curl', rpe: '7-8' },
      { name: 'Cable Pull Through',   sets: 3, reps: '12-15',  weight: '—', rpe: '7' },
      { name: 'Standing Calf Raise',  sets: 4, reps: '10-12',  weight: '—', rpe: '8' },
      { name: 'Hanging Leg Raise',    sets: 3, reps: '10-15',  weight: 'BW', rpe: '7-8' }
    ]},
  { id: 'upper-1', day: 'Day 04 · Sat', title: 'Upper +', focus: 'Bench top set + back-offs · weighted dip progression · push/pull volume', rpe: '8',
    exercises: [
      { name: 'Bench Press (top set)',sets: 1, reps: '5',      weightKey: 'bench', rpe: '8' },
      { name: 'Bench (back-offs)',    sets: 3, reps: '8',      weight: 65,   rpe: '7' },
      { name: 'Dip',                  sets: 3, reps: '6-8',    weight: 'BW', rpe: '8' },
      { name: 'Pull-up',              sets: 4, reps: 'AMRAP-1',weight: 'BW', rpe: '8' },
      { name: 'Incline DB Curl',      sets: 3, reps: '10-12',  weight: '—', rpe: '7' },
      { name: 'Overhead Tricep Ext',  sets: 3, reps: '10-12',  weight: '—', rpe: '7' },
      { name: 'Ab Wheel',             sets: 3, reps: 'AMRAP-1',weight: 'BW', rpe: '8' }
    ]}
];
```

- [ ] **Step 3: Create `js/data/default-state.js`**

```js
export function defaultState() {
  return {
    version: 1,
    athlete: 'Bishwajeet',
    current_block: 1,
    current_week: 1,
    working_weights: {
      push: [
        { key: 'bench',      name: 'Bench Press',      weight: 77, unit: 'kg' },
        { key: 'incline_bb', name: 'Incline BB Press', weight: 45, unit: 'kg' },
        { key: 'incline_db', name: 'Incline DB Press', weight: 35, unit: 'kg' },
        { key: 'ohp',        name: 'OHP',              weight: 35, unit: 'kg' },
        { key: 'lat_raise',  name: 'Lateral Raise',    weight: 10, unit: 'kg' }
      ],
      pull: [
        { key: 'deadlift',   name: 'Deadlift',         weight: 140, unit: 'kg' },
        { key: 'pulldown',   name: 'Lat Pulldown',     weight: 65,  unit: 'kg' },
        { key: 'pullup',     name: 'Pull-up',          weight: 0,   unit: 'BW' }
      ],
      legs: [
        { key: 'hack_sq',    name: 'Hack Squat',       weight: 0, unit: 'kg', calibrate: true },
        { key: 'bss',        name: 'BSS',              weight: 0, unit: 'kg', calibrate: true },
        { key: 'leg_press',  name: 'Leg Press',        weight: 0, unit: 'kg', calibrate: true },
        { key: 'leg_curl',   name: 'Leg Curl',         weight: 65, unit: 'kg' }
      ],
      acc: [
        { key: 'bb_curl',    name: 'BB Curl',          weight: 25, unit: 'kg' },
        { key: 'tri_pd',     name: 'Tricep Pushdown',  weight: 20, unit: 'kg' },
        { key: 'dip',        name: 'Dip',              weight: 0,  unit: 'BW' }
      ]
    },
    in_progress: {},
    log: [],
    updated_at: null
  };
}
```

- [ ] **Step 4: Commit**

```bash
git add js/data/
git commit -m "refactor: extract static data modules (programme, sessions, default-state)"
```

---

### Task 4: Extract `js/ui/status.js`

**Files:**
- Create: `js/ui/status.js`

This must be extracted before `store.js` since Store imports it.

- [ ] **Step 1: Create `js/ui/status.js`**

```js
import { Store } from '../store.js';

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
  foot.textContent = `${labels[status]}${Store.config ? ' · ' + new URL(Store.config.workerUrl).hostname : ''}`;
}
```

**Note:** `setStatus` reads `Store.config` for the hostname display. This creates a dependency on `store.js`. Since `store.js` also imports `setStatus`, this is a circular dependency. To break it: `status.js` will accept Store as a late-bound reference. Instead of importing Store, it reads from a module-level variable set by `app.js` at boot.

**Revised `js/ui/status.js`:**

```js
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
```

- [ ] **Step 2: Commit**

```bash
git add js/ui/status.js
git commit -m "refactor: extract setStatus to js/ui/status.js"
```

---

### Task 5: Extract `js/store.js`

**Files:**
- Create: `js/store.js`

Store imports `defaultState` and `setStatus`. Exposes `onRender` callback for `renderAll`. Also exports data helper functions (`getWeight`, `exerciseWeight`, `fmtWeight`).

- [ ] **Step 1: Create `js/store.js`**

```js
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
```

- [ ] **Step 2: Commit**

```bash
git add js/store.js
git commit -m "refactor: extract Store and weight helpers to js/store.js"
```

---

### Task 6: Extract `js/render/dashboard.js`

**Files:**
- Create: `js/render/dashboard.js`

- [ ] **Step 1: Create `js/render/dashboard.js`**

```js
import { Store, exerciseWeight, fmtWeight } from '../store.js';
import { SESSIONS_W1 } from '../data/sessions.js';

let _openSession = null;

export function initDashboard(openSessionFn) {
  _openSession = openSessionFn;
}

export function setDate() {
  const d = new Date();
  document.getElementById('todayDate').textContent =
    d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}

export function renderDashboardHero() {
  if (!Store.state) return;
  document.getElementById('blockNum').innerHTML = `<em>${String(Store.state.current_block).padStart(2,'0')}</em>`;
  document.getElementById('weekNum').textContent = String(Store.state.current_week).padStart(2,'0');
}

export function renderWeekGrid() {
  const grid = document.getElementById('weekGrid');
  const week = Store.state?.current_week || 1;
  const dow = new Date().getDay();
  const todayMap = { 1: 'push-1', 2: 'pull-1', 4: 'legs-1', 6: 'upper-1' };
  const todayId = todayMap[dow];

  grid.innerHTML = SESSIONS_W1.map(s => {
    const key = `${week}-${s.id}`;
    const done = Store.state?.log?.some(l => l.sessionKey === key);
    const isToday = s.id === todayId && !done;
    const cls = done ? 'done' : (isToday ? 'today' : '');
    const badge = done ? '<span class="badge">Done</span>'
                       : isToday ? '<span class="badge badge-torch">Today</span>'
                       : (s.id === 'upper-1' ? '<span class="badge">Optional</span>'
                                              : '<span class="badge">Upcoming</span>');
    return `
      <button class="session-card ${cls}" data-session="${s.id}">
        <div class="sc-top"><div class="sc-day">${s.day}</div>${badge}</div>
        <div class="sc-title">${s.title}</div>
        <div class="sc-focus">${s.focus}</div>
        <div class="sc-stats">
          <div class="sc-stat"><div class="v tabular">${s.exercises.length}</div><div class="k">Lifts</div></div>
          <div class="sc-stat"><div class="v tabular">${s.exercises.reduce((a,e)=>a+e.sets,0)}</div><div class="k">Sets</div></div>
          <div class="sc-stat"><div class="v">${s.rpe}</div><div class="k">RPE</div></div>
        </div>
      </button>
    `;
  }).join('');
  grid.querySelectorAll('.session-card').forEach(btn => {
    btn.addEventListener('click', () => _openSession(btn.dataset.session));
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add js/render/dashboard.js
git commit -m "refactor: extract dashboard rendering to js/render/dashboard.js"
```

---

### Task 7: Extract `js/render/programme.js`

**Files:**
- Create: `js/render/programme.js`

- [ ] **Step 1: Create `js/render/programme.js`**

```js
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
```

- [ ] **Step 2: Commit**

```bash
git add js/render/programme.js
git commit -m "refactor: extract programme rendering to js/render/programme.js"
```

---

### Task 8: Extract `js/render/weights.js`

**Files:**
- Create: `js/render/weights.js`

- [ ] **Step 1: Create `js/render/weights.js`**

```js
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
  if (!w || w.unit === 'BW') return;
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
```

**Note:** `editWeight` calls `Store.onRender()` instead of `renderAll()` on Escape / no-change blur. This matches the original behavior (which called `renderAll()` directly).

- [ ] **Step 2: Commit**

```bash
git add js/render/weights.js
git commit -m "refactor: extract weights rendering to js/render/weights.js"
```

---

### Task 9: Extract `js/render/log.js`

**Files:**
- Create: `js/render/log.js`

- [ ] **Step 1: Create `js/render/log.js`**

```js
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
```

- [ ] **Step 2: Commit**

```bash
git add js/render/log.js
git commit -m "refactor: extract log rendering to js/render/log.js"
```

---

### Task 10: Extract `js/render/session.js`

**Files:**
- Create: `js/render/session.js`

This is the most complex render module — manages `activeSession` state, exercise ticking, and the complete-session flow.

- [ ] **Step 1: Create `js/render/session.js`**

```js
import { Store, exerciseWeight, fmtWeight } from '../store.js';
import { SESSIONS_W1 } from '../data/sessions.js';

let activeSession = null;
let _showView = null;

export function initSession(showViewFn) {
  _showView = showViewFn;

  document.getElementById('backBtn').addEventListener('click', () => _showView('dashboard'));

  document.getElementById('completeBtn').addEventListener('click', () => {
    if (!activeSession) return;
    const s = activeSession;
    const week = Store.state.current_week;
    const key = `${week}-${s.id}`;
    const totalSets = s.exercises.reduce((a,e)=>a+e.sets,0);
    const totalVol = s.exercises.reduce((a,e) => {
      const w = exerciseWeight(e);
      if (typeof w !== 'number' || w === 0) return a;
      const reps = String(e.reps).match(/\d+/g);
      const r = reps ? (parseInt(reps[0]) + (reps[1] ? parseInt(reps[1]) : parseInt(reps[0]))) / 2 : 8;
      return a + (w * r * e.sets);
    }, 0);

    Store.update(st => {
      if (!st.log) st.log = [];
      st.log.push({
        date: new Date().toISOString(),
        week, name: s.title, sessionId: s.id, sessionKey: key,
        sets: totalSets, vol: Math.round(totalVol),
        focus: s.focus
      });
      if (st.in_progress) delete st.in_progress[key];
    }, `Complete session: ${s.title} (Wk ${String(week).padStart(2,'0')})`);

    const btn = document.getElementById('completeBtn');
    btn.textContent = 'Logged ✓';
    btn.style.background = 'var(--rpe-low)';
    setTimeout(() => {
      btn.textContent = 'Complete Session';
      btn.style.background = '';
      _showView('log');
    }, 700);
  });
}

export function getActiveSession() {
  return activeSession;
}

export function openSession(id) {
  const s = SESSIONS_W1.find(x => x.id === id);
  if (!s) return;
  activeSession = s;
  document.getElementById('sessionTitle').textContent = s.title;
  document.getElementById('sessionMeta').textContent = `Block 01 · Week ${String(Store.state.current_week).padStart(2,'0')} · ${s.day}`;
  document.getElementById('sessionRpe').textContent = s.rpe;
  renderExerciseList();
  _showView('session');
}

export function renderExerciseList() {
  if (!activeSession) return;
  const s = activeSession;
  const week = Store.state.current_week;
  const key = `${week}-${s.id}`;
  const doneArr = (Store.state.in_progress && Store.state.in_progress[key]) || [];
  const wrap = document.getElementById('exerciseList');
  wrap.innerHTML = s.exercises.map((e, idx) => {
    const isDone = doneArr.includes(idx);
    const rpeCls = e.rpe.includes('9') ? 'rpe-9-plus' : (e.rpe.includes('8') && !e.rpe.startsWith('7') ? 'rpe-8-9' : 'rpe-7-8');
    const w = exerciseWeight(e);
    const weightDisplay = fmtWeight(w, w === 'BW' ? 'BW' : 'kg');
    const calMark = e.cal ? ' <span class="badge badge-torch" style="margin-left:8px;">Cal</span>' : '';
    return `
      <div class="exercise-row ${isDone ? 'done' : ''}" data-idx="${idx}">
        <div class="ex-num"><span>${String(idx+1).padStart(2,'0')}</span></div>
        <div>
          <div class="ex-name">${e.name}${calMark}</div>
          <div class="ex-meta">${e.sets} sets · ${e.reps} reps</div>
        </div>
        <div class="ex-stat"><div class="v tabular">${weightDisplay}</div><div class="k">Load</div></div>
        <div class="ex-stat"><div class="v tabular">${e.sets}×${e.reps}</div><div class="k">Vol</div></div>
        <div class="ex-rpe ${rpeCls}">RPE ${e.rpe}</div>
      </div>
    `;
  }).join('');
  wrap.querySelectorAll('.exercise-row .ex-num').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const row = ev.currentTarget.closest('.exercise-row');
      const idx = parseInt(row.dataset.idx);
      const exName = s.exercises[idx].name;
      Store.update(st => {
        if (!st.in_progress) st.in_progress = {};
        const arr = st.in_progress[key] || [];
        const i = arr.indexOf(idx);
        if (i >= 0) arr.splice(i, 1); else arr.push(idx);
        st.in_progress[key] = arr;
      }, `Tick: ${exName} (${s.title})`);
    });
  });
  const totalSets = s.exercises.reduce((a,e)=>a+e.sets,0);
  const totalVol = s.exercises.reduce((a,e) => {
    const w = exerciseWeight(e);
    if (typeof w !== 'number' || w === 0) return a;
    const reps = String(e.reps).match(/\d+/g);
    const r = reps ? (parseInt(reps[0]) + (reps[1] ? parseInt(reps[1]) : parseInt(reps[0]))) / 2 : 8;
    return a + (w * r * e.sets);
  }, 0);
  document.getElementById('totalSets').textContent = totalSets;
  document.getElementById('totalVolume').textContent = Math.round(totalVol).toLocaleString();
  document.getElementById('estTime').textContent = '~' + Math.min(75, Math.max(45, 35 + totalSets * 2));
}
```

- [ ] **Step 2: Commit**

```bash
git add js/render/session.js
git commit -m "refactor: extract session rendering to js/render/session.js"
```

---

### Task 11: Extract `js/ui/setup-modal.js`

**Files:**
- Create: `js/ui/setup-modal.js`

- [ ] **Step 1: Create `js/ui/setup-modal.js`**

```js
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
```

- [ ] **Step 2: Commit**

```bash
git add js/ui/setup-modal.js
git commit -m "refactor: extract setup modal to js/ui/setup-modal.js"
```

---

### Task 12: Create `js/app.js` — Boot and Glue

**Files:**
- Create: `js/app.js`

This is the entry point. Imports all modules, wires callbacks, defines `showView` and `renderAll`, runs boot.

- [ ] **Step 1: Create `js/app.js`**

```js
import { Store } from './store.js';
import { initStatus, setStatus } from './ui/status.js';
import { initSetupModal, openSetup } from './ui/setup-modal.js';
import { initDashboard, setDate, renderDashboardHero, renderWeekGrid } from './render/dashboard.js';
import { renderProgramme } from './render/programme.js';
import { renderWeights } from './render/weights.js';
import { renderLog } from './render/log.js';
import { initSession, openSession, renderExerciseList, getActiveSession } from './render/session.js';

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(name).classList.add('active');
  document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderAll() {
  setDate();
  if (!Store.state) return;
  renderDashboardHero();
  renderWeekGrid();
  renderWeights();
  renderProgramme();
  renderLog();
  if (getActiveSession()) renderExerciseList();
}

initStatus(Store);
Store.onRender = renderAll;
initDashboard(openSession);
initSession(showView);
initSetupModal(renderAll);

document.querySelectorAll('.nav button').forEach(b => {
  b.addEventListener('click', () => showView(b.dataset.view));
});

(async function boot() {
  setDate();
  document.getElementById('bootStatus').textContent = 'Checking config…';
  const cfg = Store.readConfig();
  if (!cfg) {
    openSetup();
    return;
  }
  Store.config = cfg;
  try {
    document.getElementById('bootStatus').textContent = 'Loading state…';
    await Store.load();
    renderAll();
    document.getElementById('boot').classList.add('hidden');
  } catch (e) {
    openSetup(e.message);
  }
})();
```

- [ ] **Step 2: Commit**

```bash
git add js/app.js
git commit -m "refactor: create app.js entry point with boot and glue"
```

---

### Task 13: Slim Down `index.html` to HTML Shell

**Files:**
- Modify: `index.html` — remove all `<style>` content (already done in Task 2) and all `<script>` content, replace with module link

- [ ] **Step 1: Replace the `<script>...</script>` block**

Remove everything from `<script>` (line 420 in original, will be different after Task 2) through `</script>` (line 1022 in original). Replace with:

```html
<script type="module" src="js/app.js"></script>
```

The final `index.html` should contain:
1. `<!DOCTYPE html>` and `<head>` with meta tags, Google Fonts link, and `<link rel="stylesheet" href="css/style.css">`
2. `<body>` with all the HTML structure (boot screen, setup modal, topbar, main sections, footer)
3. `<script type="module" src="js/app.js"></script>` just before `</body>`

No inline CSS. No inline JS.

- [ ] **Step 2: Verify final line count**

Run: `wc -l index.html`
Expected: approximately 150-160 lines (HTML only).

- [ ] **Step 3: Verify all files exist**

```bash
ls -la css/style.css js/app.js js/store.js js/data/ js/render/ js/ui/
```

Expected files:
- `css/style.css`
- `js/app.js`
- `js/store.js`
- `js/data/programme.js`, `js/data/sessions.js`, `js/data/default-state.js`
- `js/render/dashboard.js`, `js/render/programme.js`, `js/render/weights.js`, `js/render/log.js`, `js/render/session.js`
- `js/ui/status.js`, `js/ui/setup-modal.js`

- [ ] **Step 4: Verify in browser**

Open `index.html` via a local server (ES modules require serving over HTTP, not `file://`):

```bash
cd /Users/biswa/Documents/GitHub/workout-plan && python3 -m http.server 8000
```

Open `http://localhost:8000` in browser. Verify:
1. Boot screen appears with "PROTOCOL" branding
2. Setup modal works (if not configured) or dashboard loads (if configured)
3. All four nav tabs work: Dashboard, Programme, Weights, Log
4. Session cards are clickable, exercise ticking works
5. Weight cells are editable (click → inline input → Enter to save)
6. Sync pill shows correct status
7. No console errors (`Cmd+Option+J` to check)

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "refactor: slim index.html to HTML shell — modularization complete"
```

---

### Task 14: Final Verification and Cleanup

- [ ] **Step 1: Check for leftover references**

```bash
grep -r 'renderAll\|SESSIONS_W1\|defaultState\|setStatus\|getWeight' index.html
```

Expected: no matches (all JS is now in module files).

- [ ] **Step 2: Verify no `file://` issues**

ES modules don't work over `file://` protocol due to CORS. Verify the dev server works:

```bash
python3 -m http.server 8000
```

If GitHub Pages is the target, modules work fine there — Pages serves with correct MIME types.

- [ ] **Step 3: Final commit with all files**

If any files were missed:

```bash
git add -A
git status
git commit -m "refactor: complete modularization — 14 ES module files, no build step"
```
