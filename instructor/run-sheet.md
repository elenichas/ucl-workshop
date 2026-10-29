# Run sheet — 2 hours 30 minutes

You present, students play, you walk around. There is more material than time **on purpose**: skip freely, and point students to the repo for the rest.

Legend: **▶ present** · **↷ flip through** (show one slide/table, 1 min) · **⤳ point to** (mention it exists; they read later)

## Timeline

Thursday 29 October, 17:30–20:00. The deck has **42 slides** (slide 2 is the plan for today). The weight is on **Part 2 (how to think about a configurator)** and **Part 3 (building it, prompt by prompt)**. Parts 1 and 4 are context.

| Time | Block | Slides | Notes |
|---|---|---|---|
| 17:30 | Welcome: instructor intro and a walk around the course website | 1–2 | 15 min. Show Course, a chapter, Files, the configurator and the style switch. |
| 17:45 | Presentation | 3–42 | 45 min, see the split below |
| 18:30 | **Break + setup check** | — | 10 min: everyone has Claude Code open on an empty folder |
| 18:40 | Demo and discussion: the configurator prototype | — | 30 min: live in the configurator (start choices, Dimensions, Make tab, How it works, a download) |
| 19:10 | Claude Code walk-through, then **hands-on** | `hands-on/` | 30 min: show a folder, plan mode, a first prompt, PROGRESS.md and localhost, then students pick a starting point or challenge card and start building |
| 19:40 | Open floor for questions | | 20 min |
| 20:00 | End | | |

Presentation split (45 min): welcome loop and Part 1 (slides 3–10) 7 min · **Part 2** (11–20) 15 min · **Part 3** (21–30) 13 min · Part 4 (31–36) 5 min · Part 5 (37–42) 5 min. If you're running late, shorten Parts 1 and 4 to their dividers and save the discussion slides for the open floor. Never skip Parts 2 and 3.

## Presenting from the site

**Course → Present the course.** Arrow keys / clicker: next reveal or slide · **O** overview (jump anywhere) · **N** speaker notes window (keep it on your laptop, share only the slides) · **F** full screen · **PowerPoint** button for a .pptx backup (takes about a minute; diagrams and 3D become images, notes are kept).

Key slides: plan for today **2** · first prompt **8** · localhost **10** · five ways to start **13** · inputs → process → outputs **14** · system map **17–18** · build prompts **23, 27, 30** · inside-out vase **26** · same vase, two printers **28**. Use **O** rather than memorising.

The reading version of every chapter (on the site and on GitHub) is longer than the slides on purpose — point students there for details.

## Live demo checklist (before the session)

- [ ] `cd site && npm install && npm run dev` works on your laptop *offline-ish* (fonts may fall back without internet — fine)
- [ ] `git tag` lists `stage-01` … `stage-07`
- [ ] One clean terminal ready for `git checkout stage-05-exports` / `stage-06-craft` (the before/after craft moment)
- [ ] The site open on your phone (`npm run dev -- --host`, same Wi-Fi)
- [ ] An exported `.3dm` already opened in Rhino, in case live export is slow
- [ ] A PowerPoint export saved locally, in case the browser misbehaves on the projector
- [ ] Ask the lab: which printers and materials? → edit `site/src/config/printers.ts` / `materials.ts` **or** keep the "Our lab only has X" card as a live exercise

## During the hands-on

Things to look for as you walk around:

- **Someone typed "build me a configurator"** → send them to `hands-on/starting-points/`.
- **A conversation 40 messages long** → `/clear`, decisions into PLAN.md.
- **The agent "fixed" a test** → ask: did the test change or the code?
- **Purple gradient spotted** → chapter 15, DESIGN.md.
- **Stuck on setup** → pair them with a neighbour; route B (jump in at a stage) needs only `npm install`.

## Questions students often ask

- *"Do I need to learn to code?"* — You need to read enough to judge. Like reading a structural drawing without being an engineer.
- *"Is it cheating?"* — Who designed the decisions? (Chapter 18.)
- *"Why React and not X?"* — It's a decision, not a law. The stack card shows the alternatives.
- *"Can it make my thesis website?"* — Yes, with the same process. Start with an interview.
