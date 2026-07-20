# Week 06 Check-in — Block 2 (Intensification)

**Date:** 2026-07-20 · **Block:** 2 / 4 (weeks 5–8, RPE 8–8.5)

---

## Sessions logged

Two of four sessions recorded for Week 6 as of this check-in (Monday 2026-07-20). Pull and Upper+ are not in the log.

| Session | Date | Sets | Volume (kg) | Status |
|---------|------|-----:|------------:|--------|
| Push | Thu 2026-07-16 | 23 | 5,831 | logged |
| Legs | Sat 2026-07-18 | 20 | 11,132 | logged |
| Pull | — | — | — | not logged |
| Upper+ | — | — | — | not logged |
| **W6 partial** | | **43** | **16,963** | |

### Week-over-week (W5 → W6, logged sessions only)

| Session | W5 Sets | W5 Vol | W6 Sets | W6 Vol | Δ Sets | Δ Vol |
|---------|--------:|-------:|--------:|-------:|-------:|------:|
| Push | 23 | 5,831 | 23 | 5,831 | 0 | 0 |
| Legs | 20 | 11,132 | 20 | 11,132 | 0 | 0 |

Both sessions produced identical sets and volume figures versus Week 5. No load changes occurred on Push or Legs between the two Block 2 weeks. This is consistent with the 2-session trigger rule: the bump fires after, not during, the second qualifying session.

---

## Progression

Rule: top of rep range at target RPE for 2 consecutive Block 2 sessions → +2.5 kg upper compounds / +5 kg lower; accessories add reps first.

Week 6 Push and Week 6 Legs complete the 2-session Block 2 sample for those patterns. The trigger is eligible to fire now for Push and Legs if both sessions qualified.

### Push and Legs — trigger eligible

| Movement | Key | Current | Condition | Target if met |
|----------|-----|--------:|-----------|:-------------:|
| Bench Press | `bench` | 60 kg | W5 + W6 Push both at 4×6 @ RPE 8 | **62.5 kg** |
| Incline BB Press | `incline_bb` | 50 kg | W5 + W6 Push both at 4×8 @ RPE 8 | **52.5 kg** |
| Dumbbell OHP | `ohp` | 35 kg | W5 + W6 Push both at 3×8 @ RPE 8 | **37.5 kg** |
| Hack Squat | `hack_sq` | 140 kg | W5 + W6 Legs both at 4×8 @ RPE 8 | **145 kg** |
| Leg Press | `leg_press` | 215 kg | W5 + W6 Legs both at 4×10 @ RPE 8 | **220 kg** |
| Leg Curl | `leg_curl` | 65 kg | W5 + W6 Legs both at 3×10 @ RPE 8 | **70 kg** |

BSS (`bss`, 10 kg): add reps before weight. Only bump load once consistently hitting top of 8–10 rep range across two consecutive Block 2 sessions.

### Pull — one Block 2 session logged, cannot trigger yet

| Movement | Key | Current | Condition | Target if met |
|----------|-----|--------:|-----------|:-------------:|
| Deadlift | `deadlift` | 90 kg | W5 + W6 Pull both at 4×5 @ RPE 8 | 95 kg |
| Chest Supported Row | `cs_row` | 60 kg | W5 + W6 Pull both at 4×8 @ RPE 8 | 65 kg |
| Lat Pulldown | `pulldown` | 52 kg | W5 + W6 Pull both at 3×10 @ RPE 8 | 57 kg |

W6 Pull is not logged. If that session still happens this week, it counts as the second Block 2 pull and the deadlift trigger becomes eligible after it.

**Accessories (reps before weight):** BB Curl (`bb_curl`, 25 kg), Hammer Curl (`hammer`, 10 kg), Tricep Pushdown (`tri_pd`, 20 kg), Lateral Raise (`lat_raise`, 10 kg). Advance weight only once top of rep range is consistently hit across two Block 2 sessions.

---

## Flags

### 1. Pull and Upper+ not logged for Week 6

Push logged Thu 16 Jul, Legs logged Sat 18 Jul. Pull and Upper+ are absent as of Monday 20 Jul. If these sessions ran but were not synced, update state via the app. If they were skipped, Week 6 closes as a 2-session week — a second incomplete week in Block 2.

### 2. Bench at 60 kg for six consecutive weeks — progression decision is overdue

Bench has not moved since Week 1. Two Block 2 Push sessions are now in the log. If both W5 and W6 bench hit 4×6 @ RPE 8 cleanly, advance to **62.5 kg for Week 7** without further delay. If even one session fell short on reps, RPE, or form, hold and confirm after Week 7 Push. Six weeks at the same load on the programme's primary strength lift requires an explicit decision either way — do not carry the ambiguity into a third Block 2 week.

### 3. `dip` key still at 0 BW — must be updated before next Upper+

Block 2 Upper+ programmes weighted dip as the primary compound (4×6–8 @ RPE 8). The `dip` key in state.json still reads 0 BW. If any load was added in the W5 Upper+ session (11 Jul), update the key in the app immediately. If Upper+ was run BW, that is the last BW Upper+ session — load no lower than +2.5 kg for the next one. Logging a second Block 2 Upper+ at BW would leave the dip progression record incomplete entering Block 3.

### 4. `current_week` needs advancing to 7

State.json shows `current_week: 6`. Advance to **7** in the app once Week 6 is closed so the dashboard shows the correct Block 2 session variant. (`current_block` is correctly set to 2 — that flag from W5 has been resolved.)

### 5. Legs volume flat across both Block 2 sessions

Hack squat (140 kg) and leg press (215 kg) produced identical totals in W5 and W6. This is correct if no impromptu load adjustments were made — the trigger fires after the second qualifying session, which is now. If both Block 2 legs sessions qualified, apply hack_sq → 145 kg and leg_press → 220 kg for Week 7.

---

## Next week

**Week 7 — Block 2, Intensification (RPE 8–8.5).** Third week of Block 2. Session structure unchanged: 4×5–6 compounds at RPE 8, 3×8–10 accessories.

Priority actions entering Week 7:

1. **Bench** — if trigger met across both Block 2 Push sessions, load **62.5 kg**. Do not enter a third Block 2 Push at 60 kg without a specific reason.
2. **Legs** — apply +5 kg to hack squat and leg press if both sessions qualified: hack_sq → 145 kg, leg_press → 220 kg. Track RPE on first set.
3. **Weighted dip** — confirm `dip` key updated to actual load in kg before Upper+. Log the weight.
4. **Pull** — complete W6 Pull if still possible, or treat W7 Pull as the second Block 2 pull; deadlift trigger eligible after it. Deadlift target if trigger fires: 95 kg.
