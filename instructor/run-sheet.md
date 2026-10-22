# Run sheet — 3 hours

You present, students play, you walk around. There is more material than time **on purpose**: skip freely, and point students to the repo for the rest.

Legend: **▶ present** · **↷ flip through** (show one slide/table, 1 min) · **⤳ point to** (mention it exists; they read later)

## Timeline

The deck has **40 slides**. The weight is on **Part 2 (how to think about a configurator)** and **Part 3 (building it, prompt by prompt)**. Parts 1 and 4 are context: a few slides each, details on the chapter pages.

| Time | Block | Slides | Notes |
|---|---|---|---|
| 0:00 | Welcome — what we build, the one rule | 1–3 | 5 min. Click through the four vases, open the real configurator for 30 seconds. |
| 0:05 | Part 1 · Context — the agent writes the code, the stack, files over chat, the first prompt, localhost | 3–9 | 10 min. Keep it light; enjoy the localhost joke. |
| 0:15 | **Part 2 · Thinking before building** ⭐ | 10–20 | 25 min. Inputs → process → outputs; the start decides the controls; the system map (show **How it works** live); constraints as inputs; the exercise. |
| 0:40 | **Part 3 · Building it, prompt by prompt** ⭐ | 21–30 | 20 min. Read the prompts aloud. The inside-out vase; same vase PLA ✓ / clay ✗. |
| 0:58 | Part 4 · Context — craft and quality | 31–36 | 7 min. Work first, design second · readable for everyone · chosen vs unchosen · three ways to test · how a site gets a public link. |
| 1:05 | Part 5 · Reflection (short) | 37–38 | 2 min. Save the discussion for the end. |
| 1:05 | **Break + setup check** | — | 10 min |
| 1:15 | **Hands-on** — start with the system-map worksheet, then a starting point or challenge card | `hands-on/` | 87 min — you walk around |
| 2:42 | Show and tell | — | 10 min — 3–4 screens |
| 2:52 | Reflection discussion | 39–40 | 8 min — pick **two** questions |

If you're running late: shorten Parts 1 and 4 to their dividers. Never skip Parts 2 and 3.

## Presenting from the site

**Course → Present the course.** Arrow keys / clicker: next reveal or slide · **O** overview (jump anywhere) · **N** speaker notes window (keep it on your laptop, share only the slides) · **F** full screen · **PowerPoint** button for a .pptx backup (takes about a minute; diagrams and 3D become images, notes are kept).

Key slides: first prompt **7** · localhost **9** · five ways to start **12** · inputs → process → outputs **14** · system map **17–18** · build prompts **23, 27, 30** · inside-out vase **26** · same vase, two printers **28**. Use **O** rather than memorising.

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
