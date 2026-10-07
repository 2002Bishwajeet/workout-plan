# Week 09 Check-in — Block 3, Strength Peak

**Date:** 2026-08-10 · **Block:** 3 (weeks 9–11, RPE 8.5–9)

*This review supersedes the earlier partial W9 draft (written after Upper+ only). All four sessions are now logged.*

---

## Week 9 sessions

Full week — all four sessions completed. First time Upper+ has been logged since W5.

| Session | Date | Sets | Volume (kg) | vs W8 (core sets) | vs W8 (core vol) |
|---------|------|-----:|------------:|------------------:|-----------------:|
| Upper+ | Sun 2026-08-02 | 21 | 1,761 | (W8 missed) | (W8 missed) |
| Push | Wed 2026-08-05 | 21 | 4,739 | −2 | −1,270 |
| Pull | Thu 2026-08-06 | 22 | 5,255 | −3 | −1,172 |
| Legs | Sat 2026-08-08 | 20 | 10,296 | 0 | −1,954 |
| **W9 total** | | **84** | **22,051** | — | — |

**W8 core (Push/Pull/Legs):** 68 sets / 24,686 kg  
**W9 core (Push/Pull/Legs):** 63 sets / 20,290 kg — down 17.8%

The volume drop is structural, not a fatigue signal. Block 3 cuts each compound from 4 sets to 3 and drops reps from 5-6 to 3-5. Lower total volume at higher peak load is the design. No concern.

---

## Progression

### Applied during W9 (committed to state.json)

| Movement | Key | From | To | Notes |
|----------|-----|-----:|---:|-------|
| Bench Press | `bench` | 65 kg | **67.5 kg** | W9 Push; +2.5 kg standard increment |
| Incline BB Press | `incline_bb` | 50 kg | **55 kg** | W9 Push; +5 kg catch-up jump (stalled since Block 1) |
| Deadlift | `deadlift` | 90 kg | **100 kg** | W9 Pull; +10 kg catch-up; W9 `top_of_range: true` |
| Chest Supported Row | `cs_row` | 65 kg | **73 kg** | W9 Pull; +8 kg catch-up |
| Lat Pulldown | `pulldown` | 52 kg | **59 kg** | W9 Pull; +7 kg to address programme-long stall |
| Leg Press | `leg_press` | 235 kg | **243 kg** | W9 Legs; W8+W9 both `top_of_range: true` → +8 kg |
| Bench Back-off | `bench_bo` | 55 kg | **60 kg** | W9 Upper+ (Aug 2); 60/67.5 = 89% — within target ratio |

Six lifts advanced in one week. Incline BB, Deadlift, CS Row, and Pulldown were all overdue; the larger-than-standard jumps are catch-up calibration, not rule violations.

**Deadlift overshoot risk:** 90 → 100 kg (+11%) is a large single-week jump. If W10 Pull triples feel above RPE 9, the anchor was missed — walk back to 95 kg immediately. Do not grind at 100 kg if form breaks.

### Conditional recommendations for W10

These are framed conditionally because the log stores per-session totals, not per-set reps or RPE.

| Movement | Key | Current | Condition | Target if met |
|----------|-----|--------:|-----------|:-------------:|
| Deadlift | `deadlift` | 100 kg | W10 Pull hits 3×3 @ RPE ≤9 | **105 kg** |
| Leg Press | `leg_press` | 243 kg | W10 Legs hits 3×8-10 @ RPE 8 | **248 kg** |
| CS Row | `cs_row` | 73 kg | W10 Pull hits 3×6-8 @ RPE 8.5 (second session at 73 kg) | **75.5 kg** |
| Hack Squat | `hack_sq` | 140 kg | If W9 Legs hit 4×5-6 @ RPE ≤9 (see Flag 1) | **145 kg** |
| OHP | `ohp` | 35 kg | Apply proactively — see Flag 2 | **37.5 kg** |
| Leg Curl | `leg_curl` | 65 kg | If W9 Legs hit 3×6-8 @ RPE 8.5 — see Flag 3 | **70 kg** |
| BSS | `bss` | 10 kg | Apply proactively — see Flag 4 | **12.5 kg** |
| Bench | `bench` | 67.5 kg | W9 Push `top_of_range: false` — hold; reassess W10 Push | — |
| Lat Pulldown | `pulldown` | 59 kg | First session at 59 kg — needs W10 Pull to qualify | — |

---

## Flags

### 1. Hack squat stalled at 140 kg — entire 9-week programme

No `top_of_range` flag has ever been recorded for `hack_sq`. Weight unchanged across all logged legs sessions from W1 through W9. This is the most persistent stall in the programme. Block 3 prescribes 4×5-6 @ RPE 8.5; if W9 Legs hit that prescription without grinding above RPE 9, load **145 kg for W10 Legs**. W10 is the last session where a weight bump can get two rounds of exposure before the deload. Do not enter the deload at 140 kg.

### 2. OHP at 35 kg since programme start

Nine weeks unchanged. Block 3 prescribes 3×5-6 @ RPE 8.5. If W9 Push completed 3×6 at sub-RPE-9, the weight is stale. **Advance to 37.5 kg before W10 Push** unless W9 Push was a legitimate grind at 35 kg.

### 3. Leg curl at 65 kg since W5 at minimum

Five-plus logged legs sessions with no change. Block 3 is 3×6-8 @ RPE 8.5. If W9 Legs hit the full prescription, advance to **70 kg for W10 Legs**.

### 4. BSS at 10 kg since W1 calibration

Nine weeks unchanged on a tracked compound. At 3×6-8 @ RPE 8 in Block 3, 10 kg should be submaximal for any intermediate athlete. **Advance to 12.5 kg before W10 Legs** and calibrate from there.

### 5. Dip — still 0 BW; Block 3 requires loaded dips

W9 Upper+ logged `top_of_range.dip: true` for BW dips. The `dip` key remains `0 BW`. Block 3 prescribes weighted dip 4×5-6 @ RPE 8.5. **Before W10 Upper+:** update the `dip` key in the app to at least **5 kg** and flip the unit from BW to kg. If 4×6 at +5 kg is submaximal, load +7.5 or +10 kg. Running a third BW Upper+ session in Block 3 is not acceptable — weighted dips were due at the start of Block 2.

### 6. Pull-up BW assessment overdue

Block 3 prescribes weighted pull-ups if you can hit ≥10 strict BW reps; otherwise max-rep test. The `pullup` key is `0 BW` and no AMRAP result has been logged in the app. W10 Pull is the last opportunity to assess and act before W11 (the spec designates W11 as the max-rep test week). Perform a strict BW pull-up AMRAP early in W10 Pull. If ≥10 reps: load `pullup` to +2.5 kg for W11. If < 10: run W11 as a bodyweight max-rep test per programme.

---

## Next: Week 10 — Block 3, Strength Peak

**Block:** 3 · **Weeks:** 9–11 · **RPE:** 8.5–9  
**Where we are:** Week 10 of 11 in the strength phase. Week 11 is the final peak. Week 12 deloads. Two working weeks left to consolidate the load advances made in W9.

Session structure is identical to W9 — same exercises, same rep targets, same RPE ceiling. Progressive load is the only variable.

**Pre-session checklist:**

| Action | Priority | Session |
|--------|----------|---------|
| Load `dip` → 5 kg in app | Critical | Before Upper+ |
| Advance `hack_sq` → 145 kg | High | Before Legs |
| Advance `ohp` → 37.5 kg | High | Before Push |
| Advance `leg_curl` → 70 kg | High | Before Legs |
| Advance `bss` → 12.5 kg | Medium | Before Legs |
| Monitor deadlift at 100 kg | Critical | Pull |
| Pull-up strict AMRAP test | High | Pull |
| Advance `deadlift` → 105 kg if triples feel right | Conditional | After Pull |
| Advance `leg_press` → 248 kg if sets qualify | Conditional | After Legs |

---

Solid execution in W9. All four sessions logged, six lifts advanced, and Block 3 core volume is tracking correctly lower. The catch-up jumps on Deadlift, Pulldown, and CS Row need one more session to confirm the loads landed correctly. Addresses the stalled accessories (hack squat, OHP, leg curl, BSS) in W10 — they should not enter the deload unchanged for a second straight block.
