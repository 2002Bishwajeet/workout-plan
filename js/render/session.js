import { Store, exerciseWeight, fmtWeight, getWeight } from '../store.js';
import { sessionsForWeek } from '../data/sessions.js';
import { blockForWeek } from '../data/programme.js';
import { WARMUPS, rampSets } from '../data/warmups.js';
import { primaryKeyFor, torStreak, suggestionFor, TOR_TARGET } from '../progression.js';
import { weightControlHTML, bindWeightControls } from '../ui/weight-editor.js';

let activeSession = null;
let _showView = null;

export function initSession(showViewFn) {
  _showView = showViewFn;

  document.getElementById('backBtn').addEventListener('click', () => _showView('dashboard'));

  document.getElementById('completeBtn').addEventListener('click', () => {
    if (!activeSession) return;
    const s = activeSession;
    const pad = n => String(n).padStart(2, '0');
    const startWeek = Store.state.current_week;

    // Sessions already logged for the week we're currently sitting on.
    const loggedKeys = new Set((Store.state.log || []).map(l => l.sessionKey));
    const coreDone = sessionsForWeek(startWeek)
      .filter(ws => !ws.optional)
      .every(ws => loggedKeys.has(`${startWeek}-${ws.id}`));

    // Skip-the-optional path: re-completing a session that's already logged,
    // once every REQUIRED day of the week is in, means you've started your next
    // training week — so this completion belongs to that next week and rolls
    // current_week forward. (Lets you skip Upper+ without ever getting stuck;
    // the core-done guard stops an accidental repeat from advancing early.)
    const startingNextWeek = coreDone && startWeek < 12
      && loggedKeys.has(`${startWeek}-${s.id}`);
    const week = startingNextWeek ? startWeek + 1 : startWeek;
    const key = `${week}-${s.id}`;

    const totalSets = s.exercises.reduce((a,e)=>a+e.sets,0);
    const totalVol = s.exercises.reduce((a,e) => {
      const w = exerciseWeight(e);
      if (typeof w !== 'number' || w === 0) return a;
      const reps = String(e.reps).match(/\d+/g);
      const r = reps ? (parseInt(reps[0]) + (reps[1] ? parseInt(reps[1]) : parseInt(reps[0]))) / 2 : 8;
      return a + (w * r * e.sets);
    }, 0);

    // Did-everything path: when this completion fills the last session of `week`
    // (Upper+ included), advance to the next week. Capped at the 12-week block.
    const after = new Set(loggedKeys); after.add(key);
    const finishing = week < 12
      && sessionsForWeek(week).every(ws => after.has(`${week}-${ws.id}`));
    const finalWeek = finishing ? week + 1 : week;
    const advanced = finalWeek !== startWeek;

    const msg = finishing
      ? `Complete session: ${s.title} (Wk ${pad(week)}) → Wk ${pad(finalWeek)}`
      : `Complete session: ${s.title} (Wk ${pad(week)})`;

    Store.update(st => {
      if (!st.log) st.log = [];
      // Move any mid-session top-of-range answers onto the log entry.
      const tor = st.tor && (st.tor[key] || st.tor[`${startWeek}-${s.id}`]);
      st.log.push({
        date: new Date().toISOString(),
        week, name: s.title, sessionId: s.id, sessionKey: key,
        sets: totalSets, vol: Math.round(totalVol),
        focus: s.focus,
        ...(tor ? { top_of_range: tor } : {})
      });
      if (st.in_progress) {
        delete st.in_progress[key];
        delete st.in_progress[`${startWeek}-${s.id}`];
      }
      if (st.tor) {
        delete st.tor[key];
        delete st.tor[`${startWeek}-${s.id}`];
      }
      if (st.current_week !== finalWeek) st.current_week = finalWeek;
    }, msg, { flush: true });

    const btn = document.getElementById('completeBtn');
    btn.textContent = finishing ? `Wk ${pad(week)} done → Wk ${pad(finalWeek)}`
                    : startingNextWeek ? `Week ${pad(week)} started`
                    : 'Logged ✓';
    btn.style.background = 'var(--rpe-low)';
    setTimeout(() => {
      btn.textContent = 'Complete Session';
      btn.style.background = '';
      _showView(advanced ? 'dashboard' : 'log');
    }, 900);
  });
}

export function getActiveSession() {
  return activeSession;
}

export function openSession(id) {
  const s = sessionsForWeek(Store.state.current_week).find(x => x.id === id);
  if (!s) return;
  activeSession = s;
  document.getElementById('sessionTitle').textContent = s.title;
  const wk = Store.state.current_week;
  document.getElementById('sessionMeta').textContent = `Block ${String(blockForWeek(wk)).padStart(2,'0')} · Week ${String(wk).padStart(2,'0')} · ${s.day}`;
  document.getElementById('sessionRpe').textContent = s.rpe;
  renderExerciseList();
  _showView('session');
}

// Display-only warm-up block above the work sets: general prep plus a
// ramp for the session's primary lift, computed from its working weight.
function warmupHTML(s) {
  const wu = WARMUPS[s.id];
  if (!wu) return '';
  const ww = getWeight(wu.rampKey);
  const ramp = ww ? rampSets(ww.weight, ww.step || 2.5) : [];
  const rampLine = ramp.length
    ? `<div class="wu-ramp">
         <span class="label">Ramp · ${wu.rampLabel}</span>
         <span class="wu-ramp-sets mono tabular">${
           ramp.map(r => `${r.load} kg × ${r.reps}`).join(' → ')
         } → work sets</span>
       </div>`
    : '';
  return `
    <div class="warmup-block">
      <div class="wu-head">
        <span class="label">Warm-up</span>
        <span class="wu-time mono">~5 min</span>
      </div>
      <div class="wu-items">${wu.prep.map(p => `<span class="wu-item">${p}</span>`).join('')}</div>
      ${rampLine}
    </div>`;
}

export function renderExerciseList() {
  if (!activeSession) return;
  const s = activeSession;
  const week = Store.state.current_week;
  const key = `${week}-${s.id}`;
  const doneArr = (Store.state.in_progress && Store.state.in_progress[key]) || [];
  const wrap = document.getElementById('exerciseList');
  const pk = primaryKeyFor(s.id, week);
  const torAnswers = (Store.state.tor && Store.state.tor[key]) || {};
  wrap.innerHTML = warmupHTML(s) + s.exercises.map((e, idx) => {
    const isDone = doneArr.includes(idx);
    const rpeCls = e.rpe.includes('9') ? 'rpe-9-plus' : (e.rpe.includes('8') && !e.rpe.startsWith('7') ? 'rpe-8-9' : 'rpe-7-8');
    const w = exerciseWeight(e);
    const weightDisplay = fmtWeight(w, w === 'BW' ? 'BW' : 'kg');
    const ww = e.weightKey ? getWeight(e.weightKey) : null;
    const calMark = e.cal ? ' <span class="badge badge-torch" style="margin-left:8px;">Cal</span>' : '';

    // Primary strength lift: streak badge + (once ticked) the one-tap
    // top-of-range prompt. Skippable — an unanswered prompt stores nothing.
    const isPrimary = pk && e.weightKey === pk;
    let torMark = '', torPrompt = '';
    if (isPrimary) {
      const streak = torStreak(Store.state.log, s.id, pk, ww && ww.changed_at);
      const sug = ww && suggestionFor(ww, streak);
      torMark = sug
        ? ` <span class="badge badge-torch" style="margin-left:8px;">${TOR_TARGET}/${TOR_TARGET} → ${sug.target} kg</span>`
        : ` <span class="badge" style="margin-left:8px;">Top ${Math.min(streak, TOR_TARGET)}/${TOR_TARGET}</span>`;
      if (isDone) {
        const ans = torAnswers[pk];
        torPrompt = ans === undefined
          ? `<div class="tor-prompt" data-key="${pk}" data-name="${e.name}">
               <span class="label">Top of rep range at target RPE?</span>
               <span class="tor-actions">
                 <button class="tor-btn" type="button" data-tor="1">Yes</button>
                 <button class="tor-btn" type="button" data-tor="0">No</button>
               </span>
             </div>`
          : `<div class="tor-prompt answered">
               <span class="label">Top of range · ${ans ? 'Yes' : 'No'}</span>
               <button class="tor-change" type="button" data-key="${pk}" data-name="${e.name}">Change</button>
             </div>`;
      }
    }
    return `
      <div class="exercise-row ${isDone ? 'done' : ''}" data-idx="${idx}">
        <div class="ex-num"><span>${String(idx+1).padStart(2,'0')}</span></div>
        <div>
          <div class="ex-name">${e.name}${calMark}${torMark}</div>
          <div class="ex-meta">${e.sets} sets · ${e.reps} reps</div>
        </div>
        <div class="ex-stat">${ww ? weightControlHTML(ww) : `<div class="v tabular">${weightDisplay}</div>`}<div class="k">Load</div></div>
        <div class="ex-stat"><div class="v tabular">${e.sets}×${e.reps}</div><div class="k">Vol</div></div>
        <div class="ex-rpe ${rpeCls}">RPE ${e.rpe}</div>
      </div>
      ${torPrompt}
    `;
  }).join('');
  wrap.querySelectorAll('.tor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const box = btn.closest('.tor-prompt');
      const yes = btn.dataset.tor === '1';
      Store.update(st => {
        if (!st.tor) st.tor = {};
        const m = st.tor[key] || {};
        m[box.dataset.key] = yes;
        st.tor[key] = m;
      }, `${yes ? 'Top of range' : 'Below range'}: ${box.dataset.name} (${s.title})`);
    });
  });
  wrap.querySelectorAll('.tor-change').forEach(btn => {
    btn.addEventListener('click', () => {
      Store.update(st => {
        if (st.tor && st.tor[key]) delete st.tor[key][btn.dataset.key];
      }, `Reset top-of-range: ${btn.dataset.name} (${s.title})`);
    });
  });
  wrap.querySelectorAll('.exercise-row .ex-num').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const row = ev.currentTarget.closest('.exercise-row');
      const idx = parseInt(row.dataset.idx);
      const exName = s.exercises[idx].name;
      Store.update(st => {
        if (!st.in_progress) st.in_progress = {};
        const arr = st.in_progress[key] || [];
        const i = arr.indexOf(idx);
        if (i >= 0) arr.splice(i, 1); else arr.push(idx);
        st.in_progress[key] = arr;
      }, `Tick: ${exName} (${s.title})`);
    });
  });
  bindWeightControls(wrap);
  const totalSets = s.exercises.reduce((a,e)=>a+e.sets,0);
  const totalVol = s.exercises.reduce((a,e) => {
    const w = exerciseWeight(e);
    if (typeof w !== 'number' || w === 0) return a;
    const reps = String(e.reps).match(/\d+/g);
    const r = reps ? (parseInt(reps[0]) + (reps[1] ? parseInt(reps[1]) : parseInt(reps[0]))) / 2 : 8;
    return a + (w * r * e.sets);
  }, 0);
  document.getElementById('totalSets').textContent = totalSets;
  document.getElementById('totalVolume').textContent = Math.round(totalVol).toLocaleString();
  document.getElementById('estTime').textContent = '~' + Math.min(75, Math.max(45, 35 + totalSets * 2));
}
