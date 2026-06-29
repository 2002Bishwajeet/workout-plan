# Week 04 Check-in — Block 1 (Volume Base)

**Date:** 2026-06-29 · **Block:** 1 / 4 (weeks 1–4, RPE 7–8)

---

## Sessions logged

| Session | Status | Sets | Volume (kg) |
|---------|--------|-----:|------------:|
| Push | Done (Mon 2026-06-23) | 22 | 6,654 |
| Pull | Done (Mon 2026-06-23) | 23 | 6,549 |
| Legs | Swapped for swim (1 exercise ticked, then pool) | — | — |
| Upper+ | Skipped | — | — |

2 of 4 sessions logged. Push and Pull were completed as a same-day double on June 23 (Push ~15:45, Pull ~17:40). Legs was partially started (1 exercise ticked) then swapped for a swim — same pattern as Weeks 2 and 3 (cycling, swim). The session remains open in `in_progress`. Upper+ was not started.

### Week-over-week volume

| Session | Wk 3 Sets | Wk 3 Vol (kg) | Wk 4 Sets | Wk 4 Vol (kg) | Delta |
|---------|----------:|--------------:|----------:|--------------:|------:|
| Push | 22 | 6,654 | 22 | 6,654 | 0 |
| Pull | 23 | 6,549 | 23 | 6,549 | 0 |
| Legs | — | — | — | — | — |
| Upper+ | — | — | — | — | — |
| **Total** | **45** | **13,203** | **45** | **13,203** | **0** |

Volume is flat vs. Week 3 — Push and Pull both matched to the kilogram. This is expected within a block (same working weights, same rep targets), but see Flag #3.

---

## Progression

Rule: top of rep range at target RPE for 2 consecutive sessions → +2.5 kg upper compounds / +5 kg lower; accessories add reps first.

**Bench (`bench`, 60 kg):** Two consecutive Push sessions logged (Wk 3 and Wk 4), identical volume both times. Block 1 target is 4×6–8 at RPE 7–8. If both sessions hit 6–8 reps at target RPE, bump to **62.5 kg**.

**Deadlift (`deadlift`, 80 kg):** Four consecutive Pull sessions logged (Wk 1–4). Wk 3 and Wk 4 both posted 6,549 kg at 23 sets. Block 1 target is 4×5 at RPE 7–8. If both Wk 3 and Wk 4 Pull sessions hit that standard, bump to **85 kg**.

**Incline BB Press (`incline_bb`, 45 kg):** 3×8–10 at RPE 7–8. Two consecutive Push sessions logged. If both sessions hit 3×10 at RPE 7–8, bump to **47.5 kg**.

**OHP (`ohp`, 35 kg):** 3×8–10 at RPE 7–8. Two consecutive Push sessions. If both hit top of range at target RPE, bump to **37.5 kg**.

**Chest Supported Row (`cs_row`, 60 kg):** 3×8–10 at RPE 7–8. Two consecutive Pull sessions. If both hit 3×10 at RPE 7–8, bump to **65 kg**.

**Lat Pulldown (`pulldown`, 52 kg):** Accessory, 3×10–12 at RPE 7. Add reps before weight. Two consecutive Pull sessions — if hitting 12 reps comfortably both sessions, consider moving to **55 kg** only after confirming rep quality and ease.

**BB Curl (`bb_curl`, 25 kg), Hammer Curl (`hammer`, 10 kg):** Accessories — add reps first. No weight change warranted without confirmed top-of-range performance across two sessions.

| Movement | Key | Current | Conditional target |
|----------|-----|--------:|-------------------:|
| Bench Press | `bench` | 60 kg | → 62.5 kg |
| Deadlift | `deadlift` | 80 kg | → 85 kg |
| Incline BB Press | `incline_bb` | 45 kg | → 47.5 kg |
| OHP | `ohp` | 35 kg | → 37.5 kg |
| Chest Supported Row | `cs_row` | 60 kg | → 65 kg |
| Lat Pulldown | `pulldown` | 52 kg | → 55 kg (if 12 reps both sessions) |

---

## Flags

### 1. Legs: 1 completed gym session across 4 weeks — critical gap

Week 1 Legs is the only completed gym session (calibration: `hack_sq` 140 kg, `bss` 10 kg, `leg_press` 160 kg). Weeks 2–4 were swapped for cross-training: cycling (Week 2), swim (Week 3), swim again after 1 exercise (Week 4). The cross-training is legitimate active recovery, but the result is that lower-body strength volume — hack squat, leg press, BSS, leg curl, leg extension — has had one session in four weeks. Block 2 Legs increases Leg Press to 4×8–10 and bumps RPE to 8; entering that without accumulated base is a risk. Clear the open `4-legs-1` session in the app (tap Close to reset it), and make Legs the non-negotiable first session of Week 5.

### 2. Push and Pull done same day — quality check needed

Both sessions were logged on the same afternoon (Push ~15:45, Pull ~17:40). A Push-Pull double compresses recovery and likely means either session was run at reduced intensity. If rep quality fell short of 6–8 on bench or 4×5 on deadlift, do not apply the progression bump — hold weights and get a clean single session at each before advancing.

### 3. Volume flat vs. Week 3

Push and Pull matched Week 3 to the kilogram (6,654 kg and 6,549 kg respectively). This is consistent with holding the same working weights. If either session felt well below RPE 7–8, the working weights may be conservative — note it and consider nudging up independently of the 2-session rule.

### 4. Advance current_week to 5

`current_week` is 4 in state.json. Today (June 29) is the start of Week 5. Advance `current_week` to 5 in the app so the dashboard loads the Block 2 session templates. Block 2 is structurally different (see below) — the correct template matters.

### 5. Upper+: missed Weeks 3 and 4

Upper+ has not been logged since Week 2 (June 13). Dip volume has been near zero since then, and pull-up volume is only what the Pull sessions provide. Block 2 Upper+ introduces weighted dip as a primary compound — that transition will be harder without the accumulated BW dip volume from Weeks 3 and 4.

---

## Next week

**Week 5 — Block 2, Intensification (RPE 8–8.5).** First week of the new block.

Block 2 structural changes from Block 1:

| Parameter | Block 1 | Block 2 |
|-----------|---------|---------|
| Compounds | 4×6–8 | 4×5–6 |
| Accessories | 3×10–12 | 3×8–10 |
| RPE | 7–8 | 8–8.5 |
| Deadlift | 4×5 | 4×4–5 |
| Pull-up sets | 4×AMRAP-1 | 5×AMRAP-1 |
| Dip | BW | **Weighted** — start +2.5 kg |

The weights that felt RPE 7–8 in Block 1 will sit closer to RPE 7.5–8 at fewer reps, so session feel will be harder even if the bar weight stays the same. This is intentional — Block 2 is the intensification phase.

**Weighted dip starts in Week 5.** Set the `dip` key to 2.5 kg in the app (unit switches from BW to kg). The Weighted Dip in Block 2 Upper+ is 4×6–8 at RPE 8.

Priority order for Week 5:

1. **Legs** — clear the open `4-legs-1` session in the app (tap Close), then run the Block 2 Legs template. Four weeks of near-zero lower-body gym volume is the biggest structural gap in Block 1.
2. **Push** — if Wk 3/Wk 4 bench sessions both hit the top of range at target RPE, start at 62.5 kg. Block 2 drops to 4×5–6.
3. **Pull** — if both Wk 3/Wk 4 Pull sessions hit standard, move deadlift to 85 kg. Set count on pull-up goes to 5×AMRAP-1.
4. **Upper+** — weighted dips begin. After a two-week absence, keep ego in check on the dip load — BW +2.5 kg is the correct starting point, not heavier.
