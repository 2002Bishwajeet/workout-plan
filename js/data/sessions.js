// ─────────────────────────────────────────────────────────────
// 12-week PPL programme — STATIC structure only.
// Mutable working weights live in data/state.json (see js/data/default-state.js).
// Weeks share a block skeleton; load progresses via working weights,
// not by editing these definitions.
//   Block 1 (Volume Base)     → weeks 1–4   · RPE 7–8
//   Block 2 (Intensification) → weeks 5–8   · RPE 8–8.5
//   Block 3 (Strength Peak)   → weeks 9–11  · RPE 8.5–9
//   Block 4 (Deload)          → week 12     · RPE 6–7
// Bodyweight movements use literal weight:'BW' (exerciseWeight() returns only
// the number, so a weightKey on a BW/0 weight would render "— kg"). Only the
// dip is weightKey-tracked, because it gets loaded from Block 2.
// ─────────────────────────────────────────────────────────────

// ===== BLOCK 1 — Volume Base (weeks 1–4) =====
const B1_PUSH = { id: 'push-1', day: 'Day 01 · Mon', title: 'Push', focus: 'Bench primary · vertical press · lateral volume', rpe: '7 — 8',
  exercises: [
    { name: 'Barbell Bench Press',   sets: 4, reps: '6-8',     weightKey: 'bench',      rpe: '7-8' },
    { name: 'Incline Barbell Press', sets: 3, reps: '8-10',    weightKey: 'incline_bb', rpe: '7-8' },
    { name: 'Machine Chest Press',   sets: 3, reps: '10-12',   weight: '—',             rpe: '7' },
    { name: 'Dumbbell OHP',          sets: 3, reps: '8-10',    weightKey: 'ohp',        rpe: '7-8' },
    { name: 'Lateral Raise (DB)',    sets: 3, reps: '12-15',   weightKey: 'lat_raise',  rpe: '7-8' },
    { name: 'Tricep Pushdown',       sets: 3, reps: '10-12',   weightKey: 'tri_pd',     rpe: '7-8' },
    { name: 'Pike Push-up',          sets: 3, reps: 'AMRAP-1', weight: 'BW',            rpe: '8' }
  ]};
const B1_PULL = { id: 'pull-1', day: 'Day 02 · Tue', title: 'Pull', focus: 'Deadlift primary · vertical + horizontal volume', rpe: '7 — 8',
  exercises: [
    { name: 'Conventional Deadlift', sets: 4, reps: '5',       weightKey: 'deadlift',   rpe: '7-8' },
    { name: 'Pull-up',               sets: 4, reps: 'AMRAP-1', weight: 'BW',            rpe: '8' },
    { name: 'Chest Supported Row',   sets: 3, reps: '8-10',    weight: '—',             rpe: '7-8' },
    { name: 'Lat Pulldown (neutral)',sets: 3, reps: '10-12',   weightKey: 'pulldown',   rpe: '7' },
    { name: 'Face Pull',             sets: 3, reps: '12-15',   weight: '—',             rpe: '7' },
    { name: 'Barbell Curl',          sets: 3, reps: '8-10',    weightKey: 'bb_curl',    rpe: '7-8' },
    { name: 'Hammer Curl',           sets: 3, reps: '10-12',   weight: '—',             rpe: '7' }
  ]};
const B1_LEGS = { id: 'legs-1', day: 'Day 03 · Thu', title: 'Legs', focus: 'Quad + posterior volume · calf + core', rpe: '7 — 8',
  exercises: [
    { name: 'Hack Squat',            sets: 4, reps: '6-8',     weightKey: 'hack_sq',    rpe: '7-8' },
    { name: 'Bulgarian Split Squat', sets: 3, reps: '8-10',    weightKey: 'bss',        rpe: '7-8' },
    { name: 'Leg Press',             sets: 3, reps: '10-12',   weightKey: 'leg_press',  rpe: '7' },
    { name: 'Leg Curl (lying)',      sets: 3, reps: '10-12',   weightKey: 'leg_curl',   rpe: '7-8' },
    { name: 'Cable Pull Through',    sets: 3, reps: '12-15',   weight: '—',             rpe: '7' },
    { name: 'Standing Calf Raise',   sets: 4, reps: '10-12',   weight: '—',             rpe: '8' },
    { name: 'Hanging Leg Raise',     sets: 3, reps: '10-15',   weight: 'BW',            rpe: '7-8' }
  ]};
// Week 1 only: legs is the calibration session.
const B1_LEGS_CAL = { ...B1_LEGS,
  focus: 'Calibration · hack squat, BSS, leg press starting weights',
  exercises: B1_LEGS.exercises.map(e =>
    ['hack_sq','bss','leg_press'].includes(e.weightKey) ? { ...e, cal: true } : e) };
const B1_UPPER = { id: 'upper-1', day: 'Day 04 · Sat', title: 'Upper +', focus: 'Bench top-set + back-offs · dip + pull-up volume', rpe: '8',
  exercises: [
    { name: 'Bench Press (top set)', sets: 1, reps: '5',       weightKey: 'bench',      rpe: '8' },
    { name: 'Bench (back-offs)',     sets: 3, reps: '8',       weight: 65,              rpe: '7' },
    { name: 'Dip',                   sets: 3, reps: '6-8',     weight: 'BW',            rpe: '8' },
    { name: 'Pull-up',               sets: 4, reps: 'AMRAP-1', weight: 'BW',            rpe: '8' },
    { name: 'Incline DB Curl',       sets: 3, reps: '10-12',   weight: '—',             rpe: '7' },
    { name: 'Overhead Tricep Ext',   sets: 3, reps: '10-12',   weight: '—',             rpe: '7' },
    { name: 'Ab Wheel',              sets: 3, reps: 'AMRAP-1', weight: 'BW',            rpe: '8' }
  ]};

// ===== BLOCK 2 — Intensification (weeks 5–8) =====
const B2_PUSH = { id: 'push-1', day: 'Day 01 · Mon', title: 'Push', focus: 'Bench strength · pressing intensity · deficit pike', rpe: '8 — 8.5',
  exercises: [
    { name: 'Barbell Bench Press',   sets: 4, reps: '5-6',     weightKey: 'bench',      rpe: '8' },
    { name: 'Incline Barbell Press', sets: 4, reps: '6-8',     weightKey: 'incline_bb', rpe: '8' },
    { name: 'Machine Chest Press',   sets: 3, reps: '8-10',    weight: '—',             rpe: '8' },
    { name: 'Dumbbell OHP',          sets: 3, reps: '6-8',     weightKey: 'ohp',        rpe: '8' },
    { name: 'Lateral Raise (DB)',    sets: 3, reps: '12-15',   weightKey: 'lat_raise',  rpe: '8' },
    { name: 'Tricep Pushdown',       sets: 3, reps: '8-10',    weightKey: 'tri_pd',     rpe: '8' },
    { name: 'Deficit Pike Push-up',  sets: 3, reps: 'AMRAP-1', weight: 'BW',            rpe: '8.5' }
  ]};
const B2_PULL = { id: 'pull-1', day: 'Day 02 · Tue', title: 'Pull', focus: 'Heavy deadlift · pull-up density · row volume', rpe: '8 — 8.5',
  exercises: [
    { name: 'Conventional Deadlift', sets: 4, reps: '4-5',     weightKey: 'deadlift',   rpe: '8' },
    { name: 'Pull-up',               sets: 5, reps: 'AMRAP-1', weight: 'BW',            rpe: '8.5' },
    { name: 'Chest Supported Row',   sets: 4, reps: '6-8',     weight: '—',             rpe: '8' },
    { name: 'Lat Pulldown (neutral)',sets: 3, reps: '8-10',    weightKey: 'pulldown',   rpe: '8' },
    { name: 'Face Pull',             sets: 3, reps: '15',      weight: '—',             rpe: '7' },
    { name: 'Barbell Curl',          sets: 3, reps: '6-8',     weightKey: 'bb_curl',    rpe: '8' },
    { name: 'Hammer Curl',           sets: 3, reps: '8-10',    weight: '—',             rpe: '8' }
  ]};
const B2_LEGS = { id: 'legs-1', day: 'Day 03 · Thu', title: 'Legs', focus: 'Hack squat + leg press intensity · posterior chain', rpe: '8 — 8.5',
  exercises: [
    { name: 'Hack Squat',            sets: 4, reps: '6-8',     weightKey: 'hack_sq',    rpe: '8' },
    { name: 'Bulgarian Split Squat', sets: 3, reps: '8-10',    weightKey: 'bss',        rpe: '8' },
    { name: 'Leg Press',             sets: 4, reps: '8-10',    weightKey: 'leg_press',  rpe: '8' },
    { name: 'Leg Curl (seated)',     sets: 3, reps: '8-10',    weightKey: 'leg_curl',   rpe: '8' },
    { name: 'Cable Pull Through',    sets: 3, reps: '12-15',   weight: '—',             rpe: '7' },
    { name: 'Standing Calf Raise',   sets: 4, reps: '8-10',    weight: '—',             rpe: '8' },
    { name: 'Hanging Leg Raise',     sets: 3, reps: '12-15',   weight: 'BW',            rpe: '8' }
  ]};
const B2_UPPER = { id: 'upper-1', day: 'Day 04 · Sat', title: 'Upper +', focus: 'Bench intensity · weighted dip primary · pull volume', rpe: '8 — 8.5',
  exercises: [
    { name: 'Bench Press (top set)', sets: 1, reps: '4-5',     weightKey: 'bench',      rpe: '8.5' },
    { name: 'Bench (back-offs)',     sets: 3, reps: '6',       weight: 65,              rpe: '8' },
    { name: 'Weighted Dip',          sets: 4, reps: '6-8',     weightKey: 'dip',        rpe: '8' },
    { name: 'Pull-up',               sets: 4, reps: 'AMRAP-1', weight: 'BW',            rpe: '8.5' },
    { name: 'Incline DB Curl',       sets: 3, reps: '8-10',    weight: '—',             rpe: '8' },
    { name: 'Overhead Tricep Ext',   sets: 3, reps: '10-12',   weight: '—',             rpe: '7' },
    { name: 'Ab Wheel',              sets: 3, reps: 'AMRAP-1', weight: 'BW',            rpe: '8' }
  ]};

// ===== BLOCK 3 — Strength Peak (weeks 9–11) =====
const B3_PUSH = { id: 'push-1', day: 'Day 01 · Mon', title: 'Push', focus: 'Heavy bench · low-rep press · pike test (wk11)', rpe: '8.5 — 9',
  exercises: [
    { name: 'Barbell Bench Press',   sets: 3, reps: '3-5',     weightKey: 'bench',      rpe: '8.5-9' },
    { name: 'Incline Barbell Press', sets: 3, reps: '5-6',     weightKey: 'incline_bb', rpe: '8.5' },
    { name: 'Machine Chest Press',   sets: 3, reps: '8-10',    weight: '—',             rpe: '8' },
    { name: 'Dumbbell OHP',          sets: 3, reps: '5-6',     weightKey: 'ohp',        rpe: '8.5' },
    { name: 'Lateral Raise (DB)',    sets: 3, reps: '12-15',   weightKey: 'lat_raise',  rpe: '8' },
    { name: 'Tricep Pushdown',       sets: 3, reps: '8-10',    weightKey: 'tri_pd',     rpe: '8' },
    { name: 'Pike Push-up',          sets: 3, reps: 'AMRAP-1', weight: 'BW',            rpe: '9' }
  ]};
const B3_PULL = { id: 'pull-1', day: 'Day 02 · Tue', title: 'Pull', focus: 'Heavy deadlift triples · pull-up test · back strength', rpe: '8.5 — 9',
  exercises: [
    { name: 'Conventional Deadlift', sets: 3, reps: '3',       weightKey: 'deadlift',   rpe: '8.5-9' },
    { name: 'Pull-up',               sets: 4, reps: 'AMRAP-1', weight: 'BW',            rpe: '9' },
    { name: 'Chest Supported Row',   sets: 3, reps: '6-8',     weight: '—',             rpe: '8.5' },
    { name: 'Lat Pulldown (neutral)',sets: 3, reps: '6-8',     weightKey: 'pulldown',   rpe: '8' },
    { name: 'Face Pull',             sets: 3, reps: '15',      weight: '—',             rpe: '7' },
    { name: 'Barbell Curl',          sets: 3, reps: '6-8',     weightKey: 'bb_curl',    rpe: '8.5' },
    { name: 'Hammer Curl',           sets: 3, reps: '8-10',    weight: '—',             rpe: '8' }
  ]};
const B3_LEGS = { id: 'legs-1', day: 'Day 03 · Thu', title: 'Legs', focus: 'Heavy hack squat · strength-biased lower', rpe: '8.5 — 9',
  exercises: [
    { name: 'Hack Squat',            sets: 4, reps: '5-6',     weightKey: 'hack_sq',    rpe: '8.5' },
    { name: 'Bulgarian Split Squat', sets: 3, reps: '6-8',     weightKey: 'bss',        rpe: '8' },
    { name: 'Leg Press',             sets: 3, reps: '8-10',    weightKey: 'leg_press',  rpe: '8' },
    { name: 'Leg Curl (lying)',      sets: 3, reps: '6-8',     weightKey: 'leg_curl',   rpe: '8.5' },
    { name: 'Cable Pull Through',    sets: 3, reps: '12-15',   weight: '—',             rpe: '7' },
    { name: 'Standing Calf Raise',   sets: 4, reps: '8-10',    weight: '—',             rpe: '8' },
    { name: 'Hanging Leg Raise',     sets: 3, reps: '12-15',   weight: 'BW',            rpe: '8' }
  ]};
const B3_UPPER = { id: 'upper-1', day: 'Day 04 · Sat', title: 'Upper +', focus: 'Bench peak · weighted dip · calisthenic tests', rpe: '8.5 — 9',
  exercises: [
    { name: 'Bench Press (top set)', sets: 1, reps: '3',       weightKey: 'bench',      rpe: '9' },
    { name: 'Bench (back-offs)',     sets: 3, reps: '5',       weight: 65,              rpe: '8.5' },
    { name: 'Weighted Dip',          sets: 4, reps: '5-6',     weightKey: 'dip',        rpe: '8.5' },
    { name: 'Pull-up',               sets: 4, reps: 'AMRAP-1', weight: 'BW',            rpe: '9' },
    { name: 'Incline DB Curl',       sets: 3, reps: '8-10',    weight: '—',             rpe: '8' },
    { name: 'Overhead Tricep Ext',   sets: 3, reps: '10-12',   weight: '—',             rpe: '8' },
    { name: 'Ab Wheel',              sets: 3, reps: 'AMRAP-1', weight: 'BW',            rpe: '8.5' }
  ]};

// ===== BLOCK 4 — Deload (week 12) =====
const B4_PUSH = { id: 'push-1', day: 'Day 01 · Mon', title: 'Push', focus: 'Deload · technique · ~50% volume', rpe: '6 — 7',
  exercises: [
    { name: 'Barbell Bench Press',   sets: 3, reps: '5',       weightKey: 'bench',      rpe: '6-7' },
    { name: 'Incline Barbell Press', sets: 2, reps: '8',       weightKey: 'incline_bb', rpe: '6' },
    { name: 'Machine Chest Press',   sets: 2, reps: '10',      weight: '—',             rpe: '6' },
    { name: 'Lateral Raise (DB)',    sets: 2, reps: '12',      weightKey: 'lat_raise',  rpe: '6' },
    { name: 'Pike Push-up',          sets: 2, reps: 'submax',  weight: 'BW',            rpe: '6' }
  ]};
const B4_PULL = { id: 'pull-1', day: 'Day 02 · Tue', title: 'Pull', focus: 'Deload · light pulls · movement quality', rpe: '6 — 7',
  exercises: [
    { name: 'Conventional Deadlift', sets: 3, reps: '3',       weightKey: 'deadlift',   rpe: '6-7' },
    { name: 'Pull-up',               sets: 3, reps: 'submax',  weight: 'BW',            rpe: '6' },
    { name: 'Chest Supported Row',   sets: 2, reps: '10',      weight: '—',             rpe: '6' },
    { name: 'Lat Pulldown (neutral)',sets: 2, reps: '12',      weightKey: 'pulldown',   rpe: '6' },
    { name: 'Face Pull',             sets: 2, reps: '15',      weight: '—',             rpe: '6' }
  ]};
const B4_LEGS = { id: 'legs-1', day: 'Day 03 · Thu', title: 'Legs', focus: 'Deload · light lower · mobility', rpe: '6 — 7',
  exercises: [
    { name: 'Hack Squat',            sets: 3, reps: '8',       weightKey: 'hack_sq',    rpe: '6' },
    { name: 'Bulgarian Split Squat', sets: 2, reps: '10',      weightKey: 'bss',        rpe: '6' },
    { name: 'Leg Curl (lying)',      sets: 2, reps: '10',      weightKey: 'leg_curl',   rpe: '6' },
    { name: 'Standing Calf Raise',   sets: 2, reps: '12',      weight: '—',             rpe: '6' },
    { name: 'Hanging Leg Raise',     sets: 2, reps: '12',      weight: 'BW',            rpe: '6' }
  ]};
const B4_UPPER = { id: 'upper-1', day: 'Day 04 · Sat', title: 'Upper +', focus: 'Deload · light upper · prep next cycle', rpe: '6 — 7',
  exercises: [
    { name: 'Bench Press',           sets: 3, reps: '5',       weightKey: 'bench',      rpe: '6' },
    { name: 'Dip',                   sets: 2, reps: '8',       weight: 'BW',            rpe: '6' },
    { name: 'Pull-up',               sets: 2, reps: 'submax',  weight: 'BW',            rpe: '6' },
    { name: 'Incline DB Curl',       sets: 2, reps: '12',      weight: '—',             rpe: '6' },
    { name: 'Ab Wheel',              sets: 2, reps: '10',      weight: 'BW',            rpe: '6' }
  ]};

const BLOCK1_W1 = [B1_PUSH, B1_PULL, B1_LEGS_CAL, B1_UPPER];   // week 1 = calibration legs
const BLOCK1    = [B1_PUSH, B1_PULL, B1_LEGS,     B1_UPPER];   // weeks 2–4
const BLOCK2    = [B2_PUSH, B2_PULL, B2_LEGS,     B2_UPPER];
const BLOCK3    = [B3_PUSH, B3_PULL, B3_LEGS,     B3_UPPER];
const DELOAD    = [B4_PUSH, B4_PULL, B4_LEGS,     B4_UPPER];

export const SESSIONS = {
  1: BLOCK1_W1, 2: BLOCK1, 3: BLOCK1, 4: BLOCK1,
  5: BLOCK2, 6: BLOCK2, 7: BLOCK2, 8: BLOCK2,
  9: BLOCK3, 10: BLOCK3, 11: BLOCK3,
  12: DELOAD
};

// Returns the 4-session array for a given week (falls back to week 1).
export function sessionsForWeek(week) {
  return SESSIONS[week] || SESSIONS[1];
}
