# CLAUDE.md

Context for Claude Code sessions working in this repo. Read this before making changes.

---

## What this is

A personal training app for one user (Bishwajeet). The site is plain HTML served by GitHub Pages. A Cloudflare Worker proxies all state mutations through to a JSON file in this repo — so every interaction (tick a set, edit a weight, complete a session) is a real git commit. The commit history *is* the training journal.

Two pieces of infrastructure, both free-tier:
- **GitHub Pages** serves `index.html`
- **Cloudflare Worker** at `worker/src/index.js`, holds the GitHub PAT, exposes `/state` GET+POST

Browser → Worker (with shared password) → GitHub API (with PAT) → `data/state.json` in this repo.

---

## File layout (current — single-file)

```
.
├── index.html                  # entire UI: HTML + CSS + JS, ~1000 lines
├── worker/
│   ├── src/index.js            # Worker, ~170 lines
│   └── wrangler.toml           # Worker config (REPO_OWNER, REPO_NAME, etc.)
├── data/
│   └── state.json              # mutable training state (created by Worker on first save)
├── README.md                   # setup & deploy guide
└── CLAUDE.md                   # this file
```

The single-file approach is deliberate for now — easy to host, easy to read, no build step. **Don't add a build step or a framework unless explicitly asked.**

---

## Architecture rules — don't break these

1. **The Worker holds the GitHub token.** Never put a PAT, OAuth token, or any GitHub credential in client JS. The client only has the shared `APP_PASSWORD`, stored in its own localStorage.

2. **localStorage in the client is for config only** — Worker URL + app password. Training data lives in `data/state.json` in this repo, fetched/saved via the Worker. Do not cache state in localStorage; the repo is the source of truth.

3. **No other backend.** No Supabase, Firebase, KV stores, D1, R2, or anything else. The whole point is: data lives in the user's GitHub repo, version-controlled, owned by them.

4. **Public repo is fine.** Nothing sensitive is in the source. Don't add anything that would change that.

5. **Static programme data is in JS constants** (`PROGRAMME`, `SESSIONS_W1`, `WEEK_FOCUS` at the top of `index.html`). Mutable user state is in `data/state.json`. Keep this separation — don't move static structure into the JSON, don't hardcode user state in JS.

---

## State shape

`data/state.json`:

```json
{
  "version": 1,
  "athlete": "Bishwajeet",
  "current_block": 1,
  "current_week": 1,
  "working_weights": {
    "push": [{ "key": "bench", "name": "Bench Press", "weight": 77, "unit": "kg" }, ...],
    "pull": [...],
    "legs": [...],
    "acc":  [...]
  },
  "in_progress": {
    "1-push-1": [0, 2, 3]   // week-sessionId → completed exercise indices
  },
  "log": [
    { "date": "2026-05-18T...", "week": 1, "name": "Push", "sessionId": "push-1",
      "sessionKey": "1-push-1", "sets": 22, "vol": 3445, "focus": "..." }
  ],
  "updated_at": "ISO timestamp"
}
```

Anything that mutates goes through `Store.update(mutator, message)` in `index.html`. Never mutate `Store.state` directly — the update function handles dirty-flagging, debounced save, and commit-message tagging.

---

## Commit message convention

The Worker accepts a `message` field in POST bodies and uses it as the commit message. Follow this pattern from the client:

```
Verb: Object (Context)
```

Examples already in use:
- `Tick: Bench Press (Push)`
- `Update weight: Hack Squat — → 90 kg`
- `Complete session: Push (Wk 01)`
- `Initial state`

Keep messages under 80 chars, present-tense, no trailing punctuation. The Worker caps at 120.

---

## Design language

The aesthetic is **utilitarian coaching tool**, not fitness-app gloss. Stick to:

- **Fonts**: Anton (display, all caps), JetBrains Mono (numbers, labels, status), IBM Plex Sans (body). All via Google Fonts. Don't add more.
- **Colors**: dark warm background, single torch-orange accent (`--torch: #ff5b1f`). RPE indicators use green/amber/red. Don't introduce new accent colors.
- **Shapes**: sharp 90° corners everywhere. `border-radius: 0` is the rule. Never add rounded corners.
- **Borders**: 1px lines in `--line` (`#2a241e`). Use 3px torch-orange left border for emphasis (calibration markers, deload weeks).
- **Numbers**: always `font-variant-numeric: tabular-nums`. Weights and reps must be glanceable.
- **Density**: dashboards and weight grids are dense. Don't pad things out to look "modern."
- **Status pill, badges**: small uppercase JetBrains Mono with letter-spacing.

The full palette is in CSS custom properties at the top of the `<style>` block. Use those, don't introduce ad-hoc colors.

---

## Athlete context (read before suggesting programme changes)

Bishwajeet is intermediate (2-3 years consistent training), 4 days/week, evening sessions, 60-75 min cap, no current injuries. Goal: strength + hypertrophy, strength weighted heavier. Secondary: integrate calisthenics (pike push-ups, weighted pull-ups, weighted dips).

**Hard constraints** — never violate when suggesting programme changes:
- **No barbell squats** of any kind (high-bar, low-bar, front, safety bar)
- **No RDLs / stiff-leg deadlifts / good mornings**
- **No hip thrusts** (barbell or machine)
- **No barbell bent-over row, no Meadows row, no Pendlay row**
- **No close-grip bench, no step-ups, no goblet squat, no preacher curl machine**

Approved lower-body movements: conventional deadlift, hack squat, leg press, Bulgarian split squat, lunges, leg extension, leg curl (lying/seated), cable pull-through.

Priority lifts: **bench press** is the primary strength priority on Push. **Pull-up and dip** are treated as calisthenics-progression foundation lifts (bodyweight in Block 1 → weighted in Block 2 onward).

Working weights are in `data/state.json`, not in the source. Don't quote weights from memory.

---

## Common tasks (cookbook)

### Add weeks 2-12 of session data

Currently `SESSIONS_W1` is a single array for Week 1. To support all 12 weeks:

```js
const SESSIONS = {
  1: [...],   // current SESSIONS_W1
  2: [...],
  // ...
  12: [...]   // deload — ~50% volume
};
```

Then update `renderWeekGrid()` and `openSession()` to read `SESSIONS[Store.state.current_week]`. The state model already keys `in_progress` by `${week}-${sessionId}`, so it Just Works.

Block 2 (weeks 5-8) intensification: tighter rep ranges (e.g. 4×5-6 strength compounds, 3×8-10 hypertrophy), RPE 8-8.5. Weighted pull-up and weighted dip become primary strength lifts.

Block 3 (weeks 9-11) peak: low-rep heavy (3×3-5), RPE 8.5-9. Calisthenics max-rep testing.

Week 12 deload: ~50% volume, RPE 6-7.

### Add a new exercise to an existing session

Two cases:
- **One-off** (not in the working-weights system): add to the session's `exercises` array with `weight: '—'` or a fixed number.
- **Tracked progression** (has a working weight that updates over time): add a new entry to `defaultState().working_weights` with a unique `key`, then reference it in the session via `weightKey`.

If the exercise involves anything from the hard-constraints list above, **stop and confirm with the user first.**

### Change the design

Stay inside the existing tokens (CSS variables). If a change requires a new color, font, or shape language, push back and confirm with the user — the design language is intentional, not arbitrary.

### Add a new view (e.g. Stats, PR history)

1. Add a `<section id="newview" class="view">` in `<main>`
2. Add a `<button data-view="newview">` to `<nav class="nav">`
3. Write a `renderNewview()` function, call it from `renderAll()`
4. Style with existing tokens; don't introduce new ones

### Surface a new piece of state

Add it to `defaultState()` first so existing users get the field on next save. Mutate via `Store.update`. Render reads from `Store.state` directly.

---

## Modularization — when and how

The single-file setup is fine until `index.html` crosses ~1500 lines or you genuinely need to share code between files. When that happens, the natural split is:

```
.
├── index.html                  # minimal shell, links the scripts
├── css/
│   └── style.css               # extract from <style> block
├── js/
│   ├── data/
│   │   ├── programme.js        # PROGRAMME, WEEK_FOCUS
│   │   ├── sessions.js         # SESSIONS_W1 (or full SESSIONS by week)
│   │   └── default-state.js    # defaultState()
│   ├── store.js                # Store module
│   ├── render/
│   │   ├── dashboard.js
│   │   ├── programme.js
│   │   ├── weights.js
│   │   ├── log.js
│   │   └── session.js
│   ├── ui/
│   │   ├── setup-modal.js
│   │   └── status.js           # setStatus
│   └── app.js                  # boot, view switching, glue
```

Use **native ES modules** (`<script type="module" src="js/app.js"></script>` + `import`/`export`). No bundler. No npm. The browser handles it.

Migration order if doing this:
1. CSS first (easy, no JS coupling)
2. Static data (`programme.js`, `sessions.js`, `default-state.js`)
3. Store (it has no DOM dependencies)
4. Render functions (one per view)
5. UI helpers
6. App bootstrap last

Worker can stay as one file unless it grows substantially.

---

## Quick reference

**Worker endpoints**:
- `GET /health` — public, returns `{ ok: true }`
- `GET /state` — requires `X-App-Password`, returns `{ state, sha }` or `{ state: null, sha: null, new: true }`
- `POST /state` — requires `X-App-Password`, body `{ state, sha, message }`, returns `{ ok, sha, commit, commit_url }`

**Worker env vars** (in `wrangler.toml` `[vars]`):
- `REPO_OWNER`, `REPO_NAME`, `REPO_BRANCH` — target repo
- `DATA_PATH` — path to state file (default `data/state.json`)
- `ALLOWED_ORIGIN` — CORS origin (tighten to Pages URL in production)
- `COMMIT_AUTHOR_NAME`, `COMMIT_AUTHOR_EMAIL`

**Worker secrets** (set via `wrangler secret put`):
- `GITHUB_TOKEN` — fine-grained PAT, contents:write on the one repo
- `APP_PASSWORD` — shared secret the client sends in `X-App-Password`

**Client config** (in browser localStorage under `protocol_config`):
- `workerUrl` — full URL of deployed Worker
- `password` — same as `APP_PASSWORD` above

---

## Things not to do

- Don't add a build step (esbuild, vite, webpack, etc.) unless asked
- Don't add a framework (React, Vue, Svelte) unless asked
- Don't add a new backend service (Supabase, Firebase, etc.)
- Don't move user state out of `data/state.json`
- Don't put GitHub credentials in the client
- Don't introduce rounded corners
- Don't introduce new accent colors
- Don't add emoji to the UI
- Don't quote working weights from memory — read them from `data/state.json`
- Don't suggest barbell squats, RDLs, or anything else in the "hard constraints" list
- Don't refactor for refactoring's sake — the user maintains this themselves, keep the diff small and reviewable
