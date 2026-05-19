# PROTOCOL

A GitHub-backed training app. Pages serves the static site, a Cloudflare Worker proxies commits to your repo. Every interaction (tick a set, edit a weight, complete a session) becomes a git commit.

```
┌─────────────┐    HTTPS    ┌─────────────────┐    GitHub API   ┌──────────┐
│ Browser     │────────────▶│ Cloudflare      │────────────────▶│ Your     │
│ (Pages)     │  + password │ Worker          │  + PAT          │ repo     │
└─────────────┘             └─────────────────┘                 └──────────┘
                                                                       │
                                                                       │  serves
                                                                       ▼
                                                                  Pages site
```

The Worker holds the GitHub token. The browser only knows a shared password. Repo can stay public on a free GitHub account; nothing sensitive lives in the source.

---

## Setup — once, ~15 min

### 1. Create the repo

Create a new repo on GitHub (e.g. `protocol`). Add this `index.html` to the root and push.

```bash
git init
git add index.html worker/ README.md
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/protocol.git
git push -u origin main
```

### 2. Create a fine-grained GitHub token

GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.

- **Repository access**: Only select repositories → pick this one repo
- **Repository permissions** → Contents → **Read and write**
- Everything else: no access

Generate, copy the token (starts with `github_pat_…`). You'll only see it once.

### 3. Deploy the Cloudflare Worker

If you don't have a Cloudflare account, sign up (free). Then:

```bash
npm install -g wrangler
wrangler login
```

Edit `worker/wrangler.toml` — set `REPO_OWNER` and `REPO_NAME` to your GitHub username and the repo name.

```bash
cd worker
wrangler deploy
```

First deploy outputs your Worker URL — looks like `https://protocol-store.<you>.workers.dev`. Note it.

Now set the secrets:

```bash
wrangler secret put GITHUB_TOKEN
# paste the PAT from step 2

wrangler secret put APP_PASSWORD
# pick a strong password — anything 20+ chars
```

Quick check the Worker is alive:

```bash
curl https://protocol-store.<you>.workers.dev/health
# → {"ok":true,"service":"protocol-store"}
```

### 4. Enable GitHub Pages

Repo → Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `/ (root)` → Save.

Wait a minute. Your site is at `https://<you>.github.io/protocol/`.

### 5. Lock down the Worker (optional but worth it)

Once Pages is live, edit `worker/wrangler.toml`:

```toml
ALLOWED_ORIGIN = "https://<you>.github.io"
```

Redeploy:

```bash
cd worker
wrangler deploy
```

Now only requests from your Pages origin can reach the Worker.

### 6. Connect the app

Open your Pages URL. Setup modal appears.

- **Worker URL**: `https://protocol-store.<you>.workers.dev`
- **App Password**: whatever you set in step 3

Tap **Connect**. App loads, seeds an initial `data/state.json` in your repo as the first commit, and you're live.

Each device needs to do step 6 once — the URL+password get stashed in that device's localStorage.

---

## Daily use

Tick sets, edit weights, complete sessions. Each action triggers a debounced commit (~2.5s after your last interaction) with an informative message:

```
Tick: Bench Press (Push)
Update weight: Hack Squat — → 90 kg
Complete session: Push (Wk 01)
```

The sync pill (top right) shows status: `Synced` / `Pending` / `Syncing` / `Error`.

---

## Architecture

**`index.html`** — entire UI as one file. Static programme structure (`PROGRAMME`, `SESSIONS_W1`, `WEEK_FOCUS`) lives in the source. Mutable state (working weights, log, in-progress ticks) is loaded from / saved to the Worker.

**`worker/src/index.js`** — single endpoint `/state` (GET + POST). Validates `X-App-Password`, reads/writes a JSON file via the GitHub Contents API. Health probe at `/health`.

**`data/state.json`** — your training log. Created on first save. Commit history is your training journal.

State shape:

```json
{
  "version": 1,
  "athlete": "Bishwajeet",
  "current_block": 1,
  "current_week": 1,
  "working_weights": {
    "push": [{ "key": "bench", "name": "Bench Press", "weight": 77, "unit": "kg" }, …],
    "pull": [...], "legs": [...], "acc": [...]
  },
  "in_progress": { "1-push-1": [0, 1, 2] },
  "log": [
    { "date": "2026-05-18T…", "week": 1, "name": "Push", "sets": 22, "vol": 3445, "focus": "…" }
  ],
  "updated_at": "2026-05-18T…"
}
```

---

## Troubleshooting

**"Can't reach Worker"** — `curl <url>/health` directly. If that 404s, Worker isn't deployed. If it times out, check `wrangler deploy` output for the actual URL.

**"Bad password"** — re-run `wrangler secret put APP_PASSWORD`, refresh the page, re-enter.

**Save errors with `403`** — PAT lacks contents:write on this repo, or has expired. Regenerate.

**Save errors with `404`** — `REPO_OWNER` / `REPO_NAME` in `wrangler.toml` are wrong, or the repo is private and the PAT can't access it.

**Want to reset everything** — Worker side: `wrangler secret delete GITHUB_TOKEN && wrangler secret delete APP_PASSWORD`. Client side: open devtools console → `localStorage.clear()`. Or just tap the sync pill in the top bar to re-open setup.

---

## Extending

The static programme data sits at the top of `index.html`. To add weeks 2-12 properly, expand `SESSIONS_W1` into `SESSIONS = { 1: […], 2: […], … }` and have `renderWeekGrid` / `openSession` look up the current week. The state shape already supports it — `in_progress` keys by `${week}-${sessionId}`.

Commit messages from the Worker can be made richer too: pass `{ summary }` from the client with details to embed in the commit body.
