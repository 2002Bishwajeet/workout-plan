import { test } from 'node:test';
import assert from 'node:assert/strict';
import { primaryKeyFor, torStreak, suggestionFor, TOR_TARGET } from '../js/progression.js';

test('primaryKeyFor maps sessions to primary lifts', () => {
  assert.equal(primaryKeyFor('push-1', 3), 'bench');
  assert.equal(primaryKeyFor('pull-1', 7), 'deadlift');
  assert.equal(primaryKeyFor('legs-1', 12), 'leg_press');
  assert.equal(primaryKeyFor('upper-1', 2), 'bench');   // Block 1: bench top set
  assert.equal(primaryKeyFor('upper-1', 7), 'dip');     // Block 2+: weighted dip
  assert.equal(primaryKeyFor('unknown', 1), null);
});

const log = [
  { sessionId: 'pull-1', date: '2026-07-01' },                                    // legacy, no field
  { sessionId: 'pull-1', date: '2026-07-08', top_of_range: { deadlift: true } },
  { sessionId: 'push-1', date: '2026-07-10', top_of_range: { bench: false } },
  { sessionId: 'pull-1', date: '2026-07-15', top_of_range: { deadlift: true } }
];

test('torStreak counts consecutive confirmations, per session type', () => {
  assert.equal(torStreak(log, 'pull-1', 'deadlift'), 2);
  assert.equal(torStreak(log, 'push-1', 'bench'), 0);   // a "no" breaks the run
  assert.equal(torStreak([], 'pull-1', 'deadlift'), 0);
  assert.equal(torStreak(undefined, 'pull-1', 'deadlift'), 0);
});

test('torStreak resets at the last weight change', () => {
  assert.equal(torStreak(log, 'pull-1', 'deadlift', '2026-07-16'), 0); // changed after both
  assert.equal(torStreak(log, 'pull-1', 'deadlift', '2026-07-10'), 1); // only newer counts
  assert.equal(torStreak(log, 'pull-1', 'deadlift', undefined), 2);    // legacy weights
});

test('suggestionFor honors the per-lift step and never fires early or on BW', () => {
  assert.deepEqual(suggestionFor({ weight: 90, step: 5 }, TOR_TARGET), { target: 95 });
  assert.deepEqual(suggestionFor({ weight: 62.5 }, 3), { target: 65 }); // default 2.5
  assert.equal(suggestionFor({ weight: 90, step: 5 }, TOR_TARGET - 1), null);
  assert.equal(suggestionFor({ weight: 0, unit: 'BW' }, TOR_TARGET), null);
  assert.equal(suggestionFor(null, TOR_TARGET), null);
});
