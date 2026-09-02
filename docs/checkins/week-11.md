# Week 11 Check-in — Block 3, Strength Peak (Final Working Week)

**Review date:** 2026-08-31 · **Block:** 3 (weeks 9–11, RPE 8.5–9)

---

## Week 11 sessions

| Session | Date | Sets | Volume (kg) | vs W10 |
|---------|------|-----:|------------:|--------|
| Pull | Wed 2026-08-27 | 22 | 5,633 | -45 (-0.8%) |
| Push | Thu 2026-08-28 | 21 | 4,821 | flat |
| Legs | — | — | — | **missed** |
| Upper+ | — | — | — | **missed** |
| **W11 total (2 sessions)** | | **43** | **10,454** | — |

**W10 PPL baseline (3 sessions):** 63 sets / 21,015 kg  
W11 has only two sessions logged. The Legs and Upper+ sessions were not completed. W11 was the final working week of the 12-week programme; the missed sessions cannot be recovered — the deload is next.

Volume on the two sessions that did land is flat-to-slightly-down vs W10 equivalents, which is expected in a peak week.

---

## Progression

### Deadlift — autoregulated down, still cleared range

The weight_history shows the deadlift bouncing on 2026-08-27 (W11 Pull day) before settling at 100 kg ahead of the session (logged ~16:51 UTC). Volume confirms it: W10 Pull was 5,678 kg with deadlift at 105 kg; W11 Pull is 5,633 kg — exactly 45 kg less, i.e. 5 kg × 9 reps (3×3) — consistent with 100 kg.

Athlete confirmed: this was a deliberate call, not an app error — fatigue that day, so the load was dropped from 105 to 100 kg before the session. Even at the reduced weight, `top_of_range.deadlift: true` was still logged. That's the second consecutive session clearing the range at 100 kg (W10 also cleared it there before the advance to 105 was applied), so the progression rule still stands: **advance deadlift to 105 kg** for the next working block. Autoregulating down on a tired day and still hitting the range is a good sign, not a concern.

The app currently shows 100 kg. This should be updated to 105 kg before or after the deload so the post-programme state is clean.

### Bench — three consecutive false in Block 3

| Session | top_of_range.bench |
|---------|-------------------|
| W9 Push | false |
| W10 Push | false |
| W11 Push | false |

Bench is at 67.5 kg. Three sessions in Block 3 (3×3–5 @ RPE 8.5–9) without hitting the top of the rep range. This is not a failure — it means the weight is in the right zone for the peak block. **Hold at 67.5 kg through the deload.** If continuing to a second programme, re-enter Block 1 at 67.5 kg and let the progression rule drive it.

### Remaining working weights — no changes this week

| Key | Name | Current weight | Status |
|-----|------|---------------:|--------|
| `bench` | Bench Press | 67.5 kg | Hold — three false in B3 |
| `incline_bb` | Incline BB Press | 55 kg | No data W11; hold |
| `ohp` | OHP | 40 kg | No data W11; hold |
| `deadlift` | Deadlift | 100 kg | **Advance to 105 kg** (see above) |
| `pulldown` | Lat Pulldown | 59 kg | No W11 data for rule |
| `cs_row` | Chest Supported Row | 91 kg | First real W11 test done; hold |
| `hack_sq` | Hack Squat | 140 kg | **Unchanged for entire programme** |
| `leg_press` | Leg Press | 253 kg | W11 Legs missed |
| `bss` | BSS | 10 kg | **Unchanged since W1 calibration** |
| `leg_curl` | Leg Curl | 65 kg | **Unchanged for 10+ sessions** |
| `dip` | Dip | 0 BW | **Never loaded — see Flag 3** |

---

## Flags

### 1. Legs missed — programme closes without a single progression on hack squat, BSS, or leg curl

W11 was the final working legs session of the 12-week programme. The deload (W12) uses ~50% volume and reduced RPE; it is not a training stimulus. The three lower-body accessories that were flagged across five consecutive check-ins never moved:

- **Hack Squat (`hack_sq`):** 140 kg since the Week 1 calibration session. 11 weeks, three complete blocks, zero progression.
- **BSS (`bss`):** 10 kg since Week 1 calibration. Same.
- **Leg Curl (`leg_curl`):** 65 kg since at least Week 5. No movement across Blocks 2 and 3.

These stalls are on record. The programme's lower-body accessory development is incomplete. When beginning a new block or programme, set realistic starting points: hack squat 145 kg, BSS 12.5 kg, leg curl 67.5 kg, and apply the progression rule properly from there.

### 2. Upper+ missed — dip never loaded across Blocks 2 and 3

The dip (`dip`) key is 0 BW. The programme spec prescribes weighted dip starting in Block 2, Week 5. The Upper+ session has been missed or skipped in many weeks; in the weeks where it was logged, the dip was still at bodyweight despite W9 Upper+ logging `top_of_range.dip: true`. W11 Upper+ (the final Upper+ session of the programme) was not logged. The programme ends without a single weighted dip rep recorded.

For the next programme: load dip at minimum +5 kg from the first Upper+ session.

### 3. Pull-up max-rep test not done

Per spec, W11 Pull is the designated pull-up max-rep test (or first weighted set if ≥10 strict reps confirmed). The test was not noted in the log (the `pullup` key remains 0 BW, no AMRAP result recorded). If you did perform pull-ups during W11 Pull, manually note the count somewhere before the context is lost — it sets the baseline for any continuation.

Decision tree for next programme:
- ≥10 strict reps: begin weighted pull-up in Block 2
- <10 reps: note the count as the baseline; continue bodyweight AMRAP through Block 1

### 4. Deadlift sitting at 100 kg — should be 105 kg

Per the analysis above, two consecutive `top_of_range: true` at 100 kg (W10 and W11). The advance to 105 was applied and then reversed before the W11 session. **Update `deadlift` to 105 kg in the app.** The deload prescription is 3×3 @ RPE 6–7 — running it at 100 or 105 during a deload is immaterial, but closing the programme with the correct state avoids confusion at the next start.

### 5. current_block shows 2 in state.json

`state.json` reports `"current_block": 2`. Weeks 9–11 are Block 3. This is a display issue only — the app dashboard may show incorrect block labels. Update via the app.

---

## Week 12 — Deload (Block 4)

**Block:** 4 · **RPE:** 6–7 · **Volume:** ~50% of working weeks

This is not a training stimulus. The goal is to flush accumulated fatigue before the programme ends (or a new block begins). Do not push RPE; do not attempt PRs; keep reps well short of failure. Every compound stays 2–3 reps in reserve.

| Session | Prescription |
|---------|-------------|
| **Push** | Bench 3×5 @ 67.5 kg (RPE 6–7) · Incline BB 2×8 @ 55 kg · Machine Press 2×10 · Lat Raise 2×12 · Pike Push-up 2×submax |
| **Pull** | Deadlift 3×3 @ 100 kg (RPE 6–7) · Pull-up 3×submax BW · CS Row 2×10 · Pulldown 2×12 @ 59 kg · Face Pull 2×15 |
| **Legs** | Hack Squat 3×8 @ 140 kg · BSS 2×10 @ 10 kg · Leg Curl 2×10 @ 65 kg · Standing Calf 2×12 · Hanging Leg Raise 2×12 |
| **Upper+** | Bench 3×5 · Dip 2×8 BW · Pull-up 2×submax · Incline DB Curl 2×12 · Ab Wheel 2×10 |

**Post-deload checklist (set these in the app before starting any new block):**

| Action | Priority |
|--------|----------|
| Advance `deadlift` → **105 kg** | High |
| Set `hack_sq` → **145 kg** | Critical |
| Set `bss` → **12.5 kg** | Critical |
| Set `leg_curl` → **67.5 kg** | High |
| Set `dip` to **5 kg**, change unit to **kg** | Critical |
| Update `current_block` → **3 (or 1 if restarting)** | Medium |
| Note pull-up max-rep count | High |
