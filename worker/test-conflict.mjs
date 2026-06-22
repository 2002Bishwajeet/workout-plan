// Run: node worker/test-conflict.mjs
// Regression: a stale-sha POST must return 409 and must NOT issue a second,
// clobbering PUT (the bug that silently deleted a logged Push session).
import assert from 'node:assert';
import worker from './src/index.js';

const env = { APP_PASSWORD: 'pw', GITHUB_TOKEN: 't', REPO_OWNER: 'o', REPO_NAME: 'r', REPO_BRANCH: 'main' };

let puts = 0;
globalThis.fetch = async (_url, opts = {}) => {
  if ((opts.method || 'GET') === 'PUT') {            // every write attempt conflicts
    puts++;
    return new Response('{"message":"sha did not match"}', { status: 409 });
  }
  return new Response(JSON.stringify({ sha: 'SERVER_NEW', content: btoa('{}') }), { status: 200 });
};

const req = new Request('https://api.example/state', {
  method: 'POST',
  headers: { 'X-App-Password': 'pw', 'Content-Type': 'application/json' },
  body: JSON.stringify({ state: { log: [] }, sha: 'CLIENT_STALE', message: 'Tick: x' })
});

const res = await worker.fetch(req, env);
assert.strictEqual(res.status, 409, `expected 409, got ${res.status}`);
assert.strictEqual(puts, 1, `expected 1 PUT (no clobbering retry), got ${puts}`);
assert.strictEqual((await res.json()).stale, true);
console.log('ok: stale write rejected (409), journal not clobbered (1 PUT, 0 retries)');
