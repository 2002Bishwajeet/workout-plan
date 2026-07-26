// ─────────────────────────────────────────────────────────────
// Pure decisions behind completing a session — extracted from
// js/render/session.js so they can run under node --test.
// No DOM, no Store; sessionsForWeek is static programme data.
// ─────────────────────────────────────────────────────────────
import { sessionsForWeek } from './data/sessions.js';

// "6-8" → 7, "5" → 5, "AMRAP-1" → 1 (first numbers found); no digits → 8.
export function parseAvgReps(reps) {
  const m = String(reps).match(/\d+/g);
  return m ? (parseInt(m[0]) + (m[1] ? parseInt(m[1]) : parseInt(m[0]))) / 2 : 8;
}

// Estimated tonnage for a session; weightOf resolves an exercise to a
// numeric load (BW / unset contribute nothing).
export function sessionVolume(exercises, weightOf) {
  return exercises.reduce((a, e) => {
    const w = weightOf(e);
    if (typeof w !== 'number' || w === 0) return a;
    return a + w * parseAvgReps(e.reps) * e.sets;
  }, 0);
}

// Which week a completion belongs to and whether it advances the week.
//
// Skip-the-optional path: re-completing an already-logged session once every
// REQUIRED day of the week is in means the next training week has started —
// the completion is logged under that next week. Did-everything path: filling
// the last session of the week (Upper+ included) advances too. Both capped
// at the 12-week block.
export function completionPlan(startWeek, session, loggedKeys) {
  const coreDone = sessionsForWeek(startWeek)
    .filter(ws => !ws.optional)
    .every(ws => loggedKeys.has(`${startWeek}-${ws.id}`));
  const startingNextWeek = coreDone && startWeek < 12
    && loggedKeys.has(`${startWeek}-${session.id}`);
  const week = startingNextWeek ? startWeek + 1 : startWeek;
  const key = `${week}-${session.id}`;

  const after = new Set(loggedKeys); after.add(key);
  const finishing = week < 12
    && sessionsForWeek(week).every(ws => after.has(`${week}-${ws.id}`));
  const finalWeek = finishing ? week + 1 : week;
  return { week, key, startingNextWeek, finishing, finalWeek };
}
