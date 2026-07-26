// ─────────────────────────────────────────────────────────────
// Progression rule, made computable:
//   top of rep range at target RPE for TOR_TARGET consecutive
//   sessions → step the working weight (+2.5 upper / +5 lower,
//   already encoded per-lift as `step` in working_weights).
//
// Answers are captured mid-session in a transient `state.tor` map
// (`${week}-${sessionId}` → { weightKey: bool }) and moved onto the
// log entry as `top_of_range` when the session completes. Old log
// entries simply lack the field — every read here tolerates absence.
// Pure module: no DOM, no Store — testable with plain data.
// ─────────────────────────────────────────────────────────────
import { blockForWeek } from './data/programme.js';

export const TOR_TARGET = 2;

const PRIMARY = { 'push-1': 'bench', 'pull-1': 'deadlift', 'legs-1': 'leg_press' };

// The weightKey of a session's primary strength lift, or null.
// Upper+ promotes the weighted dip to primary from Block 2; in Block 1
// its strength work is the bench top set.
export function primaryKeyFor(sessionId, week) {
  if (sessionId === 'upper-1') return blockForWeek(week) >= 2 ? 'dip' : 'bench';
  return PRIMARY[sessionId] || null;
}

// Consecutive top-of-range confirmations for (sessionId, key), counted
// back from the most recent answered session. A logged "no" breaks the run.
// `since` (the lift's changed_at) discards confirmations earned at a
// previous load — a fresh weight starts a fresh streak.
export function torStreak(log, sessionId, key, since) {
  const entries = (log || [])
    .filter(l => l.sessionId === sessionId && l.top_of_range && key in l.top_of_range
      && (!since || new Date(l.date) > new Date(since)))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  let n = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].top_of_range[key]) n++; else break;
  }
  return n;
}

// Next-step suggestion once the streak is complete, else null.
// Never suggests for BW/unset lifts (no numeric weight to step from).
export function suggestionFor(w, streak) {
  if (!w || typeof w.weight !== 'number' || w.weight <= 0) return null;
  if (streak < TOR_TARGET) return null;
  const step = (typeof w.step === 'number' && w.step > 0) ? w.step : 2.5;
  return { target: w.weight + step };
}
