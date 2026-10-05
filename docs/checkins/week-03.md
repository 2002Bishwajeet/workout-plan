# Week 03 Check-in — Cycle 2, Block 1 (Volume Base)

**Review date:** 2026-10-05 · **Cycle:** 2 · **Block:** 1 (weeks 1–4, RPE 7–8)

---

## Sessions logged — Week 3

| Session | Date | Sets | Volume (kg) | Notes |
|---------|------|-----:|------------:|-------|
| Push | Mon 2026-09-29 | 24 | 7,913 | Sub'd pec deck → shoulder trap DB work |
| Pull | Thu 2026-10-01 | 23 | 7,607 | **Health incident — see Flags #1** |
| Legs | Sat 2026-10-03 | 20 | 14,044 | — |
| Upper+ | — | — | — | Not logged (3rd consecutive skip) |

3 of 4 sessions logged. Upper+ has not been logged in any week of Cycle 2.

### Week-over-week volume (Cycle 2)

| Session | W1 Sets | W1 Vol (kg) | W2 Sets | W2 Vol (kg) | W3 Sets | W3 Vol (kg) | W2→W3 |
|---------|--------:|------------:|--------:|------------:|--------:|------------:|------:|
| Push | 24 | 7,733 | 24 | 7,593 | 24 | 7,913 | +320 |
| Pull | 23 | 7,623 | 23 | 7,607 | 23 | 7,607 | ±0 |
| Legs | 20 | 13,904 | 20 | 14,044 | 20 | 14,044 | ±0 |
| Upper+ | — | — | — | — | — | — | — |
| **Total (3 PPL)** | **67** | **29,260** | **67** | **29,244** | **67** | **29,564** | **+320** |

Push volume is up 320 kg week-over-week with the same set count — consistent with small load increases or better reps on the same weight. Pull volume is identical to W2 numerically, but the W3 session was cut short at the deadlift due to a health incident; the matching total likely reflects the remaining accessory work completing normally. Legs volume holds flat at 14,044 for a second consecutive week; load or reps did not increase.

---

## Progression

Rule: top of rep range at target RPE for 2 consecutive sessions → +2.5 kg upper-body compounds, +5 kg lower; accessories add reps before weight.

Session-level `top_of_range` flags are used where present. Per-set reps and RPE are not stored in the log.

| Lift | Key | Current | W1 TOR | W2 TOR | W3 TOR | Verdict |
|------|-----|--------:|--------|--------|--------|---------|
| Bench Press | `bench` | 65 kg | false | false | false | No trigger — hold 65 kg |
| Deadlift | `deadlift` | 102.5 kg | true | false | N/A (cut short) | No clean consecutive pair — hold |
| Leg Press | `leg_press` | 268 kg | true | false | false | No trigger — hold 268 kg |

No progression is triggered this week for any tracked compound. All three lifts have had at least one TOR=false in the last two logged sessions.

**Conditional targets for Week 4:**

- **Bench (`bench`):** If W4 Push hits 6–8 reps at RPE 7–8, that is the first genuine TOR signal since cycle reset. One clean session does not trigger the rule; a second consecutive TOR=true (W5 earliest) would move bench to **67.5 kg**. Do not advance before then.
- **Deadlift (`deadlift`):** W3 Pull was cut short and cannot be read. If W4 Pull runs healthy and hits the full 4×5 at RPE 7–8, that is a fresh TOR signal. A subsequent TOR=true in W5 would move to **107.5 kg**. Do not advance before then — the reset to 102.5 kg is treated as the new working base.
- **Leg Press (`leg_press`):** Two consecutive false sessions (W2, W3). No progression signal. Hold 268 kg through W4; re-evaluate in W5.

---

## Flags

### 1. Pull W3 — health incident; deadlift cut to 2 sets

The W3 Pull log carries a note: *"Did 2 sets deadlift — had sharp sudden pain in glutes, nausea, dizziness so did what i could and called it a day."* This is the highest-priority flag this week.

Acute, sharp glute pain combined with systemic symptoms (nausea, dizziness) during a loaded hinge is not a normal fatigue response. Before pulling again in Week 4:

- Give it at least 48–72 h from first return to any loaded movement.
- Assess whether the pain has resolved fully at rest and through normal daily movement.
- If any residual tightness, numbness, or referred sensation remains down the leg, do not deadlift — see a physio before loading.
- If you feel recovered: start W4 Pull with a conservative ramp-up on deadlift (3 warm-up sets at 50–70% before working sets) and be prepared to cut the session if pain returns.
- Do not try to make up for the shortened W3 session with extra volume.

### 2. Upper+ — not logged in any of 3 cycle 2 weeks

Upper+ is optional but has been skipped every week this cycle. The direct consequences: pull-up and dip accumulation volume is zero, the bench back-off sets are not being done, and the Block 2 weighted-dip introduction (Week 5) will happen without any recent dip volume as a base. Aim to include Upper+ in at least 2 of the remaining 4 weeks in Block 1 (Weeks 3–4 still have opportunities). Prioritise the three PPL days first, but do not skip Upper+ every week of Block 2 the way it's been skipped in Block 1.

### 3. `hack_sq` key not present in working_weights

The week-12 check-in recommended setting hack squat to 145 kg for cycle 2. The key is absent from the current `working_weights.legs` array. Possible explanations: the athlete does not have access to a hack squat machine at their current gym, or the key was accidentally removed. If hack squat is being trained, re-add the key via a `Store.update` call. If the exercise is being substituted, flag what is replacing it.

### 4. `bss` and `leg_curl` still at cycle 1 opening weights

| Key | Name | Current | W12 recommendation |
|-----|------|--------:|--------------------|
| `bss` | BSS | 10 kg | 12.5 kg (overdue) |
| `leg_curl` | Leg Curl | 65 kg | 67.5 kg (overdue) |

Both were flagged in the week-12 check-in as advances to apply before starting cycle 2. They remain at their original calibration values five weeks into cycle 2. Update both in the app — these are not progression decisions requiring TOR data, they are acknowledged corrections from last cycle.

### 5. Bench and OHP reset at cycle 2 start — weights lower than end-of-cycle 1

The week-12 check-in recommended opening cycle 2 bench at 70 kg. The weight history shows a series of corrections on 2026-09-15 that stepped bench down to 60 kg before settling at 65 kg on 2026-09-29. OHP similarly dropped from 40 kg to 30 kg before returning to 35 kg. Incline BB dropped from 55 kg to 45 kg.

These resets appear intentional (cycle 2 is a fresh run; the athlete may have found the block 3 weights too heavy to maintain for 4×6–8 at RPE 7–8). The current weights are treated as correct. The progression rule applies from here — do not try to rush back to the end-of-cycle 1 weights ahead of the data.

### 6. `current_week` = 4 — dashboard is ahead of last logged week

`current_week` in state.json is 4; the highest week in the cycle 2 log is 3. This is correct — the athlete has already advanced the week in the app, and Week 4 sessions are now showing on the dashboard. No action needed.

---

## Next week

**Week 4 — Cycle 2, Block 1, Volume Base (RPE 7–8).** Final week of Block 1. Session structure is identical to Weeks 1–3.

Block 2 (Intensification, RPE 8–8.5, compounds shift to 4×5–6, accessories to 3×8–10, weighted dip introduced) begins at Week 5. After Week 4, no structural changes to the session — only load and rep-range targets change.

Priority order for Week 4:

1. **Pull** — assess recovery from W3 health incident before loading deadlift. If cleared, run it conservative. Non-negotiable on the health check.
2. **Push** — aim for clean 4×6–8 bench at 65 kg at RPE 7–8. This is the first session where a genuine TOR signal would unlock the progression to 67.5 kg.
3. **Legs** — aim to break the W2/W3 volume plateau; if leg press and leg ext feel solid, push for the top of the rep range across both. Update `bss` and `leg_curl` in the app before this session (Flags #4).
4. **Upper+** — include if possible. Block 2 starts with weighted dip, so getting any dip and pull-up volume in Block 1 matters.
