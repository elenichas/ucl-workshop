# 01 · The planning conversation

Before any code, the instructor and Claude went back and forth for several rounds. This is that conversation, condensed. Notice how the brief **grows** with each answer.

---

### Round 1 — the idea

> **Instructor:** I'm going to teach a workshop at an architecture university about using Claude Code to build websites. The case study is a website to configure 3D-printable vases. The process of building it is as important as the result. I want them to understand what Claude Code is, what happens in the background, what building a website means technically, and the thought process for a 3D app: inputs, process, algorithm, outputs, a 3D viewer, a printability check, exports for Rhino… and the parameters: height, width, shape, material, colour. One chapter should be on fundamentals: AI models, agents, websites, repos. And which skills could be relevant. Propose a plan and a repo structure first; we'll agree before building.

**Claude proposed:** a title, ~13 chapters in 4 parts, a repo structure (`course/`, `site/`, `prompts/`, `.claude/skills/`), git tags per stage so students can "time-travel", and asked four questions: *How long is the workshop? Will students drive Claude Code themselves? Which printers does the school have? Changes to the structure?*

### Round 2 — scope grows

> **Instructor:** Add a part on responsiveness, accessibility, UI on the web, 3D interactions, avoiding AI slop, and testing. Reflection moves to the end.

**Claude:** restructured into 5 parts / 18 chapters; noted the size and asked again about duration.

### Round 3 — the format

> **Instructor:** 3 hours. I present, then they play and I walk around. They won't finish; I just want to bring ideas to the table.

**Claude:** proposed a run sheet (70 min talk / 80 min hands-on / 20 min show-and-tell), merging chapters into 10, plus starting points and challenge cards.

### Round 4 — a constraint becomes a feature ⭐

> **Instructor:** I'm not sure what printer they'll use. Leave it open — several printers, materials, colours. If I find out we need to limit it, that's a nice case of real-life limitations affecting the app. And don't worry about size: I'd rather have more material and skip chapters.

**Claude:** back to the full chapter list, and — the key design decision — **printers and materials become editable profiles** in one config file, with printability rules that read from them. *"Our lab only has X — update the app"* becomes a hands-on challenge.

> 💡 This decision didn't exist in the first prompt. It came from a question. That is the argument for interviewing before building.

### Round 5 — teaching the process

> **Instructor:** I want them to think systematically: not "build me a configurator", but write a plan, or ask Claude to interview them, or map it as a digital product, or start from an editorial experience. Better starting points, fewer tokens. And mention tokens and usage.

**Claude:** chapter 05 became *Starting systematically* with five starting points; a new chapter 03 on *Tokens, usage and cost*; and the demo's own log (this folder) would start with an interview.

### Round 6 — design repos

> **Instructor:** *(shares a screenshot listing 12 GitHub repos that "fix AI-generated UI")* Add links to these and show how a student could point their agent at one.

**Claude:** researched all 12 (noting the star counts in the screenshot didn't match the repos), grouped them into five families, proposed creative uses for the vase app, and an example "study → DESIGN.md → apply → critique" workflow. See [`resources/design-repos.md`](../resources/design-repos.md).

### Round 7 — the stack is a decision

> **Instructor:** React, TypeScript, Tailwind, and options for the component library like shadcn. Everyone should be aware of the stack and ask for it explicitly. 3D with three.js or React Three Fiber. Mention that web 3D is like Rhino's viewport but lives on the web, and how to fix a slow viewer.

**Claude:** the **stack card**; Vite + React + TS + Tailwind + shadcn/ui + R3F + rhino3dm fixed, component library as the students' choice; chapter 08 gained "meshes not NURBS" and a performance table.

### Round 8

> **Instructor:** go build it

---

## What to take from this

- Seven rounds of conversation, zero lines of code. Then the build was straightforward.
- Every round **added a decision** the agent would otherwise have guessed.
- The instructor stayed in charge of *what* and *why*; Claude contributed structure, options, and questions.
