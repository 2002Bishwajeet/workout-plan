import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HOME_SESSIONS, HOME_PREP } from '../js/data/home-sessions.js';
import { SESSIONS } from '../js/data/sessions.js';

// Movements from the hard-constraints list (CLAUDE.md) that must never
// appear in any home programming, plus the banned squat patterns.
const BANNED = [
  'rdl', 'stiff', 'good morning', 'hip thrust', 'goblet', 'barbell squat',
  'front squat', 'pendlay', 'meadows', 'bent-over row', 'close-grip',
  'step-up', 'preacher'
];

test('every session id has a home variant', () => {
  const ids = new Set(Object.values(SESSIONS).flat().map(s => s.id));
  for (const id of ids) {
    const hv = HOME_SESSIONS[id];
    assert.ok(hv, `missing home variant for ${id}`);
    assert.ok(hv.exercises.length >= 5, `${id}: too few exercises`);
    assert.ok(hv.focus && hv.rpe, `${id}: missing focus/rpe`);
  }
});

test('home exercises respect the hard-constraints list', () => {
  const names = Object.values(HOME_SESSIONS)
    .flatMap(v => v.exercises.map(e => e.name.toLowerCase()))
    .concat(HOME_PREP.map(p => p.toLowerCase()));
  for (const name of names) {
    for (const banned of BANNED) {
      assert.ok(!name.includes(banned), `banned movement "${banned}" in "${name}"`);
    }
  }
});

test('home exercises never reference working weights', () => {
  for (const [id, v] of Object.entries(HOME_SESSIONS)) {
    for (const e of v.exercises) {
      assert.equal(e.weightKey, undefined, `${id}: ${e.name} has a weightKey`);
      assert.ok(e.weight === 'BW' || e.weight === '—', `${id}: ${e.name} has a numeric load`);
    }
  }
});

test('home sessions fit the session time cap', () => {
  for (const [id, v] of Object.entries(HOME_SESSIONS)) {
    const sets = v.exercises.reduce((a, e) => a + e.sets, 0);
    assert.ok(sets <= 22, `${id}: ${sets} sets exceeds the time cap`);
    assert.ok(sets >= 16, `${id}: ${sets} sets is thin for a session`);
  }
});
