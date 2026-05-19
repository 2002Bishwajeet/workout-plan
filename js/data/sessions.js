export const SESSIONS_W1 = [
  { id: 'push-1', day: 'Day 01 · Mon', title: 'Push', focus: 'Bench primary · vertical press · lateral volume', rpe: '7 — 8',
    exercises: [
      { name: 'Barbell Bench Press',  sets: 4, reps: '6-8',    weightKey: 'bench',   rpe: '7-8' },
      { name: 'Incline Barbell Press',sets: 3, reps: '8-10',   weightKey: 'incline_bb', rpe: '7-8' },
      { name: 'Machine Chest Press',  sets: 3, reps: '10-12',  weight: '—', rpe: '7' },
      { name: 'Dumbbell OHP',         sets: 3, reps: '8-10',   weightKey: 'ohp', rpe: '7-8' },
      { name: 'Lateral Raise (DB)',   sets: 3, reps: '12-15',  weightKey: 'lat_raise', rpe: '7-8' },
      { name: 'Tricep Pushdown',      sets: 3, reps: '10-12',  weightKey: 'tri_pd', rpe: '7-8' },
      { name: 'Pike Push-up',         sets: 3, reps: 'AMRAP-1',weight: 'BW', rpe: '8' }
    ]},
  { id: 'pull-1', day: 'Day 02 · Tue', title: 'Pull', focus: 'Deadlift primary · vertical + horizontal volume', rpe: '7 — 8',
    exercises: [
      { name: 'Conventional Deadlift',sets: 4, reps: '5',      weightKey: 'deadlift', rpe: '7-8' },
      { name: 'Pull-up',              sets: 4, reps: '6-8',    weight: 'BW', rpe: '8' },
      { name: 'Chest Supported Row',  sets: 3, reps: '8-10',   weight: '—', rpe: '7-8' },
      { name: 'Lat Pulldown (neutral)',sets: 3, reps: '10-12', weightKey: 'pulldown', rpe: '7' },
      { name: 'Face Pull',            sets: 3, reps: '12-15',  weight: '—', rpe: '7' },
      { name: 'Barbell Curl',         sets: 3, reps: '8-10',   weightKey: 'bb_curl', rpe: '7-8' },
      { name: 'Hammer Curl',          sets: 3, reps: '10-12',  weight: '—', rpe: '7' }
    ]},
  { id: 'legs-1', day: 'Day 03 · Thu', title: 'Legs', focus: 'Calibration · BSS, hack squat, leg press starting weights', rpe: '7 — 8',
    exercises: [
      { name: 'Hack Squat',           sets: 4, reps: '6-8',    weightKey: 'hack_sq', rpe: '7-8', cal: true },
      { name: 'Bulgarian Split Squat',sets: 3, reps: '8-10',   weightKey: 'bss', rpe: '7-8', cal: true },
      { name: 'Leg Press',            sets: 3, reps: '10-12',  weightKey: 'leg_press', rpe: '7', cal: true },
      { name: 'Leg Curl (lying)',     sets: 3, reps: '10-12',  weightKey: 'leg_curl', rpe: '7-8' },
      { name: 'Cable Pull Through',   sets: 3, reps: '12-15',  weight: '—', rpe: '7' },
      { name: 'Standing Calf Raise',  sets: 4, reps: '10-12',  weight: '—', rpe: '8' },
      { name: 'Hanging Leg Raise',    sets: 3, reps: '10-15',  weight: 'BW', rpe: '7-8' }
    ]},
  { id: 'upper-1', day: 'Day 04 · Sat', title: 'Upper +', focus: 'Bench top set + back-offs · weighted dip progression · push/pull volume', rpe: '8',
    exercises: [
      { name: 'Bench Press (top set)',sets: 1, reps: '5',      weightKey: 'bench', rpe: '8' },
      { name: 'Bench (back-offs)',    sets: 3, reps: '8',      weight: 65,   rpe: '7' },
      { name: 'Dip',                  sets: 3, reps: '6-8',    weight: 'BW', rpe: '8' },
      { name: 'Pull-up',              sets: 4, reps: 'AMRAP-1',weight: 'BW', rpe: '8' },
      { name: 'Incline DB Curl',      sets: 3, reps: '10-12',  weight: '—', rpe: '7' },
      { name: 'Overhead Tricep Ext',  sets: 3, reps: '10-12',  weight: '—', rpe: '7' },
      { name: 'Ab Wheel',             sets: 3, reps: 'AMRAP-1',weight: 'BW', rpe: '8' }
    ]}
];
