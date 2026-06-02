# Modularization: Single-File to ES Modules

## Goal

Split `index.html` (1023 lines — HTML + CSS + JS) into separate files for easier maintenance. No build step, no bundler — native ES modules only.

## File Structure

```
index.html              ~150 lines  HTML shell, <link> to CSS, <script type="module"> to app.js
css/style.css           ~255 lines  Full <style> block extracted verbatim
js/data/programme.js     ~15 lines  PROGRAMME, WEEK_FOCUS exports
js/data/sessions.js      ~45 lines  SESSIONS_W1 export
js/data/default-state.js ~40 lines  defaultState() export
js/ui/status.js          ~15 lines  setStatus() export
js/store.js              ~90 lines  Store object + getWeight, exerciseWeight, fmtWeight exports
js/render/dashboard.js   ~60 lines  renderDashboardHero, renderWeekGrid, setDate
js/render/programme.js   ~25 lines  renderProgramme
js/render/weights.js     ~70 lines  renderWeights, renderWeightCells, editWeight
js/render/log.js         ~35 lines  renderLog, fmtDate
js/render/session.js     ~90 lines  openSession, renderExerciseList, complete handler, activeSession state
js/ui/setup-modal.js     ~40 lines  openSetup, closeSetup, connect handler
js/app.js                ~40 lines  boot, showView, renderAll, nav wiring
```

## Dependency Graph

```
                   programme.js ──┐
                    sessions.js ──┤
              default-state.js ──┤
                                  ├── store.js ──────┐
                    status.js ────┘                   │
                                                      ├── render/*.js ──┐
                                                      │                 ├── app.js
                                                      ├── ui/*.js ──────┘
```

No circular dependencies. `store.js` depends on `status.js` and `default-state.js`. Render modules depend on `store.js` and data modules. `app.js` imports everything and wires it up.

## Breaking the Store → renderAll Circular Dependency

`Store.update()` currently calls `renderAll()` directly. After the split, `renderAll` lives in `app.js` which imports `Store` — that would be circular.

Solution: `Store` exposes an `onRender` callback property. `app.js` sets `Store.onRender = renderAll` during boot. `Store.update()` calls `this.onRender()` instead of `renderAll()`.

## Module Boundaries

### js/store.js exports
- `Store` — the state management object (load, save, update, config)
- `getWeight(key)` — look up a weight entry by key across all categories
- `exerciseWeight(exercise)` — resolve an exercise's weight from its `weight` or `weightKey`
- `fmtWeight(val, unit)` — format a weight value for display

These helpers live in `store.js` because they read `Store.state` and have no DOM dependencies.

### js/render/session.js
- Manages `activeSession` as module-level state
- Exports `openSession(id)`, `renderExerciseList()`, `getActiveSession()`
- Binds complete button and back button handlers on import (via top-level event listeners)
- Needs `showView` from `app.js` — passed as a callback during init to avoid circular import

### js/app.js
- Defines `showView(name)` and `renderAll()`
- Calls init functions from session.js and setup-modal.js, passing `showView` as needed
- Runs the boot sequence

## Constraints

- No build step, no npm, no bundler
- Native `<script type="module">` — works in all modern browsers
- GitHub Pages serves static files — `.js` files served as `text/javascript` by default
- All CSS custom properties preserved exactly as-is
- No functional changes — the app behaves identically after the split
- Worker code (`worker/src/index.js`) unchanged
