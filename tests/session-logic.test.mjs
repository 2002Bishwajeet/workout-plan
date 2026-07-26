import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAvgReps, sessionVolume, completionPlan } from '../js/session-logic.js';
import { sessionsForWeek } from '../js/data/sessions.js';

test('parseAvgReps', () => {
  assert.equal(parseAvgReps('6-8'), 7);
  assert.equal(parseAvgReps('5'), 5);
  assert.equal(parseAvgReps('AMRAP-1'), 1);
  assert.equal(parseAvgReps('submax'), 8);
});

test('sessionVolume skips BW and unset loads', () => {
  const exercises = [
    { sets: 4, reps: '6-8', weightKey: 'bench' },   // 4 × 7 × 60
    { sets: 3, reps: 'AMRAP-1', weight: 'BW' },     // skipped
    { sets: 2, reps: '10', weightKey: 'missing' }   // resolves to 0 → skipped
  ];
  const weightOf = e => (e.weightKey === 'bench' ? 60 : e.weight === 'BW' ? 'BW' : 0);
  assert.equal(sessionVolume(exercises, weightOf), 4 * 7 * 60);
});

const logged = keys => new Set(keys);
const session = id => sessionsForWeek(5).find(s => s.id === id);

test('completionPlan: plain completion, week does not advance', () => {
  const plan = completionPlan(5, session('pull-1'), logged(['5-push-1']));
  assert.deepEqual(plan, {
    week: 5, key: '5-pull-1', startingNextWeek: false, finishing: false, finalWeek: 5
  });
});

test('completionPlan: last session of the week advances (did-everything path)', () => {
  const plan = completionPlan(5, session('upper-1'),
    logged(['5-push-1', '5-pull-1', '5-legs-1']));
  assert.equal(plan.finishing, true);
  assert.equal(plan.finalWeek, 6);
  assert.equal(plan.week, 5);
});

test('completionPlan: re-completing with core done starts next week (skip-optional path)', () => {
  const plan = completionPlan(5, session('push-1'),
    logged(['5-push-1', '5-pull-1', '5-legs-1']));
  assert.equal(plan.startingNextWeek, true);
  assert.equal(plan.week, 6);
  assert.equal(plan.key, '6-push-1');
  assert.equal(plan.finishing, false);
});

test('completionPlan: repeat without core done does NOT advance (guard)', () => {
  const plan = completionPlan(5, session('push-1'), logged(['5-push-1']));
  assert.equal(plan.startingNextWeek, false);
  assert.equal(plan.week, 5);
});

test('completionPlan: capped at week 12', () => {
  const s12 = sessionsForWeek(12).find(s => s.id === 'upper-1');
  const plan = completionPlan(12, s12, logged(['12-push-1', '12-pull-1', '12-legs-1']));
  assert.equal(plan.finishing, false);
  assert.equal(plan.finalWeek, 12);
});
