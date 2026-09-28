# Week 02 Check-in — Cycle 2, Block 1 (Volume Base)

**Date:** 2026-09-28 · **Cycle:** 2 · **Block:** 1 / 4 (weeks 1–4, RPE 7–8)

---

## Sessions logged

| Session | Status | Date | Sets | Volume (kg) |
|---------|--------|------|-----:|------------:|
| Push | **Done** | 2026-09-27 | 24 | 7,593 |
| Pull | **Done** | 2026-09-24 | 23 | 7,607 |
| Legs | **Done** | 2026-09-27 | 20 | 14,044 |
| Upper+ | **Skipped** | — | — | — |

**3 of 4 sessions logged.** Upper+ is optional — no structural loss.

### Week-over-week volume (Cycle 2 only)

| Session | Wk 1 Sets | Wk 1 Vol (kg) | Wk 2 Sets | Wk 2 Vol (kg) | Delta |
|---------|----------:|--------------:|----------:|--------------:|------:|
| Push | 24 | 7,733 | 24 | 7,593 | −140 (−1.8%) |
| Pull | 23 | 7,623 | 23 | 7,607 | −16 (−0.2%) |
| Legs | 20 | 13,904 | 20 | 14,044 | +140 (+1.0%) |
| Upper+ | — | — | — | — | — |
| **Total** | **67** | **29,260** | **67** | **29,244** | **−16 (−0.1%)** |

Volume is essentially flat — less than 0.1% change across all three sessions. Consistent training load; no fatigue-driven drop.

---

## Progression

Rule: top of rep range at target RPE for 2 consecutive sessions → +2.5 kg upper compounds / +5 kg lower; accessories add reps before weight.

Neither bench nor deadlift triggered in week 2. Leg press was bumped in-app during the week 2 session (263 → 268 kg) but `top_of_range` was logged as false at 268 kg, so that is the new working weight to hold.

### Bench Press (`bench`, 60 kg)

| Week | top_of_range |
|------|-------------|
| Cy2 Wk 1 | false |
| Cy2 Wk 2 | false |

No trigger. 60 kg is a deliberate cycle-2 reset (was 67.5–70 kg at end of Cycle 1). If week 3 Push completes all reps of 4×6–8 at RPE 7–8, that is session 1 of a potential trigger; week 4 would confirm it.
Conditional: if Wk 3 and Wk 4 both hit top of range at RPE 7–8 → **bench 60 → 62.5 kg**.

### Deadlift (`deadlift`, 102.5 kg)

| Week | top_of_range | Note |
|------|-------------|------|
| Cy2 Wk 1 | **true** | Clean session |
| Cy2 Wk 2 | false | "Deadlift -3 set 3 rep (tirey week)"; stepped down 105 → 102.5 in-app |

Wk1 fired, Wk2 did not — no consecutive trigger. The in-session step-down to 102.5 kg is the correct call for a fatigued week. Hold at 102.5 kg for week 3 and re-assess.
Conditional: if Wk 3 Pull and Wk 4 Pull both hit top of range at RPE 7–8 → **deadlift 102.5 → 107.5 kg**.

### Leg Press (`leg_press`, 268 kg)

| Week | top_of_range |
|------|-------------|
| Cy2 Wk 1 | **true** | |
| Cy2 Wk 2 | false | Bumped 263 → 268 in-app mid-session; `top_of_range` false at 268 kg |

Wk1 fired at 263 kg; the athlete correctly added +5 kg. Wk2 at 268 kg did not hit top of range. Hold at 268 kg for week 3.
Conditional: if Wk 3 and Wk 4 Legs both hit top of range at RPE 7–8 → **leg press 268 → 273 kg**.

### All other working weights — hold

| Movement | Key | Weight |
|----------|-----|-------:|
| Incline BB Press | `incline_bb` | 45 kg |
| OHP | `ohp` | 30 kg |
| Lateral Raise | `lat_raise` | 10 kg |
| Reverse Pec Deck | `machine_press` | 54 kg |
| Bench Back-off | `bench_bo` | 60 kg |
| Lat Pulldown | `pulldown` | 52 kg |
| Pull-up | `pullup` | BW |
| Chest Supported Row | `cs_row` | 91 kg |
| Face Pull | `face_pull` | 17.5 kg |
| Hammer Curl | `hammer` | 10 kg |
| BB Curl | `bb_curl` | 25 kg |
| BSS | `bss` | 10 kg |
| Leg Extension | `leg_ext` | 45 kg |
| Leg Curl | `leg_curl` | 65 kg |
| Standing Calf | `calf` | 60 kg |
| Tricep Pushdown | `tri_pd` | 27 kg |
| Dip | `dip` | BW |
| Incline DB Curl | `incline_db_curl` | 10 kg |
| OH Tricep Ext | `oh_tri` | 12 kg |

---

## Flags

### 1. `hack_sq` key absent from working_weights

The Block 1 programme spec lists Hack Squat (4×6–8, key `hack_sq`) as the primary leg compound. That key does not exist in the current `working_weights.legs`. Leg sessions in Cycle 2 are running with Leg Press as the de-facto primary (268 kg, high volume). Two options:

- **If Leg Press has replaced Hack Squat as the primary:** no action required — the weights grid reflects the actual programme.
- **If Hack Squat is still in the session:** add the `hack_sq` key via the weights grid in the app before the next Legs session.

Confirm which is the case and act accordingly. Do not start a Legs session with an untracked primary compound.

### 2. Deadlift — fatigue step-down, hold and reassess

Week 2 was a "tired week" per the session note. Stepping down 105 → 102.5 mid-session and logging `top_of_range: false` is the right call. This breaks the wk1 trigger. Hold at 102.5 kg for week 3; if the session goes cleanly at RPE 7–8, that resets the progression clock.

### 3. Bench — cycle reset to 60 kg

Bench ended Cycle 1 at ~67.5 kg and was reset to 60 kg at the start of Cycle 2 (2026-09-15). Both cycle-2 sessions show `top_of_range: false` — appropriate for a building phase. No concern at this stage; the progression clock starts ticking from here. Two clean 4×6–8 weeks will trigger the bump.

### 4. Upper+ skipped both weeks

Not a problem structurally — it is optional. If the pattern continues through week 3, note it in the session log comment so the bench back-off and dip/pull-up volume gap is visible across cycles.

### 5. `current_week` is correctly at 3

Dashboard is aligned. No action needed.

---

## Next week

**Week 3 — Cycle 2, Block 1, Volume Base (RPE 7–8)**

Same session skeleton as weeks 1–2. No template changes until week 5 (Block 2 Intensification). Priority:

1. **Pull** — key session. Week 3 is the first of two sessions needed to reset the deadlift progression clock after the wk2 step-down. Target: 4×5 at 102.5 kg, RPE 7–8, all reps complete.
2. **Push** — bench needs two clean weeks to trigger 62.5 kg. Week 3 is session 1 of that window.
3. **Legs** — resolve the `hack_sq` flag before this session. Target: 3×10–12 leg press at 268 kg, RPE 7–8.
4. **Upper+** — optional. Three clean core sessions first.
