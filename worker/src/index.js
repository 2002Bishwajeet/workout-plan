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
    if (url.pathname === '/health') {
      return json({ ok: true, service: 'protocol-store' }, 200, corsHeaders);
    }

    // Auth gate — every other route requires the shared password
    const password = request.headers.get('X-App-Password');
    if (!env.APP_PASSWORD || password !== env.APP_PASSWORD) {
      return json({ error: 'Unauthorized' }, 401, corsHeaders);
    }

    try {
      if (url.pathname === '/state') {
        if (request.method === 'GET')  return await handleGetState(env, corsHeaders);
        if (request.method === 'POST') return await handlePostState(env, request, corsHeaders);
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

  const commitMsg = String(message || 'Update state').slice(0, 120);
  const content   = JSON.stringify(state, null, 2);

  // If client didn't provide a SHA, fetch latest (handles first write + race recovery)
  if (!sha) {
    const current = await ghGetFile(env, dataPath(env));
    sha = current?.sha || null;
  }

  const result = await ghPutFile(env, dataPath(env), content, commitMsg, sha);
  return json({
    ok: true,
    sha: result.content.sha,
    commit: result.commit.sha,
    commit_url: result.commit.html_url
  }, 200, corsHeaders);
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

  // Conflict — someone wrote since we last read. Refetch & retry once.
  if (res.status === 409 || res.status === 422) {
    const fresh = await ghGetFile(env, path);
    body.sha = fresh?.sha;
    const retry = await fetch(url, {
      method: 'PUT',
      headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!retry.ok) throw new Error(`GitHub PUT retry ${retry.status}: ${await retry.text()}`);
    return await retry.json();
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
