# Apple Watch → PROTOCOL sync (iOS Shortcut)

HealthKit has no web API, so the site can never read watch data directly. But
the Shortcuts app on the iPhone *can* read HealthKit and POST JSON to a URL.
This guide builds a Shortcut that sends the last workout to the Worker's
`POST /health` endpoint, plus an automation that fires it automatically when a
workout ends. The Worker commits each sync to `data/health/YYYY-MM.json`.

Everything here is assembled on the iPhone — it can't be installed from the
repo. Budget ~10 minutes.

---

## Payload contract

`POST https://api.workout.bishwajeetparhi.dev/health`, header
`X-App-Password: <app password>`, body:

```json
{
  "start": "2026-07-26T17:30:00Z",
  "end": "2026-07-26T18:35:00Z",
  "type": "Traditional Strength Training",
  "duration_min": 65,
  "avg_hr": 121,
  "max_hr": 158,
  "active_kcal": 410
}
```

`start` and `end` are required ISO timestamps; everything else is optional.
Unknown fields are dropped server-side. Re-sending the same workout is safe —
duplicates (same `start`) are ignored.

---

## Build the Shortcut

Open **Shortcuts** → **+** → name it `Sync Workout`.

1. **Find Health Samples** (search "Find Health Samples"):
   - Type: **Workouts**
   - Sort by: **End Date**, Order: **Latest First**
   - Limit: ON, Get **1** sample
2. *(first run only)* Allow Health access when prompted.
3. **Text** action — the app password. (Stored inside the Shortcut on-device;
   it is the shared app password, **not** a GitHub credential.)
4. **Get Contents of URL**:
   - URL: `https://api.workout.bishwajeetparhi.dev/health`
   - Method: **POST**
   - Headers: `X-App-Password` → the Text variable from step 3
   - Request Body: **JSON**, add fields using variables from the Health sample
     (tap each value → select the magic variable → pick the property):

     | Field | Type | Value (from Health sample) |
     |---|---|---|
     | `start` | Text | Start Date → Format: ISO 8601 |
     | `end` | Text | End Date → Format: ISO 8601 |
     | `type` | Text | Workout Type |
     | `duration_min` | Number | Duration in Minutes (rounded) |
     | `avg_hr` | Number | Average Heart Rate |
     | `max_hr` | Number | Maximum Heart Rate |
     | `active_kcal` | Number | Active Energy |

     For the dates, choose **Format Date** with format `ISO 8601` and turn
     **ISO 8601 Time** ON — the server rejects non-ISO timestamps.
5. *(optional)* **Show Notification** with the URL result, so a failed sync is
   visible instead of silent.

Run it once manually after a workout: the response should be
`{"ok":true,"added":1}` and a `Sync: Watch workout (…)` commit appears in the
repo.

## Automate it

Shortcuts → **Automation** tab → **+**:

- Trigger: **Workout** → **When any workout ends**
- **Run Immediately** (no confirmation)
- Action: run the `Sync Workout` shortcut

From then on, finishing a workout on the watch commits it to the repo within a
few seconds of the phone syncing.

## Fallbacks & troubleshooting

- **Automation didn't fire** (happens occasionally with Health sync lag): run
  `Sync Workout` manually — idempotency makes double-runs harmless.
- **`401 Unauthorized`**: the Text field doesn't match the Worker's
  `APP_PASSWORD` secret.
- **`400` on dates**: the Format Date action isn't set to ISO 8601.
- **Several missed days**: raise the Find Health Samples limit to 10 and run
  once — the server skips what it already has.

## Backfill: import history from a Health export (one-off)

Workouts from before the sync existed can be imported from the Health app's
full export — no Worker involved, the files are committed by hand.

1. On the iPhone: **Health app → profile picture → Export All Health Data**.
   Share the resulting ZIP to the computer and unzip it; the file needed is
   `apple_health_export/export.xml`. **Warning: this file is often 100+ MB**
   (it contains every heart-rate sample ever recorded). The script streams
   it, so size is fine — just don't open it in an editor.
2. Preview what would be imported:

   ```
   node scripts/backfill-health.js path/to/export.xml --dry-run
   ```

3. Run it for real (same command without `--dry-run`). It filters the export
   down to strength workouts — both `TraditionalStrengthTraining` and
   `FunctionalStrengthTraining` count — and writes `data/health/YYYY-MM.json`
   files in the same shape the Worker commits, keyed by the workout's start
   month (UTC). Existing month files are merged, duplicates (same `start`)
   skipped, entries kept sorted — re-running is harmless, same as the sync.
4. Review with `git diff`, then commit the generated files manually, e.g.
   `Backfill: 34 workouts from Health export`. Don't commit `export.xml`.

## Alternative: Health Auto Export

The paid app **Health Auto Export** (App Store) can POST richer JSON (HR
time-series, HRV, sleep) to a REST endpoint on a schedule. Point it at the
same URL with the `X-App-Password` header. The free Shortcut above is the
default path; consider HAE only if the summary fields stop being enough —
note its field names differ from the contract, so it would need a mapping
or a server-side adapter first.
