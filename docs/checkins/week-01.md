# Week 01 Check-in — Block 1 (Volume Base), Calibration

**Date:** 2026-06-08 · **Block:** 1 / 4 (weeks 1–4, RPE 7–8) · **Week role:** calibration

> Manual check-in. The automated Monday routine did not produce a `docs/checkins/` entry,
> so this was run by hand from the committed `data/state.json` log.

---

## Sessions logged

| Day | Session | Status | Sets | Volume |
|-----|---------|--------|-----:|-------:|
| Mon 06-01 | Push | **Done** | 22 | 5,185 kg |
| Tue 06-04 | Pull | **Done** | 23 | 5,620 kg |
| Thu | Legs (calibration) | **Partial** — 3/7 ticked, not completed | — | — |
| Sat | Upper + | **Not started** | — | — |

**2 of 4 sessions completed.** Push/Pull volume (22–23 working sets) is right on target for a
Block-1 base. No complaints there.

---

## The one thing that matters this week: leg calibration is unfinished

Week 1's Legs session exists for exactly one reason — to set starting weights for **Hack Squat,
BSS, and Leg Press**. Current state:

| Lift | Ticked? | Weight in state.json |
|------|---------|---------------------:|
| Hack Squat | no | `0` (uncalibrated) |
| Bulgarian Split Squat | yes | `0` (uncalibrated) |
| Leg Press | yes | `0` (uncalibrated) |

Ticking an exercise marks it done but does **not** record the load you used — so even the two you
ticked (BSS, Leg Press) have no number saved. All three still read `0 kg`.

**Action:** enter the weights you actually used into the weights grid (BSS, Leg Press), and run
the Hack Squat working set if you haven't. Week 2's Legs day can't be programmed against `0`. If
you don't remember the numbers, treat the first Legs session of Week 2 as the calibration instead —
just don't let it carry on as `0`.

---

## Notable change

- **Deadlift recalibrated 140 → 100 kg** (06-04, during the Pull session). Sensible call — 140 for
  4×5 at RPE 7–8 was clearly too heavy for a base block. **Hold at 100** for Week 2 and reassess
  after the next pull session.

---

## Progression decisions

Rule: load goes up only after hitting the **top of the rep range at target RPE for 2 consecutive
sessions** (+2.5 kg upper compounds / +5 kg lower compounds; accessories add reps first).

**No increases this week** — every movement has at most one logged session, and Week 1 is
calibration by design. Everything holds:

| Movement | Weight | Movement | Weight |
|----------|-------:|----------|-------:|
| Bench Press | 70 kg | Deadlift | 100 kg |
| Incline BB Press | 45 kg | Lat Pulldown | 65 kg |
| OHP | 35 kg | Pull-up | BW |
| Lateral Raise | 10 kg | Leg Curl | 65 kg |
| Tricep Pushdown | 20 kg | BB Curl | 25 kg |
| Hack Squat / BSS / Leg Press | **set these** | Dip | BW (loads from Block 2) |

---

## Week 2 plan

- **Still Block 1, RPE 7–8.** Legs switches from the calibration session to the regular B1 Legs day.
- Same working weights as above (no triggers fired) — **except** the three leg lifts, which must be
  set first.
- Progression now becomes real: from Week 2 on, any compound that hits the top of its rep range at
  RPE 8 two sessions running earns its increment. Bench is the priority lift — chase that one.
- Calibration week ran a touch short (Legs unfinished, Upper+ skipped). Not a problem for week 1;
  just close out a full 4-day week from here so the progression signal is clean.

**Bottom line:** solid start on Push/Pull, deadlift sensibly dialed in. Only real to-do is getting
real numbers on the three leg lifts before Legs day next week.
