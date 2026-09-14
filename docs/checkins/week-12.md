# Week 12 Check-in — Block 4, Deload (Programme Complete)

**Review date:** 2026-09-14 · **Block:** 4 — Deload (weeks 12), RPE 6–7

---

## Week 12 sessions

| Session | Date | Sets | Volume (kg) | vs W11 |
|---------|------|-----:|------------:|--------|
| Push | Sun 2026-09-07 | 11 | 3,230 | −1,591 (−33%) vs W11 |
| Pull | Thu 2026-09-10 | 12 | 4,661 | −972 (−17%) vs W11 |
| Legs | — | — | — | **in progress / not completed** |
| Upper+ | — | — | — | **not logged** |
| **W12 total (2 of 4 sessions logged)** | | **23** | **7,891** | |

W11 baseline (3 PPL sessions): 63 sets / 21,190 kg.

Push deload landed cleanly at 52% of W11 set count — correct. Pull dropped to 55% of W11 sets; volume remains 83% of W11 because the deadlift weight is unchanged (100 kg, not the reduced deload load one might expect, but the prescription allowed the same working weight at lower RPE). Legs is partially ticked in `in_progress` (3 exercises done, `leg_press` TOR flagged — see below) but the session was not completed and does not appear in the log. Upper+ was not started.

---

## Progression

The log records only session-level totals (sets + volume), not per-set reps or RPE. Progression recommendations below are therefore conditional — you know whether you actually hit the top of the rep range at the target RPE; the `top_of_range` flags you set in the app are the signals used here.

### Bench — manually advanced to 70 kg during deload; four consecutive false in Block 3

| Session | Logged TOR | Working weight at session |
|---------|-----------|--------------------------|
| W9 Push | false | 67.5 kg |
| W10 Push | false | 67.5 kg |
| W11 Push | false | 67.5 kg |
| W12 Push | false | **70 kg** (advanced ~16 min before session logged) |

The weight history shows three corrections on 2026-09-07 before the session was logged: 67.5 → 65 → 67.5 → **70 kg**. The deload Push session ran at 70 kg, not 67.5 kg. `top_of_range.bench` is false for this session, consistent with a deload effort (RPE 6–7). This was a manual advance outside the progression rule, not triggered by two consecutive top-of-range sessions.

For the next programme: **bench opens at 70 kg**. This is actually the original spec target weight ("Bench treated as 70 kg honest working weight"). Block 3 at 67.5 kg never cracked the rep-range top, which is correct for a peak block. Entering the next cycle at 70 kg is reasonable — apply the progression rule from day one and let it drive.

### Deadlift — four consecutive TOR: true; still at 100 kg

| Session | Logged TOR | Working weight |
|---------|-----------|---------------|
| W9 Pull | true | 100 kg |
| W10 Pull | true | 105 kg raised then reversed |
| W11 Pull | true | 100 kg (autoregulated down from 105) |
| W12 Pull | true | 100 kg |

This was flagged in the W11 check-in. The advance from 100 → 105 kg was applied and reversed before the W11 session; W11 cleared top-of-range at 100 kg. W12 Pull (`top_of_range.deadlift: true`) is now the fourth consecutive clear at this weight or at 100 kg. **The progression rule has been satisfied for multiple cycles. Advance deadlift to 105 kg in the app before starting any new block.** This is a high-priority post-deload action.

### Leg Press — TOR: true again in W12 Legs (in progress)

The `tor["12-legs-1"] = { leg_press: true }` flag was set during the partially-completed W12 Legs session. This is the fifth consecutive TOR signal (W8–W12 in progress). The deload prescription runs leg press at lower RPE — clearing TOR on a deload set at 263 kg with RPE 6 is expected and does not itself justify an advance. **Hold leg press at 263 kg.** When starting a new programme, run the first legs session and apply the rule from there.

### Remaining working weights — end-of-programme state

| Key | Name | Current weight | Programme status |
|-----|------|---------------:|-----------------|
| `bench` | Bench Press | 70 kg | Manually advanced W12 deload; opens new cycle at 70 kg |
| `incline_bb` | Incline BB Press | 55 kg | No deload data; hold |
| `ohp` | OHP | 40 kg | No deload data; hold |
| `deadlift` | Deadlift | 100 kg | **Advance to 105 kg — overdue** |
| `pulldown` | Lat Pulldown | 59 kg | No deload data; hold |
| `cs_row` | Chest Supported Row | 91 kg | No deload data; hold |
| `leg_press` | Leg Press | 263 kg | Hold — deload TOR expected, not a progression signal |
| `hack_sq` | Hack Squat | 140 kg | **Unchanged all programme — see Flags** |
| `bss` | BSS | 10 kg | **Unchanged all programme — see Flags** |
| `leg_curl` | Leg Curl | 65 kg | **Unchanged all programme — see Flags** |
| `dip` | Dip | 0 BW | **Never loaded — see Flags** |

---

## Flags

### 1. Deadlift advance overdue — update to 105 kg before new programme

Flagged in W11, still not done. Four consecutive `top_of_range: true` at 100 kg. **Action required in the app: set `deadlift` → 105 kg.** Do this now, during or immediately after the deload, so the state is correct before Block 1 Week 1 opens.

### 2. W12 Legs not completed; Upper+ not logged

Legs has 3 exercises ticked in `in_progress` but the session was never completed — it will not appear in the log. If the remaining exercises have been done in the gym but not logged, complete the session in the app before the programme closes. Upper+ was not logged for the second consecutive week; this is the last opportunity to log the calisthenic test content (dip, pull-up submax).

### 3. Hack Squat, BSS, Leg Curl — no progression across 12 weeks

These three lower-body accessories ended the programme at their Week 1 calibration values. This was flagged from Week 5 onward. The deload changes nothing:

- **Hack Squat (`hack_sq`):** 140 kg → set to **145 kg** at new programme start
- **BSS (`bss`):** 10 kg → set to **12.5 kg** at new programme start
- **Leg Curl (`leg_curl`):** 65 kg → set to **67.5 kg** at new programme start

Apply the progression rule seriously from Block 1 Week 1 of the next cycle.

### 4. Dip never loaded; weighted protocol never started

`dip` is still 0 BW. The programme spec prescribed weighted dip from Block 2 (W5) onward. The Upper+ session was missed in most weeks, and in the few logged (W1–W5, W9), the dip remained bodyweight even when `top_of_range.dip: true` was flagged (W9). For the next programme: **set `dip` to 5 kg, change unit to `kg`**, and treat it as the primary Block 2 strength lift for Upper+ from Week 5.

### 5. Pull-up max-rep test not recorded

W11 Pull was the designated pull-up test session. `pullup` remains 0 BW with no AMRAP result noted. If you know your current strict pull-up count (from W11 or W12), note it somewhere before the context is lost. Decision tree for next programme:

- ≥10 strict reps: begin Block 2 (W5) with weighted pull-up (+2.5 kg)
- <10 reps: record the number as the new baseline; continue BW AMRAP through Block 1

### 6. current_block shows 2 in state.json

`current_block` is 2; W12 is Block 4 (Deload). This is a display issue — update via the app before starting any new cycle to avoid a stale label on the dashboard.

---

## Post-programme — programme complete

The 12-week PPL programme is finished. Week 12 is the deload; there is no Week 13. Complete the deload sessions if any remain, then execute the checklist below before starting a new block.

**Post-deload checklist (priority order):**

| Action | Key | Value | Priority |
|--------|-----|-------|----------|
| Advance deadlift | `deadlift` | **105 kg** | Critical |
| Set Hack Squat to new start | `hack_sq` | **145 kg** | Critical |
| Set BSS to new start | `bss` | **12.5 kg** | Critical |
| Load dip for Block 2 | `dip` | **5 kg, unit → kg** | Critical |
| Set Leg Curl to new start | `leg_curl` | **67.5 kg** | High |
| Advance deadlift (redundant reminder) | `deadlift` | 105 kg | High |
| Note pull-up max-rep count | — | — | High |
| Update current_block | — | **1 (if restarting)** | Medium |
| Complete W12 Legs in app if done in gym | — | — | Low |

**Block 1 opening weights (for reference):**

| Lift | Opening weight |
|------|---------------|
| Bench Press | 70 kg |
| Incline BB Press | 55 kg |
| OHP | 40 kg |
| Deadlift | **105 kg** (after update) |
| Lat Pulldown | 59 kg |
| Chest Supported Row | 91 kg |
| Hack Squat | **145 kg** (after update) |
| Leg Press | 263 kg |
| BSS | **12.5 kg** (after update) |
| Leg Curl | **67.5 kg** (after update) |
| Dip | **5 kg** (after update, Block 2 only) |
