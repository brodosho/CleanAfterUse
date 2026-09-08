# Clean After Use

A gym tracker that builds you a routine, walks you through the session, and shows its working.

One HTML file, no account, no network. Everything is stored on your own device.

**Live:** `https://<your-username>.github.io/clean-after-use/`

---

## What it does

- **Builds a routine from seven questions** — experience, goal, days a week, which days,
  equipment, what you want to bring on, and how long you can be there. Then it tells you where
  those minutes actually go and what the plan does and doesn't cover.
- **Walks you through the session** — warm-up, one exercise at a time with a start/finish diagram
  and form notes, a rest timer, then stretches. If a machine is taken, one tap moves that exercise
  to the end.
- **Progresses the weight for you** — off reps beyond the target, not the raw count, with double
  progression on accessories so a 3×12 accessory doesn't jump 15 kg for doing what it was told.
- **Scores where you are** — an ELO built on published strength standards, with seven ranks and
  concrete advice on the one lift that would move you up a tier.
- **Stays out of the way** — three levels of set logging, from one number to every set, and an
  advanced switch that hides the machinery for anyone who doesn't want it.

## Putting it on GitHub Pages

1. Create a repository (public) and upload everything in this folder to the root.
2. **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/ (root)`**.
3. Wait a minute; your URL appears at the top of that same page.
4. Open it on your phone, then **Add to Home Screen** — Safari on iOS, Chrome's ⋮ menu on Android.

Once installed it runs offline, with its own icon and no browser chrome.

> Pages must be **https** for the service worker and Add to Home Screen to work. Opening
> `index.html` straight off your hard drive works, but without offline caching or installation.

## Files

```
index.html              the whole app, built — this is what GitHub Pages serves
manifest.webmanifest    name, icons, standalone display
sw.js                   service worker, so it works with no signal
icon-192.png/512.png    home screen icons
.nojekyll               tells Pages to serve the files as they are

src/
  app.template.html     the app with four placeholders
  diagrams.js           start/finish figures, drawn as SVG
  generator.js          routine generator, time model, weekly volume balancing
  elo.js                strength standards, ranks, tips, level-up advice
  library.py            the exercise library (86 exercises)
  build_db2.py          builds the SQLite database and src/seed.json
  seed.json             library, routine templates, mobility — generated
  build.py              assembles index.html from the above
  t6.js probe2.js elotest.js personas.js uxtest.py    the test suites

data/
  clean-after-use.db    SQLite: library, templates, schema
  schema.sql            portable dump

docs/                   the audits this was built from
```

## Building it yourself

```bash
python3 src/build_db2.py   # only if you changed library.py or the templates
python3 src/build.py       # writes index.html
```

No dependencies beyond Python 3 for the build. The app itself has no build step at runtime and
loads no frameworks — the only external request is a Google Fonts stylesheet, and it falls back
to system fonts if that fails.

## Tests

```bash
node src/t6.js         # every screen renders
node src/probe2.js     # progression, units, supersets, stages, fortnights
node src/elotest.js    # ELO calibration against known strength standards
node src/personas.js   # 30 simulated people, two weeks each
python3 src/uxtest.py  # tap targets, render timing, interaction depth (needs playwright)
```

## Where the numbers come from

Nothing in the programming logic is invented. The sources:

- **Routine structure and the beginner progression** — the r/Fitness wiki's recommended routines,
  including its Basic Beginner Routine and GZCLP.
- **Weekly volume targets** — the 10–20 sets per muscle per week range from the training-volume
  literature, scaled by experience.
- **Machine-first beginner routine** — ACSM guidance on full-body training for new lifters.
- **Session time model** — set duration, prescribed rest, ramp sets and equipment transitions,
  summed rather than guessed.
- **Energy estimate** — MET values from the Compendium of Physical Activities, where one MET is
  roughly one kcal per kg per hour. It's a ballpark and the app says so.
- **Strength standards behind the ELO** — bodyweight ratios at Beginner through Elite from the
  ExRx performance tables, StrengthLevel's dataset and Symmetric Strength. They describe trained
  adults roughly 18–39.

## What it deliberately doesn't do

No account, no cloud sync, no analytics, no ads. That means your history lives on one device —
export it from **Settings → Your data**, which the app will nag you about every 20 sessions.

It is not a powerlifting program: there is no percentage-of-max programming, no planned blocks
and no peaking. It's a coach for people building a habit and a base.

## Licence

MIT. See `LICENSE`.
