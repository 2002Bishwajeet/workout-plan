# All-activity health import — design

**Date:** 2026-08-03
**Status:** Approved, not yet implemented

## Problem

The Apple Health import currently covers strength training only. `scripts/backfill-health.js`
filters to `STRENGTH_TYPES` (Traditional + Functional Strength Training), so swimming, hiking,
cycling and running never reach the repo. The app therefore has no idea what the athlete does
outside the programme — a 100 km ride and a rest day look identical to it.

Two things block the fix, and only one of them is the filter:

1. **The filter.** The backfill script drops every non-strength workout.
2. **The client.** `js/health.js` exposes `matchWorkout()`, which pins a watch workout to a
   *logged strength session* by timestamp overlap. `js/render/log.js` and
   `js/render/dashboard.js` both consume it that way. A hike has no logged session to attach
   to, so widening the filter alone would put data in the repo that never appears on screen.

The Worker is not a blocker: `handlePostHealth()` has no type filter and accepts any activity
today. It does drop distance, because `HEALTH_FIELDS` is a seven-field allowlist.

## Export contents

From the 2026-08-03 export (403 workouts):

| Type | Count |
|---|---|
| Walking | 167 |
| TraditionalStrengthTraining | 104 |
| Cycling | 54 |
| FunctionalStrengthTraining | 47 |
| Hiking | 15 |
| Running | 7 |
| CoreTraining | 6 |
| Other | 2 |
| Swimming | 1 |

Distance is available as `WorkoutStatistics`: `DistanceWalkingRunning` (189, km),
`DistanceCycling` (51, km), `DistanceSwimming` (1, m).

## Decisions

- **Import everything except Walking** — 236 workouts. The 167 Walking entries are mostly
  incidental auto-detected walks rather than training, and at 41% of the data they would
  dominate any chronological view.
- **Non-strength activities interleave into the Log view**, sorted chronologically among
  logged sessions rather than grouped into a separate block or a new nav section. The point is
  reading what happened when.
- **Unmatched workouts all show, including pre-app strength sessions.** The watch holds 151
  strength workouts against ~24 logged sessions, so most of that history predates the app.
  Showing it makes the Log an honest complete record back to Oct 2024.

## Changes

### 1. `scripts/backfill-health.js`

Rename `STRENGTH_TYPES` to `ACTIVITY_TYPES` and extend it to every HK identifier except
Walking, mapping each to its display name:

```
TraditionalStrengthTraining → Traditional Strength Training
FunctionalStrengthTraining  → Functional Strength Training
Cycling                     → Cycling
Hiking                      → Hiking
Running                     → Running
CoreTraining                → Core Training
Swimming                    → Swimming
Other                       → Other
```

Walking is excluded by omission, keeping the map the single place scope is defined.

In `workoutToEntry()`, extend the existing `WorkoutStatistics` block to read distance from
whichever of the three distance identifiers is present. Emit `distance_km` rounded to 2 dp,
converting swimming's metres to km. Omit the field when absent, matching how `avg_hr`,
`max_hr` and `active_kcal` already behave.

Re-running is safe: dedupe is by `start`, so the 151 committed strength entries are untouched
and roughly 85 new activity rows land beside them.

### 2. `worker/src/index.js`

Append `distance_km` to `HEALTH_FIELDS`. No other change — the endpoint already accepts every
activity type. This also fixes the live iOS Shortcut path, which would otherwise keep dropping
distance on rides and swims.

### 3. `js/health.js`

Add one export, `unmatchedWorkouts(log)`: every loaded watch workout that `matchWorkout()`
did not claim for a logged session, sorted by start descending. Pure and DOM-free like the
existing matcher, so it tests the same way. `matchWorkout()` itself is unchanged, as is the
loader.

### 4. `js/render/log.js`

`renderLog()` merges logged sessions with `unmatchedWorkouts()` into a single list sorted
descending on one timestamp per row — `entry.date` for a logged session, `workout.start` for a
watch row. Watch rows reuse the `.log-entry` structure with a `.watch` modifier:

- date cell: date only, no week badge
- name cell: activity type, with `Apple Watch` as the sub-line
- stats: duration, distance (when present), avg/max HR, kcal — no sets, no tonnage

`logCount` and `loggedCount` continue to count logged sessions only. Those numbers mean
"sessions completed in the programme"; a hike should not inflate them.

### 5. Styling

No new tokens. The `.watch` modifier uses the existing muted text color for the name, and the
existing `.stat` / `.tabular` blocks for numbers. Sharp corners, no new accent colors, no
emoji — consistent with the design language in CLAUDE.md.

## Testing

- `tests/backfill.test.mjs` — widened type map, Walking exclusion, distance parsing for each
  of the three identifiers, and the metres-to-km swim conversion.
- `tests/health.test.mjs` — `unmatchedWorkouts()` coverage, in particular that a workout
  already matched to a logged session does not also render as its own row.

Both run under `node --test`, no framework, matching the existing suites.

## Scope boundaries

Not in this change: dashboard treatment of cardio (it keeps showing watch stats for the last
logged session only), distance or volume aggregates, per-sport summaries, and any change to
`data/state.json`. Health files stay separate from training state, as they are today.

## Net effect

The Log grows from 24 rows to roughly 240 — 24 logged sessions plus the ~216 watch workouts
that match none of them — reaching back to Oct 2024. About 60 lines change across four files.
No new dependency, no build step, no nav change.
