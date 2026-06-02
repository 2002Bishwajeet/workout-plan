# 12-Week PPL Programme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the app from a single Week-1 session set to the full 12-week PPL programme defined in `docs/superpowers/specs/2026-06-02-12-week-ppl-programme-design.md`, rendered per current week.

**Architecture:** Static programme data only. `js/data/sessions.js` grows from a flat `SESSIONS_W1` array into a `SESSIONS` object keyed by week (1–12), built from four block templates. Render modules read the current week's array via a new `sessionsForWeek(week)` helper. Block labels derive from week via a new `blockForWeek(week)` helper. Mutable working weights stay in `data/state.json`; the only state-shape change is dropping the unused `incline_db` default.

**Tech Stack:** Vanilla ES modules, no build step, no framework, no test runner (per `CLAUDE.md`). Verification is a Node structural check on the pure-data modules plus a manual browser smoke test.

**Commits:** This repo's rule is *commit only when the user asks* (see harness/`CLAUDE.md`). The per-task git steps below are therefore deferred — do NOT commit during execution. A single optional commit is offered at the end, gated on user approval.

---

### Task 1: Rebuild `sessions.js` as the 12-week `SESSIONS` object

**Files:**
- Modify (full rewrite): `js/data/sessions.js`
- Verify: `/tmp/_prog_verify.mjs` copies (temporary, not committed)

- [ ] **Step 1: Write the failing verifier**

Create the verifier command (run from repo root `/Users/biswa/Documents/GitHub/workout-plan`):

```bash
cp js/data/sessions.js /tmp/_sessions.mjs
cp js/data/default-state.js /tmp/_default-state.mjs
node --input-type=module -e '
const { SESSIONS } = await import("file:///tmp/_sessions.mjs");
const { defaultState } = await import("file:///tmp/_default-state.mjs");
const weeks = Object.keys(SESSIONS).map(Number).sort((a,b)=>a-b);
const ids = ["push-1","pull-1","legs-1","upper-1"];
let ok = true; const chk=(c,m)=>{ if(!c){ok=false;console.log("FAIL:",m);} };
chk(weeks.length===12 && weeks[0]===1 && weeks[11]===12, "12 weeks 1..12");
for (const w of weeks){
  chk(SESSIONS[w].length===4, `week ${w} has 4 sessions`);
  chk(ids.every((id,i)=>SESSIONS[w][i].id===id), `week ${w} id order`);
}
const legs1 = SESSIONS[1].find(s=>s.id==="legs-1");
chk(legs1.exercises.filter(e=>e.cal).length===3, "week1 legs has 3 calibration flags");
chk(SESSIONS[2].find(s=>s.id==="legs-1").exercises.every(e=>!e.cal), "week2 legs has no cal flags");
const stateKeys = new Set(Object.values(defaultState().working_weights).flat().map(w=>w.key));
const used = new Set();
for (const w of weeks) for (const s of SESSIONS[w]) for (const e of s.exercises) if (e.weightKey) used.add(e.weightKey);
for (const k of used) chk(stateKeys.has(k), `weightKey "${k}" missing from default state`);
chk(!used.has("incline_db"), "no session references incline_db");
console.log(ok ? `ALL CHECKS PASS (${used.size} weight keys used)` : "CHECKS FAILED");
process.exit(ok?0:1);
'
```

- [ ] **Step 2: Run the verifier against the CURRENT file to confirm it fails**

Run the command above.
Expected: `FAIL: 12 weeks 1..12` then `CHECKS FAILED` (current file exports `SESSIONS_W1`, not `SESSIONS`, so `SESSIONS` is `undefined` and the import-destructure yields a thrown TypeError on `.map`/`Object.keys` — either way it does not pass).

- [ ] **Step 3: Rewrite `js/data/sessions.js` with the full content below**

```js
// ─────────────────────────────────────────────────────────────
// 12-week PPL programme — STATIC structure only.
// Mutable working weights live in data/state.json (see js/data/default-state.js).
// Weeks share a block skeleton; load progresses via working weights,
// not by editing these definitions.
//   Block 1 (Volume Base)     → weeks 1–4   · RPE 7–8
//   Block 2 (Intensification) → weeks 5–8   · RPE 8–8.5
//   Block 3 (Strength Peak)   → weeks 9–11  · RPE 8.5–9
//   Block 4 (Deload)          → week 12     · RPE 6–7
// Bodyweight movements use literal weight:'BW' (exerciseWeight() returns only
// the number, so a weightKey on a BW/0 weight would render "— kg"). Only the
// dip is weightKey-tracked, because it gets loaded from Block 2.
// ─────────────────────────────────────────────────────────────

// ===== BLOCK 1 — Volume Base (weeks 1–4) =====
const B1_PUSH = { id: 'push-1', day: 'Day 01 · Mon', title: 'Push', focus: 'Bench primary · vertical press · lateral volume', rpe: '7 — 8',
  exercises: [
    { name: 'Barbell Bench Press',   sets: 4, reps: '6-8',     weightKey: 'bench',      rpe: '7-8' },
    { name: 'Incline Barbell Press', sets: 3, reps: '8-10',    weightKey: 'incline_bb', rpe: '7-8' },
    { name: 'Machine Chest Press',   sets: 3, reps: '10-12',   weight: '—',             rpe: '7' },
    { name: 'Dumbbell OHP',          sets: 3, reps: '8-10',    weightKey: 'ohp',        rpe: '7-8' },
    { name: 'Lateral Raise (DB)',    sets: 3, reps: '12-15',   weightKey: 'lat_raise',  rpe: '7-8' },
    { name: 'Tricep Pushdown',       sets: 3, reps: '10-12',   weightKey: 'tri_pd',     rpe: '7-8' },
    { name: 'Pike Push-up',          sets: 3, reps: 'AMRAP-1', weight: 'BW',            rpe: '8' }
  ]};
const B1_PULL = { id: 'pull-1', day: 'Day 02 · Tue', title: 'Pull', focus: 'Deadlift primary · vertical + horizontal volume', rpe: '7 — 8',
  exercises: [
    { name: 'Conventional Deadlift', sets: 4, reps: '5',       weightKey: 'deadlift',   rpe: '7-8' },
    { name: 'Pull-up',               sets: 4, reps: 'AMRAP-1', weight: 'BW',            rpe: '8' },
    { name: 'Chest Supported Row',   sets: 3, reps: '8-10',    weight: '—',             rpe: '7-8' },
    { name: 'Lat Pulldown (neutral)',sets: 3, reps: '10-12',   weightKey: 'pulldown',   rpe: '7' },
    { name: 'Face Pull',             sets: 3, reps: '12-15',   weight: '—',             rpe: '7' },
    { name: 'Barbell Curl',          sets: 3, reps: '8-10',    weightKey: 'bb_curl',    rpe: '7-8' },
    { name: 'Hammer Curl',           sets: 3, reps: '10-12',   weight: '—',             rpe: '7' }
  ]};
const B1_LEGS = { id: 'legs-1', day: 'Day 03 · Thu', title: 'Legs', focus: 'Quad + posterior volume · calf + core', rpe: '7 — 8',
  exercises: [
    { name: 'Hack Squat',            sets: 4, reps: '6-8',     weightKey: 'hack_sq',    rpe: '7-8' },
    { name: 'Bulgarian Split Squat', sets: 3, reps: '8-10',    weightKey: 'bss',        rpe: '7-8' },
    { name: 'Leg Press',             sets: 3, reps: '10-12',   weightKey: 'leg_press',  rpe: '7' },
    { name: 'Leg Curl (lying)',      sets: 3, reps: '10-12',   weightKey: 'leg_curl',   rpe: '7-8' },
    { name: 'Cable Pull Through',    sets: 3, reps: '12-15',   weight: '—',             rpe: '7' },
    { name: 'Standing Calf Raise',   sets: 4, reps: '10-12',   weight: '—',             rpe: '8' },
    { name: 'Hanging Leg Raise',     sets: 3, reps: '10-15',   weight: 'BW',            rpe: '7-8' }
  ]};
// Week 1 only: legs is the calibration session.
const B1_LEGS_CAL = { ...B1_LEGS,
  focus: 'Calibration · hack squat, BSS, leg press starting weights',
  exercises: B1_LEGS.exercises.map(e =>
    ['hack_sq','bss','leg_press'].includes(e.weightKey) ? { ...e, cal: true } : e) };
const B1_UPPER = { id: 'upper-1', day: 'Day 04 · Sat', title: 'Upper +', focus: 'Bench top-set + back-offs · dip + pull-up volume', rpe: '8',
  exercises: [
    { name: 'Bench Press (top set)', sets: 1, reps: '5',       weightKey: 'bench',      rpe: '8' },
    { name: 'Bench (back-offs)',     sets: 3, reps: '8',       weight: 65,              rpe: '7' },
    { name: 'Dip',                   sets: 3, reps: '6-8',     weight: 'BW',            rpe: '8' },
    { name: 'Pull-up',               sets: 4, reps: 'AMRAP-1', weight: 'BW',            rpe: '8' },
    { name: 'Incline DB Curl',       sets: 3, reps: '10-12',   weight: '—',             rpe: '7' },
    { name: 'Overhead Tricep Ext',   sets: 3, reps: '10-12',   weight: '—',             rpe: '7' },
    { name: 'Ab Wheel',              sets: 3, reps: 'AMRAP-1', weight: 'BW',            rpe: '8' }
  ]};

// ===== BLOCK 2 — Intensification (weeks 5–8) =====
const B2_PUSH = { id: 'push-1', day: 'Day 01 · Mon', title: 'Push', focus: 'Bench strength · pressing intensity · deficit pike', rpe: '8 — 8.5',
  exercises: [
    { name: 'Barbell Bench Press',   sets: 4, reps: '5-6',     weightKey: 'bench',      rpe: '8' },
    { name: 'Incline Barbell Press', sets: 4, reps: '6-8',     weightKey: 'incline_bb', rpe: '8' },
    { name: 'Machine Chest Press',   sets: 3, reps: '8-10',    weight: '—',             rpe: '8' },
    { name: 'Dumbbell OHP',          sets: 3, reps: '6-8',     weightKey: 'ohp',        rpe: '8' },
    { name: 'Lateral Raise (DB)',    sets: 3, reps: '12-15',   weightKey: 'lat_raise',  rpe: '8' },
    { name: 'Tricep Pushdown',       sets: 3, reps: '8-10',    weightKey: 'tri_pd',     rpe: '8' },
    { name: 'Deficit Pike Push-up',  sets: 3, reps: 'AMRAP-1', weight: 'BW',            rpe: '8.5' }
  ]};
const B2_PULL = { id: 'pull-1', day: 'Day 02 · Tue', title: 'Pull', focus: 'Heavy deadlift · pull-up density · row volume', rpe: '8 — 8.5',
  exercises: [
    { name: 'Conventional Deadlift', sets: 4, reps: '4-5',     weightKey: 'deadlift',   rpe: '8' },
    { name: 'Pull-up',               sets: 5, reps: 'AMRAP-1', weight: 'BW',            rpe: '8.5' },
    { name: 'Chest Supported Row',   sets: 4, reps: '6-8',     weight: '—',             rpe: '8' },
    { name: 'Lat Pulldown (neutral)',sets: 3, reps: '8-10',    weightKey: 'pulldown',   rpe: '8' },
    { name: 'Face Pull',             sets: 3, reps: '15',      weight: '—',             rpe: '7' },
    { name: 'Barbell Curl',          sets: 3, reps: '6-8',     weightKey: 'bb_curl',    rpe: '8' },
    { name: 'Hammer Curl',           sets: 3, reps: '8-10',    weight: '—',             rpe: '8' }
  ]};
const B2_LEGS = { id: 'legs-1', day: 'Day 03 · Thu', title: 'Legs', focus: 'Hack squat + leg press intensity · posterior chain', rpe: '8 — 8.5',
  exercises: [
    { name: 'Hack Squat',            sets: 4, reps: '6-8',     weightKey: 'hack_sq',    rpe: '8' },
    { name: 'Bulgarian Split Squat', sets: 3, reps: '8-10',    weightKey: 'bss',        rpe: '8' },
    { name: 'Leg Press',             sets: 4, reps: '8-10',    weightKey: 'leg_press',  rpe: '8' },
    { name: 'Leg Curl (seated)',     sets: 3, reps: '8-10',    weightKey: 'leg_curl',   rpe: '8' },
    { name: 'Cable Pull Through',    sets: 3, reps: '12-15',   weight: '—',             rpe: '7' },
    { name: 'Standing Calf Raise',   sets: 4, reps: '8-10',    weight: '—',             rpe: '8' },
    { name: 'Hanging Leg Raise',     sets: 3, reps: '12-15',   weight: 'BW',            rpe: '8' }
  ]};
const B2_UPPER = { id: 'upper-1', day: 'Day 04 · Sat', title: 'Upper +', focus: 'Bench intensity · weighted dip primary · pull volume', rpe: '8 — 8.5',
  exercises: [
    { name: 'Bench Press (top set)', sets: 1, reps: '4-5',     weightKey: 'bench',      rpe: '8.5' },
    { name: 'Bench (back-offs)',     sets: 3, reps: '6',       weight: 65,              rpe: '8' },
    { name: 'Weighted Dip',          sets: 4, reps: '6-8',     weightKey: 'dip',        rpe: '8' },
    { name: 'Pull-up',               sets: 4, reps: 'AMRAP-1', weight: 'BW',            rpe: '8.5' },
    { name: 'Incline DB Curl',       sets: 3, reps: '8-10',    weight: '—',             rpe: '8' },
    { name: 'Overhead Tricep Ext',   sets: 3, reps: '10-12',   weight: '—',             rpe: '7' },
    { name: 'Ab Wheel',              sets: 3, reps: 'AMRAP-1', weight: 'BW',            rpe: '8' }
  ]};

// ===== BLOCK 3 — Strength Peak (weeks 9–11) =====
const B3_PUSH = { id: 'push-1', day: 'Day 01 · Mon', title: 'Push', focus: 'Heavy bench · low-rep press · pike test (wk11)', rpe: '8.5 — 9',
  exercises: [
    { name: 'Barbell Bench Press',   sets: 3, reps: '3-5',     weightKey: 'bench',      rpe: '8.5-9' },
    { name: 'Incline Barbell Press', sets: 3, reps: '5-6',     weightKey: 'incline_bb', rpe: '8.5' },
    { name: 'Machine Chest Press',   sets: 3, reps: '8-10',    weight: '—',             rpe: '8' },
    { name: 'Dumbbell OHP',          sets: 3, reps: '5-6',     weightKey: 'ohp',        rpe: '8.5' },
    { name: 'Lateral Raise (DB)',    sets: 3, reps: '12-15',   weightKey: 'lat_raise',  rpe: '8' },
    { name: 'Tricep Pushdown',       sets: 3, reps: '8-10',    weightKey: 'tri_pd',     rpe: '8' },
    { name: 'Pike Push-up',          sets: 3, reps: 'AMRAP-1', weight: 'BW',            rpe: '9' }
  ]};
const B3_PULL = { id: 'pull-1', day: 'Day 02 · Tue', title: 'Pull', focus: 'Heavy deadlift triples · pull-up test · back strength', rpe: '8.5 — 9',
  exercises: [
    { name: 'Conventional Deadlift', sets: 3, reps: '3',       weightKey: 'deadlift',   rpe: '8.5-9' },
    { name: 'Pull-up',               sets: 4, reps: 'AMRAP-1', weight: 'BW',            rpe: '9' },
    { name: 'Chest Supported Row',   sets: 3, reps: '6-8',     weight: '—',             rpe: '8.5' },
    { name: 'Lat Pulldown (neutral)',sets: 3, reps: '6-8',     weightKey: 'pulldown',   rpe: '8' },
    { name: 'Face Pull',             sets: 3, reps: '15',      weight: '—',             rpe: '7' },
    { name: 'Barbell Curl',          sets: 3, reps: '6-8',     weightKey: 'bb_curl',    rpe: '8.5' },
    { name: 'Hammer Curl',           sets: 3, reps: '8-10',    weight: '—',             rpe: '8' }
  ]};
const B3_LEGS = { id: 'legs-1', day: 'Day 03 · Thu', title: 'Legs', focus: 'Heavy hack squat · strength-biased lower', rpe: '8.5 — 9',
  exercises: [
    { name: 'Hack Squat',            sets: 4, reps: '5-6',     weightKey: 'hack_sq',    rpe: '8.5' },
    { name: 'Bulgarian Split Squat', sets: 3, reps: '6-8',     weightKey: 'bss',        rpe: '8' },
    { name: 'Leg Press',             sets: 3, reps: '8-10',    weightKey: 'leg_press',  rpe: '8' },
    { name: 'Leg Curl (lying)',      sets: 3, reps: '6-8',     weightKey: 'leg_curl',   rpe: '8.5' },
    { name: 'Cable Pull Through',    sets: 3, reps: '12-15',   weight: '—',             rpe: '7' },
    { name: 'Standing Calf Raise',   sets: 4, reps: '8-10',    weight: '—',             rpe: '8' },
    { name: 'Hanging Leg Raise',     sets: 3, reps: '12-15',   weight: 'BW',            rpe: '8' }
  ]};
const B3_UPPER = { id: 'upper-1', day: 'Day 04 · Sat', title: 'Upper +', focus: 'Bench peak · weighted dip · calisthenic tests', rpe: '8.5 — 9',
  exercises: [
    { name: 'Bench Press (top set)', sets: 1, reps: '3',       weightKey: 'bench',      rpe: '9' },
    { name: 'Bench (back-offs)',     sets: 3, reps: '5',       weight: 65,              rpe: '8.5' },
    { name: 'Weighted Dip',          sets: 4, reps: '5-6',     weightKey: 'dip',        rpe: '8.5' },
    { name: 'Pull-up',               sets: 4, reps: 'AMRAP-1', weight: 'BW',            rpe: '9' },
    { name: 'Incline DB Curl',       sets: 3, reps: '8-10',    weight: '—',             rpe: '8' },
    { name: 'Overhead Tricep Ext',   sets: 3, reps: '10-12',   weight: '—',             rpe: '8' },
    { name: 'Ab Wheel',              sets: 3, reps: 'AMRAP-1', weight: 'BW',            rpe: '8.5' }
  ]};

// ===== BLOCK 4 — Deload (week 12) =====
const B4_PUSH = { id: 'push-1', day: 'Day 01 · Mon', title: 'Push', focus: 'Deload · technique · ~50% volume', rpe: '6 — 7',
  exercises: [
    { name: 'Barbell Bench Press',   sets: 3, reps: '5',       weightKey: 'bench',      rpe: '6-7' },
    { name: 'Incline Barbell Press', sets: 2, reps: '8',       weightKey: 'incline_bb', rpe: '6' },
    { name: 'Machine Chest Press',   sets: 2, reps: '10',      weight: '—',             rpe: '6' },
    { name: 'Lateral Raise (DB)',    sets: 2, reps: '12',      weightKey: 'lat_raise',  rpe: '6' },
    { name: 'Pike Push-up',          sets: 2, reps: 'submax',  weight: 'BW',            rpe: '6' }
  ]};
const B4_PULL = { id: 'pull-1', day: 'Day 02 · Tue', title: 'Pull', focus: 'Deload · light pulls · movement quality', rpe: '6 — 7',
  exercises: [
    { name: 'Conventional Deadlift', sets: 3, reps: '3',       weightKey: 'deadlift',   rpe: '6-7' },
    { name: 'Pull-up',               sets: 3, reps: 'submax',  weight: 'BW',            rpe: '6' },
    { name: 'Chest Supported Row',   sets: 2, reps: '10',      weight: '—',             rpe: '6' },
    { name: 'Lat Pulldown (neutral)',sets: 2, reps: '12',      weightKey: 'pulldown',   rpe: '6' },
    { name: 'Face Pull',             sets: 2, reps: '15',      weight: '—',             rpe: '6' }
  ]};
const B4_LEGS = { id: 'legs-1', day: 'Day 03 · Thu', title: 'Legs', focus: 'Deload · light lower · mobility', rpe: '6 — 7',
  exercises: [
    { name: 'Hack Squat',            sets: 3, reps: '8',       weightKey: 'hack_sq',    rpe: '6' },
    { name: 'Bulgarian Split Squat', sets: 2, reps: '10',      weightKey: 'bss',        rpe: '6' },
    { name: 'Leg Curl (lying)',      sets: 2, reps: '10',      weightKey: 'leg_curl',   rpe: '6' },
    { name: 'Standing Calf Raise',   sets: 2, reps: '12',      weight: '—',             rpe: '6' },
    { name: 'Hanging Leg Raise',     sets: 2, reps: '12',      weight: 'BW',            rpe: '6' }
  ]};
const B4_UPPER = { id: 'upper-1', day: 'Day 04 · Sat', title: 'Upper +', focus: 'Deload · light upper · prep next cycle', rpe: '6 — 7',
  exercises: [
    { name: 'Bench Press',           sets: 3, reps: '5',       weightKey: 'bench',      rpe: '6' },
    { name: 'Dip',                   sets: 2, reps: '8',       weight: 'BW',            rpe: '6' },
    { name: 'Pull-up',               sets: 2, reps: 'submax',  weight: 'BW',            rpe: '6' },
    { name: 'Incline DB Curl',       sets: 2, reps: '12',      weight: '—',             rpe: '6' },
    { name: 'Ab Wheel',              sets: 2, reps: '10',      weight: 'BW',            rpe: '6' }
  ]};

const BLOCK1_W1 = [B1_PUSH, B1_PULL, B1_LEGS_CAL, B1_UPPER];   // week 1 = calibration legs
const BLOCK1    = [B1_PUSH, B1_PULL, B1_LEGS,     B1_UPPER];   // weeks 2–4
const BLOCK2    = [B2_PUSH, B2_PULL, B2_LEGS,     B2_UPPER];
const BLOCK3    = [B3_PUSH, B3_PULL, B3_LEGS,     B3_UPPER];
const DELOAD    = [B4_PUSH, B4_PULL, B4_LEGS,     B4_UPPER];

export const SESSIONS = {
  1: BLOCK1_W1, 2: BLOCK1, 3: BLOCK1, 4: BLOCK1,
  5: BLOCK2, 6: BLOCK2, 7: BLOCK2, 8: BLOCK2,
  9: BLOCK3, 10: BLOCK3, 11: BLOCK3,
  12: DELOAD
};

// Returns the 4-session array for a given week (falls back to week 1).
export function sessionsForWeek(week) {
  return SESSIONS[week] || SESSIONS[1];
}

// Back-compat alias for anything still importing the flat Week-1 array.
export const SESSIONS_W1 = SESSIONS[1];
```

- [ ] **Step 4: Run the verifier to confirm it passes**

Run the same command block from Step 1.
Expected: `ALL CHECKS PASS (12 weight keys used)` and exit code 0. (Weight keys used: bench, incline_bb, ohp, lat_raise, tri_pd, deadlift, pulldown, bb_curl, hack_sq, bss, leg_press, leg_curl, dip = 13 — the line prints the actual count; any number is fine as long as it says PASS and `incline_db` is not among them.)

- [ ] **Step 5: Commit** — DEFERRED (see Commits note at top). Do not commit.

---

### Task 2: Drop the stale `incline_db` default working weight

**Files:**
- Modify: `js/data/default-state.js:11`

- [ ] **Step 1: Confirm the verifier currently warns nothing (incline_db still present)**

Run:
```bash
node --input-type=module -e '
const { defaultState } = await import("file:///tmp/_default-state.mjs");
const keys = Object.values(defaultState().working_weights).flat().map(w=>w.key);
console.log(keys.includes("incline_db") ? "PRESENT (expected before fix)" : "ABSENT");
'
```
Expected (before fix): `PRESENT (expected before fix)` — note `/tmp/_default-state.mjs` is the pre-fix copy from Task 1.

- [ ] **Step 2: Remove the `incline_db` line**

In `js/data/default-state.js`, delete this line from the `push` array (line 11):

```js
        { key: 'incline_db', name: 'Incline DB Press', weight: 35, unit: 'kg' },
```

The `push` array should then read:

```js
      push: [
        { key: 'bench',      name: 'Bench Press',      weight: 77, unit: 'kg' },
        { key: 'incline_bb', name: 'Incline BB Press', weight: 45, unit: 'kg' },
        { key: 'ohp',        name: 'OHP',              weight: 35, unit: 'kg' },
        { key: 'lat_raise',  name: 'Lateral Raise',    weight: 10, unit: 'kg' }
      ],
```

- [ ] **Step 3: Re-copy and verify it's gone**

Run:
```bash
cp js/data/default-state.js /tmp/_default-state.mjs
node --input-type=module -e '
const { defaultState } = await import("file:///tmp/_default-state.mjs");
const keys = Object.values(defaultState().working_weights).flat().map(w=>w.key);
console.log(keys.includes("incline_db") ? "STILL PRESENT (FAIL)" : "ABSENT (PASS)");
'
```
Expected: `ABSENT (PASS)`.

- [ ] **Step 4: Commit** — DEFERRED.

> Note: this changes `defaultState()` for *future* resets only. The athlete's live `data/state.json` still contains `incline_db`; per the spec it is left untouched and can be removed later via an in-app weights edit (`Store.update`), not a hand-edit here.

---

### Task 3: Add `blockForWeek(week)` to `programme.js`

**Files:**
- Modify: `js/data/programme.js` (append a helper)

- [ ] **Step 1: Append the helper to `js/data/programme.js`**

Add at the end of the file (after the `WEEK_FOCUS` export):

```js
// Maps a week number (1–12) to its block number (1–4) using PROGRAMME.blocks.
export function blockForWeek(week) {
  const idx = PROGRAMME.blocks.findIndex(b => b.weeks.includes(week));
  return idx < 0 ? 1 : idx + 1;
}
```

- [ ] **Step 2: Verify it resolves the right blocks**

Run:
```bash
cp js/data/programme.js /tmp/_programme.mjs
node --input-type=module -e '
const { blockForWeek } = await import("file:///tmp/_programme.mjs");
const got = [1,4,5,8,9,11,12].map(blockForWeek).join(",");
console.log(got === "1,1,2,2,3,3,4" ? "PASS "+got : "FAIL "+got);
'
```
Expected: `PASS 1,1,2,2,3,3,4`.

- [ ] **Step 3: Commit** — DEFERRED.

---

### Task 4: Point the dashboard week-grid at the current week + derive its block label

**Files:**
- Modify: `js/render/dashboard.js:2` (import), `:18` (hero block), `:29` (grid source)

- [ ] **Step 1: Update the imports (line 1–2)**

Replace:
```js
import { Store } from '../store.js';
import { SESSIONS_W1 } from '../data/sessions.js';
```
with:
```js
import { Store } from '../store.js';
import { sessionsForWeek } from '../data/sessions.js';
import { blockForWeek } from '../data/programme.js';
```

- [ ] **Step 2: Derive the hero block label from the current week (line 18)**

In `renderDashboardHero()`, replace:
```js
  document.getElementById('blockNum').innerHTML = `<em>${String(Store.state.current_block).padStart(2,'0')}</em>`;
```
with:
```js
  document.getElementById('blockNum').innerHTML = `<em>${String(blockForWeek(Store.state.current_week)).padStart(2,'0')}</em>`;
```
(This keeps the displayed block in sync with the week, so advancing only `current_week` never shows a stale block.)

- [ ] **Step 3: Render the current week's sessions (line 29)**

In `renderWeekGrid()`, replace:
```js
  grid.innerHTML = SESSIONS_W1.map(s => {
```
with:
```js
  grid.innerHTML = sessionsForWeek(week).map(s => {
```
(`week` is already computed on line 24 as `Store.state?.current_week || 1`.)

- [ ] **Step 4: Verify syntax**

Run:
```bash
cp js/render/dashboard.js /tmp/_dashboard.mjs && node --check /tmp/_dashboard.mjs && echo "SYNTAX OK"
```
Expected: `SYNTAX OK` (no parse errors). Full runtime behaviour is checked in Task 6.

- [ ] **Step 5: Commit** — DEFERRED.

---

### Task 5: Point `openSession()` at the current week + fix the hardcoded block label

**Files:**
- Modify: `js/render/session.js:2` (import), `:53` (lookup), `:57` (meta label)

- [ ] **Step 1: Update the imports (line 1–2)**

Replace:
```js
import { Store, exerciseWeight, fmtWeight } from '../store.js';
import { SESSIONS_W1 } from '../data/sessions.js';
```
with:
```js
import { Store, exerciseWeight, fmtWeight } from '../store.js';
import { sessionsForWeek } from '../data/sessions.js';
import { blockForWeek } from '../data/programme.js';
```

- [ ] **Step 2: Look the session up in the current week (line 53)**

In `openSession(id)`, replace:
```js
  const s = SESSIONS_W1.find(x => x.id === id);
```
with:
```js
  const s = sessionsForWeek(Store.state.current_week).find(x => x.id === id);
```

- [ ] **Step 3: Derive the block label in the session meta (line 57)**

Replace:
```js
  document.getElementById('sessionMeta').textContent = `Block 01 · Week ${String(Store.state.current_week).padStart(2,'0')} · ${s.day}`;
```
with:
```js
  const wk = Store.state.current_week;
  document.getElementById('sessionMeta').textContent = `Block ${String(blockForWeek(wk)).padStart(2,'0')} · Week ${String(wk).padStart(2,'0')} · ${s.day}`;
```

- [ ] **Step 4: Verify syntax**

Run:
```bash
cp js/render/session.js /tmp/_session.mjs && node --check /tmp/_session.mjs && echo "SYNTAX OK"
```
Expected: `SYNTAX OK`.

- [ ] **Step 5: Commit** — DEFERRED.

---

### Task 6: Manual browser smoke test + full structural re-verify

**Files:** none (verification only)

- [ ] **Step 1: Re-run the full structural verifier from Task 1, Step 1**

Expected: `ALL CHECKS PASS`.

- [ ] **Step 2: Serve and open the app**

Run:
```bash
cd /Users/biswa/Documents/GitHub/workout-plan && python3 -m http.server 8765 >/dev/null 2>&1 &
```
Open `http://localhost:8765/` in a browser. (The app fetches state from the live Worker; `current_week` is `1`.)

- [ ] **Step 3: Verify Week 1 dashboard**

Confirm the week grid shows 4 cards — Push / Pull / Legs / Upper + — with "Optional" on Upper+, and the hero shows **Block 01 · Week 01**.

- [ ] **Step 4: Verify each session opens**

Click each card. Confirm: the session view lists the Block-1 exercises, the meta line reads `Block 01 · Week 01 · Day …`, bodyweight lifts (Pike Push-up, Pull-up, Dip, Ab Wheel, Hanging Leg Raise) show **BW** (not "— kg"), and the Legs session shows the **Cal** badge on Hack Squat / BSS / Leg Press.

- [ ] **Step 5: (Optional) spot-check a later week**

In the browser devtools console: `Store.state.current_week = 6; renderAll && renderAll();` — or reload after temporarily setting it — and confirm the grid swaps to Block-2 sessions (Deficit Pike Push-up on Push, Weighted Dip on Upper+) and the hero reads **Block 02**. Reset to `1` afterward. Skip if not convenient — Step 1 already proves all 12 weeks are structurally sound.

- [ ] **Step 6: Stop the server**

Run:
```bash
pkill -f "http.server 8765" 2>/dev/null; rm -f /tmp/_sessions.mjs /tmp/_default-state.mjs /tmp/_programme.mjs /tmp/_dashboard.mjs /tmp/_session.mjs
```

---

## Self-Review

**Spec coverage:**
- §1 structure (PPL + optional Upper+) → all block templates carry `upper-1` with "Optional" badge (existing dashboard logic). ✓
- §2 calisthenics ramp (BW → weighted dip B2/B3; pull-up BW) → encoded: `dip` becomes `weightKey` in B2/B3, pull-up stays `weight:'BW'`. Pull-up weighting noted as athlete-driven in spec §7 (display caveat documented in `sessions.js` header). ✓
- §3 periodization (rep/RPE per block) → Tasks 1 block templates match the spec tables. ✓
- §4 full session definitions → Task 1 reproduces every session. ✓
- §5 technical (SESSIONS by week, drop incline_db, render reads, no design changes) → Tasks 1–5. ✓
- §5 also flagged the `Block 01` hardcode implicitly; surfaced as a real fix in Tasks 4–5. ✓
- §6 weekly check-in → out of scope for this plan (separate follow-up), correctly excluded. ✓
- §7 assumptions (bench 70 lives in state.json, not default-state; leg calibration in-app) → respected; default-state bench left at 77 (future-reset default only), incline_db dropped. ✓

**Placeholder scan:** No TBD/TODO; every code step shows full content. ✓

**Type/name consistency:** `sessionsForWeek` and `blockForWeek` defined in Tasks 1/3 and imported identically in Tasks 4/5. Session ids (`push-1`/`pull-1`/`legs-1`/`upper-1`) constant across all blocks, matching `renderWeekGrid` `todayMap` and the existing `1-push-1` log key. `weightKey` values all verified ⊆ default-state keys by the Task 1 verifier. ✓

**Scope:** Single subsystem (programme data + its render reads). No decomposition needed. ✓
