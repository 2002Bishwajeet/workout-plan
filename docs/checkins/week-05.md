# Week 05 Check-in — Block 2 (Intensification)

**Date:** 2026-07-13 · **Block:** 2 / 4 (weeks 5–8, RPE 8–8.5)

---

## Sessions logged

All four sessions completed for Week 5 — the second full week in the log alongside Week 1 and Week 4.

| Session | Date | Sets | Volume (kg) |
|---------|------|-----:|------------:|
| Pull | Thu 2026-07-03 | 25 | 6,174 |
| Push | Mon 2026-07-06 | 23 | 5,831 |
| Legs | Wed 2026-07-08 | 20 | 11,132 |
| Upper+ | Sat 2026-07-11 | 21 | 1,926 |
| **Total W5** | | **89** | **25,063** |

### Week-over-week comparison (W4 → W5)

| Session | W4 Sets | W4 Vol | W5 Sets | W5 Vol | Δ Sets | Δ Vol |
|---------|--------:|-------:|--------:|-------:|-------:|------:|
| Push | 22 | 6,654 | 23 | 5,831 | +1 | −823 |
| Pull | 23 | 6,549 | 25 | 6,174 | +2 | −375 |
| Legs | 20 | 10,382 | 20 | 11,132 | 0 | +750 |
| Upper+ | 20 | 2,346 | 21 | 1,926 | +1 | −420 |
| **Total** | **85** | **25,931** | **89** | **25,063** | **+4** | **−868** |

Total sets rose +4 while total volume fell −868 kg. This is the expected Block 2 signature: compounds shift from 6–8 to 5–6 reps and accessories from 10–12 to 8–10, so volume per set drops at higher intensity. Not a regression.

Legs volume increased (+750 kg) reflecting heavier absolute loads on hack squat and leg press relative to Week 4. Positive.

---

## Progression

Rule: top of rep range at target RPE for 2 consecutive Block 2 sessions → +2.5 kg upper compounds / +5 kg lower; accessories add reps before weight.

Week 5 is the first Block 2 session for every movement pattern. No 2-consecutive-session condition has been met yet. All recommendations are conditional on Week 6 performance.

| Movement | Key | Current | Condition | Target if met |
|----------|-----|--------:|-----------|:-------------:|
| Bench Press | `bench` | 60 kg | 2× Block 2 Push at 4×6 @ RPE 8 | 62.5 kg |
| Incline BB Press | `incline_bb` | 50 kg | 2× Block 2 Push at 4×8 @ RPE 8 | 52.5 kg |
| Dumbbell OHP | `ohp` | 35 kg | 2× Block 2 Push at 3×8 @ RPE 8 | 37.5 kg |
| Deadlift | `deadlift` | 90 kg | 2× Block 2 Pull at 4×5 @ RPE 8 | 95 kg |
| Chest Supported Row | `cs_row` | 60 kg | 2× Block 2 Pull at 4×8 @ RPE 8 | 65 kg |
| Lat Pulldown | `pulldown` | 52 kg | 2× Block 2 Pull at 3×10 @ RPE 8 | 57 kg |
| Hack Squat | `hack_sq` | 140 kg | 2× Block 2 Legs at 4×8 @ RPE 8 | 145 kg |
| Leg Press | `leg_press` | 215 kg | 2× Block 2 Legs at 4×10 @ RPE 8 | 220 kg |
| Leg Curl | `leg_curl` | 65 kg | 2× Block 2 Legs at 3×10 @ RPE 8 | 70 kg |

**Accessories (add reps before weight):** BB Curl (`bb_curl`, 25 kg), Hammer Curl (`hammer`, 10 kg), BSS (`bss`, 10 kg), Tricep Pushdown (`tri_pd`, 20 kg), Lateral Raise (`lat_raise`, 10 kg). Only advance weight once consistently hitting the top of the rep range across two consecutive sessions.

**Weighted dip:** Block 2 Upper+ programmes Weighted Dip at 4×6–8 @ RPE 8 as the primary compound. The `dip` key is still showing 0 BW in state.json. If any weight was added on the Jul 11 session, update the `dip` key in the app to the actual load used. If the session was run at BW, that is fine for the first Block 2 exposure — start no higher than +2.5 kg on the next Upper+ regardless of how light it feels. Tendon adaptation lags strength.

---

## Flags

### 1. First complete four-session week since Week 4

All sessions completed: Pull → Push → Legs → Upper+. The accumulation gap flagged in prior check-ins (Weeks 2–3 ran 2 sessions each) is no longer growing. Weeks 2 and 3 are still structural debt on the legs side specifically, but the pattern of incomplete weeks is broken.

### 2. Bench unchanged at 60 kg for all five logged weeks

Bench has not moved across all of Block 1 and into Block 2 Week 5. This needs a clear answer before Week 7: either the 4×6 @ RPE 8 Block 2 condition was not met in Week 5 (valid — hold at 60 kg), or it was met and the weight needs updating. Confirm which after Week 6 Push. If both Block 2 Push sessions genuinely hit 4×6 @ RPE 8, apply 62.5 kg for Week 7 without further delay. Five weeks without a progression signal on the primary strength lift is the programme's largest open item.

### 3. `current_block` in state.json is 1 — should be 2

`current_week` is correctly set to 6, but `current_block` still reads 1. We are in Block 2 (weeks 5–8). Update `current_block` to 2 in the app so dashboard display reflects the correct block.

### 4. Legs accumulation remains thin entering Block 2 intensity

Only 3 Legs sessions logged across 5 weeks (Week 1 calibration, Week 4, Week 5). Block 2 raises leg press to 4×8–10 at RPE 8 and hack squat stays 4×6–8. Current loads (hack squat 140 kg, leg press 215 kg) are heavy in absolute terms with limited base under them. Track RPE on hack squat and leg press carefully in Week 6; if either session lands consistently above RPE 8.5, hold load rather than auto-progressing.

### 5. `dip` key — confirm weight entered before next Upper+

Block 2 Upper+ is weighted dip as the primary compound. The key still shows BW. Do not log a second Block 2 Upper+ session before updating the key; otherwise the progression record is incomplete for this movement entering Block 3.

---

## Next week

**Week 6 — Block 2, Intensification (RPE 8–8.5).** Second week of Block 2.

Session structure is unchanged: 4×5–6 on compounds at RPE 8, 3×8–10 on accessories. This is the first week where 2-consecutive-session data is available. After Week 6, apply the +2.5/+5 kg rule to any lift that qualified across both Block 2 sessions.

Priority order:
1. **Push** — second Block 2 bench session. Note whether 4×6 at RPE 8 was hit in Week 5. Same target this week.
2. **Pull** — second Block 2 deadlift session. First time the +5 kg rule can fire if Week 5 Pull qualified.
3. **Legs** — third Block 2 legs session overall, second in Block 2. Manage RPE given thin Block 1 base.
4. **Upper+** — confirm `dip` key updated to kg before this session. Log load used.
