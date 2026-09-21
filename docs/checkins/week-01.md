# Week 01 Check-in — Cycle 2, Block 1 (Volume Base)

**Review date:** 2026-09-21 · **Block:** 1 — Volume Base (weeks 1–4, RPE 7–8) · **Cycle:** 2

---

## Week 1 (Cycle 2) sessions

| Session | Date | Sets | Volume (kg) | C1 W1 baseline |
|---------|------|-----:|------------:|---------------|
| Push | Mon 2026-09-15 | 24 | 7,733 | 22 sets / 5,185 kg |
| Pull | Wed 2026-09-17 | 23 | 7,623 | 23 sets / 5,620 kg |
| Legs | Fri 2026-09-19 | 20 | 13,904 | 20 sets / 6,895 kg |
| Upper+ | — | — | — | **not logged** |
| **W1 total (3 of 4)** | | **67** | **29,260** | 65 sets / 17,700 kg |

Volume is 65% higher than cycle 1 Week 1 across the same three sessions. This is primarily mechanical: cycle 2 opens with higher starting weights on all major lifts (deadlift still at 100 kg but with full sets; leg press at 263 kg vs cycle 1 calibration from near-zero). Set counts are essentially unchanged.

Upper+ has now been missed in Week 1 of both cycles.

---

## Weight resets at cycle start

Multiple lifts were reset downward on 2026-09-15 before the Push session:

| Key | Name | End of Cycle 1 | Cycle 2 Open | Delta |
|-----|------|---------------:|-------------:|------:|
| `bench` | Bench Press | 70 kg | 65 kg | −5 kg |
| `incline_bb` | Incline BB Press | 55 kg | 45 kg | −10 kg |
| `ohp` | OHP | 40 kg | 30 kg | −10 kg |
| `pulldown` | Lat Pulldown | 59 kg | 54 kg | −5 kg |

These appear deliberate. The larger drops on incline and OHP suggest those cycle 1 peaks were at or above comfortable RPE; opening conservatively is sound practice. The bench reset from 70 to 65 kg partially undoes the manual advance made during the deload — the progression rule will drive it back to 70 kg within a few sessions if reps are clean.

---

## Progression

The log stores only per-session totals; recommendations below are conditional on whether you hit the top of the rep range at the target RPE.

### Deadlift — TOR: true on session 1 of Cycle 2; advance to 105 kg is OVERDUE

| Session | Cycle | TOR flag | Weight |
|---------|-------|----------|--------|
| W9 Pull | C1 | true | 100 kg |
| W10 Pull | C1 | true | 105 kg attempt → reversed to 100 |
| W11 Pull | C1 | true | 100 kg |
| W12 Pull (deload) | C1 | true | 100 kg |
| W1 Pull | **C2** | **true** | 100 kg |

Five consecutive top-of-range signals at 100 kg. The W12 check-in flagged this advance as critical; it was not applied before cycle 2 opened. **Advance deadlift to 105 kg in the app now, before W2 Pull.** This is not a conditional call.

### Leg Press — TOR: true on session 1 of Cycle 2; one more triggers the jump

Legs logged `top_of_range.leg_press: true` at 263 kg. This is the sixth consecutive TOR signal (W8–W12 C1, W1 C2). The W12 check-in recommended holding at 263 kg because the deload TOR was expected at reduced RPE. Cycle 2 Week 1 is not a deload. If W2 Legs also logs TOR: **advance to 268 kg**.

### Bench — TOR: false; hold at 65 kg

Push logged `top_of_range.bench: false` at 65 kg. No action. Re-evaluate after two sessions.

### Other lifts — no TOR data for W1

Incline BB (45 kg), OHP (30 kg), pulldown (54 kg), cs_row (91 kg), and all accessories have no TOR flag for W1. The reset weights on incline and OHP may well generate TOR signals quickly — if they both come in clean at the top of range this week, flag them and they can advance at W3.

---

## Flags

### 1. Deadlift advance still not applied — five consecutive TOR

This was flagged in the W11 and W12 check-ins and classed critical. It is now the third written reminder. **Set `deadlift` to 105 kg in the app before the next Pull session.** No further analysis is needed; the progression rule is unambiguous.

### 2. Deload checklist — items still outstanding from cycle 1

The W12 check-in closed with a prioritised action list. Current status:

| Action | Key | Recommended | Current | Status |
|--------|-----|-------------|---------|--------|
| Advance deadlift | `deadlift` | 105 kg | 100 kg | **NOT DONE** |
| Set BSS opening weight | `bss` | 12.5 kg | 10 kg | **NOT DONE** |
| Set Leg Curl opening weight | `leg_curl` | 67.5 kg | 65 kg | **NOT DONE** |
| Load dip for Block 2 | `dip` | 5 kg (unit → kg) | 0 BW | Not due until W5 |

BSS and leg_curl are small corrections; apply them before the next Legs session so W2 progression is measured against the correct baseline.

### 4. Upper+ not logged — second consecutive W1 miss

Upper+ carries dip volume and the pull-up density work. Weighted dip is the primary Block 2 calisthenics strength lift (from W5); if Upper+ is not a regular training day, the dip loading protocol will fall through again as it did in cycle 1. No programme change is recommended here — flag only. If the 4th day remains ad hoc, prioritise the dip sets within another session or accept that calisthenics loading will lag.

---

## Next week — Week 2, Block 1

Block 1 continues unchanged. Session structure is identical to Week 1 (calibration flags drop off Legs). Progression rule is now live.

**Priority actions before Week 2:**

1. **Set `deadlift` to 105 kg in the app** — do this before Pull day.
2. **Update `bss` to 12.5 kg and `leg_curl` to 67.5 kg** — before Legs day.
3. Log all four sessions including Upper+.
4. Track TOR flags on every set — specifically incline_bb and OHP (reset weights may be too easy) and leg_press (one more TOR → advance to 268 kg).
