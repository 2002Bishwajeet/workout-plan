import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WARMUPS, rampSets } from '../js/data/warmups.js';
import { SESSIONS } from '../js/data/sessions.js';

test('rampSets rounds to the lift step and rises through the scheme', () => {
  assert.deepEqual(rampSets(90, 5).map(r => r.load), [35, 55, 70]);
  assert.deepEqual(rampSets(62.5, 2.5).map(r => r.load), [25, 37.5, 50]);
  const loads = rampSets(140, 5).map(r => r.load);
  assert.ok(loads.every((l, i) => i === 0 || l > loads[i - 1]));
});

test('rampSets returns [] for BW/unset weights, never below one step', () => {
  assert.deepEqual(rampSets('BW'), []);
  assert.deepEqual(rampSets(0), []);
  assert.deepEqual(rampSets(undefined), []);
  assert.ok(rampSets(2.5, 2.5).every(r => r.load >= 2.5));
});

test('every session id has a warm-up with prep and a ramp key', () => {
  const ids = new Set(Object.values(SESSIONS).flat().map(s => s.id));
  for (const id of ids) {
    const wu = WARMUPS[id];
    assert.ok(wu, `missing warm-up for ${id}`);
    assert.ok(wu.prep.length >= 3 && wu.prep.length <= 5, `prep size for ${id}`);
    assert.ok(wu.rampKey && wu.rampLabel, `ramp config for ${id}`);
  }
});
