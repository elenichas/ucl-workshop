# Run sheet — 3 hours

You present, students play, you walk around. There is more material than time **on purpose**: skip freely, and point students to the repo for the rest.

Legend: **▶ present** · **↷ flip through** (show one slide/table, 1 min) · **⤳ point to** (mention it exists; they read later)

## Timeline

The deck has **43 slides**: a dark divider opens each of the five parts, then 1–3 slides per chapter. Roughly one minute per slide, more on the starred ones.

| Time | Block | Slides | Notes |
|---|---|---|---|
| 0:00 | Welcome — what we build, the one rule | 1–3 | 5 min. Click through the four vases. |
| 0:05 | **Part 1 · Foundations** — agents, websites, the stack, Claude Code, tokens, first prompt | 4–13 | 20 min. The agent loop and "what happens in the background" are the core. |
| 0:25 | **Part 2 · Thinking before building** ⭐ — starting systematically, parameters, the system map | 14–20 | 15 min. Tell the "printer profiles came from a question" story. Show **How it works** live in the app. |
| 0:40 | **Part 3 · Building** — algorithm, viewer, printability, exports | 21–29 | 12 min. The inside-out vase; same vase PLA ✓ / clay ✗. |
| 0:52 | **Part 4 · Craft and quality** — UI, phones, accessibility, 3D, AI slop, testing, shipping | 30–39 | 12 min. Most slides are one-liners — keep moving. |
| 1:04 | **Part 5 · Reflection** (short version) | 40–41 | 3 min. Save the discussion for the end. |
| 1:07 | **Break + setup check** | — | 10 min |
| 1:17 | **Hands-on** | `hands-on/` | 85 min — you walk around |
| 2:42 | Show and tell | — | 10 min — 3–4 screens |
| 2:52 | Reflection discussion | 42–43 | 8 min — pick **two** questions |

If you're running late: skip slides 32–34 and 39 (phones, accessibility, 3D, shipping) — the chapter pages cover them. Never skip Part 2.

## Presenting from the site

**Course → Present the course.** Arrow keys / clicker: next reveal or slide · **O** overview (jump anywhere) · **N** speaker notes window (keep it on your laptop, share only the slides) · **F** full screen · **PowerPoint** button for a .pptx backup (takes about a minute; diagrams and 3D become images, notes are kept).

Key slides: five ways to start **16** · system map **19–20** · inside-out vase **24** · same vase, two printers **27** · AI slop **35**. Use **O** rather than memorising.

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
