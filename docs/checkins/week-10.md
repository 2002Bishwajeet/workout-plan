# Week 10 Check-in — Block 3, Strength Peak

**Date:** 2026-08-17 · **Block:** 3 (weeks 9–11, RPE 8.5–9)

*Partial week — only Push logged as of review date. Pull, Legs, and Upper+ are outstanding for W10.*

---

## Week 10 sessions

| Session | Date | Sets | Volume (kg) | vs W9 |
|---------|------|-----:|------------:|------:|
| Push | Mon 2026-08-10 | 21 | 4,821 | +82 |
| Pull | — | — | — | — |
| Legs | — | — | — | — |
| Upper+ | — | — | — | — |
| **W10 partial** | | **21** | **4,821** | — |

**W9 Push:** 21 sets / 4,739 kg → W10 Push up 82 kg. The volume bump is largely explained by the OHP jump from 35 to 40 kg (see Flag 2 below).

---

## Progression

### Applied since W9 check-in

| Movement | Key | From | To | Notes |
|----------|-----|-----:|---:|-------|
| OHP | `ohp` | 35 kg | **40 kg** | W10 Push (Aug 10); two steps same day (35→37.5→40) |

All other W9 checklist items remain unactioned — see Flags.

### W10 Push analysis

`bench top_of_range: false` in both W9 Push and W10 Push — bench holds at **67.5 kg**. Two consecutive false flags; the load is appropriate for the 3×3–5 Block 3 prescription or the rep ceiling isn't being reached. Hold for W11 and reassess.

OHP is in its first session at 40 kg. No rep-range or RPE data in the log — see Flag 2.

### Conditional recommendations for remaining W10 sessions

| Movement | Key | Current | Condition | Target if met |
|----------|-----|--------:|-----------|:-------------:|
| Deadlift | `deadlift` | 100 kg | W10 Pull hits 3×3 @ RPE ≤9 (second consecutive top-of-range) | **105 kg** |
| Leg Press | `leg_press` | 243 kg | W10 Legs hits 3×8–10 @ RPE 8 | **248 kg** |
| Hack Squat | `hack_sq` | 140 kg | W10 Legs hits 4×5–6 @ RPE ≤9 — see Flag 3 | **145 kg** |
| Leg Curl | `leg_curl` | 65 kg | W10 Legs hits 3×6–8 @ RPE 8.5 — see Flag 4 | **70 kg** |
| BSS | `bss` | 10 kg | Apply proactively — see Flag 5 | **12.5 kg** |
| OHP | `ohp` | 40 kg | W10 Push 3×5–6 felt at or below RPE 9 | Hold and monitor; if above RPE 9, drop to **37.5 kg** for W11 |
| Bench | `bench` | 67.5 kg | Two consecutive `top_of_range: false` — hold | — |
| Lat Pulldown | `pulldown` | 59 kg | W10 Pull hits 3×6–8 @ RPE 8 (second session at 59 kg) | **61.5 kg** |
| CS Row | `cs_row` | 73 kg | W10 Pull hits 3×6–8 @ RPE 8.5 (second session at 73 kg) | **75.5 kg** |

---

## Flags

### 1. Dip still 0 BW — critical — third consecutive flagged week

The `dip` key is `0 BW`. This was flagged in W8, W9, and again now. W9 Upper+ recorded `top_of_range.dip: true` for bodyweight dips. Block 3 prescribes **weighted dip 4×5–6 @ RPE 8.5**. Only W10 and W11 Upper+ remain before the deload. If W10 Upper+ is played, it **must** use a loaded dip. Update the `dip` key in the app to **at least 5 kg** and switch the unit from BW to kg before the session. Running a fourth consecutive BW dip session in Block 3 is not recoverable.

### 2. OHP over-jump: 35 → 40 kg in a single session

The W9 check-in recommended advancing to 37.5 kg. The athlete went to 40 kg in two increments on the same day (Aug 10). That is +14% in one session on an overhead compound. The W10 Push `top_of_range` field records only bench; no OHP RPE data is in the log. Two outcomes:
- If 3×5–6 at 40 kg was at RPE ≤9: weight is fine, hold for W11.
- If it was above RPE 9 or reps were truncated: **drop back to 37.5 kg for W11 Push**. Do not peak a lift at a weight that broke form.

Flag this to yourself in the app before W11 Push.

### 3. Hack squat at 140 kg — 10 weeks unchanged

Flagged in W1, W8, and W9 check-ins. Weight has not moved since programme start. W10 Legs is the last opportunity before the deload to get two sessions at a higher load (there is no W11 opportunity if W10 Legs is missed). **Load 145 kg for W10 Legs regardless of the top-of-range reading** — 140 kg has been the weight for ten weeks; there is no justification for staying there. If 145 kg is genuinely above RPE 9 for 4×5–6, note it and adjust; but the default must be to advance.

### 4. Leg curl at 65 kg — unchanged since at least W5

Five-plus logged legs sessions with no change. Block 3 prescribes 3×6–8 @ RPE 8.5. **Advance to 70 kg before W10 Legs.** If 70 kg is above the top of the rep range at target RPE, record it and the next check-in will adjust.

### 5. BSS at 10 kg — 10 weeks unchanged

This is a tracked compound that has not moved since W1 calibration. Block 3 prescribes 3×6–8 @ RPE 8. **Advance to 12.5 kg before W10 Legs.** Same logic as hack squat — ten weeks at one weight on a compound means the current load is stale.

### 6. Pull-up AMRAP assessment — final window

W11 is the designated pull-up max-rep test week per the spec. The `pullup` key is `0 BW`; no AMRAP result has been recorded in the app. W10 Pull is the last session with slack — perform a strict BW pull-up AMRAP **at the start** of W10 Pull (fresh, before deadlifts). Decision rule:
- ≥10 strict reps: load `pullup` to **+2.5 kg** for W11.
- < 10 reps: run W11 Pull as a BW max-rep test; note the count.

Do not defer this again — the W11 session prescription depends on the W10 result.

### 7. Three W10 sessions outstanding

Pull, Legs, and Upper+ are not yet logged. W11 (the final peak week) cannot be fully planned until these results are in. When they are logged, the next check-in will cover:
- Deadlift qualification for the 105 kg advance
- Leg press qualification for 248 kg
- Pull-up AMRAP result
- Confirmation of dip loading

---

## Next: Week 11 — Block 3, Strength Peak (final working week)

**Block:** 3 · **Weeks:** 9–11 · **RPE:** 8.5–9  
**Character:** Final peak week. The spec designates W11 as the max-rep test week for pike push-ups (Push) and pull-ups (Pull, if still bodyweight). All compounds run at peak load — the heaviest singles in the programme. W12 is the deload; W11 is the last meaningful loading stimulus.

Key W11 events:
- **Pike push-up:** switch from AMRAP-1 to full-out max-rep test
- **Pull-up:** max-rep test (BW) or first weighted set if ≥10 reps confirmed in W10
- **Bench:** decision point — bench has not cleared top-of-range for two consecutive Block 3 sessions; it will hold at 67.5 kg unless W10 Push or W11 Push changes that
- **Deadlift:** if 100 kg qualifies in W10 Pull, W11 Pull runs at 105 kg for its 3×3 peak

---

*Push complete; awaiting Pull, Legs, and Upper+ to close the week. Pre-session checklist for remaining W10 sessions:*

| Action | Priority | Session |
|--------|----------|---------|
| Load `dip` → 5 kg minimum in app | **Critical** | Before Upper+ |
| Advance `hack_sq` → 145 kg | **Critical** | Before Legs |
| Advance `leg_curl` → 70 kg | High | Before Legs |
| Advance `bss` → 12.5 kg | High | Before Legs |
| Pull-up strict AMRAP (fresh, before deadlifts) | High | Pull |
| Assess OHP at 40 kg from W10 Push | High | Before W11 Push |
| Advance `deadlift` → 105 kg if W10 Pull triples @ RPE ≤9 | Conditional | After Pull |
| Advance `leg_press` → 248 kg if W10 Legs sets qualify | Conditional | After Legs |
