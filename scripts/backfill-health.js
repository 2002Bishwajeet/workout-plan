// ─────────────────────────────────────────────────────────────
// Backfill: one-off import of historical workouts from an Apple
// Health export (export.xml) into data/health/YYYY-MM.json files.
//
// The generated files match the schema the Worker's POST /health
// endpoint writes (worker/src/index.js): monthly arrays of
//   { start, end, type, duration_min, avg_hr, max_hr, active_kcal }
// keyed by the workout's START month, deduped by `start`, sorted.
// Files are committed manually — no Worker involvement.
//
// Usage:  node scripts/backfill-health.js path/to/export.xml [--dry-run]
//
// The export is often 100+ MB, so the file is streamed: workout
// elements are carved out of the chunk stream one at a time and the
// buffer never holds more than a single <Workout>…</Workout> block.
// Zero dependencies — stdlib only, matching the rest of the repo.
// ─────────────────────────────────────────────────────────────

import { createReadStream } from 'node:fs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Strength workouts only — both flavours count (see docs/shortcuts.md).
// Values match the type strings the iOS Shortcut sends to POST /health.
const STRENGTH_TYPES = {
  HKWorkoutActivityTypeTraditionalStrengthTraining: 'Traditional Strength Training',
  HKWorkoutActivityTypeFunctionalStrengthTraining: 'Functional Strength Training',
};

// ---------- streaming extraction ----------

// Incremental extractor: feed it chunks, get back complete Workout
// blocks (`<Workout …>…</Workout>` or self-closing `<Workout … />`).
// Everything before the next `<Workout ` is discarded, so memory stays
// bounded by the size of one workout element, not the file.
export function createWorkoutExtractor() {
  const OPEN = '<Workout ';
  const CLOSE = '</Workout>';
  let buf = '';
  return {
    push(chunk) {
      buf += chunk;
      const blocks = [];
      for (;;) {
        const open = buf.indexOf(OPEN);
        if (open === -1) {
          // Keep a tail in case `<Workout ` straddles two chunks
          if (buf.length > OPEN.length) buf = buf.slice(-OPEN.length);
          break;
        }
        const tagEnd = buf.indexOf('>', open);
        if (tagEnd === -1) { buf = buf.slice(open); break; }
        let end;
        if (buf[tagEnd - 1] === '/') {
          end = tagEnd + 1; // self-closing (older exports, no children)
        } else {
          const close = buf.indexOf(CLOSE, tagEnd);
          if (close === -1) { buf = buf.slice(open); break; }
          end = close + CLOSE.length;
        }
        blocks.push(buf.slice(open, end));
        buf = buf.slice(end);
      }
      return blocks;
    },
  };
}

// ---------- parsing / transform ----------

function xmlUnescape(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function parseAttrs(tag) {
  const attrs = {};
  const re = /([\w:]+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(tag))) attrs[m[1]] = xmlUnescape(m[2]);
  return attrs;
}

// Apple export dates look like `2026-06-01 17:30:00 +0530` → ISO 8601 UTC.
export function appleDateToISO(s) {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\s*([+-])(\d{2}):?(\d{2}))?$/
    .exec(s.trim());
  if (!m) {
    const t = Date.parse(s);
    return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 19) + 'Z';
  }
  const [, Y, Mo, D, H, Mi, S, sign, oh, om] = m;
  let ms = Date.UTC(+Y, Mo - 1, +D, +H, +Mi, +S);
  if (sign) {
    const off = (+oh * 60 + +om) * 60000;
    ms += sign === '+' ? -off : off; // +0530 means local is AHEAD of UTC
  }
  return new Date(ms).toISOString().slice(0, 19) + 'Z';
}

// One Workout block → a /health-shaped entry, or null when it isn't a
// strength workout (or lacks usable dates). Optional fields are omitted
// when the export doesn't carry them, matching the Worker's sanitizer.
export function workoutToEntry(block) {
  const openEnd = block.indexOf('>');
  if (openEnd === -1) return null;
  const attrs = parseAttrs(block.slice(0, openEnd + 1));
  const type = STRENGTH_TYPES[attrs.workoutActivityType];
  if (!type) return null;

  const start = appleDateToISO(attrs.startDate);
  const end = appleDateToISO(attrs.endDate);
  if (!start || !end) return null;

  const entry = { start, end, type };

  let dur = null;
  if (attrs.duration !== undefined && !Number.isNaN(+attrs.duration)) {
    const unit = attrs.durationUnit || 'min';
    if (unit === 'min') dur = +attrs.duration;
    else if (unit === 's' || unit === 'sec') dur = +attrs.duration / 60;
    else if (unit === 'hr') dur = +attrs.duration * 60;
  }
  if (dur == null) dur = (Date.parse(end) - Date.parse(start)) / 60000;
  entry.duration_min = Math.round(dur);

  // Recent exports carry summary stats as child WorkoutStatistics
  // elements; each is a single self-contained tag, so attrs suffice.
  const stats = [...block.matchAll(/<WorkoutStatistics\b[^>]*>/g)].map(x => parseAttrs(x[0]));
  const hr = stats.find(s => s.type === 'HKQuantityTypeIdentifierHeartRate');
  if (hr) {
    if (hr.average !== undefined && !Number.isNaN(+hr.average)) entry.avg_hr = Math.round(+hr.average);
    if (hr.maximum !== undefined && !Number.isNaN(+hr.maximum)) entry.max_hr = Math.round(+hr.maximum);
  }
  const energy = stats.find(s => s.type === 'HKQuantityTypeIdentifierActiveEnergyBurned');
  // Older exports put energy on the Workout tag itself (totalEnergyBurned)
  const kcal = energy?.sum ?? attrs.totalEnergyBurned;
  if (kcal !== undefined && !Number.isNaN(+kcal)) entry.active_kcal = Math.round(+kcal);

  return entry;
}

// ---------- month files ----------

// Files are keyed by the workout's START month (UTC), same as the Worker.
export function groupByMonth(entries) {
  const byMonth = new Map();
  for (const e of entries) {
    const month = e.start.slice(0, 7); // YYYY-MM
    if (!byMonth.has(month)) byMonth.set(month, []);
    byMonth.get(month).push(e);
  }
  return byMonth;
}

// Merge into an existing monthly array: dedupe by `start`, keep sorted —
// the same idempotent semantics as the Worker's POST /health.
export function mergeMonth(existing, fresh) {
  const entries = Array.isArray(existing) ? existing.slice() : [];
  const known = new Set(entries.map(w => w.start));
  let added = 0, skipped = 0;
  for (const w of fresh) {
    if (known.has(w.start)) { skipped++; continue; }
    known.add(w.start);
    entries.push(w);
    added++;
  }
  entries.sort((a, b) => (a.start < b.start ? -1 : 1));
  return { entries, added, skipped };
}

// ---------- CLI ----------

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const inputs = args.filter(a => a !== '--dry-run');
  if (inputs.length !== 1) {
    console.error('Usage: node scripts/backfill-health.js path/to/export.xml [--dry-run]');
    process.exit(1);
  }
  const xmlPath = inputs[0];
  if (!existsSync(xmlPath)) {
    console.error(`No such file: ${xmlPath}`);
    process.exit(1);
  }

  const extractor = createWorkoutExtractor();
  const entries = [];
  let scanned = 0;
  const stream = createReadStream(xmlPath, { encoding: 'utf8', highWaterMark: 1 << 20 });
  for await (const chunk of stream) {
    for (const block of extractor.push(chunk)) {
      scanned++;
      const entry = workoutToEntry(block);
      if (entry) entries.push(entry);
    }
  }
  console.log(`Scanned ${scanned} workouts, ${entries.length} strength (Traditional + Functional)`);

  const healthDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'health');
  if (!dryRun) await mkdir(healthDir, { recursive: true });

  let totalAdded = 0, totalSkipped = 0;
  for (const [month, fresh] of [...groupByMonth(entries)].sort()) {
    const file = path.join(healthDir, `${month}.json`);
    let existing = [];
    if (existsSync(file)) {
      try { existing = JSON.parse(await readFile(file, 'utf8')); } catch { existing = []; }
      if (!Array.isArray(existing)) existing = [];
    }
    const { entries: merged, added, skipped } = mergeMonth(existing, fresh);
    totalAdded += added;
    totalSkipped += skipped;
    if (added && !dryRun) {
      // Same serialisation the Worker commits, so files stay byte-consistent
      await writeFile(file, JSON.stringify(merged, null, 2));
    }
    console.log(
      `data/health/${month}.json  ${added} added, ${skipped} duplicate${skipped === 1 ? '' : 's'} skipped` +
      ` (${merged.length} total)`
    );
  }
  console.log(`Done: ${totalAdded} added, ${totalSkipped} duplicates skipped across ${groupByMonth(entries).size} month file(s)`);
  if (dryRun) console.log('Dry run — nothing written.');
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) main().catch(err => { console.error(err.message || err); process.exit(1); });
