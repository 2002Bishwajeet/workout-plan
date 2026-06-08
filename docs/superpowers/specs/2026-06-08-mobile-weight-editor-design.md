# Mobile-First Weight Editor — Design Spec

**Date:** 2026-06-08 · **Status:** approved (approach B) · **Author:** coaching session

## Problem

Setting/changing a working weight is broken in practice on mobile, which is the
primary device:

1. Editing exists **only on the Weights tab**, by tapping the value — there is no
   affordance, so the calibration lifts (rendered as "—" because they're `0`) don't
   look editable.
2. The edit **commits on `blur` only** (`weights.js:41`). On a mobile keypad the
   dismiss behaviour is unreliable, so typed values often never save — which is why
   Deadlift edited once but the leg lifts wouldn't.
3. The **session screen has no weight entry at all** — you can only tick an exercise
   done. You can't record the load you actually lifted where you actually train.

## Goals

- One robust, mobile-first control for setting weights, used in **both** the Weights
  tab and the session screen.
- **Commit is explicit and instant** — every stepper tap and every confirmed typed
  value saves immediately; no dependence on `blur`.
- Type *or* step: numeric keypad for any value (calibration), `− / +` buttons for
  the weekly progression nudge.
- Stays inside the existing design language (M3 tokens, JetBrains Mono numbers,
  existing radii — no new colors).

## Non-goals (YAGNI)

- No per-session weight **history** / PR tracking (that's approach C, deferred). A
  session edit updates the single working weight — same source of truth as today.
- No new framework, build step, or backend. Native ES module, same as the rest of `js/`.

## Component — `js/ui/weight-editor.js`

A small, self-contained unit. Two exports:

- `weightControlHTML(w)` → string. Given a working-weight object
  `{ key, name, weight, unit, step?, calibrate? }`, returns the control markup.
  - `unit === 'BW'` → renders static `BW` (no editor).
  - not editable (`!Store.editable`) → renders static value (read-only).
  - otherwise → `− [input] unit +`.
- `bindWeightControls(rootEl)` → wires every `.wedit[data-wkey]` inside `rootEl`:
  - **stepper tap**: `new = clamp0(current ± stepFor(w))`, commit immediately.
  - **typed value**: commit on `change` and on `Enter` (then blur). `change` fires
    on keypad-confirm and on blur, so it's the reliable commit point.
  - all commits go through `Store.update(mutator, "Update weight: {name} {prev} → {new} kg")`,
    clearing `calibrate` on first real value (preserves current behaviour).

`stepFor(w)` = `w.step ?? 2.5`. Step is stored per working-weight so it can match the
coaching rule (+2.5 upper / +5 lower compounds). Missing `step` falls back to 2.5, so
old state still works.

Markup:

```html
<div class="wedit" data-wkey="leg_press">
  <button class="wedit-step" data-dir="-1" type="button" aria-label="Decrease leg press">−</button>
  <input class="wedit-input tabular" inputmode="decimal" enterkeyhint="done" value="160" />
  <span class="wedit-unit">kg</span>
  <button class="wedit-step" data-dir="1" type="button" aria-label="Increase leg press">+</button>
</div>
```

`inputmode="decimal"` brings up the numeric keypad without the fragile `type=number`
spinner. Buttons are `type="button"` (no form submit). Touch targets ≥ 40px on mobile.

## Integration

**Weights tab + dashboard snapshot — `js/render/weights.js`:** the `.weight-cell`
`.val` becomes `weightControlHTML(w)`; after building each grid, call
`bindWeightControls`. Delete the old `editWeight` / `inline-edit` path.

**Session screen — `js/render/session.js`:** in `renderExerciseList`, an exercise
with a `weightKey` renders the control in its "Load" stat; fixed-number / `—` / `BW`
exercises stay static. After building the list, call `bindWeightControls`. Editing a
tracked lift here updates its working weight (and the displayed tonnage re-renders).

## CSS — `css/style.css`

Replace `.weight-cell input.inline-edit` with a `.wedit` block:
- `.wedit` flex row, `gap`, `align-items:center`.
- `.wedit-step` 40×40 (mobile) / 32×32 (desktop) tonal buttons, sharp-ish to match
  M3 tokens (`--r-sm`), `--md-secondary-container`, big `−/+`, `:active` feedback.
- `.wedit-input` Anton/tabular, transparent, bottom-accent on focus, width ~3.5ch.
- `.readonly .wedit-step { display:none }` and input `readonly` — reuse existing
  read-only convention.
- In `.exercise-row` the control sits in the Load stat; verify the 720px reflow.

## Data changes (committed separately, before the UI)

1. **Programme restructure** (`js/data/sessions.js`, `js/data/default-state.js`):
   remove **Hack Squat** (no machine) and **Cable Pull Through** (technique) from all
   leg sessions; promote **Leg Press** into the primary heavy-quad slot per block;
   add **Leg Extension** (`leg_ext`) for quad-isolation volume. Posterior chain stays
   covered by deadlift + leg curl.
2. **Calibration** (`data/state.json`): `leg_press = 160`, `bss = 10`, `leg_curl = 65`
   (confirm), drop `calibrate` on those; remove `hack_sq`; add `leg_ext` (0, calibrate);
   add `step` to each lift. Clear the stale `1-legs-1` in-progress and log Legs as done.

## Verification

- `node --check` each touched JS module (no build/test harness in repo — don't add one).
- Manual: on mobile width, set a `0` calibration lift via keypad → commits; `+`/`−`
  step a lift → commits instantly; read-only mode shows static values; tonnage updates.
- Commit per logical unit; push to `main` (auto-deploys via Cloudflare).
