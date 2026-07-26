import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { defaultState } from '../js/data/default-state.js';

// Guards data/state.json against a bad manual edit or Worker bug.
// The file may not exist on a fresh clone (Worker creates it on first save).
const PATH = new URL('../data/state.json', import.meta.url);

function checkShape(st, label) {
  assert.equal(typeof st.version, 'number', `${label}: version`);
  assert.ok(st.current_week >= 1 && st.current_week <= 12, `${label}: current_week`);
  assert.ok(st.working_weights && typeof st.working_weights === 'object', `${label}: working_weights`);
  for (const cat of ['push', 'pull', 'legs', 'acc']) {
    assert.ok(Array.isArray(st.working_weights[cat]), `${label}: working_weights.${cat}`);
    for (const w of st.working_weights[cat]) {
      assert.equal(typeof w.key, 'string', `${label}: ${cat} key`);
      assert.equal(typeof w.name, 'string', `${label}: ${cat} name`);
      assert.equal(typeof w.weight, 'number', `${label}: ${w.key} weight`);
    }
  }
  assert.ok(Array.isArray(st.log), `${label}: log`);
  for (const l of st.log) {
    assert.equal(typeof l.sessionKey, 'string', `${label}: log sessionKey`);
    assert.equal(typeof l.vol, 'number', `${label}: log vol`);
    assert.ok(l.week >= 1 && l.week <= 12, `${label}: log week`);
  }
  // Keys must be unique per category
  const keys = Object.values(st.working_weights).flat().map(w => w.key);
  assert.equal(keys.length, new Set(keys).size, `${label}: duplicate weight keys`);
}

test('defaultState matches the expected shape', () => {
  checkShape(defaultState(), 'defaultState');
});

test('data/state.json matches the expected shape', { skip: !existsSync(PATH) }, () => {
  checkShape(JSON.parse(readFileSync(PATH, 'utf8')), 'state.json');
});
