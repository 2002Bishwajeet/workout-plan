import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createWorkoutExtractor,
  appleDateToISO,
  workoutToEntry,
  groupByMonth,
  mergeMonth,
} from '../scripts/backfill-health.js';

// Small slice of an Apple Health export: one full strength workout with
// HR + energy stats, one functional strength, one running workout (must
// be filtered out), one strength workout with no stats children, and a
// late-night workout whose +0530 offset moves it into the previous
// month once converted to UTC.
const FIXTURE = `<?xml version="1.0" encoding="UTF-8"?>
<HealthData locale="en_IN">
 <Record type="HKQuantityTypeIdentifierHeartRate" value="72"/>
 <Workout workoutActivityType="HKWorkoutActivityTypeTraditionalStrengthTraining" duration="64.51" durationUnit="min" sourceName="Bishwajeet&#8217;s Apple&#160;Watch" startDate="2026-06-01 17:30:00 +0530" endDate="2026-06-01 18:35:00 +0530">
  <MetadataEntry key="HKTimeZone" value="Asia/Kolkata"/>
  <WorkoutEvent type="HKWorkoutEventTypePause" date="2026-06-01 17:50:00 +0530"/>
  <WorkoutStatistics type="HKQuantityTypeIdentifierHeartRate" startDate="2026-06-01 17:30:00 +0530" endDate="2026-06-01 18:35:00 +0530" average="121.4" minimum="88" maximum="158.2" unit="count/min"/>
  <WorkoutStatistics type="HKQuantityTypeIdentifierActiveEnergyBurned" startDate="2026-06-01 17:30:00 +0530" endDate="2026-06-01 18:35:00 +0530" sum="410.23" unit="kcal"/>
 </Workout>
 <Workout workoutActivityType="HKWorkoutActivityTypeRunning" duration="30" durationUnit="min" startDate="2026-06-02 07:00:00 +0530" endDate="2026-06-02 07:30:00 +0530">
  <WorkoutStatistics type="HKQuantityTypeIdentifierHeartRate" average="150" maximum="175" unit="count/min"/>
 </Workout>
 <Workout workoutActivityType="HKWorkoutActivityTypeFunctionalStrengthTraining" duration="45" durationUnit="min" startDate="2026-06-03 18:00:00 +0530" endDate="2026-06-03 18:45:00 +0530">
  <WorkoutStatistics type="HKQuantityTypeIdentifierActiveEnergyBurned" sum="280" unit="kcal"/>
 </Workout>
 <Workout workoutActivityType="HKWorkoutActivityTypeTraditionalStrengthTraining" duration="40" durationUnit="min" startDate="2026-06-05 17:00:00 +0530" endDate="2026-06-05 17:40:00 +0530">
  <MetadataEntry key="HKIndoorWorkout" value="1"/>
 </Workout>
 <Workout workoutActivityType="HKWorkoutActivityTypeTraditionalStrengthTraining" duration="50" durationUnit="min" startDate="2026-06-01 02:00:00 +0530" endDate="2026-06-01 02:50:00 +0530">
  <WorkoutStatistics type="HKQuantityTypeIdentifierHeartRate" average="115" maximum="140" unit="count/min"/>
 </Workout>
</HealthData>
`;

function parseFixture(chunkSize = FIXTURE.length) {
  const ex = createWorkoutExtractor();
  const blocks = [];
  for (let i = 0; i < FIXTURE.length; i += chunkSize) {
    blocks.push(...ex.push(FIXTURE.slice(i, i + chunkSize)));
  }
  return blocks;
}

test('extractor finds every Workout block, ignores Record/WorkoutEvent', () => {
  const blocks = parseFixture();
  assert.equal(blocks.length, 5);
  assert.ok(blocks.every(b => b.startsWith('<Workout ') && b.endsWith('</Workout>')));
});

test('extractor is chunk-boundary safe (tiny chunks give same blocks)', () => {
  assert.deepEqual(parseFixture(7), parseFixture());
});

test('extractor handles self-closing Workout tags (older exports)', () => {
  const ex = createWorkoutExtractor();
  const blocks = ex.push(
    '<Workout workoutActivityType="HKWorkoutActivityTypeTraditionalStrengthTraining"' +
    ' duration="30" durationUnit="min" totalEnergyBurned="200" totalEnergyBurnedUnit="kcal"' +
    ' startDate="2025-11-10 18:00:00 +0530" endDate="2025-11-10 18:30:00 +0530"/>\n'
  );
  assert.equal(blocks.length, 1);
  const entry = workoutToEntry(blocks[0]);
  assert.deepEqual(entry, {
    start: '2025-11-10T12:30:00Z',
    end: '2025-11-10T13:00:00Z',
    type: 'Traditional Strength Training',
    duration_min: 30,
    active_kcal: 200, // falls back to the totalEnergyBurned attribute
  });
});

test('appleDateToISO converts +0530 offsets to UTC', () => {
  assert.equal(appleDateToISO('2026-06-01 17:30:00 +0530'), '2026-06-01T12:00:00Z');
  assert.equal(appleDateToISO('2026-06-01 02:00:00 +0530'), '2026-05-31T20:30:00Z');
  assert.equal(appleDateToISO('2026-06-01 12:00:00 -0700'), '2026-06-01T19:00:00Z');
  assert.equal(appleDateToISO(''), null);
  assert.equal(appleDateToISO('not a date'), null);
});

test('workoutToEntry maps a full strength workout to the /health schema', () => {
  const entries = parseFixture().map(workoutToEntry).filter(Boolean);
  assert.deepEqual(entries[0], {
    start: '2026-06-01T12:00:00Z',
    end: '2026-06-01T13:05:00Z',
    type: 'Traditional Strength Training',
    duration_min: 65,
    avg_hr: 121,
    max_hr: 158,
    active_kcal: 410,
  });
});

test('non-strength workouts are filtered, functional strength kept', () => {
  const entries = parseFixture().map(workoutToEntry).filter(Boolean);
  assert.equal(entries.length, 4); // running workout dropped
  assert.ok(entries.some(e => e.type === 'Functional Strength Training'));
  assert.ok(!entries.some(e => e.type && e.type.includes('Running')));
});

test('missing HR/energy stats are omitted, never null or NaN', () => {
  const entries = parseFixture().map(workoutToEntry).filter(Boolean);
  const bare = entries.find(e => e.start === '2026-06-05T11:30:00Z');
  assert.deepEqual(bare, {
    start: '2026-06-05T11:30:00Z',
    end: '2026-06-05T12:10:00Z',
    type: 'Traditional Strength Training',
    duration_min: 40,
  });
  assert.ok(!('avg_hr' in bare) && !('max_hr' in bare) && !('active_kcal' in bare));
});

test('files are keyed by START month in UTC — offset can shift the month', () => {
  const entries = parseFixture().map(workoutToEntry).filter(Boolean);
  const byMonth = groupByMonth(entries);
  // 2026-06-01 02:00 +0530 is 2026-05-31 in UTC → lands in the May file
  assert.deepEqual([...byMonth.keys()].sort(), ['2026-05', '2026-06']);
  assert.equal(byMonth.get('2026-05').length, 1);
  assert.equal(byMonth.get('2026-06').length, 3);
});

test('mergeMonth dedupes by start, keeps sorted, matches Worker semantics', () => {
  const existing = [
    { start: '2026-06-01T12:00:00Z', end: '2026-06-01T13:05:00Z', type: 'Traditional Strength Training' },
  ];
  const fresh = [
    { start: '2026-06-03T12:30:00Z', end: '2026-06-03T13:15:00Z', type: 'Functional Strength Training' },
    { start: '2026-06-01T12:00:00Z', end: '2026-06-01T13:05:00Z', type: 'Traditional Strength Training' }, // dup of existing
    { start: '2026-06-03T12:30:00Z', end: '2026-06-03T13:15:00Z', type: 'Functional Strength Training' }, // dup within batch
    { start: '2026-06-02T12:00:00Z', end: '2026-06-02T12:40:00Z', type: 'Traditional Strength Training' },
  ];
  const { entries, added, skipped } = mergeMonth(existing, fresh);
  assert.equal(added, 2);
  assert.equal(skipped, 2);
  assert.deepEqual(entries.map(e => e.start), [
    '2026-06-01T12:00:00Z',
    '2026-06-02T12:00:00Z',
    '2026-06-03T12:30:00Z',
  ]);
  // idempotent: merging the same batch again adds nothing
  const again = mergeMonth(entries, fresh);
  assert.equal(again.added, 0);
  assert.equal(again.skipped, 4);
  assert.deepEqual(again.entries, entries);
});
