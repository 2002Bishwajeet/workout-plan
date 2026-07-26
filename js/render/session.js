import { Store, exerciseWeight, fmtWeight, getWeight } from '../store.js';
import { sessionsForWeek } from '../data/sessions.js';
import { blockForWeek } from '../data/programme.js';
import { completionPlan, sessionVolume } from '../session-logic.js';
import { WARMUPS, rampSets } from '../data/warmups.js';
import { HOME_SESSIONS, HOME_PREP } from '../data/home-sessions.js';
import { primaryKeyFor, torStreak, suggestionFor, TOR_TARGET } from '../progression.js';
import { weightControlHTML, bindWeightControls } from '../ui/weight-editor.js';

let activeSession = null;
let _showView = null;
// Home mode swaps the exercise list for the band+BW variant. Ticks live under
// `${week}-${id}-home` so indices never collide with the gym list; completion
// logs the SAME sessionKey as the gym twin, so advancement/adherence just work.
let homeMode = false;

const homeVariant = s => HOME_SESSIONS[s.id] || null;
const activeExercises = s => (homeMode && homeVariant(s)) ? homeVariant(s).exercises : s.exercises;
const tickKey = (week, s) => homeMode ? `${week}-${s.id}-home` : `${week}-${s.id}`;

function setVariant(home) {
  const s = activeSession;
  if (!s) return;
  homeMode = home && !!homeVariant(s);
  document.getElementById('variantGym').classList.toggle('active', !homeMode);
  document.getElementById('variantHome').classList.toggle('active', homeMode);
  document.getElementById('sessionRpe').textContent = homeMode ? homeVariant(s).rpe : s.rpe;
  renderExerciseList();
}

export function initSession(showViewFn) {
  _showView = showViewFn;

  document.getElementById('backBtn').addEventListener('click', () => _showView('dashboard'));
  document.getElementById('variantGym').addEventListener('click', () => setVariant(false));
  document.getElementById('variantHome').addEventListener('click', () => setVariant(true));

  document.getElementById('completeBtn').addEventListener('click', () => {
    if (!activeSession) return;
    const s = activeSession;
    const pad = n => String(n).padStart(2, '0');
    const startWeek = Store.state.current_week;

    // Week attribution + advancement rules live in js/session-logic.js.
    const loggedKeys = new Set((Store.state.log || []).map(l => l.sessionKey));
    const { week, key, startingNextWeek, finishing, finalWeek } =
      completionPlan(startWeek, s, loggedKeys);
    const advanced = finalWeek !== startWeek;

    const exs = activeExercises(s);
    const totalSets = exs.reduce((a,e)=>a+e.sets,0);
    const totalVol = sessionVolume(exs, exerciseWeight);
    const title = homeMode ? `${s.title} (Home)` : s.title;
    const focus = homeMode ? homeVariant(s).focus : s.focus;

    const msg = finishing
      ? `Complete session: ${title} (Wk ${pad(week)}) → Wk ${pad(finalWeek)}`
      : `Complete session: ${title} (Wk ${pad(week)})`;

    Store.update(st => {
      if (!st.log) st.log = [];
      // Move any mid-session top-of-range answers onto the log entry —
      // gym only; a home completion must not carry gym rep-quality data.
      const tor = !homeMode && st.tor && (st.tor[key] || st.tor[`${startWeek}-${s.id}`]);
      st.log.push({
        date: new Date().toISOString(),
        week, name: title, sessionId: s.id, sessionKey: key,
        sets: totalSets, vol: Math.round(totalVol),
        focus,
        ...(tor ? { top_of_range: tor } : {}),
        ...(homeMode ? { variant: 'home' } : {})
      });
      if (st.in_progress) {
        delete st.in_progress[key];
        delete st.in_progress[`${startWeek}-${s.id}`];
        delete st.in_progress[`${week}-${s.id}-home`];
        delete st.in_progress[`${startWeek}-${s.id}-home`];
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
  // Resume in home mode when a home session is already in progress.
  const ip = Store.state.in_progress || {};
  const homeStarted = (ip[`${wk}-${s.id}-home`] || []).length > 0;
  const gymStarted = (ip[`${wk}-${s.id}`] || []).length > 0;
  setVariant(homeStarted && !gymStarted);
  _showView('session');
}

// Display-only warm-up block above the work sets: general prep plus a
// ramp for the session's primary lift, computed from its working weight.
function warmupHTML(s) {
  const wu = WARMUPS[s.id];
  if (!wu) return '';
  // Home: band-only prep, no load ramp (nothing to ramp).
  const prep = homeMode ? HOME_PREP : wu.prep;
  const ww = homeMode ? null : getWeight(wu.rampKey);
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
      <div class="wu-items">${prep.map(p => `<span class="wu-item">${p}</span>`).join('')}</div>
      ${rampLine}
    </div>`;
}

export function renderExerciseList() {
  if (!activeSession) return;
  const s = activeSession;
  const week = Store.state.current_week;
  const key = tickKey(week, s);
  const exs = activeExercises(s);
  const doneArr = (Store.state.in_progress && Store.state.in_progress[key]) || [];
  const wrap = document.getElementById('exerciseList');
  const pk = primaryKeyFor(s.id, week);
  const torAnswers = (Store.state.tor && Store.state.tor[key]) || {};
  wrap.innerHTML = warmupHTML(s) + exs.map((e, idx) => {
    const isDone = doneArr.includes(idx);
    const rpeCls = e.rpe.includes('9') ? 'rpe-9-plus' : (e.rpe.includes('8') && !e.rpe.startsWith('7') ? 'rpe-8-9' : 'rpe-7-8');
    const w = exerciseWeight(e);
    const weightDisplay = (homeMode && w === '—') ? 'Band' : fmtWeight(w, w === 'BW' ? 'BW' : 'kg');
    const ww = e.weightKey ? getWeight(e.weightKey) : null;
    const calMark = e.cal ? ' <span class="badge badge-torch" style="margin-left:8px;">Cal</span>' : '';

    // Primary strength lift: streak badge + (once ticked) the one-tap
    // top-of-range prompt. Skippable — an unanswered prompt stores nothing.
    // Home exercises carry no weightKey, so none of this fires in home mode.
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
      const exName = exs[idx].name;
      Store.update(st => {
        if (!st.in_progress) st.in_progress = {};
        const arr = st.in_progress[key] || [];
        const i = arr.indexOf(idx);
        if (i >= 0) arr.splice(i, 1); else arr.push(idx);
        st.in_progress[key] = arr;
      }, `Tick: ${exName} (${s.title}${homeMode ? ' · Home' : ''})`);
    });
  });
  bindWeightControls(wrap);
  const totalSets = exs.reduce((a,e)=>a+e.sets,0);
  const totalVol = sessionVolume(exs, exerciseWeight);
  document.getElementById('totalSets').textContent = totalSets;
  document.getElementById('totalVolume').textContent = Math.round(totalVol).toLocaleString();
  document.getElementById('estTime').textContent = '~' + Math.min(75, Math.max(45, 35 + totalSets * 2));
}
