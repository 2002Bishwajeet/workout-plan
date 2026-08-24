# Week 10 Check-in — Block 3, Strength Peak

**Review date:** 2026-08-24 · **Block:** 3 (weeks 9–11, RPE 8.5–9)

---

## Week 10 sessions

| Session | Date | Sets | Volume (kg) | vs W9 (PPL) |
|---------|------|-----:|------------:|------------:|
| Push | Mon 2026-08-10 | 21 | 4,821 | +82 |
| Pull | Wed 2026-08-19 | 22 | 5,678 | +423 |
| Legs | Sat 2026-08-22 | 20 | 10,516 | +220 |
| Upper+ | — | — | — | missed |
| **W10 total (PPL)** | | **63** | **21,015** | **+725** |

**W9 PPL baseline:** 63 sets / 20,290 kg  
**W10 volume up 725 kg (+3.6%)** on equal sets — driven by weight advances on deadlift, OHP, and leg press.  
Upper+ was missed again. W9 had Upper+ at 21 sets / 1,761 kg. That session and its weighted dip prescription are lost for this week.

---

## Progression

### Changes applied during W10

| Movement | Key | From | To | Session | Trigger |
|----------|-----|-----:|---:|---------|---------|
| OHP | `ohp` | 35 kg | **40 kg** | W10 Push (Aug 10) | Two-step advance; W10 is first session at 40 kg |
| Deadlift | `deadlift` | 100 kg | **105 kg** | W10 Pull (Aug 19) | Two consecutive `top_of_range: true` (W9 + W10) — advance rule met |
| CS Row | `cs_row` | 73 kg | **91 kg** | W10 Pull (Aug 19) | Multiple same-session increments (73→78→83→88→93→91); see Flag 1 |
| Leg Press | `leg_press` | 243 kg | **253 kg** | W10 Legs (Aug 22) | `top_of_range: true` for third consecutive session; advance applied as +10 kg (see Flag 2) |

### Existing state going into W11

| Movement | Key | Current weight | Note |
|----------|-----|---------------:|------|
| Bench Press | `bench` | 67.5 kg | Two consecutive `false` in Block 3 (W9 + W10) — hold |
| Incline BB Press | `incline_bb` | 55 kg | Bumped W9; no repeat data yet |
| OHP | `ohp` | 40 kg | First Block 3 session at this weight was W10 |
| Deadlift | `deadlift` | 105 kg | Advance already applied — W11 runs 3×3 @ RPE 8.5–9 at 105 kg |
| Lat Pulldown | `pulldown` | 59 kg | Two sessions (W9+W10) at 59 kg; no top_of_range field logged |
| CS Row | `cs_row` | 91 kg | First W11 session is the real test at this weight — see Flag 1 |
| Hack Squat | `hack_sq` | 140 kg | **Unchanged since programme start** — see Flag 3 |
| Leg Press | `leg_press` | 253 kg | Third consecutive top_of_range; advance applied |
| BSS | `bss` | 10 kg | **Unchanged since W1 calibration** — see Flag 4 |
| Leg Curl | `leg_curl` | 65 kg | **Unchanged for 5+ sessions** — see Flag 5 |
| Dip | `dip` | 0 BW | **Still unloaded — critical** — see Flag 6 |
| Pull-up | `pullup` | 0 BW | Bodyweight; W11 = max-rep test per spec |

### Conditional recommendations for W11

| Movement | Key | Current | Condition | Target if met |
|----------|-----|--------:|-----------|:-------------:|
| Bench | `bench` | 67.5 kg | Two consecutive `false` in Block 3 — do not advance | Hold |
| Deadlift | `deadlift` | 105 kg | Already applied — W11 runs at 105 kg | — |
| OHP | `ohp` | 40 kg | If W10 Push 3×5–6 was at RPE ≤9, hold at 40 kg; if above RPE 9 or reps were cut | **Drop to 37.5 kg for W11** |
| Leg Press | `leg_press` | 253 kg | If W11 Legs hits 3×8–10 @ RPE 8 | **+5 kg → 258 kg** |
| Lat Pulldown | `pulldown` | 59 kg | If W11 Pull hits 3×6–8 @ RPE 8 (would be second session at 59 kg clearing range) | **+2.5 kg → 61.5 kg** |
| CS Row | `cs_row` | 91 kg | First session at 91 kg coming in W11; be ready to drop if above RPE 9 | Assess after W11 Pull |

**Non-conditional advances — do these before the session, not after:**

| Movement | Key | Current | Target | Deadline |
|----------|-----|--------:|-------:|---------|
| Hack Squat | `hack_sq` | 140 kg | **145 kg** | Before W11 Legs |
| BSS | `bss` | 10 kg | **12.5 kg** | Before W11 Legs |
| Leg Curl | `leg_curl` | 65 kg | **70 kg** | Before W11 Legs |
| Dip | `dip` | 0 BW | **5 kg minimum** | Before W11 Upper+ |

---

## Flags

### 1. CS Row: 73 → 91 kg in a single session (weight history anomaly)

The weight_history shows six increments on 2026-08-19 in the same W10 Pull session (73→78→83→88→93→91). Net change: +18 kg from W9's settled weight. This is not consistent with the +2.5 kg progression rule and suggests either recalibration to a different machine/setup or exploratory loading. The `cs_row` key is now at 91 kg. W11 Pull is the first session where this will be tested as a working weight. If 3×6–8 @ RPE 8.5 is not achievable at 91 kg, pull back to the last comfortable weight and re-establish progression normally.

### 2. Leg press advance was +10 kg, not +5 kg

W10 Legs bumped leg press 243→253 (+10 kg), double the +5 kg compound rule. With three consecutive `top_of_range: true` readings the athlete may have felt the standard step was too small. If W11 feels appropriately heavy (RPE 8) at 253 kg, the larger jump was fine. If it is above RPE 9, pull back to 248 kg.

### 3. Hack Squat — 140 kg, unchanged since Week 1 — CRITICAL — W11 last chance

This is the fifth check-in to flag this stall. The weight has not moved in 10+ weeks through three complete blocks. Block 3 prescribes 4×5–6 @ RPE 8.5. There is no justification for another session at 140 kg. **Load 145 kg in the app before W11 Legs.** W11 is the last working legs session before the deload; if this week is also missed, the programme ends without a single progression on hack squat.

### 4. BSS — 10 kg, unchanged since W1 calibration — W11 last chance

Same situation. Ten weeks at the same weight on a bilateral-equivalent compound. Block 3 prescribes 3×6–8 @ RPE 8. **Load 12.5 kg before W11 Legs.** If 12.5 kg is genuinely above RPE 9 for the prescribed reps, note it; the floor is being established, not the ceiling.

### 5. Leg Curl — 65 kg, unchanged for 5+ sessions — W11 last chance

No movement since at least W5. **Load 70 kg before W11 Legs.** Block 3 = 3×6–8 @ RPE 8.5. If 70 kg exceeds RPE 9, drop to 67.5 kg and note the finding.

### 6. Dip — still 0 BW — CRITICAL — W11 is the final opportunity

This is the fifth check-in flagging the dip. Block 3 Upper+ prescribes **weighted dip 4×5–6 @ RPE 8.5** since W9. W9 Upper+ logged `top_of_range.dip: true` on bodyweight. W10 Upper+ was missed. The `dip` key is still 0 BW. **Update `dip` to 5 kg and switch the unit from BW to kg in the app before W11 Upper+.** This is the last programmed Upper+ session of the block. Running W11 Upper+ at bodyweight would end the programme without a single loaded dip despite the spec explicitly placing weighted dip in Block 2 and Block 3.

### 7. Upper+ missed in W10

This is the second consecutive week without an Upper+ session (W9 had it; W10 did not). Upper+ contains the dip and pull-up supplemental volume. The log is clean on Push/Pull/Legs but the optional session has low adherence. Make W11 Upper+ a priority given it carries the calisthenic test content (dip loading, pull-up max-rep).

### 8. current_block shows 2 in state.json — should be 3

`state.json` reports `"current_block": 2`. Weeks 9–11 are Block 3. This is a display issue only (working weights and session definitions are not tied to `current_block`), but the dashboard may show incorrect block labels. Update via the app if the UI surface shows Block 2.

### 9. Pull-up: W11 is the max-rep test week

Per spec, W11 Pull is the designated pull-up max-rep test (or first weighted set if ≥10 strict reps confirmed). The `pullup` key is still 0 BW — no AMRAP result has been recorded. W10 Pull was the intended pre-test session; no result was logged. Proceed with W11 Pull as a bodyweight strict AMRAP max-rep test. Perform it at the top of the session, before deadlifts, when fresh. Note the count in the app. Decision:
- ≥10 reps: programme is complete, note the result; weighted pull-up would begin in any future block
- < 10 reps: result is the baseline; note it

---

## Next: Week 11 — Block 3, Strength Peak (final working week)

**Block:** 3 · **Weeks:** 9–11 · **RPE:** 8.5–9  
**Character:** Final peak week. Max-rep calisthenic tests (pike push-up on Push, pull-up on Pull per spec). All barbell compounds at peak loads. W12 is the deload — W11 is the last meaningful loading stimulus of the programme.

| Session | Key events |
|---------|-----------|
| Push | 3×3–5 bench at 67.5 kg · OHP at 40 kg (or 37.5 if W10 was above RPE 9) · Pike push-up max-rep test |
| Pull | 3×3 deadlift at **105 kg** · Pull-up bodyweight max-rep test · CS Row first real session at 91 kg |
| Legs | Hack Squat at **145 kg** · BSS at **12.5 kg** · Leg Curl at **70 kg** · Leg Press at 253 kg |
| Upper+ | Weighted dip at **5 kg minimum** (update key before session) · Pull-up volume |

**Pre-W11 checklist (do in app before each session):**

| Action | Priority | Before session |
|--------|----------|---------------|
| Advance `hack_sq` → **145 kg** | **Critical** | Legs |
| Advance `bss` → **12.5 kg** | **Critical** | Legs |
| Advance `leg_curl` → **70 kg** | High | Legs |
| Update `dip` → **5 kg, unit: kg** | **Critical** | Upper+ |
| Assess OHP: hold 40 kg or drop to 37.5 kg | High | Push |
| Pull-up strict BW AMRAP (fresh, pre-deadlift) | High | Pull |
