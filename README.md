# Prompt to Print

**Building a parametric vase configurator with Claude Code**
A two-and-a-half-hour workshop for architecture students · UCL

> This course is not about building the best website ever.
> It is about learning **how to think** when you build a digital tool with an AI agent:
> what goes in, what happens in the middle, what comes out, and how you check it.

Our case study is a web app where anyone can design their own 3D-printable vase: change its height, shape, ribs and twist, see it in 3D, check whether it can actually be printed, and download it for Rhino or a slicer.

---

## What is in this repo

| Folder | What it is |
|---|---|
| [`course/`](course/) | The 19 chapters of the course, one folder each. Start at [00 — Welcome](course/00-welcome/README.md). |
| [`instructor/`](instructor/) | The run sheet: what to present, what to skip, when to stop talking. |
| [`hands-on/`](hands-on/) | Starting-point prompts, challenge cards, a prompt cheat sheet and the stack card. |
| [`prompts/`](prompts/) | The real conversation behind the demo: every step, the prompt used and what we learned. |
| [`resources/`](resources/) | Curated links: design repos, skills, 3D, web fundamentals. |
| [`site/`](site/) | The demo website: the vase configurator, the course as readable pages, and the course **as a presentation** (with PowerPoint download). |
| [`.claude/skills/`](.claude/skills/) | Custom skills written for this project (printability review, design language). |
| [`CLAUDE.md`](CLAUDE.md) | The project instructions Claude Code reads every time it starts here. |
| [`PLAN.md`](PLAN.md) | The approved plan for the demo app, written **before** any code. |
| [`DESIGN.md`](DESIGN.md) | The design language of the demo site. |

## The course at a glance

**Part 1 — Foundations**
00 Welcome · 01 Fundamentals: AI and the web · 02 What is Claude Code? · 03 Tokens, usage and cost · 04 Setup and first conversation

**Part 2 — Thinking before building**
05 Starting systematically: from idea to plan · 06 Parameters: what do we control?

**Part 3 — Building it, prompt by prompt**
07 The algorithm · 08 The 3D viewer · 09 Is it printable? · 10 Exports

**Part 4 — Craft and quality**
11 UI on the web · 12 Responsiveness · 13 Accessibility · 14 3D interactions · 15 Avoiding AI slop · 16 Testing · 17 Shipping

**Part 5 — Reflection**
18 Working with an agent

## Run the demo on your laptop

You need [Node.js](https://nodejs.org) (version 20 or newer).

```bash
cd site
npm install      # downloads the libraries listed in package.json
npm run dev      # starts a local server, open the link it prints
```

Other commands: `npm test` (geometry and printability tests), `npm run build` (makes the publishable version in `site/dist`).

## Presenting

Open **Course → Present the course** (or *Present this chapter* on any chapter page). Arrow keys or a clicker move through slides and reveals. **F** full screen · **O** overview · **N** speaker notes in a second window · **PowerPoint** button downloads the whole deck as an editable .pptx (diagrams and 3D views as images, notes included).

## Follow the build step by step

Every stage of the demo is saved, so you can jump to the exact state of the website at the end of each chapter. **Students don't need Git:** the instructor hands out each stage as a plain folder (see [`hands-on/`](hands-on/README.md)). If you do use Git, each stage is a **tag**:

| Tag | State of the app |
|---|---|
| `stage-01-scaffold` | Empty React + TypeScript + Tailwind project, stack decided |
| `stage-02-algorithm` | The vase geometry exists as code and tests, no visuals yet |
| `stage-03-viewer` | 3D viewer with orbit controls |
| `stage-04-printability` | Printer and material profiles + printability checks |
| `stage-05-exports` | STL, OBJ and Rhino .3dm downloads |
| `stage-06-craft` | Real UI, responsive layout, accessibility pass |
| `stage-07-shipped` | Tests, course pages inside the site, deploy workflow |
| `stage-08-ways-to-start` | Nine ways to start (shapes, draw, sketch, image, carve), pattern library, colours and finishes, the system map |
| `stage-09-presentation` | Present mode with animated diagrams and live 3D, speaker notes, PowerPoint export |

```bash
git checkout stage-03-viewer     # travel to that moment
git checkout main                # come back to the present
```

## The stack (decided, not left to the agent)

Vite · React · TypeScript · Tailwind CSS · shadcn/ui-style components (Radix) · React Three Fiber + drei · rhino3dm

See [`hands-on/stack-card.md`](hands-on/stack-card.md) for why, and for the alternatives students may choose.
