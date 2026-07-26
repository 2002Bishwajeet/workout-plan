// ─────────────────────────────────────────────────────────────
// Weekly check-ins (docs/checkins/*.md) rendered in-app.
// The repo is public, so the list and files come straight from the
// GitHub contents API — no Worker involvement, no credentials.
// Markdown rendering is a tiny hand-rolled subset (headings, bold,
// code, tables, lists, hr) matching what the check-in docs actually
// use — deliberately no markdown library (no-dependency rule).
// ─────────────────────────────────────────────────────────────
import { REPO } from '../config.js';

const LIST_URL = `https://api.github.com/repos/${REPO}/contents/docs/checkins`;

let files = null;      // [{ name, download_url }], newest first
let fetching = false;
let failed = false;    // don't refetch on every render once the API said no
const bodies = new Map(); // name → rendered HTML, filled lazily on expand

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(s) {
  return esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

export function mdToHTML(md) {
  const lines = md.split('\n');
  const out = [];
  let inList = false;
  let para = [];
  const flushPara = () => {
    if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; }
  };
  const closeList = () => { if (inList) { out.push('</ul>'); inList = false; } };

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];

    // table: header row followed by a |---|---| separator
    if (l.trim().startsWith('|') && lines[i + 1] && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      flushPara(); closeList();
      const cells = row => row.trim().replace(/^\||\|$/g, '').split('|').map(c => inline(c.trim()));
      const header = cells(l);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(cells(lines[i])); i++; }
      i--;
      out.push('<div class="ck-tablewrap"><table><thead><tr>'
        + header.map(h => `<th>${h}</th>`).join('')
        + '</tr></thead><tbody>'
        + rows.map(r => '<tr>' + r.map(c => `<td>${c}</td>`).join('') + '</tr>').join('')
        + '</tbody></table></div>');
      continue;
    }

    const h = l.match(/^(#{1,4})\s+(.*)/);
    if (h) {
      flushPara(); closeList();
      const level = Math.min(h[1].length + 2, 6); // md # → h3.., below the page's own headings
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      continue;
    }
    if (/^\s*---+\s*$/.test(l)) { flushPara(); closeList(); out.push('<hr>'); continue; }
    const li = l.match(/^\s*[-*]\s+(.*)/);
    if (li) {
      flushPara();
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${inline(li[1])}</li>`);
      continue;
    }
    if (!l.trim()) { flushPara(); closeList(); continue; }
    para.push(l.trim());
  }
  flushPara(); closeList();
  return out.join('\n');
}

function itemTitle(name) {
  const m = name.match(/week-(\d+)/);
  return m ? `Week ${m[1].padStart(2, '0')}` : name.replace(/\.md$/, '');
}

function renderList() {
  const wrap = document.getElementById('checkins');
  const meta = document.getElementById('ckMeta');
  if (!wrap) return;
  if (files === null) {
    meta.textContent = '—';
    wrap.innerHTML = '<div class="ck-empty">Couldn’t load check-ins — needs network access to GitHub.</div>';
    return;
  }
  meta.textContent = `${files.length} reviews`;
  wrap.innerHTML = files.map(f => `
    <div class="ck-item" data-name="${f.name}">
      <button class="ck-head" type="button">
        <span class="ck-title">${itemTitle(f.name)}</span>
        <span class="ck-file mono">${f.name}</span>
      </button>
      <div class="ck-body" hidden></div>
    </div>`).join('');

  wrap.querySelectorAll('.ck-head').forEach(btn => {
    btn.addEventListener('click', async () => {
      const item = btn.closest('.ck-item');
      const body = item.querySelector('.ck-body');
      if (!body.hidden) { body.hidden = true; item.classList.remove('open'); return; }
      const name = item.dataset.name;
      if (!bodies.has(name)) {
        body.innerHTML = '<div class="ck-empty">Loading…</div>';
        body.hidden = false; item.classList.add('open');
        try {
          const f = files.find(x => x.name === name);
          const res = await fetch(f.download_url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          bodies.set(name, mdToHTML(await res.text()));
        } catch (e) {
          body.innerHTML = `<div class="ck-empty">Failed to load: ${esc(e.message)}</div>`;
          return;
        }
      }
      body.innerHTML = bodies.get(name);
      body.hidden = false;
      item.classList.add('open');
    });
  });
}

export function renderCheckins() {
  if (files !== null || fetching || failed) return;
  fetching = true;
  fetch(LIST_URL)
    .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
    .then(list => {
      files = list.filter(f => f.name.endsWith('.md'))
        .sort((a, b) => (a.name < b.name ? 1 : -1)); // newest (highest week) first
      renderList();
    })
    .catch(() => { failed = true; renderList(); })
    .finally(() => { fetching = false; });
}
