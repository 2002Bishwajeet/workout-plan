// ─────────────────────────────────────────────────────────────
// Warm-up protocols — STATIC structure, one per session id.
// Display-only: items are not tickable and never count toward
// sets/volume. Ramp-up loads are computed live from working
// weights (data/state.json) — nothing here hardcodes a load.
// General prep stays ≤ 5 min to protect the 60-75 min cap.
// Movements respect the approved-exercise constraints (CLAUDE.md).
// ─────────────────────────────────────────────────────────────

export const WARMUPS = {
  'push-1': {
    prep: [
      'Bike or row · 3 min easy',
      'Band dislocates · 15',
      'Scap push-up · 10',
      'Band pull-apart · 15'
    ],
    rampKey: 'bench', rampLabel: 'Bench Press'
  },
  'pull-1': {
    prep: [
      'Bike or row · 3 min easy',
      'Glute bridge · 12',
      'Hinge drill (empty bar) · 10',
      'Dead hang · 30 s'
    ],
    rampKey: 'deadlift', rampLabel: 'Deadlift'
  },
  'legs-1': {
    prep: [
      'Bike · 3 min easy',
      'Leg swing · 10 / side',
      'Bodyweight lunge · 8 / side',
      'Leg extension (light) · 15'
    ],
    rampKey: 'leg_press', rampLabel: 'Leg Press'
  },
  'upper-1': {
    prep: [
      'Row · 2 min easy',
      'Band pull-apart · 15',
      'Scap pull-up · 8',
      'Push-up · 10'
    ],
    rampKey: 'bench', rampLabel: 'Bench Press'
  }
};

// Ramp scheme for the session's primary lift: fast-rising, low-fatigue.
export const RAMP_SCHEME = [
  { pct: 0.4, reps: '5' },
  { pct: 0.6, reps: '3' },
  { pct: 0.8, reps: '1-2' }
];

// Loads for a given working weight, each rounded to the lift's step.
// Returns [] when there's no numeric weight to ramp from (BW, unset).
export function rampSets(weight, step = 2.5) {
  if (typeof weight !== 'number' || weight <= 0) return [];
  return RAMP_SCHEME.map(r => ({
    reps: r.reps,
    load: Math.max(step, Math.round((weight * r.pct) / step) * step)
  }));
}
