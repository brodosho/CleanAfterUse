# Clean After Use — UX audit

Everything below was measured in a real browser at 390×844 (a phone-sized viewport),
against the current build. Nothing here is an impression.

---

## 1. Usability and intuitiveness

| Measure | Result | Standard |
|---|---|---|
| Interactive elements below 44 px | **0 of 18** | Apple HIG / WCAG 2.5.5 minimum is 44 px |
| Smallest tap target height | **44 px** | — |
| Text below 13 px on screen | **0** | — |
| Contrast, muted text on background | **11.34 : 1** | WCAG AAA needs 7:1 |
| Maximum taps from Today to any feature | **2** | — |
| Screens that need scrolling | Today 1.0, Progress 1.2, Plan 1.3, **Settings 2.5** | — |
| Page errors across the whole run | **none** | — |

Every feature is one or two taps from the home screen: start a session (1), change an exercise (1),
swap it (2), ELO (2), targets (2), schedule (2), export (2), colour (2).

Tapping an exercise on Today gives four options — swap, set weight, change sets and reps, skip
today. The swap list offered **6 alternatives, each with a diagram**.

**The weak spot is set ticking.** Logging a five-exercise session takes a minimum of **28 taps**,
and **15 of those are ticking individual sets**. There is no "all sets done" shortcut, no long-press,
no auto-advance. That is over half the interaction budget spent on the least interesting thing in
the app.

Settings at 2.5 screenfuls is the only screen that has drifted past comfortable. It now carries
colour, theme, name, bodyweight, five behaviour dropdowns, export, feedback and routines.

---

## 2. Performance and responsiveness

| Measure | Result |
|---|---|
| Cold start to interactive | **335 ms** |
| DOMContentLoaded | 247 ms |
| Page weight | 211 KB, single file |
| Full re-render, Today | **0.32–1.02 ms** |
| Full re-render, session screen | **0.71 ms** |
| ELO calculation | **≤ 0.2 ms** |
| Network calls after load | none — works offline |

The app re-renders the entire screen on every single tap. At sub-millisecond render times that is
invisible, and it removes a whole class of state bugs.

**Stress tested against a year and a half of training:**

| Sessions logged | Today | Progress | Plan | Log size |
|---|---|---|---|---|
| 0 | 0.32 ms | 0.22 ms | 0.35 ms | 15 B |
| 50 | 1.02 ms | 3.98 ms | 0.78 ms | 31 KB |
| 250 | 0.62 ms | 6.23 ms | 0.23 ms | 159 KB |
| 500 | 0.35 ms | 5.14 ms | 0.83 ms | **321 KB** |

Render time is flat — Progress is the only screen that grows, and it plateaus around 5–6 ms
because it caps at 40 rows. Nothing here will ever be felt.

**The real risk is storage, not speed.** At 500 sessions the log is 321 KB. Browser storage limits
vary but 5 MB is a common floor, so this is fine for years — but there is no warning if a write
ever fails, and no cloud backup. All data lives on one device.

---

## 3. Desirability and gamification

| Signal | Present |
|---|---|
| ELO score with named rank | yes |
| Distance to next rank shown | yes |
| Session counts per workout | yes (Progress) |
| Weight-over-time graphs | yes |
| Estimated one-rep max | yes |
| Best-set record kept | yes |
| **Streaks** | **no** |
| **Personal-best celebration at the moment it happens** | **no** |
| **Badges or milestones** | **no** |
| **Social or shared progress** | **no** |

The ELO is the strongest motivational asset and it is genuinely well-built — it names your weakest
lift and tells you the exact weight that would move you a tier. But it is **two taps away on a
secondary screen**, and nothing on Today references it.

The gap is the moment of the win. A personal best is detected and stored, but the app says nothing
when it happens — you find out later by visiting Progress. Hevy makes PR celebration a headline
feature, and a 2024 meta-analysis of 36 randomised trials found gamified fitness apps produced a
measurable, if modest, activity increase over non-gamified ones. Missing the moment is the single
biggest desirability gap.

---

## 4. Customisation depth

| Surface | Count |
|---|---|
| Editable fields per exercise | **13** (name, sets, reps, weight, rest, muscle area, instructions, target, pairing, progression style, stack step, optional, rotation) |
| Routine-level controls | 7 (name, instructions, timing, weekly/fortnightly cycle, schedule, progression rules, sessions) |
| App settings | 14 |
| Exercise library | **51** |
| Ready-made routines | 6 |

Depth is genuinely strong — three progression styles (linear, double progression, GZCLP-style
stages), editable progression bands, fortnightly cycles, supersets, per-exercise pin increments,
three set-logging modes, unit switching that converts history.

**The library is the weakness.** 51 exercises against Jefit's 1,300–1,400 with video demonstrations.
For a beginner on machines that is plenty. For anyone with a specific movement in mind it is not,
and the "add your own" fallback gives no diagram and no form notes.

---

## 5. Efficiency and time to value

| Journey | Taps | Time |
|---|---|---|
| Cold open → complete personalised routine | **14** | **3.6 s** |
| Today → session started | 1 | — |
| Full five-exercise session logged | 28 | — |

Fourteen taps from never having opened the app to having a routine built around your experience,
goal, days, equipment, focus and available time — with the reasoning shown. That is the app's
single best number and it beats everything it competes with, because the competitors either hand
you a blank routine builder or a subscription wall.

The 28-tap session is where the efficiency story weakens. Fifteen set-ticks is the cost.

---

## 6. Competitive benchmarking

Pricing and feature facts below are from published 2026 comparisons.

| | Free tier | Paid | Builds your routine | Explains itself | Offline / no account |
|---|---|---|---|---|---|
| **Clean After Use** | unlimited | — | yes, from 7 questions | yes, with sources | yes |
| Hevy | 4 routines | $23.99/yr, $74.99 lifetime | Hevy Trainer, light touch | no | no |
| Strong | 3 routines | $29.99/yr, $99.99 lifetime | no | no | no |
| Fitbod | 3 workouts total | $12.99/mo, $95.99/yr | yes, per session | no | no |
| Jefit | free with ads | ~$6.99–12.99/mo | pre-written plans | no | no |

**Where it wins.** Nothing else in the category explains its own reasoning — the "why these
exercises" screen showing weekly sets per muscle against the research range has no equivalent.
Nothing else tells you honestly that thirty minutes only holds two exercises. The whole app is one
211 KB file with no account and no network, which no competitor offers. And the free tier is
unlimited in a category where "free" usually means three routines.

**Where it loses.** No cloud sync or account — a lost phone is a lost training history, and every
competitor solves this. No Apple Watch. 51 exercises against Jefit's 1,400 with video. No social
layer, which is Hevy's strongest retention mechanic. Stick figures against HD video demonstrations.

**The honest positioning:** the category is full of logbooks. Multiple 2026 comparisons make the
same observation — all the major apps log sets and reps well, and none of them actually coach you.
This one does coach, and shows its working. That is the differentiator worth protecting.

---

## What to fix, in order

1. **A "tick all sets" control.** 15 of 28 taps per session, and the cheapest fix on this list.
2. **Celebrate the personal best when it happens**, not later in Progress.
3. **Surface the ELO on Today** — the best motivational asset is hidden two taps deep.
4. **A backup route.** Export exists but is manual; there is no prompt and no warning if a storage
   write ever fails.
5. **Grow the library**, or at minimum give custom exercises a diagram picker so they aren't second class.
6. **Split Settings.** At 2.5 screenfuls it is the only screen that has outgrown its shape.
