# Week 03 Check-in — Block 1 (Volume Base)

**Date:** 2026-06-22 · **Block:** 1 / 4 (weeks 1–4, RPE 7–8)

---

## Sessions logged

| Session | Status | Sets | Volume (kg) |
|---------|--------|-----:|------------:|
| Push | In progress — not logged | — | — |
| Pull | Done (Thu 2026-06-18) | 23 | 6,549 |
| Legs | Skipped (swim) | — | — |
| Upper+ | Skipped | — | — |

1 of 4 sessions logged. Push was started (`3-push-1` in `in_progress` with 5 exercises ticked) but the session was never completed. Legs was swapped for a swim; Upper+ was not started.

### Week-over-week volume

| Session | Wk 2 Sets | Wk 2 Vol (kg) | Wk 3 Sets | Wk 3 Vol (kg) | Delta |
|---------|----------:|--------------:|----------:|--------------:|------:|
| Push | — | — | — | — | — |
| Pull | 23 | 6,040 | 23 | 6,549 | +509 |
| Legs | — | — | — | — | — |
| Upper+ | 20 | 2,516 | — | — | — |
| **Total** | **43** | **8,556** | **23** | **6,549** | — |

Pull volume is up 509 kg vs Week 2 at the same 23-set count — a positive indicator that load on the deadlift or pulling accessories increased.

---

## Progression

Rule: top of rep range at target RPE for 2 consecutive sessions → +2.5 kg upper compounds / +5 kg lower; accessories add reps first.

**Deadlift (`deadlift`, 80 kg):** Three Pull sessions are now in the log (Wk 1, Wk 2, Wk 3) with rising volume across all three (5,620 → 6,040 → 6,549 kg at 23 sets each). Target is 4×5 at RPE 7–8. If Wk 2 and Wk 3 Pull both hit that standard, bump to **85 kg**.

**Chest Supported Row (`cs_row`, 60 kg):** 3×8–10 at RPE 7–8. If both Wk 2 and Wk 3 Pull sessions hit 10 reps at RPE 7–8, bump to **65 kg**.

**Lat Pulldown (`pulldown`, 52 kg):** 3×10–12 at RPE 7. Accessory — add reps before weight. If hitting 12 reps confidently for 2 sessions, consider moving to **55 kg**.

All other compounds have no second logged session this week; no trigger is possible.

| Movement | Key | Current | Conditional target |
|----------|-----|--------:|-------------------:|
| Deadlift | `deadlift` | 80 kg | → 85 kg |
| Chest Supported Row | `cs_row` | 60 kg | → 65 kg |
| Lat Pulldown | `pulldown` | 52 kg | → 55 kg |

---

## Flags

### 1. Push: three weeks, zero completed Push sessions — critical

`in_progress` shows `3-push-1` with 5 exercises ticked; the session was never finished and logged. The week is over. Bench is the programme's primary strength lift, and Block 1 has two weeks remaining (weeks 4 and the Block 2 transition at week 5). Zero Push data means zero bench progression signal, zero incline data, zero OHP data. Run Push first in Week 4 — not optional.

### 2. Legs: skipped in 2 of 3 weeks — both for cross-training

Week 1 Legs was logged (calibration complete — `hack_sq` 140 kg, `bss` 10 kg, `leg_press` 160 kg all set). Weeks 2 and 3 had no Legs session — Week 2 was the 102.55 km cycling ride, Week 3 was a swim. Both are legitimate active-recovery choices, but the result is the same: lower-body strength frequency is one session in three weeks, and `leg_ext` and `leg_curl` have had no load since Week 1. Week 4 Legs is non-negotiable — don't let a third week slide.

### 3. Bench weight: state shows 60 kg; Week 02 check-in recorded 70 kg

`bench` is 60 kg in state.json. The Week 02 check-in documented 70 kg (itself already reduced from the onboarding 77 kg). Something was changed in the app. The state is authoritative — use 60 kg — but confirm this was intentional and not a mis-entry before the next Push session.

More urgently: `bench_bo` (back-off) is also 60 kg. If the top set is 60 kg, the back-off cannot be the same weight. This is almost certainly a stale value. Correct `bench_bo` in the app to something like 52–55 kg (85–90% of 60 kg) before running Push.

### 4. Lat Pulldown: state shows 52 kg; Week 02 check-in recorded 65 kg

Same pattern as bench — a weight appears to have been reset or corrected in the app. State is authoritative (52 kg). If this was unintentional, fix it. If it was a reset after feeling the previous load was too heavy, note that and proceed from 52 kg.

### 5. current_week matches highest logged week — no action needed

`current_week` is 3 in state.json, matching the highest week in the log. Dashboard is showing the correct sessions.

---

## Next week

**Week 4 — Block 1, Volume Base (RPE 7–8).** Final week of Block 1. Session structure is identical to weeks 1–3. Block 2 (Intensification, RPE 8–8.5, tighter rep ranges) begins at Week 5 — after Week 4, compounds move from 4×6–8 to 4×5–6 and accessories shift to 3×8–10.

Priority order for Week 4:

1. **Push** — mandatory. Confirm the bench weight situation first. Run Push as the first session of the week.
2. **Legs** — mandatory. Two consecutive skipped weeks. `hack_sq`, `bss`, `leg_press`, `leg_ext`, `leg_curl` are all calibrated and ready.
3. **Pull** — continue the streak; a third consecutive Pull with rising volume confirms the deadlift progression to 85 kg.
4. **Upper+** — optional. Dip and pull-up volume matters for the calisthenics progression, but fit this in only if the other three sessions are covered.
