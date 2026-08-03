// ─────────────────────────────────────────────────────────────
// Apple Watch workouts, read-only in the client.
// The Worker's POST /health appends watch workouts to
// data/health/YYYY-MM.json; the repo is public, so the client reads
// those files straight from the GitHub contents API — same pattern as
// js/render/checkins.js. No credentials, one fetch per page load,
// quiet failure. This module NEVER writes health files and never
// touches Store state.
//
// Matching is pure and DOM-free (tested in tests/health.test.mjs):
// a log entry has a single completion timestamp, a watch workout has
// a start–end window. Overlap (timestamp inside the window) wins;
// otherwise the nearest window on the same calendar day.
// ─────────────────────────────────────────────────────────────
import { REPO } from './config.js';

const LIST_URL = `https://api.github.com/repos/${REPO}/contents/data/health`;

// ---- pure matching ----

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

// A logged session is always a gym session, so only a strength workout can
// belong to one. Without this filter the widened import lets a same-day bike
// ride claim a Push session and render the ride's heart rate as the session's.
const SESSION_TYPES = new Set([
  'Traditional Strength Training',
  'Functional Strength Training',
]);

// Best watch workout for a log entry: 0-distance when the entry's
// timestamp falls inside a workout's start–end window, else the gap to
// the nearest window edge — but only windows sharing a calendar day
// with the entry are eligible. Returns null when nothing qualifies.
export function matchWorkout(entryDate, workouts) {
  const t = new Date(entryDate);
  if (isNaN(t)) return null;
  let best = null;
  let bestDist = Infinity;
  for (const w of workouts || []) {
    if (!SESSION_TYPES.has(w.type)) continue;
    const s = new Date(w.start);
    const e = new Date(w.end);
    if (isNaN(s) || isNaN(e)) continue;
    const dist = (t >= s && t <= e) ? 0 : Math.min(Math.abs(t - s), Math.abs(t - e));
    if (dist > 0 && !sameDay(t, s) && !sameDay(t, e)) continue;
    if (dist < bestDist) { best = w; bestDist = dist; }
  }
  return best;
}

// Every workout no logged session claimed, newest first. The Log renders
// these as their own rows; without the exclusion a session's own watch
// workout would appear twice — once as stats on the session, once as a
// standalone row. Pure, like matchWorkout: both inputs are parameters.
export function unmatchedWorkouts(log, workouts) {
  const all = workouts || [];
  const claimed = new Set();
  for (const entry of log || []) {
    const w = matchWorkout(entry.date, all);
    if (w) claimed.add(w.start);
  }
  return all
    .filter(w => !claimed.has(w.start))
    .sort((a, b) => (a.start < b.start ? 1 : -1));
}

// ---- loader (fetch once, cache in memory, never retry a failure) ----

let workouts = null;   // flattened across all monthly files, or null until loaded
let fetching = false;
let failed = false;    // API said no — don't hammer it on every render
const onLoad = [];     // render callbacks to fire once data actually arrives

export function healthWorkouts() {
  return workouts;
}

// Kick off the one fetch if it hasn't happened yet. `onReady` is called
// only if workouts arrive and there are any — absence stays silent and
// the views render exactly as they do today.
export function ensureHealthLoaded(onReady) {
  if (workouts !== null) return;
  if (onReady && !onLoad.includes(onReady)) onLoad.push(onReady);
  if (fetching || failed) return;
  fetching = true;
  (async () => {
    const res = await fetch(LIST_URL);
    if (res.status === 404) { workouts = []; return; } // data/health/ doesn't exist yet
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list = await res.json();
    const files = (Array.isArray(list) ? list : [])
      .filter(f => /^\d{4}-\d{2}\.json$/.test(f.name));
    const bodies = await Promise.all(files.map(f =>
      fetch(f.download_url).then(r => (r.ok ? r.json() : []))
    ));
    workouts = bodies.flat().filter(w => w && w.start && w.end);
  })()
    .then(() => {
      if (workouts && workouts.length) onLoad.splice(0).forEach(cb => cb());
    })
    .catch(() => { failed = true; })
    .finally(() => { fetching = false; });
}
