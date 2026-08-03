# All-Activity Health Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import every Apple Health activity except Walking (swimming, hiking, cycling, running, core training) with distance, and interleave watch workouts that match no logged session into the Log view.

**Architecture:** Three independent layers. The backfill script gains a wider type map and distance parsing. The Worker gains one field in its allowlist. The client gains a selector for unclaimed workouts plus a second row template in the Log view. No new dependency, no build step, no nav change.

**Tech Stack:** Vanilla ES modules in the browser, Node stdlib for the backfill script, `node --test` for tests, Cloudflare Worker (plain JS) for the API.

## Global Constraints

- No build step, no framework, no npm dependency — browser-native ES modules only.
- Tests run under `node --test`, no framework, no fixtures beyond inline string constants.
- Health data lives in `data/health/YYYY-MM.json`, never in `data/state.json`.
- Styling uses existing CSS custom properties only. The stylesheet uses Material tokens
  (`--md-sc`, `--md-on-surface`, `--md-on-surface-variant`, `--r-lg`). Do not introduce new
  colors, fonts, or shape values. No emoji.
- Fonts already loaded: Anton (display), JetBrains Mono (numbers/labels), IBM Plex Sans (body).
- Commit messages follow `Verb: Object (Context)`, under 80 chars, present tense, no trailing
  punctuation.
- `distance_km` is a number in kilometres rounded to 2 decimal places, omitted entirely when
  the export carries no distance for that workout.

---

### Task 1: Widen the backfill type map

Replaces the strength-only filter with the full activity set. Walking is excluded by omission,
which keeps the map the single place scope is defined.

**Files:**
- Modify: `scripts/backfill-health.js:26-31` (the `STRENGTH_TYPES` constant), `:110` (the lookup
  inside `workoutToEntry`), `:205` (the CLI summary line)
- Test: `tests/backfill.test.mjs`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `ACTIVITY_TYPES` (object, HK identifier string → display name string), consumed by
  `workoutToEntry(block)` which returns `{ start, end, type, duration_min, avg_hr?, max_hr?,
  active_kcal? }` or `null`.

- [ ] **Step 1: Update the existing fixture expectations**

The fixture holds five workouts, one of them Running, which three assertions currently expect
to be dropped. The Running workout starts `2026-06-02 07:00 +0530`, which is June in UTC, so
it joins the June bucket.

In `tests/backfill.test.mjs` line 100, change:

```js
  assert.equal(entries.length, 4); // running workout dropped
```

to:

```js
  assert.equal(entries.length, 5); // every type in the fixture is imported
```

Line 102, change:

```js
  assert.ok(!entries.some(e => e.type && e.type.includes('Running')));
```

to:

```js
  assert.ok(entries.some(e => e.type === 'Running'));
```

Line 123, change:

```js
  assert.equal(byMonth.get('2026-06').length, 3);
```

to:

```js
  assert.equal(byMonth.get('2026-06').length, 4);
```

Leave line 122 (`byMonth.get('2026-05').length, 1`) alone — the May bucket holds the
late-night `+0530` workout and is unaffected.

- [ ] **Step 2: Write the failing test**

Add to `tests/backfill.test.mjs`:

```js
test('imports non-strength activities with a friendly type name', () => {
  const block = `<Workout workoutActivityType="HKWorkoutActivityTypeCycling" duration="58" durationUnit="min" startDate="2026-07-02 17:00:00 +0200" endDate="2026-07-02 17:58:00 +0200">
  <WorkoutStatistics type="HKQuantityTypeIdentifierHeartRate" average="131" maximum="162" unit="count/min"/>
 </Workout>`;
  const got = workoutToEntry(block);
  assert.equal(got.type, 'Cycling');
  assert.equal(got.duration_min, 58);
  assert.equal(got.avg_hr, 131);
});

test('maps CoreTraining to a spaced display name', () => {
  const block = `<Workout workoutActivityType="HKWorkoutActivityTypeCoreTraining" duration="20" durationUnit="min" startDate="2026-07-04 08:00:00 +0200" endDate="2026-07-04 08:20:00 +0200"/>`;
  assert.equal(workoutToEntry(block).type, 'Core Training');
});

test('Walking is excluded', () => {
  const block = `<Workout workoutActivityType="HKWorkoutActivityTypeWalking" duration="12" durationUnit="min" startDate="2026-07-05 09:00:00 +0200" endDate="2026-07-05 09:12:00 +0200"/>`;
  assert.equal(workoutToEntry(block), null);
});
```

- [ ] **Step 3: Run tests to verify the new ones fail**

Run: `node --test tests/backfill.test.mjs`
Expected: FAIL — the Cycling and Core Training tests throw on reading `.type` of `null`,
because `STRENGTH_TYPES` has no entry for them.

- [ ] **Step 4: Replace the type map**

In `scripts/backfill-health.js`, replace the `STRENGTH_TYPES` constant and its comment:

```js
// Every activity type worth importing, mapped to its display name.
// Walking is deliberately absent — the watch auto-detects short incidental
// walks, which outnumber real training 167 to 236 in the export and would
// swamp the log. Adding a type here is the only change needed to widen scope.
const ACTIVITY_TYPES = {
  HKWorkoutActivityTypeTraditionalStrengthTraining: 'Traditional Strength Training',
  HKWorkoutActivityTypeFunctionalStrengthTraining: 'Functional Strength Training',
  HKWorkoutActivityTypeCycling: 'Cycling',
  HKWorkoutActivityTypeHiking: 'Hiking',
  HKWorkoutActivityTypeRunning: 'Running',
  HKWorkoutActivityTypeCoreTraining: 'Core Training',
  HKWorkoutActivityTypeSwimming: 'Swimming',
  HKWorkoutActivityTypeOther: 'Other',
};
```

- [ ] **Step 5: Update the lookup and the doc comment**

In `workoutToEntry`, change:

```js
  const type = STRENGTH_TYPES[attrs.workoutActivityType];
```

to:

```js
  const type = ACTIVITY_TYPES[attrs.workoutActivityType];
```

And in that function's doc comment above it, change "or `null` when it isn't a strength
workout" to "or `null` when the activity type isn't imported".

- [ ] **Step 6: Update the CLI summary line**

In `main()`, change:

```js
  console.log(`Scanned ${scanned} workouts, ${entries.length} strength (Traditional + Functional)`);
```

to:

```js
  console.log(`Scanned ${scanned} workouts, ${entries.length} imported (Walking excluded)`);
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `node --test tests/backfill.test.mjs`
Expected: PASS, all tests including the three new ones.

- [ ] **Step 8: Commit**

```bash
git add scripts/backfill-health.js tests/backfill.test.mjs
git commit -m "Widen health import to all activities except Walking"
```

---

### Task 2: Parse distance from the export

Cycling and walking/running carry distance in km, swimming in metres. The unit is an attribute
on the stat element, so read it rather than assuming.

**Files:**
- Modify: `scripts/backfill-health.js` (inside `workoutToEntry`, after the `active_kcal` block
  around line 144, before `return entry`)
- Test: `tests/backfill.test.mjs`

**Interfaces:**
- Consumes: `ACTIVITY_TYPES` and `workoutToEntry(block)` from Task 1.
- Produces: `workoutToEntry` now may include `distance_km` (number, km, 2 dp) on its returned
  entry. Consumed by Task 5's Log row template and validated by Task 3's Worker allowlist.

- [ ] **Step 1: Write the failing test**

Add to `tests/backfill.test.mjs`:

```js
test('reads cycling distance in km', () => {
  const block = `<Workout workoutActivityType="HKWorkoutActivityTypeCycling" duration="58" durationUnit="min" startDate="2026-07-02 17:00:00 +0200" endDate="2026-07-02 17:58:00 +0200">
  <WorkoutStatistics type="HKQuantityTypeIdentifierDistanceCycling" sum="24.137" unit="km"/>
 </Workout>`;
  assert.equal(workoutToEntry(block).distance_km, 24.14);
});

test('converts swimming distance from metres to km', () => {
  const block = `<Workout workoutActivityType="HKWorkoutActivityTypeSwimming" duration="35" durationUnit="min" startDate="2026-07-06 19:00:00 +0200" endDate="2026-07-06 19:35:00 +0200">
  <WorkoutStatistics type="HKQuantityTypeIdentifierDistanceSwimming" sum="1450" unit="m"/>
 </Workout>`;
  assert.equal(workoutToEntry(block).distance_km, 1.45);
});

test('reads hiking distance from the walking/running identifier', () => {
  const block = `<Workout workoutActivityType="HKWorkoutActivityTypeHiking" duration="142" durationUnit="min" startDate="2026-07-30 09:00:00 +0200" endDate="2026-07-30 11:22:00 +0200">
  <WorkoutStatistics type="HKQuantityTypeIdentifierDistanceWalkingRunning" sum="11.4" unit="km"/>
 </Workout>`;
  assert.equal(workoutToEntry(block).distance_km, 11.4);
});

test('omits distance_km when the export carries none', () => {
  const block = `<Workout workoutActivityType="HKWorkoutActivityTypeTraditionalStrengthTraining" duration="40" durationUnit="min" startDate="2026-07-07 17:00:00 +0200" endDate="2026-07-07 17:40:00 +0200"/>`;
  assert.equal('distance_km' in workoutToEntry(block), false);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/backfill.test.mjs`
Expected: FAIL — `distance_km` is `undefined`, so the first three assertions fail on
`undefined !== 24.14` etc.

- [ ] **Step 3: Add the distance identifier set**

In `scripts/backfill-health.js`, directly below the `ACTIVITY_TYPES` constant:

```js
// Distance arrives under a per-sport identifier; any of them is "the" distance
// for that workout, since a workout only ever carries one.
const DISTANCE_TYPES = new Set([
  'HKQuantityTypeIdentifierDistanceCycling',
  'HKQuantityTypeIdentifierDistanceWalkingRunning',
  'HKQuantityTypeIdentifierDistanceSwimming',
]);
```

- [ ] **Step 4: Extract distance in workoutToEntry**

In `workoutToEntry`, immediately before `return entry;`, add:

```js
  // Unit is declared per stat (km for cycling/walking, m for swimming), so
  // convert from the attribute rather than assuming the sport's unit.
  const dist = stats.find(s => DISTANCE_TYPES.has(s.type));
  if (dist?.sum !== undefined && !Number.isNaN(+dist.sum)) {
    const n = +dist.sum;
    const km = dist.unit === 'm' ? n / 1000
      : dist.unit === 'mi' ? n * 1.609344
      : n;
    entry.distance_km = Math.round(km * 100) / 100;
  }
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `node --test tests/backfill.test.mjs`
Expected: PASS, all tests.

- [ ] **Step 6: Commit**

```bash
git add scripts/backfill-health.js tests/backfill.test.mjs
git commit -m "Parse workout distance from Health export"
```

---

### Task 3: Allow distance through the Worker

`HEALTH_FIELDS` is an allowlist that silently drops anything unlisted, so the live iOS Shortcut
currently loses distance on every ride and swim. One field fixes both paths.

**Files:**
- Modify: `worker/src/index.js:115` (the `HEALTH_FIELDS` constant)

**Interfaces:**
- Consumes: the `distance_km` field shape from Task 2.
- Produces: `POST /health` now persists `distance_km` into `data/health/YYYY-MM.json`.

- [ ] **Step 1: Add the field**

In `worker/src/index.js`, change:

```js
const HEALTH_FIELDS = ['start', 'end', 'type', 'duration_min', 'avg_hr', 'max_hr', 'active_kcal'];
```

to:

```js
const HEALTH_FIELDS = ['start', 'end', 'type', 'duration_min', 'avg_hr', 'max_hr', 'active_kcal', 'distance_km'];
```

- [ ] **Step 2: Verify the Worker still builds and its regression test passes**

Run: `node worker/test-conflict.mjs`
Expected: `ok: stale write rejected (409), journal not clobbered (1 PUT, 0 retries)`

Run: `npx wrangler deploy --config worker/wrangler.toml --dry-run`
Expected: build succeeds with no errors. The `--config` flag is required — without it wrangler
picks up the root `wrangler.jsonc` and targets the static-site Worker instead.

- [ ] **Step 3: Commit**

```bash
git add worker/src/index.js
git commit -m "Accept distance_km in health payloads"
```

---

### Task 4: Select workouts that match no logged session

The Log needs the complement of `matchWorkout()`: every watch workout not already claimed by a
logged session, so nothing renders twice.

**Files:**
- Modify: `js/health.js` (add one export at the end)
- Test: `tests/health.test.mjs`

**Interfaces:**
- Consumes: the module-level `workouts` array and existing `matchWorkout(entryDate, workouts)`
  in `js/health.js`.
- Produces: `unmatchedWorkouts(log, workouts)` — takes the log array (entries shaped
  `{ date, week, name, ... }`) and the workout array, returns workout objects
  (`{ start, end, type, duration_min, avg_hr?, max_hr?, active_kcal?, distance_km? }`) sorted
  by `start` descending. Pure, taking both inputs as parameters like `matchWorkout` does, so it
  needs no access to module state and no test seam. Consumed by Task 5.

- [ ] **Step 1: Write the failing test**

`tests/health.test.mjs` imports `matchWorkout` only. Change the import line to:

```js
const { matchWorkout, unmatchedWorkouts } = await import('../js/health.js');
```

Then add:

```js
test('unmatched: a workout claimed by a session is not returned', () => {
  const claimed = W('2026-07-20T18:00:00Z', '2026-07-20T19:10:00Z');
  const loose   = W('2026-07-22T07:00:00Z', '2026-07-22T08:00:00Z', { type: 'Cycling' });
  const got = unmatchedWorkouts([{ date: '2026-07-20T19:05:00Z' }], [claimed, loose]);
  assert.equal(got.length, 1);
  assert.equal(got[0].type, 'Cycling');
});

test('unmatched: with no log, every workout is unmatched', () => {
  const a = W('2026-07-20T18:00:00Z', '2026-07-20T19:10:00Z');
  const b = W('2026-07-22T07:00:00Z', '2026-07-22T08:00:00Z');
  assert.equal(unmatchedWorkouts([], [a, b]).length, 2);
});

test('unmatched: returned newest first', () => {
  const older = W('2026-07-20T18:00:00Z', '2026-07-20T19:00:00Z', { type: 'Hiking' });
  const newer = W('2026-07-25T18:00:00Z', '2026-07-25T19:00:00Z', { type: 'Swimming' });
  assert.deepEqual(unmatchedWorkouts([], [older, newer]).map(w => w.type), ['Swimming', 'Hiking']);
});

test('unmatched: two sessions on the same day each claim their own workout', () => {
  const morning = W('2026-07-20T07:00:00Z', '2026-07-20T08:00:00Z');
  const evening = W('2026-07-20T18:00:00Z', '2026-07-20T19:00:00Z');
  const got = unmatchedWorkouts([
    { date: '2026-07-20T07:55:00Z' },
    { date: '2026-07-20T18:55:00Z' },
  ], [morning, evening]);
  assert.equal(got.length, 0);
});

test('unmatched: handles null inputs', () => {
  assert.deepEqual(unmatchedWorkouts(null, null), []);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/health.test.mjs`
Expected: FAIL — `unmatchedWorkouts is not a function`.

- [ ] **Step 3: Implement the selector**

Add to `js/health.js`, in the "pure matching" section directly below `matchWorkout` (not at the
end of the file — it belongs with the matcher, above the loader):

```js
// Every workout no logged session claimed, newest first. The Log renders
// these as their own rows; without the exclusion a session's own watch
// workout would appear twice — once as stats on the session, once as a
// standalone row. Pure, like matchWorkout: both inputs are parameters.
export function unmatchedWorkouts(log, workouts) {
  const all = workouts || [];
  const claimed = new Set();
  for (const entry of log || []) {
    const w = matchWorkout(entry.date, all);
    if (w) claimed.add(w.start);
  }
  return all
    .filter(w => !claimed.has(w.start))
    .sort((a, b) => (a.start < b.start ? 1 : -1));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/health.test.mjs`
Expected: PASS, all tests including the four new ones.

- [ ] **Step 5: Commit**

```bash
git add js/health.js tests/health.test.mjs
git commit -m "Add unmatchedWorkouts selector to health module"
```

---

### Task 5: Render watch rows in the Log

Merge sessions and unmatched workouts into one chronological list, with a distinct row template
for watch rows.

**Files:**
- Modify: `js/render/log.js` (whole file)
- Modify: `css/style.css` (append after the `.log-entry .stat .k` rule, around line 1646)

**Interfaces:**
- Consumes: `unmatchedWorkouts(log, workouts)` from Task 4, and `distance_km` from Task 2.
- Produces: no exports beyond the existing `renderLog()`.

- [ ] **Step 1: Add the escape helper and watch row template**

In `js/render/log.js`, change the import on line 2 to:

```js
import { ensureHealthLoaded, healthWorkouts, matchWorkout, unmatchedWorkouts } from '../health.js';
```

Then add below the existing `stat()` function:

```js
// `type` comes from the Shortcut payload via the Worker, so it is data,
// not a literal — escape before interpolating into innerHTML.
function esc(s) {
  return String(s ?? '').replace(/[&<>"]/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));
}

// Distance keeps 2 dp — stat() rounds to whole numbers, which would turn
// a 24.14 km ride into "24".
function distStat(km) {
  if (km === undefined || km === null) return '';
  return `<div class="stat"><div class="v tabular">${km.toFixed(2)}</div><div class="k">Km</div></div>`;
}

// A watch workout with no logged session behind it: no week, no sets, no
// tonnage — that data does not exist for a hike or a pre-app gym session.
function watchRow(w) {
  return `
    <div class="log-entry watch">
      <div class="date">${fmtDate(w.start)}</div>
      <div><div class="name">${esc(w.type || 'Workout')}</div><div class="sub">Apple Watch</div></div>
      <div class="stats">
        ${stat(w.duration_min, 'Min')}${distStat(w.distance_km)}${stat(w.avg_hr, 'Avg HR')}${stat(w.max_hr, 'Max HR')}${stat(w.active_kcal, 'Kcal')}
      </div>
    </div>`;
}
```

- [ ] **Step 2: Extract the session row into its own function**

Still in `js/render/log.js`, add below `watchRow`:

```js
function sessionRow(l) {
  return `
    <div class="log-entry">
      <div class="date">${fmtDate(l.date)}<div class="sub">Wk ${String(l.week).padStart(2,'0')}</div></div>
      <div><div class="name">${esc(l.name)}</div><div class="sub">${esc(l.focus || '')}</div></div>
      <div class="stats">
        <div class="stat"><div class="v tabular">${l.sets}</div><div class="k">Sets</div></div>
        <div class="stat"><div class="v tabular">${(l.vol || 0).toLocaleString()}</div><div class="k">Tonnage</div></div>
        ${watchStats(l)}
      </div>
    </div>`;
}
```

- [ ] **Step 3: Merge both row kinds in renderLog**

Replace the body of `renderLog()` from `const sorted = ...` to the end of the function with:

```js
  // One list, one sort key per row: a session's completion timestamp or a
  // workout's start. Counts above stay session-only — a hike is not a
  // programme session and should not inflate them.
  const rows = [
    ...log.map(l => ({ at: l.date, html: () => sessionRow(l) })),
    ...unmatchedWorkouts(log, healthWorkouts() || [])
      .map(w => ({ at: w.start, html: () => watchRow(w) })),
  ].sort((a, b) => new Date(b.at) - new Date(a.at));
  wrap.innerHTML = rows.map(r => r.html()).join('');
```

Leave the two `textContent` count lines and the empty-state early return exactly as they are.

- [ ] **Step 4: Style the watch row**

Append to `css/style.css`:

```css
/* Watch-only rows: same structure as a session, quieter, since there is no
   programme session behind them. */
.log-entry.watch .name {
  font-size: 18px;
  color: var(--md-on-surface-variant);
}
```

- [ ] **Step 5: Verify in the browser**

Run: `npx wrangler dev` and open the printed localhost URL, then switch to the Log view.

Expected: cycling, hiking and pre-app strength rows appear interleaved by date among the
logged sessions. Watch rows show duration / distance / HR / kcal and no week badge. The two
counters at the top still read the logged-session count, not the merged total. A logged session
that has watch data still shows its HR and kcal inline and does *not* also appear as a separate
watch row.

- [ ] **Step 6: Commit**

```bash
git add js/render/log.js css/style.css
git commit -m "Show unmatched watch activities in the Log"
```

---

### Task 6: Re-run the backfill and deploy

**Files:**
- Modify: `data/health/*.json` (regenerated)

**Interfaces:**
- Consumes: everything from Tasks 1-5.
- Produces: the committed activity history.

- [ ] **Step 1: Extract the export**

The export zip is at `/Users/biswa/Downloads/export.zip`. Extract only the XML, into the
scratchpad rather than the repo so it can never be committed:

```bash
SP=/private/tmp/claude-501/-Users-biswa-Documents-GitHub-workout-plan/60730e8d-c39e-482b-92e9-a22fb54115d5/scratchpad
unzip -o -j /Users/biswa/Downloads/export.zip apple_health_export/export.xml -d "$SP"
```

- [ ] **Step 2: Dry-run the backfill**

```bash
node scripts/backfill-health.js "$SP/export.xml" --dry-run
```

Expected: `Scanned 403 workouts, 236 imported (Walking excluded)` and roughly 85 added across
the existing month files, 151 duplicates skipped. If the added count is near 236 instead, the
dedupe broke — stop and investigate before writing.

- [ ] **Step 3: Run it for real**

```bash
node scripts/backfill-health.js "$SP/export.xml"
```

- [ ] **Step 4: Spot-check the output**

```bash
git diff --stat data/health
grep -h '"type"' data/health/*.json | sort | uniq -c | sort -rn
```

Expected: no `Walking` in the type census; Cycling around 54, Hiking 15, Running 7,
Core Training 6, Swimming 1. Existing strength entries unchanged.

- [ ] **Step 5: Commit and clean up**

```bash
git add data/health
git commit -m "Backfill: all activity types from Health export"
rm -f "$SP/export.xml"
```

- [ ] **Step 6: Deploy both Workers**

```bash
npx wrangler deploy --config worker/wrangler.toml
npx wrangler deploy
```

Expected: both succeed. The API Worker carries the `distance_km` allowlist change; the site
Worker carries the Log view and CSS changes.

- [ ] **Step 7: Verify live**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://workout.bishwajeetparhi.dev/
curl -s https://api.workout.bishwajeetparhi.dev/health
```

Expected: `200` and `{"ok":true,"service":"protocol-store"}`. Then open the site and confirm
the Log shows the merged history.

- [ ] **Step 8: Push**

```bash
git push origin main
```

---

## Notes for the implementer

- `data/health/` is excluded from the static site upload by `.assetsignore` (`/data`). That is
  correct and intentional: the client reads health files from the public GitHub contents API,
  not from the site origin. Do not "fix" this.
- The repo is public and these files contain heart-rate history. The athlete has explicitly
  accepted that. Do not add gitignore rules for `data/health/`.
- Never run bare `npx wrangler deploy` when you mean the API Worker — the root
  `wrangler.jsonc` will capture it and deploy the static site instead.
