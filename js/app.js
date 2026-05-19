import { Store } from './store.js';
import { initStatus, setStatus } from './ui/status.js';
import { initSetupModal, openSetup } from './ui/setup-modal.js';
import { initDashboard, setDate, renderDashboardHero, renderWeekGrid } from './render/dashboard.js';
import { renderProgramme } from './render/programme.js';
import { renderWeights } from './render/weights.js';
import { renderLog } from './render/log.js';
import { initSession, openSession, renderExerciseList, getActiveSession } from './render/session.js';

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(name).classList.add('active');
  document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderAll() {
  setDate();
  if (!Store.state) return;
  renderDashboardHero();
  renderWeekGrid();
  renderWeights();
  renderProgramme();
  renderLog();
  if (getActiveSession()) renderExerciseList();
}

initStatus(Store);
Store.onRender = renderAll;
initDashboard(openSession);
initSession(showView);
initSetupModal(renderAll);

document.querySelectorAll('.nav button').forEach(b => {
  b.addEventListener('click', () => showView(b.dataset.view));
});

(async function boot() {
  setDate();
  document.getElementById('bootStatus').textContent = 'Checking config…';
  const cfg = Store.readConfig();
  if (!cfg) {
    openSetup();
    return;
  }
  Store.config = cfg;
  try {
    document.getElementById('bootStatus').textContent = 'Loading state…';
    await Store.load();
    renderAll();
    document.getElementById('boot').classList.add('hidden');
  } catch (e) {
    openSetup(e.message);
  }
})();
