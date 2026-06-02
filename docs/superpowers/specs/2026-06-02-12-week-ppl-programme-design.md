# 12-Week PPL Programme — Design Spec

**Date:** 2026-06-02
**Athlete:** Bishwajeet (~80–82 kg, intermediate, 2–3 yrs)
**Status:** Approved framework — pending spec review before implementation

---

## 1. Goals & constraints

- **Goal:** strength + hypertrophy, **strength weighted heavier**. Push-day strength priority = **Barbell Bench Press**.
- **Split:** 4-day PPL — Push / Pull / Legs always, **Upper+ optional 4th day**. 3-day weeks drop Upper+ with no structural loss.
- **Schedule:** evenings, 60–75 min cap → each core day capped at 7 exercises.
- **Equipment:** full commercial gym + home resistance bands.
- **Loading:** RPE-based only, never % of max. Working weights in `state.json` are working weights, not maxes.
- **Progression:** top of rep range @ target RPE for 2 consecutive sessions → **+2.5 kg upper compounds / +5 kg lower compounds**; accessories add reps before weight.
- **Deload:** built in at Week 12 (~50% volume).

**Excluded (hard):** all squat variants, RDL/stiff-leg/good-morning, hip thrust, bent-over/Meadows/Pendlay row, sumo DL, goblet/step-up/close-grip/preacher, DB bench, incline DB press, cable lateral raise, DB rear-delt fly, landmine press, glute bridge, Nordic curl, cable crunch.

**Posterior-chain note:** Cable Pull-Through replaces the excluded RDL as the hip-hinge accessory. Conventional deadlift is the only barbell hinge.

## 2. Calisthenics progression (tuned to current base)

Base: **pull-ups 6 strict**, **dips 8–10 BW**, bodyweight ~81 kg. Pull-ups lag → stay bodyweight longer (build reps); dips lead → load earlier.

| Movement | Block 1 (wk1–4) | Block 2 (wk5–8) | Block 3 (wk9–11) |
|---|---|---|---|
| Pull-up | 4×AMRAP-1 BW (build → 8) | 5×AMRAP-1 BW (density) | weighted **if** ≥10 BW, else max-rep test |
| Dip | 3×6–8 BW | **weighted** 4×6–8 (+2.5–5 kg) | weighted 4×5–6 |
| Pike push-up | 3×AMRAP-1 | deficit (feet elevated) | deeper ROM / max-rep |

Weighted dip and weighted pull-up **reuse the existing `dip` / `pullup` working-weight keys** — the `unit` flips from `BW` to `kg` when load is added. No new state keys.

## 3. Periodization

| Block | Weeks | Compounds | Hypertrophy | RPE |
|---|---|---|---|---|
| 1 · Volume Base | 1–4 | 4×6–8 | 3×10–12 | 7–8 |
| 2 · Intensification | 5–8 | 4×5–6 | 3×8–10 | 8–8.5 |
| 3 · Strength Peak | 9–11 | 3×3–5 | 3×8 back-off | 8.5–9 |
| 4 · Deload | 12 | 3×5 light | 2×8–10 | 6–7 |

Weeks within a block share the same session skeleton; progression is **load-driven** via the working-weight rule above, not by changing the session definition. So `SESSIONS[1..4]` are structurally identical (Week 1 carries calibration flags on legs), `[5..8]` identical, `[9..11]` identical, `[12]` deload.

## 4. Full session definitions

Weight column: a `weightKey` (tracked in `state.json`) or a literal (`—` = athlete fills in, `BW` = bodyweight). Reps `AMRAP-1` = all-out minus one in reserve.

### Block 1 — Volume Base (Weeks 1–4), RPE 7–8

**Push** — *Bench primary · vertical press · lateral volume*
| Exercise | Sets×Reps | Weight | RPE |
|---|---|---|---|
| Barbell Bench Press | 4×6-8 | `bench` | 7-8 |
| Incline Barbell Press | 3×8-10 | `incline_bb` | 7-8 |
| Machine Chest Press | 3×10-12 | — | 7 |
| Dumbbell OHP | 3×8-10 | `ohp` | 7-8 |
| Lateral Raise (DB) | 3×12-15 | `lat_raise` | 7-8 |
| Tricep Pushdown | 3×10-12 | `tri_pd` | 7-8 |
| Pike Push-up | 3×AMRAP-1 | BW | 8 |

**Pull** — *Deadlift primary · vertical + horizontal volume*
| Exercise | Sets×Reps | Weight | RPE |
|---|---|---|---|
| Conventional Deadlift | 4×5 | `deadlift` | 7-8 |
| Pull-up | 4×AMRAP-1 | BW | 8 |
| Chest Supported Row | 3×8-10 | — | 7-8 |
| Lat Pulldown (neutral) | 3×10-12 | `pulldown` | 7 |
| Face Pull | 3×12-15 | — | 7 |
| Barbell Curl | 3×8-10 | `bb_curl` | 7-8 |
| Hammer Curl | 3×10-12 | — | 7 |

**Legs** — *Quad + posterior volume · calf + core* (Week 1: **calibration** — set starting weights for hack squat, BSS, leg press)
| Exercise | Sets×Reps | Weight | RPE |
|---|---|---|---|
| Hack Squat | 4×6-8 | `hack_sq` (cal wk1) | 7-8 |
| Bulgarian Split Squat | 3×8-10 | `bss` (cal wk1) | 7-8 |
| Leg Press | 3×10-12 | `leg_press` (cal wk1) | 7 |
| Leg Curl (lying) | 3×10-12 | `leg_curl` | 7-8 |
| Cable Pull Through | 3×12-15 | — | 7 |
| Standing Calf Raise | 4×10-12 | — | 8 |
| Hanging Leg Raise | 3×10-15 | BW | 7-8 |

**Upper+** *(optional)* — *Bench top-set + back-offs · dip + pull-up volume*
| Exercise | Sets×Reps | Weight | RPE |
|---|---|---|---|
| Bench Press (top set) | 1×5 | `bench` | 8 |
| Bench (back-offs) | 3×8 | 65 | 7 |
| Dip | 3×6-8 | `dip` (BW) | 8 |
| Pull-up | 4×AMRAP-1 | BW | 8 |
| Incline DB Curl | 3×10-12 | — | 7 |
| Overhead Tricep Ext | 3×10-12 | — | 7 |
| Ab Wheel | 3×AMRAP-1 | BW | 8 |

### Block 2 — Intensification (Weeks 5–8), RPE 8–8.5

**Push** — *Bench strength · pressing intensity · deficit pike*
| Exercise | Sets×Reps | Weight | RPE |
|---|---|---|---|
| Barbell Bench Press | 4×5-6 | `bench` | 8 |
| Incline Barbell Press | 4×6-8 | `incline_bb` | 8 |
| Machine Chest Press | 3×8-10 | — | 8 |
| Dumbbell OHP | 3×6-8 | `ohp` | 8 |
| Lateral Raise (DB) | 3×12-15 | `lat_raise` | 8 |
| Tricep Pushdown | 3×8-10 | `tri_pd` | 8 |
| Deficit Pike Push-up | 3×AMRAP-1 | BW | 8.5 |

**Pull** — *Heavy deadlift · pull-up density · row volume*
| Exercise | Sets×Reps | Weight | RPE |
|---|---|---|---|
| Conventional Deadlift | 4×4-5 | `deadlift` | 8 |
| Pull-up | 5×AMRAP-1 | BW | 8.5 |
| Chest Supported Row | 4×6-8 | — | 8 |
| Lat Pulldown (neutral) | 3×8-10 | `pulldown` | 8 |
| Face Pull | 3×15 | — | 7 |
| Barbell Curl | 3×6-8 | `bb_curl` | 8 |
| Hammer Curl | 3×8-10 | — | 8 |

**Legs** — *Hack squat + leg press intensity · posterior chain*
| Exercise | Sets×Reps | Weight | RPE |
|---|---|---|---|
| Hack Squat | 4×6-8 | `hack_sq` | 8 |
| Bulgarian Split Squat | 3×8-10 | `bss` | 8 |
| Leg Press | 4×8-10 | `leg_press` | 8 |
| Leg Curl (seated) | 3×8-10 | `leg_curl` | 8 |
| Cable Pull Through | 3×12-15 | — | 7 |
| Standing Calf Raise | 4×8-10 | — | 8 |
| Hanging Leg Raise | 3×12-15 | BW | 8 |

**Upper+** *(optional)* — *Bench intensity · weighted dip primary · pull volume*
| Exercise | Sets×Reps | Weight | RPE |
|---|---|---|---|
| Bench Press (top set) | 1×4-5 | `bench` | 8.5 |
| Bench (back-offs) | 3×6 | 65 | 8 |
| Weighted Dip | 4×6-8 | `dip` (→kg) | 8 |
| Pull-up | 4×AMRAP-1 | BW | 8.5 |
| Incline DB Curl | 3×8-10 | — | 8 |
| Overhead Tricep Ext | 3×10-12 | — | 7 |
| Ab Wheel | 3×AMRAP-1 | BW | 8 |

### Block 3 — Strength Peak (Weeks 9–11), RPE 8.5–9

**Push** — *Heavy bench · low-rep press · pike test (wk11)*
| Exercise | Sets×Reps | Weight | RPE |
|---|---|---|---|
| Barbell Bench Press | 3×3-5 | `bench` | 8.5-9 |
| Incline Barbell Press | 3×5-6 | `incline_bb` | 8.5 |
| Machine Chest Press | 3×8-10 | — | 8 |
| Dumbbell OHP | 3×5-6 | `ohp` | 8.5 |
| Lateral Raise (DB) | 3×12-15 | `lat_raise` | 8 |
| Tricep Pushdown | 3×8-10 | `tri_pd` | 8 |
| Pike Push-up *(max-rep test wk11)* | 3×AMRAP-1 | BW | 9 |

**Pull** — *Heavy deadlift triples · pull-up test · back strength*
| Exercise | Sets×Reps | Weight | RPE |
|---|---|---|---|
| Conventional Deadlift | 3×3 | `deadlift` | 8.5-9 |
| Pull-up *(weighted if ≥10 BW; max-rep test wk11)* | 4×AMRAP-1 | `pullup` | 9 |
| Chest Supported Row | 3×6-8 | — | 8.5 |
| Lat Pulldown (neutral) | 3×6-8 | `pulldown` | 8 |
| Face Pull | 3×15 | — | 7 |
| Barbell Curl | 3×6-8 | `bb_curl` | 8.5 |
| Hammer Curl | 3×8-10 | — | 8 |

**Legs** — *Heavy hack squat · strength-biased lower*
| Exercise | Sets×Reps | Weight | RPE |
|---|---|---|---|
| Hack Squat | 4×5-6 | `hack_sq` | 8.5 |
| Bulgarian Split Squat | 3×6-8 | `bss` | 8 |
| Leg Press | 3×8-10 | `leg_press` | 8 |
| Leg Curl (lying) | 3×6-8 | `leg_curl` | 8.5 |
| Cable Pull Through | 3×12-15 | — | 7 |
| Standing Calf Raise | 4×8-10 | — | 8 |
| Hanging Leg Raise | 3×12-15 | BW | 8 |

**Upper+** *(optional)* — *Bench peak · weighted dip · calisthenic tests*
| Exercise | Sets×Reps | Weight | RPE |
|---|---|---|---|
| Bench Press (top set) | 1×3 | `bench` | 9 |
| Bench (back-offs) | 3×5 | 65 | 8.5 |
| Weighted Dip | 4×5-6 | `dip` | 8.5 |
| Pull-up *(weighted / max test)* | 4×AMRAP-1 | `pullup` | 9 |
| Incline DB Curl | 3×8-10 | — | 8 |
| Overhead Tricep Ext | 3×10-12 | — | 8 |
| Ab Wheel | 3×AMRAP-1 | BW | 8.5 |

### Block 4 — Deload (Week 12), RPE 6–7, ~50% volume

**Push** — Barbell Bench Press 3×5 (`bench`, 6-7) · Incline BB 2×8 (`incline_bb`, 6) · Machine Chest Press 2×10 (—, 6) · Lateral Raise 2×12 (`lat_raise`, 6) · Pike Push-up 2×submax (BW, 6)
**Pull** — Deadlift 3×3 (`deadlift`, 6-7) · Pull-up 3×submax (BW, 6) · Chest Supported Row 2×10 (—, 6) · Lat Pulldown 2×12 (`pulldown`, 6) · Face Pull 2×15 (—, 6)
**Legs** — Hack Squat 3×8 (`hack_sq`, 6) · BSS 2×10 (`bss`, 6) · Leg Curl 2×10 (`leg_curl`, 6) · Standing Calf 2×12 (—, 6) · Hanging Leg Raise 2×12 (BW, 6)
**Upper+** *(optional)* — Bench 3×5 (`bench`, 6) · Dip 2×8 (BW, 6) · Pull-up 2×submax (BW, 6) · Incline DB Curl 2×12 (—, 6) · Ab Wheel 2×10 (BW, 6)

## 5. Technical implementation

Per `CLAUDE.md` cookbook ("Add weeks 2–12"):

1. **`js/data/sessions.js`** — replace `SESSIONS_W1` with `SESSIONS = { 1:[…], … 12:[…] }`. Build the 12 keys from 4 block templates (block 1 → weeks 1–4, etc.); Week 1 keeps the leg calibration flags. Keep `export const SESSIONS_W1 = SESSIONS[1]` as a back-compat alias if anything still imports it (remove once confirmed unused).
2. **Render** — `renderWeekGrid()` and `openSession()` read `SESSIONS[Store.state.current_week]` instead of the flat `SESSIONS_W1`. `in_progress` is already keyed `${week}-${sessionId}`, so progress tracking just works.
3. **State** — drop the stale `incline_db` entry from `js/data/default-state.js` `working_weights.push` (unused; conflicts with library). Existing `data/state.json` is the athlete's live state — leave it untouched here; it can be cleaned via a normal in-app edit/`Store.update` rather than a hand-edit.
4. **No design-token changes** — pure data + one render tweak. No new colors/fonts/shapes/rounded corners.

Session `id`s stay constant across weeks (`push-1`/`pull-1`/`legs-1`/`upper-1`) so `${week}-${sessionId}` disambiguates — consistent with the already-logged `1-push-1`.

## 6. Weekly check-in (separate follow-up)

End of each week: read the `state.json` log, apply the +2.5/+5 progression to lifts that hit the top of range @ RPE for 2 sessions, update working weights, flag stalls/fatigue, and confirm the next week's calibration. Can be wired as a recurring reminder once the programme is live — to be set up after implementation.

## 7. Open items / assumptions

- Bench treated as **70 kg honest working weight** (edited down from onboarding 77). Progress via +2.5 kg rule.
- Bench back-off weight shown as a literal `65` (≈90% of 70) — athlete adjusts as bench climbs.
- Leg working weights (`hack_sq`, `bss`, `leg_press`) get set during Week 1 calibration via the app.
- Weighted pull-up only programmed once ≥10 strict BW reps; otherwise Block 3 is a bodyweight max-rep test.
