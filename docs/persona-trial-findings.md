# Clean After Use — 30-persona trial

Thirty personas, two simulated weeks each, run against the app's real code: routine generation,
schedule, session rotation, logging, progression, statistics. 212 sessions in total.
Everything below is something the run actually produced, not something I imagined a user might say.

---

## The thirty

| # | Persona | Sessions |
|---|---|---|
| 1 | Complete beginner, 34F, machines, 3 days, wants tone | 6/6 |
| 2 | Complete beginner, 19M, gym-naive, barbell | 6/6 |
| 3 | 70M, first time lifting, machines, 2 days, 30 min | 4/4 |
| 4 | 56M returning after 20 years, barbell, strength | 6/6 |
| 5 | 26M, 3 years training, 6-day PPL, sceptical | 12/12 |
| 6 | 30F adapting it to her own split | 8/8 |
| 7 | Shift worker, misses half his days | 5/6 |
| 8 | Home trainer, dumbbells only, 2 days | 4/4 |
| 9 | Postpartum 33F, cautious, machines | 6/6 |
| 10 | Powerlifter-curious 24M, 4 days, heavy | 8/8 |
| 11 | Cutting weight, 29F, 5 days | 10/10 |
| 12 | Busy parent 41F, 30-minute slots | 6/6 |
| 13 | Runs the r/Fitness beginner routine as-is | 6/6 |
| 14 | Runs GZCLP | 6/6 |
| 15 | Runs the machine starter template | 6/6 |
| 16 | Runs Gym Phase 1 | 10/10 |
| 17 | Plateaus after one week | 6/6 |
| 18 | Very strong beginner, blows through weights | 6/6 |
| 19 | Drops sets, never finishes a session | 6/6 |
| 20 | Adds classes and cardio constantly | 6/6 |
| 21 | 6 days, wants a fortnightly split | 12/12 |
| 22 | 68M, joint issues, machines | 6/6 |
| 23 | 17M athlete, in season, 2 days | 4/4 |
| 24 | Trains in pounds, US-based | 8/8 |
| 25 | Four 30-minute sessions a week | 8/8 |
| 26 | Never records bodyweight | 6/6 |
| 27 | Sometimes trains twice a day | 10/10 |
| 28 | Only free Friday to Sunday | 6/6 |
| 29 | Disappears for three weeks mid-trial | 1/6 |
| 30 | Perfectionist, edits and logs precisely | 8/8 |

---

## What worked

**Nothing crashed and nothing corrupted.** Across 212 sessions there were no errors, no
`NaN` weights, no orphaned exercises, no sessions that logged nothing.

**The rotation held up under real behaviour.** No persona was ever handed the same session
three times running. The shift worker (7) and the three-week absentee (29) both picked up
where they left off rather than being told they were behind — the rotation follows what you
last *did*, not what the calendar expected.

**Weekend-only and awkward availability worked.** Persona 28, free only Friday to Sunday, got
three properly spaced sessions with no complaint.

**Session accounting is accurate.** Sets completed, duration and the calorie estimate were
recorded correctly every time, including for persona 19 who deliberately dropped half his sets.
Persona 26, who never entered a bodyweight, correctly got no calorie figure and an explanation
rather than a made-up number.

**The time model held.** Every session landed inside its slot. Eight personas — the 30-minute
and heavy-strength ones — got an honest note that rests had been shortened to make it fit.

**All four templates ran clean** (13–16), including Gym Phase 1 at ten sessions a fortnight.

---

## What didn't work

**1. Progression bands are wrecking the accessory lifts.** Eight of thirty personas.
The bands were written for a 5-rep compound, then applied to everything. A Bulgarian split
squat prescribed at 3×12 hits the "that weight is far too light" band the moment you do 12 reps
— which is exactly what you were told to do.

```
Bulgarian Split Squat, 3×12, at 10 kg
  got 10 reps -> next 20 kg
  got 12 reps -> next 25 kg      (the prescribed number)
```

Persona 5 ended two weeks with a one-arm dumbbell row at 72.5 kg and a goblet squat at 85 kg.
This is the most serious thing in the trial: it is an injury pathway, not a nuisance.
The band should key off reps *above target*, not absolute reps.

**2. The fortnightly schedule ignores which week it is.** Persona 21. With two weeks of
schedule stored, the lookup takes the first row matching the day name, so Week 2 Monday
resolves to Week 1's session. The fortnight feature is decorative right now.

**3. Switching kg to pounds corrupts your history.** Persona 24. Current weights convert;
logged sessions don't. A lift recorded at 60 kg stays as "60" and the progress graph plots it
next to converted figures, mixing units on the same line.

**4. Stalls are silent.** Personas 13, 15, 16, 17. The app counts how many sessions you have
been stuck at a weight — and then does nothing with it. The stall warning and the
"drop 10% and rebuild" button existed in the previous version and were lost in the rewrite.
Persona 17, built specifically to plateau, got no acknowledgement at all.

**5. Two cardio answers do nothing.** "No, lifting only" and "Yes, but on my rest days"
produce byte-identical plans. Only "after lifting" changes anything.

**6. Features lost in the rewrite.** All confirmed absent from the current build:
progression-rules editor, per-set logging, marking an exercise optional, paste-a-list bulk add.
The `guided` setting is still in Settings but there is no unguided path left for it to switch to
— it is a dead control.

---

## What could work better

**The volume warning appears once and is never seen again.** 22 of 30 personas finished
below the weekly set target for at least one muscle. They are told at creation, in a paragraph
they read once while excited about starting, and never again. It belongs on the Plan screen
as a persistent, dismissible line.

**Coming back after a break.** Persona 29 returned after three weeks to weights exactly where
she left them, with no suggestion to drop back. A simple "it has been 18 days — want to start
10% lighter?" would cover it.

**First-weight guidance is one-directional.** The app tells beginners to start with the bar,
then asks for a number. Personas 1, 3, 9 and 22 have no way to say "I don't know yet" and let
the first session find it.

**Short sessions dead-end.** Personas 3, 12 and 25 get two exercises, which is arithmetically
right, but the app never revisits it. If they later free up 15 minutes, nothing prompts them.

**Diagrams are pattern-level, not exercise-level.** Face Pull shows a row; Lateral Raise shows
an overhead press. Close enough to be useful, wrong enough to mislead a true beginner —
which is exactly persona 1 and 2's situation.

---

## What would make it better

- **A one-tap "how did that feel?"** after each exercise — easy / right / hard. Reps alone
  cannot tell the difference between a light set and a grinder, and it would fix the accessory
  problem more elegantly than rep-band maths.
- **Deload weeks.** Nothing in the app suggests backing off after six to eight weeks of
  progression, which is where personas 5, 10 and 30 were heading.
- **Supersets**, for the time-poor. Pairing two accessories would buy personas 12 and 25 a
  third and fourth exercise inside the same half hour.
- **Remember the reorder.** Persona 7's gym is busy at the same time every week; the machine he
  parks is the same machine every session, but the order resets each time.
- **Pin numbers, not just plate maths.** Machine users (1, 3, 9, 15, 22 — a third of the trial)
  get no loading help at all, because plate breakdown only fires for barbells.
- **Export.** Persona 30 wants his data out. There is currently no way to get it.
- **A session-length reality check on the Plan screen**, showing what each session actually costs
  now, since editing exercises silently changes the time and nothing recalculates in view.

---

## Priority

1. Fix the progression bands — it is a safety issue, not a polish issue
2. Restore the stall warning and deload button
3. Fix the fortnight lookup and the unit conversion of history
4. Make the volume and time warnings persistent rather than one-shot
5. Everything else
