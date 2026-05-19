export const PROGRAMME = {
  blocks: [
    { name: 'Volume Base',     weeks: [1,2,3,4],   rpe: '7 — 8',   focus: '4×6-8 strength compounds · 3×10-12 hypertrophy · pike push-ups' },
    { name: 'Intensification', weeks: [5,6,7,8],   rpe: '8 — 8.5', focus: 'Weighted pull-ups + weighted dips primary · deficit pike push-ups' },
    { name: 'Strength Peak',   weeks: [9,10,11],   rpe: '8.5 — 9', focus: 'Low-rep heavy work · calisthenics max-rep testing' },
    { name: 'Deload',          weeks: [12],        rpe: '6 — 7',   focus: '~50% volume · technique focus · prep for next cycle' }
  ]
};

export const WEEK_FOCUS = {
  1: 'Calibration', 2: 'Build', 3: 'Build', 4: 'Block 01 close',
  5: 'Intensify',   6: 'Intensify', 7: 'Intensify', 8: 'Block 02 close',
  9: 'Peak',       10: 'Peak',     11: 'Peak test',
  12: 'Deload'
};
