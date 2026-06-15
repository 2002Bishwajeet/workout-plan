# Week 02 Check-in — Block 1 (Volume Base)

**Date:** 2026-06-15 · **Block:** 1 / 4 (weeks 1–4, RPE 7–8)

---

## Sessions logged

| Session | Status | Sets | Volume (kg) |
|---------|--------|-----:|------------:|
| Push | **Skipped** | — | — |
| Pull | **Done** — 4 exercises completed, session not marked complete in app | — | — |
| Legs | **Skipped** (102 km cycling recovery) | — | — |
| Upper+ | **Done** (Sat 2026-06-13) | 20 | 2,516 |

**1 of 4 sessions fully logged.** Pull was done but not saved (tap Complete in app). Push and Legs were skipped.

### Week-over-week volume

| Session | Wk 1 Sets | Wk 1 Vol (kg) | Wk 2 Sets | Wk 2 Vol (kg) |
|---------|----------:|--------------:|----------:|--------------:|
| Push | 22 | 5,185 | — | — |
| Pull | 23 | 5,620 | — | — |
| Legs | 20 | 6,895 | — | — |
| Upper+ | 20 | 2,636 | 20 | 2,516 |
| **Total** | **85** | **20,336** | **20** | **2,516** |

---

## Progression

Rule: top of rep range at target RPE for 2 consecutive sessions → +2.5 kg upper compounds / +5 kg lower; accessories add reps first.

With only Upper+ logged this week, no progression triggers fire. Upper+ is a supplementary session; bench/dip/pull-up progression is confirmed through Push and Pull main sessions. No weight changes warranted until Push and Pull complete and the log has 2 sessions per lift.

**All working weights hold:**

| Movement | Key | Current |
|----------|-----|--------:|
| Bench Press | `bench` | 70 kg |
| Incline BB Press | `incline_bb` | 45 kg |
| OHP | `ohp` | 35 kg |
| Lateral Raise | `lat_raise` | 10 kg |
| Deadlift | `deadlift` | 80 kg |
| Lat Pulldown | `pulldown` | 65 kg |
| Chest Supported Row | `cs_row` | 60 kg |
| Leg Press | `leg_press` | 160 kg |
| BSS | `bss` | 10 kg |
| Leg Curl | `leg_curl` | 65 kg |
| BB Curl | `bb_curl` | 25 kg |
| Tricep Pushdown | `tri_pd` | 20 kg |
| Pull-up | `pullup` | BW |
| Dip | `dip` | BW |

---

## Flags

### 1. Pull session unsaved — tap Complete in app

Pull was done (deadlift, pull-up, chest supported row, lat pulldown). The session was not marked complete, so it has no log entry and no commit. Open the app, find the in-progress Pull session, and tap Complete.

### 2. Push skipped — primary concern for week 3

Bench is the programme's priority lift. Two weeks in with zero logged Push sessions means no progression signal yet. Week 3 Push is not optional.

### 3. Legs skipped — noted, not a concern

102 km cycling is legitimate grounds. Quad fatigue from that effort would compromise hack squat and leg press quality. One skipped Legs session is not a problem.

### 4. Hack Squat not in working_weights — action required

The programme's primary leg compound is Hack Squat (`hack_sq`, 4×6–8 at RPE 7–8). The key does not exist in state.json. Working weight confirmed by athlete: **140 kg**. Enter this in the app's weights grid — `hack_sq` needs to be added as a new entry, not just edited.

### 5. Leg Extension not calibrated

`leg_ext` is still 0 kg. Working weight confirmed by athlete: **35 kg**. Update in the weights grid.

### 6. Deadlift at 80 kg — hold and assess

Recalibrated from 140 → 100 → 80 kg across two weeks. At 80 kg, 4×5 at RPE 7–8 should feel comfortable. Hold for at least 2 sessions before going up. Log what happens in the commit message if it still feels off.

### 5. Bench back-off weight: 60 kg vs spec 65 kg

`bench_bo` is 60 kg; spec targets 65 kg (≈ 90% of 70 kg top set). Keep 60 kg if it is working — it is a guideline, not a rule. Scale it alongside the top-set bench as that progresses.

---

## Next week

**Week 3 — Block 1, Volume Base (RPE 7–8).** Sessions structurally identical to weeks 1–2. No template changes until week 5.

Priority order for week 3:
1. **Push** — non-negotiable. Two skipped weeks on bench is the biggest gap right now.
2. **Pull** — tap Complete on the in-progress session first, then do week 3 Pull. Two logged Pull sessions gives the first deadlift progression read.
3. **Legs** — full session. Add `hack_sq` (140 kg) and set `leg_ext` (35 kg) in the weights grid beforehand.
4. **Upper+** — optional. Fine to drop if the week gets tight.
