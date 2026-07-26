export function defaultState() {
  return {
    version: 1,
    athlete: 'Bishwajeet',
    current_block: 1,
    current_week: 1,
    working_weights: {
      push: [
        { key: 'bench',         name: 'Bench Press',         weight: 77, unit: 'kg', step: 2.5 },
        { key: 'incline_bb',    name: 'Incline BB Press',    weight: 45, unit: 'kg', step: 2.5 },
        { key: 'ohp',           name: 'OHP',                 weight: 35, unit: 'kg', step: 2.5 },
        { key: 'lat_raise',     name: 'Lateral Raise',       weight: 10, unit: 'kg', step: 2.5 },
        { key: 'machine_press', name: 'Machine Chest Press', weight: 0,  unit: 'kg', step: 5 },
        { key: 'bench_bo',      name: 'Bench Back-off',      weight: 65, unit: 'kg', step: 2.5 }
      ],
      pull: [
        { key: 'deadlift',  name: 'Deadlift',           weight: 140, unit: 'kg', step: 5 },
        { key: 'pulldown',  name: 'Lat Pulldown',       weight: 65,  unit: 'kg', step: 5 },
        { key: 'pullup',    name: 'Pull-up',            weight: 0,   unit: 'BW' },
        { key: 'cs_row',    name: 'Chest Supported Row',weight: 0,   unit: 'kg', step: 5 },
        { key: 'face_pull', name: 'Face Pull',          weight: 0,   unit: 'kg', step: 2.5 },
        { key: 'hammer',    name: 'Hammer Curl',        weight: 0,   unit: 'kg', step: 2.5 }
      ],
      legs: [
        { key: 'leg_press', name: 'Leg Press',         weight: 0,  unit: 'kg', step: 5,   calibrate: true },
        { key: 'bss',       name: 'BSS',               weight: 0,  unit: 'kg', step: 2.5, calibrate: true },
        { key: 'leg_ext',   name: 'Leg Extension',     weight: 0,  unit: 'kg', step: 5,   calibrate: true },
        { key: 'leg_curl',  name: 'Leg Curl',          weight: 65, unit: 'kg', step: 5 },
        { key: 'calf',      name: 'Standing Calf Raise',weight: 0, unit: 'kg', step: 5 }
      ],
      acc: [
        { key: 'bb_curl',         name: 'BB Curl',             weight: 25, unit: 'kg', step: 2.5 },
        { key: 'tri_pd',          name: 'Tricep Pushdown',     weight: 20, unit: 'kg', step: 2.5 },
        { key: 'dip',             name: 'Dip',                 weight: 0,  unit: 'BW' },
        { key: 'incline_db_curl', name: 'Incline DB Curl',     weight: 0,  unit: 'kg', step: 2.5 },
        { key: 'oh_tri',          name: 'Overhead Tricep Ext', weight: 0,  unit: 'kg', step: 2.5 },
        { key: 'cable_crunch',    name: 'Cable Crunch',        weight: 0,  unit: 'kg', step: 5 }
      ]
    },
    in_progress: {},
    tor: {},
    weight_history: [],
    log: [],
    updated_at: null
  };
}
