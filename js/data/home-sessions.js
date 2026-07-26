// ─────────────────────────────────────────────────────────────
// Home session variants — STATIC structure, one per session id.
// Equipment: one resistance band + bodyweight. These are fallbacks
// for days the gym isn't happening, not a progression track: high
// reps at RPE ~8 (a band demands reps, not load), no weightKeys, so
// nothing here touches working weights, tonnage, or top-of-range.
//
// Completing a home variant logs under the SAME sessionKey as its
// gym twin — week advancement and adherence treat it as the day done.
//
// Movement constraints (CLAUDE.md) respected: no squat pattern
// (barbell + goblet banned; lunges/BSS are the approved knee work),
// and no hinge substitute at all — RDLs, stiff-leg DLs and good
// mornings are banned, and a band can't replicate a heavy hinge, so
// home Pull is upper-pull volume only (deadlift counts as skipped).
// ─────────────────────────────────────────────────────────────

export const HOME_SESSIONS = {
  'push-1': {
    focus: 'Band + BW push volume · shoulders and triceps burn out on reps',
    rpe: '8',
    exercises: [
      { name: 'Pike Push-up',              sets: 4, reps: 'AMRAP-1', weight: 'BW', rpe: '8' },
      { name: 'Push-up (3s descent)',      sets: 4, reps: 'AMRAP-2', weight: 'BW', rpe: '8' },
      { name: 'Band Overhead Press',       sets: 3, reps: '12-15',   weight: '—',  rpe: '8' },
      { name: 'Band Chest Press',          sets: 3, reps: '12-15',   weight: '—',  rpe: '8' },
      { name: 'Band Lateral Raise',        sets: 3, reps: '15-20',   weight: '—',  rpe: '8' },
      { name: 'Band Tricep Pushdown',      sets: 3, reps: '12-15',   weight: '—',  rpe: '8' }
    ]
  },
  'pull-1': {
    focus: 'Band pull volume — no hinge substitute, deadlift counts as skipped',
    rpe: '8',
    exercises: [
      { name: 'Band Row',                  sets: 4, reps: '12-15',   weight: '—',  rpe: '8' },
      { name: 'Band Lat Pulldown',         sets: 4, reps: '12-15',   weight: '—',  rpe: '8' },
      { name: 'Band Face Pull',            sets: 3, reps: '15-20',   weight: '—',  rpe: '8' },
      { name: 'Band Pull-apart',           sets: 3, reps: '15-20',   weight: '—',  rpe: '7' },
      { name: 'Band Curl',                 sets: 3, reps: '12-15',   weight: '—',  rpe: '8' },
      { name: 'Band Hammer Curl',          sets: 3, reps: '12-15',   weight: '—',  rpe: '8' }
    ]
  },
  'legs-1': {
    focus: 'Single-leg BW work · band leg curls · calves and core',
    rpe: '8',
    exercises: [
      { name: 'Bulgarian Split Squat',     sets: 4, reps: '10-12/side', weight: 'BW', rpe: '8' },
      { name: 'Reverse Lunge',             sets: 3, reps: '12-15/side', weight: 'BW', rpe: '8' },
      { name: 'Band Leg Curl (lying)',     sets: 3, reps: '15-20',      weight: '—',  rpe: '8' },
      { name: 'Single-leg Glute Bridge',   sets: 3, reps: '12-15/side', weight: 'BW', rpe: '8' },
      { name: 'Single-leg Calf Raise',     sets: 4, reps: '15-20/side', weight: 'BW', rpe: '8' },
      { name: 'Lying Leg Raise',           sets: 3, reps: '15-20',      weight: 'BW', rpe: '8' }
    ]
  },
  'upper-1': {
    focus: 'Push-up variations · band pull balance · arms and core',
    rpe: '8',
    exercises: [
      { name: 'Decline Push-up',           sets: 4, reps: 'AMRAP-2', weight: 'BW', rpe: '8' },
      { name: 'Pike Push-up',              sets: 3, reps: 'AMRAP-1', weight: 'BW', rpe: '8' },
      { name: 'Band Row',                  sets: 4, reps: '12-15',   weight: '—',  rpe: '8' },
      { name: 'Band Curl',                 sets: 3, reps: '12-15',   weight: '—',  rpe: '8' },
      { name: 'Band Overhead Tricep Ext',  sets: 3, reps: '12-15',   weight: '—',  rpe: '8' },
      { name: 'Hollow Hold',               sets: 3, reps: '30-45s',  weight: 'BW', rpe: '8' }
    ]
  }
};

// Band-only prep for home sessions — no load ramp (nothing to ramp).
export const HOME_PREP = [
  'March in place · 2 min',
  'Band pull-apart · 15',
  'Band dislocates · 10',
  'Bodyweight lunge · 8 / side'
];
