// =============================================================
// PROTOCOL · GITHUB-BACKED STATE STORE
// Cloudflare Worker that proxies commits to a GitHub repo.
// Holds the GitHub PAT server-side; gates writes with a shared
// password the client sends in X-App-Password.
// =============================================================

const GITHUB_API = 'https://api.github.com';

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-App-Password',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Public health check (no auth) so the setup screen can verify URL is alive
    if (url.pathname === '/health' && request.method === 'GET') {
      return json({ ok: true, service: 'protocol-store' }, 200, corsHeaders);
    }

    try {
      if (url.pathname === '/state') {
        if (request.method === 'GET')  return await handleGetState(env, corsHeaders);

        // Writes require the shared password
        const password = request.headers.get('X-App-Password');
        if (!env.APP_PASSWORD || password !== env.APP_PASSWORD) {
          return json({ error: 'Unauthorized' }, 401, corsHeaders);
        }
        if (request.method === 'POST') return await handlePostState(env, request, corsHeaders);
      }

      // Apple Watch workout sync (iOS Shortcut / Health Auto Export → repo)
      if (url.pathname === '/health' && request.method === 'POST') {
        const password = request.headers.get('X-App-Password');
        if (!env.APP_PASSWORD || password !== env.APP_PASSWORD) {
          return json({ error: 'Unauthorized' }, 401, corsHeaders);
        }
        return await handlePostHealth(env, request, corsHeaders);
      }

      return json({ error: 'Not found' }, 404, corsHeaders);
    } catch (err) {
      return json({ error: String(err.message || err) }, 500, corsHeaders);
    }
  }
};

const dataPath = (env) => env.DATA_PATH || 'data/state.json';
const branch   = (env) => env.REPO_BRANCH || 'main';

async function handleGetState(env, corsHeaders) {
  const file = await ghGetFile(env, dataPath(env));
  if (!file) {
    // File doesn't exist yet — client will seed defaults and POST
    return json({ state: null, sha: null, new: true }, 200, corsHeaders);
  }
  let state;
  try { state = JSON.parse(file.content); }
  catch (e) { throw new Error('state.json is not valid JSON: ' + e.message); }
  return json({ state, sha: file.sha }, 200, corsHeaders);
}

async function handlePostState(env, request, corsHeaders) {
  const body = await request.json();
  let { state, sha, message } = body;
  if (!state || typeof state !== 'object') {
    return json({ error: 'Missing state' }, 400, corsHeaders);
  }
  state.updated_at = new Date().toISOString();

  // Multi-line messages carry a batch: subject line capped at 120 chars,
  // body (one line per batched action) capped separately so a runaway
  // client can't commit an essay.
  const lines = String(message || 'Update state').split('\n');
  const subject = lines.shift().slice(0, 120);
  const msgBody = lines.join('\n').slice(0, 2000);
  const commitMsg = msgBody ? `${subject}\n${msgBody}` : subject;
  const content   = JSON.stringify(state, null, 2);

  // If client didn't provide a SHA, fetch latest (handles first write + race recovery)
  if (!sha) {
    const current = await ghGetFile(env, dataPath(env));
    sha = current?.sha || null;
  }

  let result;
  try {
    result = await ghPutFile(env, dataPath(env), content, commitMsg, sha);
  } catch (err) {
    if (err.conflict) return json({ error: 'conflict', stale: true }, 409, corsHeaders);
    throw err;
  }
  return json({
    ok: true,
    sha: result.content.sha,
    commit: result.commit.sha,
    commit_url: result.commit.html_url
  }, 200, corsHeaders);
}

// Fields a workout entry may carry — anything else is dropped so the
// payload contract stays forward-compatible but the stored data stays clean.
const HEALTH_FIELDS = ['start', 'end', 'type', 'duration_min', 'avg_hr', 'max_hr', 'active_kcal', 'distance_km'];

function sanitizeWorkout(raw) {
  const w = {};
  for (const f of HEALTH_FIELDS) if (raw[f] !== undefined && raw[f] !== null) w[f] = raw[f];
  return w;
}

// Appends watch workouts to data/health/YYYY-MM.json (one file per month,
// keyed by the workout's start month). Accepts a single workout object or an
// array; duplicates (same start timestamp) are ignored so Shortcut re-runs
// are idempotent.
async function handlePostHealth(env, request, corsHeaders) {
  let body;
  try { body = await request.json(); }
  catch { return json({ error: 'Invalid JSON' }, 400, corsHeaders); }

  const items = Array.isArray(body) ? body : [body];
  if (!items.length || items.length > 50) {
    return json({ error: 'Expected 1-50 workouts' }, 400, corsHeaders);
  }
  for (const it of items) {
    if (!it || typeof it !== 'object' || !it.start || !it.end) {
      return json({ error: 'Each workout needs start and end' }, 400, corsHeaders);
    }
    if (isNaN(Date.parse(it.start)) || isNaN(Date.parse(it.end))) {
      return json({ error: 'start/end must be ISO timestamps' }, 400, corsHeaders);
    }
  }

  // Group by month so a batch spanning a month boundary lands in the right files.
  const byMonth = new Map();
  for (const it of items) {
    const month = String(it.start).slice(0, 7); // YYYY-MM
    if (!byMonth.has(month)) byMonth.set(month, []);
    byMonth.get(month).push(sanitizeWorkout(it));
  }

  let added = 0;
  for (const [month, workouts] of byMonth) {
    const path = `data/health/${month}.json`;
    const file = await ghGetFile(env, path);
    let arr = [];
    if (file) {
      try { arr = JSON.parse(file.content); } catch { arr = []; }
      if (!Array.isArray(arr)) arr = [];
    }
    const known = new Set(arr.map(w => w.start));
    const fresh = workouts.filter(w => !known.has(w.start));
    if (!fresh.length) continue;

    arr.push(...fresh);
    arr.sort((a, b) => (a.start < b.start ? -1 : 1));
    const first = fresh[0];
    const detail = [
      first.duration_min ? `${first.duration_min} min` : null,
      first.active_kcal ? `${first.active_kcal} kcal` : null
    ].filter(Boolean).join(', ');
    const msg = fresh.length === 1
      ? `Sync: Watch workout${detail ? ` (${detail})` : ''}`
      : `Sync: ${fresh.length} watch workouts (${month})`;
    await ghPutFile(env, path, JSON.stringify(arr, null, 2), msg, file ? file.sha : null);
    added += fresh.length;
  }
  return json({ ok: true, added }, 200, corsHeaders);
}

// ----------- GitHub API helpers -----------

async function ghGetFile(env, path) {
  const url = `${GITHUB_API}/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${encodeURIComponent(path)}?ref=${branch(env)}`;
  const res = await fetch(url, { headers: ghHeaders(env) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { sha: data.sha, content: b64decode(data.content) };
}

async function ghPutFile(env, path, content, message, sha) {
  const url = `${GITHUB_API}/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents/${encodeURIComponent(path)}`;
  const body = {
    message,
    content: b64encode(content),
    branch: branch(env),
    committer: {
      name:  env.COMMIT_AUTHOR_NAME  || 'Protocol',
      email: env.COMMIT_AUTHOR_EMAIL || 'protocol@local'
    }
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  // Stale write: the client's sha no longer matches HEAD, so something was
  // committed since it loaded. Do NOT refetch-and-overwrite — that silently
  // clobbers the newer commit (this is how a logged session got deleted). Surface
  // a conflict so the client reloads fresh state. (409 = sha mismatch, 422 = sha missing.)
  if (res.status === 409 || res.status === 422) {
    const e = new Error('stale sha — reload and retry');
    e.conflict = true;
    throw e;
  }

  if (!res.ok) throw new Error(`GitHub PUT ${res.status}: ${await res.text()}`);
  return await res.json();
}

function ghHeaders(env) {
  return {
    'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
    'User-Agent': 'protocol-store-worker',
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };
}

// ----------- Base64 (UTF-8 safe) -----------

function b64encode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function b64decode(str) {
  const bin = atob(str.replace(/\s/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers }
  });
}
