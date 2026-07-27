# Week 07 Check-in — Block 2 (Intensification)

**Date:** 2026-07-27 · **Block:** 2 / 4 (weeks 5–8, RPE 8–8.5)

---

## Sessions logged

Three of four sessions recorded for Week 7. Upper+ was not logged for the second consecutive week.

| Session | Date | Sets | Volume (kg) | Status |
|---------|------|-----:|------------:|--------|
| Push | Mon 2026-07-20 | 23 | 5,886 | logged |
| Pull | Tue 2026-07-21 | 25 | 6,287 | logged |
| Legs | Thu 2026-07-23 | 20 | 11,937 | logged |
| Upper+ | — | — | — | not logged |
| **W7 total (3 sessions)** | | **68** | **24,110** | |

### Week-over-week (W6 → W7, matched sessions only)

W6 Pull was not logged, so Pull compares to W5.

| Session | Prior Sets | Prior Vol | W7 Sets | W7 Vol | Δ Sets | Δ Vol |
|---------|----------:|----------:|--------:|-------:|-------:|------:|
| Push (vs W6) | 23 | 5,831 | 23 | 5,886 | 0 | +55 |
| Pull (vs W5) | 25 | 6,174 | 25 | 6,287 | 0 | +113 |
| Legs (vs W6) | 20 | 11,132 | 20 | 11,937 | 0 | +805 |

Volume increased across all three sessions. The Legs jump (+805 kg) aligns with a load bump on leg press (215 → 225 kg in state.json). Push volume increase (+55 kg) is consistent with bench moving from 60 → 62.5 kg. Pull increase (+113 kg) likely reflects load or rep improvements on deadlift or rows.

---

## Progression

Rule: top of rep range at target RPE for 2 consecutive sessions → +2.5 kg upper compounds / +5 kg lower compounds; accessories add reps before weight.

### Applied since last check-in

| Movement | Key | Previous | Current | Notes |
|----------|-----|:--------:|:-------:|-------|
| Bench Press | `bench` | 60 kg | **62.5 kg** | W5+W6 trigger applied ✓ |
| Leg Press | `leg_press` | 215 kg | **225 kg** | +10 kg total (two consecutive +5 bumps, or one larger jump) |

Bench was correctly advanced. Leg press moved +10 rather than the standard +5 — if this was two separate trigger events applied together, that is consistent with the rule. If it was a single manual jump, note that 225 kg is now the working load entering the final Block 2 Legs session and Block 3.

### Trigger-eligible after W7

**Pull — W5 + W7 are both Block 2 Pull sessions (W6 Pull was skipped)**

| Movement | Key | Current | Condition | Target if met |
|----------|-----|--------:|-----------|:-------------:|
| Deadlift | `deadlift` | 90 kg | W5 + W7 Pull both at 4×5 @ RPE 8 | **95 kg** |
| Chest Supported Row | `cs_row` | 60 kg | W5 + W7 Pull both at 4×8 @ RPE 8 | **65 kg** |
| Lat Pulldown | `pulldown` | 52 kg | W5 + W7 Pull both at 3×10 @ RPE 8 | **57 kg** |

W5 and W7 are the first and second Block 2 Pull sessions — the W6 gap does not reset the trigger count. If both sessions qualified, advance the above loads for W8 Pull.

**Push — W6 + W7 are sessions 2 and 3 of Block 2 Push**

| Movement | Key | Current | Condition | Target if met |
|----------|-----|--------:|-----------|:-------------:|
| Incline BB Press | `incline_bb` | 50 kg | W6 + W7 Push both at 4×8 @ RPE 8 | **52.5 kg** |
| Dumbbell OHP | `ohp` | 35 kg | W6 + W7 Push both at 3×8 @ RPE 8 | **37.5 kg** |

Bench (62.5 kg) is in its first Block 2 session at the new load. W7 is session 1 of 2 needed at 62.5 kg. If W8 Push hits 4×5-6 @ RPE 8, bench advances to **65 kg** entering Block 3.

**Legs — W7 is the third Block 2 Legs session; hack squat and leg curl not yet advanced**

| Movement | Key | Current | Condition | Target if met |
|----------|-----|--------:|-----------|:-------------:|
| Hack Squat | `hack_sq` | 140 kg | W6 + W7 Legs both at 4×8 @ RPE 8 | **145 kg** |
| Leg Curl | `leg_curl` | 65 kg | W6 + W7 Legs both at 3×10 @ RPE 8 | **70 kg** |

Hack squat and leg curl were trigger-eligible after W5+W6 but were not advanced. W6+W7 provide a second opportunity. These should be resolved before W8 Legs — three Block 2 Legs sessions at the same load is at the edge of stalling.

**Accessories (reps before weight):** Lateral Raise (`lat_raise`, 10 kg), Tricep Pushdown (`tri_pd`, 20 kg), BB Curl (`bb_curl`, 25 kg), Hammer Curl (`hammer`, 10 kg). Advance load only once top of rep range is consistently hit across two Block 2 sessions.

---

## Flags

### 1. Upper+ missed for the second consecutive week (W6 and W7)

Block 2 Upper+ programmes **weighted dip as the primary compound** (4×6-8 @ RPE 8). Two missed Upper+ sessions in a 4-week block means the weighted dip protocol has had zero Block 2 exposures. The `dip` key remains at 0 BW in state.json.

Week 8 is the last Block 2 week. If Upper+ is skipped again, weighted dip carries over into Block 3 with no loading baseline, which will require improvising a starting weight during the Block 3 Upper+ instead of progressing from an established load. Run Upper+ in W8.

### 2. `dip` key still at 0 BW — must be loaded before W8 Upper+

Before logging W8 Upper+, set the `dip` key to an actual kg value in the app. Block 2 calls for +2.5–5 kg minimum. If the W5 Upper+ session (11 Jul) included any loaded dip, that weight should have been recorded then. Set it now at whatever load allows 4×6 @ RPE 8 in W8.

### 3. Hack squat stalled at 140 kg for three consecutive Block 2 Legs sessions

Hack squat was trigger-eligible after W5+W6. It was not advanced. W7 is now a third Block 2 session at 140 kg. Unless W7 was clearly not at the top of range (i.e., reps fell short or RPE exceeded 8.5), advance to **145 kg for W8 Legs**. Do not enter Block 3 without resolving this.

### 4. Leg curl stalled at 65 kg for three consecutive Block 2 Legs sessions

Same pattern as hack squat. Trigger-eligible after W5+W6, not advanced. If W7 leg curl hit 3×10 @ RPE 8, bump to **70 kg for W8 Legs**.

### 5. Leg press at 225 kg — verify the load history

Leg press went from 215 kg (W5/W6) to 225 kg (current), a +10 jump rather than the standard +5. If two separate +5 triggers were batched (W5+W6 qualifying → +5 to 220; W6+W7 qualifying → +5 to 225), that is correct. If a single manual edit jumped +10 to accelerate, note that W7 Legs volume confirms the higher load was workable (+805 kg vol increase vs W6). Track RPE on first set in W8 — entering Block 3 at an unvalidated load is a risk.

### 6. `current_week` is correct at 7 — no action needed

State.json shows `current_week: 7`, consistent with the highest logged week. The W6 flag has been resolved.

---

## Next week

**Week 8 — Block 2, Intensification (RPE 8–8.5).** Final week of Block 2. Week 9 begins Block 3 (Strength Peak, RPE 8.5–9), where compounds drop to 3×3-5 and intensity climbs sharply.

Priority actions entering W8:

1. **Hack squat** — if W6+W7 Legs both qualified at 4×8 @ RPE 8, load **145 kg** before the session. This is overdue.
2. **Leg curl** — if W6+W7 Legs both qualified, load **70 kg**.
3. **Deadlift / CS Row / Pulldown** — if W5+W7 Pull both qualified, apply bumps (deadlift → 95 kg, cs_row → 65 kg, pulldown → 57 kg) before W8 Pull.
4. **Upper+** — do not skip a third consecutive week. Set the `dip` key to an actual kg load first. Log the session.
5. **Bench** — W8 Push is the second Block 2 session at 62.5 kg. If clean at 4×5-6 @ RPE 8, the trigger fires and bench enters Block 3 at **65 kg**. This is the primary strength lift — get that session in and hit the reps.
6. **Incline BB / OHP** — if W6+W7 Push both qualified, advance incline_bb → 52.5 kg and ohp → 37.5 kg for W8.
7. **Advance current_week to 8** in the app once W7 is closed.
