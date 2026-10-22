# Run sheet — 3 hours

You present, students play, you walk around. There is more material than time **on purpose**: skip freely, and point students to the repo for the rest.

Legend: **▶ present** · **↷ flip through** (show one slide/table, 1 min) · **⤳ point to** (mention it exists; they read later)

## Timeline

| Time | Block | Chapters | Mode |
|---|---|---|---|
| 0:00 | Welcome + live demo of the finished configurator | 00 | ▶ 5 min |
| 0:05 | AI + web fundamentals | 01 | ▶ 12 min — the agent loop diagram, "a website is files", the stack table |
| 0:17 | What is Claude Code | 02 | ▶ 12 min — the 10-step "background" diagram; skills in 2 min |
| 0:29 | Tokens | 03 | ▶ 5 min — the context box + "A vs B" comparison |
| 0:34 | Setup | 04 | ↷ 2 min (they do it during the break) |
| 0:36 | **Starting systematically** ⭐ | 05 | ▶ 12 min — the five starting points; tell the "printer profiles came from a question" story (`prompts/01-interview.md`) |
| 0:48 | Parameters | 06 | ↷ 3 min — "every parameter is a decision you give away" |
| 0:51 | Algorithm | 07 | ▶ 6 min — Grasshopper analogy + the **inside-out vase** story |
| 0:57 | Viewer + performance | 08 | ▶ 5 min — meshes not NURBS; the "when it's slow" table |
| 1:02 | Printability + exports | 09, 10 | ↷ 4 min — same vase, PLA ✓ vs clay ✗, live in the app |
| 1:06 | Craft: UI, responsive, a11y, 3D interaction | 11–14 | ↷ 4 min — show stage 5 vs stage 6 side by side; show it on your phone |
| 1:10 | **Avoiding AI slop** | 15 | ▶ 6 min — the tells; DESIGN.md; the five families of repos |
| 1:16 | Testing + shipping | 16, 17 | ↷ 3 min — run `npm test` live; the 3DM bug only a browser caught |
| 1:19 | **Break + setup check** | — | 10 min |
| 1:29 | **Hands-on** | `hands-on/` | 75 min — you walk around |
| 2:44 | Show and tell | — | 10 min — 3–4 screens |
| 2:54 | Reflection | 18 | 6 min — pick **two** discussion questions |

If you're running late, cut in this order: 14 → 13 → 12 → 10 → 06 → 17. Never cut 05.

## Live demo checklist (before the session)

- [ ] `cd site && npm install && npm run dev` works on your laptop *offline-ish* (fonts may fall back without internet — fine)
- [ ] `git tag` lists `stage-01` … `stage-07`
- [ ] One clean terminal ready for `git checkout stage-05-exports` / `stage-06-craft` (the before/after craft moment)
- [ ] The site open on your phone (`npm run dev -- --host`, same Wi-Fi)
- [ ] An exported `.3dm` already opened in Rhino, in case live export is slow
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
