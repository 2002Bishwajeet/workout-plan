// ─────────────────────────────────────────────────────────────
// Weight editor — one mobile-first control, used in two places:
//   · the Weights tab cells (js/render/weights.js)
//   · the session exercise rows (js/render/session.js)
//
// Type a value on the numeric keypad, or nudge with − / + by the lift's
// `step` (matches the coaching rule: +2.5 upper / +5 lower). Every edit
// commits immediately through Store.update — no dependence on blur — so
// it works reliably on a phone. Editing a lift updates its single working
// weight (state.json is the source of truth); there is no per-session copy.
// ─────────────────────────────────────────────────────────────
import { Store, getWeight } from '../store.js';

// Per-lift step, falling back to 2.5 for any weight without an explicit one.
function stepFor(w) {
  return (typeof w.step === 'number' && w.step > 0) ? w.step : 2.5;
}

// Markup for one control bound to a working-weight object.
// BW lifts and read-only mode render a static value (no editor).
export function weightControlHTML(w) {
  if (!w) return '<span class="wedit-static tabular">— kg</span>';
  const unit = w.unit || 'kg';
  if (unit === 'BW') return '<span class="wedit-static">BW</span>';

  const val = (typeof w.weight === 'number') ? w.weight : 0;
  if (!Store.editable) {
    return `<span class="wedit-static tabular">${val || '—'}<span class="wedit-unit">${unit}</span></span>`;
  }
  return `<span class="wedit" data-wkey="${w.key}">`
    + `<button class="wedit-step" data-dir="-1" type="button" aria-label="Decrease ${w.name}">−</button>`
    + `<input class="wedit-input tabular" inputmode="decimal" enterkeyhint="done"`
    + ` aria-label="${w.name} weight" value="${val || ''}" placeholder="—" />`
    + `<span class="wedit-unit">${unit}</span>`
    + `<button class="wedit-step" data-dir="1" type="button" aria-label="Increase ${w.name}">+</button>`
    + `</span>`;
}

// Persist a new weight for `key` (clears the calibrate flag on first real value).
function commitWeight(key, raw) {
  const w = getWeight(key);
  if (!w) return;
  let v = parseFloat(raw);
  if (isNaN(v)) return;
  if (v < 0) v = 0;
  if (v === w.weight) return;
  const prev = w.weight;
  Store.update(s => {
    for (const cat of Object.values(s.working_weights)) {
      const found = cat.find(x => x.key === key);
      if (found) {
        found.weight = v;
        // Stamp the change so top-of-range streaks reset — confirmations
        // earned at the old load must not justify another step at the new one.
        found.changed_at = new Date().toISOString();
        if (found.calibrate) delete found.calibrate;
      }
    }
    // Progression journal for the Stats view, capped so state stays small.
    if (!s.weight_history) s.weight_history = [];
    s.weight_history.push({ date: new Date().toISOString(), key, name: w.name, from: prev || 0, to: v });
    if (s.weight_history.length > 200) s.weight_history.splice(0, s.weight_history.length - 200);
  }, `Update weight: ${w.name} ${prev || '—'} → ${v} kg`);
}

// Wire every .wedit control inside `root`. Called after each (re)render; the
// root's innerHTML is rebuilt each time, so old listeners are discarded with it.
export function bindWeightControls(root) {
  if (!root) return;
  root.querySelectorAll('.wedit').forEach(ctrl => {
    const key = ctrl.dataset.wkey;
    const input = ctrl.querySelector('.wedit-input');

    ctrl.querySelectorAll('.wedit-step').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const w = getWeight(key);
        if (!w) return;
        const dir = parseInt(btn.dataset.dir, 10);
        const base = (typeof w.weight === 'number') ? w.weight : 0;
        commitWeight(key, Math.max(0, base + dir * stepFor(w)));
      });
    });

    if (input) {
      // `change` fires on keypad-confirm and on blur — the reliable commit point.
      input.addEventListener('change', () => commitWeight(key, input.value));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
      });
      // Put the caret at the END on focus so typing appends, not prepends.
      input.addEventListener('focus', () => {
        const end = input.value.length;
        setTimeout(() => { try { input.setSelectionRange(end, end); } catch (_) {} }, 0);
      });
      input.addEventListener('click', (e) => e.stopPropagation());
    }
  });
}
