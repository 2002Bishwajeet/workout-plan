# Week 09 Check-in — Block 3 (Strength Peak)

**Date:** 2026-08-03 · **Block:** 3 / 4 (weeks 9–11, RPE 8.5–9)

*No week-08 check-in was produced. This review covers the W8 retrospective (the last completed full week) and the W9 Upper+ session logged so far.*

---

## Sessions logged — Week 9

Week 9 opened on Sunday 02 Aug with Upper+. Push, Pull, and Legs are the core work this week.

| Session | Date | Sets | Volume (kg) | Status |
|---------|------|-----:|------------:|--------|
| Push | — | — | — | not yet logged |
| Pull | — | — | — | not yet logged |
| Legs | — | — | — | not yet logged |
| Upper+ | Sun 2026-08-02 | 21 | 1,761 | logged |

Upper+ volume trend across blocks (lower is expected as reps drop):

| Session | W1 | W2 | W4 | W5 | W9 |
|---------|----|----|----|----|----|
| Sets | 20 | 20 | 20 | 21 | 21 |
| Vol (kg) | 2,636 | 2,516 | 2,346 | 1,926 | 1,761 |

Declining volume is appropriate — Block 3 runs bench at 1×3 @ RPE 9 + 3×5 back-offs, versus Block 1's 1×5 + 3×8. No concern here.

---

## Week 8 retrospective (Block 2 final week)

Week 8 ran Push/Pull/Legs; Upper+ was missed for the third consecutive week.

| Session | Date | Sets | Vol (kg) | vs W7 Sets | vs W7 Vol |
|---------|------|-----:|---------:|-----------:|----------:|
| Push | Mon 2026-07-27 | 23 | 6,009 | 0 | +123 |
| Pull | Tue 2026-07-28 | 25 | 6,427 | 0 | +140 |
| Legs | Thu 2026-07-30 | 20 | 12,250 | 0 | +313 |
| Upper+ | — | — | — | — | missed (W6/W7/W8) |
| **W8 total** | | **68** | **24,686** | **0** | **+576** |

Volume up across all three sessions. The Legs jump (+313 kg) tracks the leg press load bump (225 → 235 kg mid-session on Jul 30). All `top_of_range` flags from W8:

- `bench`: **false** (did not hit top of range at 62.5 kg / advanced to 65 kg mid-session)
- `deadlift`: **false** (did not qualify; deadlift stays at 90 kg)
- `leg_press`: **true** (qualified; progressed 225 → 235 kg)

---

## Progression

### Applied in Week 8

| Movement | Key | From | To | Basis |
|----------|-----|-----:|---:|-------|
| Bench Press | `bench` | 62.5 kg | **65 kg** | W7 was session 2 at 62.5 kg; advanced mid-session W8 Push |
| Tricep Pushdown | `tri_pd` | 20 kg | **22.5 kg** | Reps-then-weight rule for accessories |
| Chest Supported Row | `cs_row` | 60 kg | **65 kg** | W5+W7 Pull both qualified |
| Leg Press | `leg_press` | 225 kg | **235 kg** | W8 `top_of_range: true`; +10 kg applied (two +5 increments) |
| Leg Extension | `leg_ext` | 44 kg | **45 kg** | Minor correction applied |

### Applied in Week 9 Upper+

| Movement | Key | From | To | Notes |
|----------|-----|-----:|---:|-------|
| Bench Back-off | `bench_bo` | 55 kg | **60 kg** | Advanced alongside bench top set at 65 kg |

Note: bench_bo at 60 kg = 92% of top-set (65 kg). Standard back-off is 85–90%. If 3×5 back-offs at 60 kg push RPE above 8.5, drop to 57.5 kg.

### Conditional recommendations for W9 Push/Pull/Legs

Block 3 runs lower reps at higher RPE. Most lifts are entering their first Block 3 exposure this week — two sessions needed before the advancement trigger fires.

| Movement | Key | Current | Condition | Target if met |
|----------|-----|--------:|-----------|:-------------:|
| Hack Squat | `hack_sq` | 140 kg | If W8 Legs hit 4×6-8 @ RPE ≤8.5 (block 2 criteria) | **145 kg** |
| Leg Curl | `leg_curl` | 65 kg | If W8 Legs hit 3×8-10 @ RPE ≤8.5 | **70 kg** |
| Incline BB | `incline_bb` | 50 kg | If W8+W9 Push both hit 3×5-6 @ RPE 8.5 | **52.5 kg** |
| OHP | `ohp` | 35 kg | If W8+W9 Push both hit 3×5-6 @ RPE 8.5 | **37.5 kg** |
| Bench | `bench` | 65 kg | First Block 3 exposure this week; needs 2 sessions | — |
| Deadlift | `deadlift` | 90 kg | W8 `top_of_range: false`; first Block 3 exposure this week | — |
| Lat Pulldown | `pulldown` | 52 kg | See flag 3 below | — |

**Dip — action required before next Upper+:**
`top_of_range.dip: true` was logged in W9 Upper+. The `dip` key is still `0 BW`. Block 3 Upper+ prescribes **weighted dip 4×5-6 @ RPE 8.5**. Update the `dip` key in the app from `0 BW` to `5 kg` before the next Upper+ session. If 4×5-6 @ RPE 8.5 with +5 kg is too light, go to +7.5 or +10 kg after the first set. The unit in the app needs to flip from BW to kg.

**Pull-up assessment:**
Block 3 Upper+ prescribes pull-ups weighted if you can hit ≥10 strict BW reps; otherwise run as a max-rep test. Programme base at week 1 was 6 strict reps. Assess your current BW AMRAP on W9 Pull or Upper+. If ≥10, add +2.5 kg to the `pullup` key.

---

## Flags

### 1. Hack squat stalled at 140 kg for all of Block 2

Hack squat has not moved across at least five logged Legs sessions (W5 through W8). The W7 check-in flagged this and recommended 145 kg for W8 Legs. It was not applied. Block 3 changes the rep scheme to 4×5-6 (from 4×6-8 in Block 2), so the lighter rep range may make 140 kg feel easier — but this does not excuse stalling. If W8 Legs hit the full Block 2 prescription, load **145 kg for W9 Legs**.

### 2. Leg curl stalled at 65 kg across all of Block 2

Same pattern as hack squat. Unchanged since at least W5. Block 3 prescribes 3×6-8 @ RPE 8.5 (tighter than Block 2's 3×8-10 @ RPE 8). If W8 Legs hit 3×8-10 at target RPE, advance to **70 kg for W9 Legs**.

### 3. Lat pulldown at 52 kg — unchanged since programme start

Pulldown has not moved across Block 1 or Block 2. Block 2 prescription was 3×8-10 @ RPE 8; Block 3 is 3×6-8 @ RPE 8. If Block 2 sets were submaximal (RPE well below 8), the two-session trigger does not apply as a blocker — bump proactively to **57 kg** and calibrate from there.

### 4. Incline BB and OHP unchanged since programme start

Incline BB (50 kg) and OHP (35 kg) were both flagged for advancement after W7 (→ 52.5 kg and 37.5 kg respectively). Neither was applied. These are entering Block 3 at the same loads they started Block 1 with. Block 3 lowers reps further (3×5-6 @ RPE 8.5), which makes it a poor time to run stale loads. Apply the W7 targets now unless W8 Push did not qualify.

### 5. Upper+ missed for three consecutive weeks (W6, W7, W8)

Block 2 Upper+ was the first block to include weighted dips as primary compound. Three missed sessions means zero weighted dip exposures across Block 2. W9 Upper+ ran BW dips and logged `top_of_range: true` — that closes the gap for BW, but Block 3 weighted dip work is now starting from scratch mid-peak. Establish the starting load (+5 kg minimum) this week and do not skip Upper+ again in Block 3.

### 6. Bench back-off ratio

Top set 65 kg / back-off 60 kg = 92%. If the back-offs at 60 kg feel genuinely heavy (RPE > 8.5) for 3×5, walk back to 57.5 kg. The back-off serves hypertrophy and technique volume — it should not be grinding sets.

---

## Next: Week 9 remaining sessions

**Block 3 — Strength Peak (weeks 9–11), RPE 8.5–9.** Compounds drop to 3×3-5 (Push/Pull) and 4×5-6 (Legs). Volume will be lower than Block 2 — that is by design, not a problem. Quality of execution at high RPE is the goal.

Priority checklist entering W9 Push/Pull/Legs:

1. **Hack squat** — if W8 Legs qualified, load 145 kg before W9 Legs. Four weeks at 140 kg is a hard stall regardless of block transition.
2. **Leg curl** — if W8 Legs qualified, load 70 kg.
3. **Lat pulldown** — if Block 2 sets were consistently sub-RPE, jump to 57 kg now.
4. **OHP + Incline BB** — apply the overdue advancement: OHP → 37.5 kg, Incline BB → 52.5 kg, unless W8 Push explicitly failed to qualify.
5. **Dip** — update `dip` key in app to 5 kg before next Upper+. Block 3 requires loaded dips.
6. **Bench back-off** — monitor RPE on 3×5 at 60 kg. Roll back to 57.5 kg if grinding.
7. **Pull-up BW test** — assess max strict reps this week to decide whether Block 3 runs weighted or as a max-rep test.
