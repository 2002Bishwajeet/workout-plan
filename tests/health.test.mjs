// Same-day is evaluated in the runtime's local timezone (in the browser,
// the athlete's); pin UTC before importing so day-boundary assertions
// are deterministic wherever the suite runs.
process.env.TZ = 'UTC';

import { test } from 'node:test';
import assert from 'node:assert/strict';
const { matchWorkout, unmatchedWorkouts } = await import('../js/health.js');

const W = (start, end, extra = {}) =>
  ({ start, end, type: 'Traditional Strength Training', avg_hr: 120, max_hr: 155, active_kcal: 300, ...extra });

test('entry inside a workout window matches it (overlap beats nearness)', () => {
  const inside = W('2026-07-20T18:00:00Z', '2026-07-20T19:10:00Z', { avg_hr: 131 });
  const nearer = W('2026-07-20T19:20:00Z', '2026-07-20T19:30:00Z'); // edge closer to entry than inside's start
  const got = matchWorkout('2026-07-20T19:05:00Z', [nearer, inside]);
  assert.equal(got.avg_hr, 131);
});

test('no overlap: falls back to nearest window on the same day', () => {
  const morning = W('2026-07-20T07:00:00Z', '2026-07-20T07:45:00Z', { avg_hr: 101 });
  const evening = W('2026-07-20T18:00:00Z', '2026-07-20T19:00:00Z', { avg_hr: 141 });
  // Session completed 19:25 — after the evening workout ended
  const got = matchWorkout('2026-07-20T19:25:00Z', [morning, evening]);
  assert.equal(got.avg_hr, 141);
});

test('no workout on the entry day: no match', () => {
  const prevDay = W('2026-07-19T18:00:00Z', '2026-07-19T19:00:00Z');
  assert.equal(matchWorkout('2026-07-20T18:30:00Z', [prevDay]), null);
  assert.equal(matchWorkout('2026-07-20T18:30:00Z', []), null);
  assert.equal(matchWorkout('2026-07-20T18:30:00Z', undefined), null);
});

test('garbage in, null out', () => {
  assert.equal(matchWorkout('not a date', [W('2026-07-20T18:00:00Z', '2026-07-20T19:00:00Z')]), null);
  assert.equal(matchWorkout('2026-07-20T18:30:00Z', [{ start: 'nope', end: 'also nope' }]), null);
});

test('month boundary: workout starting in July matches an entry logged in August', () => {
  // Stored in data/health/2026-07.json (keyed by start month) but the
  // window crosses midnight into 1 Aug — the entry overlaps it.
  const late = W('2026-07-31T23:30:00Z', '2026-08-01T00:40:00Z', { avg_hr: 128 });
  const got = matchWorkout('2026-08-01T00:35:00Z', [late]);
  assert.equal(got.avg_hr, 128);
  // Same-day nearness also works across the file boundary: entry shortly
  // after the window ended still shares the calendar day with its end.
  const got2 = matchWorkout('2026-08-01T01:05:00Z', [late]);
  assert.equal(got2.avg_hr, 128);
  // But an entry the following evening is a different training day from
  // the window's start day and doesn't overlap — still same day as end.
  const got3 = matchWorkout('2026-08-01T19:00:00Z', [late]);
  assert.equal(got3.avg_hr, 128);
  // An entry on 2 Aug shares no day with the window: no match.
  assert.equal(matchWorkout('2026-08-02T10:00:00Z', [late]), null);
});

test('non-strength workout hours away on the same day is not matched', () => {
  // Same scenario as the "no overlap: falls back to nearest window on the
  // same day" test above, except the candidate is a Cycling ride, not a
  // strength session. A logged session can only ever be a gym session, so
  // a same-day bike ride must never be picked up as its match — the ride
  // three hours away must stay unmatched (and therefore still surface via
  // unmatchedWorkouts) rather than donating its heart rate to the session.
  const ride = W('2026-07-20T13:17:00Z', '2026-07-20T13:27:00Z', { type: 'Cycling', avg_hr: 143 });
  const got = matchWorkout('2026-07-20T10:17:00Z', [ride]);
  assert.equal(got, null);
  const unmatched = unmatchedWorkouts([{ date: '2026-07-20T10:17:00Z' }], [ride]);
  assert.equal(unmatched.length, 1);
  assert.equal(unmatched[0].type, 'Cycling');
});

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
