# 05 · Starting systematically: from idea to plan

> **Part 2 · Thinking before building**

**In one sentence:** never start with "build me X" — start with a conversation that produces a written plan, approve the plan, and only then build.

---

## Why "build me a configurator" fails

When you give an agent a vague goal, it fills every gap with the **most average choice**: average layout, average colours, average features, whatever framework it likes. You get something that works and that you neither designed nor understand. Then you spend hours (and tokens) pushing it towards what you meant.

Every gap you leave, the model fills. **Planning is deciding which gaps you want to fill yourself.**

## The loop

```
   idea
    │
    ▼
 conversation  ──(one of the 5 starting points below)
    │
    ▼
 PLAN.md  ──  you read it, edit it, cross things out
    │
    ▼
 approve  ──  "This plan is approved. Build step 1 only."
    │
    ▼
 build one step ─► check (look, test) ─► note it (PROGRESS.md, PLAN.md)
    │                                                    │
    └──────────────────── next step ◄────────────────────┘
```

## Five ways to start

Pick the one that matches how *you* think. All of them end in a `PLAN.md`. Copy-paste versions are in [`hands-on/starting-points/`](../../hands-on/starting-points/).

### 1 · Interview me
*Best when you're not sure what you want yet.*

```text
I want to build a web app: a configurator for 3D-printable vases.
Before writing any code, interview me about what it needs.
Ask one question at a time, and wait for my answer. Cover: who uses it,
what they can control, what they get at the end, constraints (printers,
materials), and how it should feel. When you have enough, write PLAN.md
and stop.
```

The interview surfaces things you didn't think of. (Real example: while planning this course, the question *"which printers will students use?"* led to the whole idea of printer and material **profiles** — we didn't know, so we made it configurable. See [`prompts/01-interview.md`](../../prompts/01-interview.md).)

### 2 · Map it as a digital product
*Best for structured, technical thinkers.*

```text
Treat this as a digital product: a 3D vase configurator for architecture
students. Map it out: users and their goals, inputs, process, outputs,
and a feature list sorted into must / should / could. Flag the riskiest
technical parts. Write it to PLAN.md. No code.
```

### 3 · Start from the experience (editorial)
*Best for people who care most about how it looks and feels.*

```text
I want a vase configurator that feels like a fashion editorial or a
ceramics gallery catalogue, not like software. Start from mood: references,
typography, pace, how the vase is presented, what the first 5 seconds feel
like. Then work out which configurator features serve that experience.
Write PLAN.md and a first DESIGN.md. No code.
```

### 4 · Start from constraints
*Best for fabrication-minded people.*

```text
Our lab has [list printers] and [list materials]. Start from what is
physically possible: build volumes, nozzle sizes, minimum walls, overhang
limits. Design the configurator so that users can only make — or are
clearly warned about — what can actually be printed. Write PLAN.md.
```

### 5 · Write it yourself, then ask for critique
*Best for people who want full control.*

Write a `PLAN.md` by hand (use the template below). Then:

```text
Read my PLAN.md. Don't build anything. Tell me: what's missing, what's
ambiguous, what's risky, and what would you cut for a first version?
Ask me questions where you'd otherwise have to guess.
```

## What goes in a PLAN.md

```markdown
# PLAN — <project name>
## Goal (one sentence)
## Users
## Inputs → Process → Outputs
## Parameters (name, unit, range)
## Constraints (printers, materials, rules)
## Tech stack   ← paste the stack card
## Pages
## Out of scope (what we are NOT doing)
## Build order (small steps)
```

Our real one: [`PLAN.md`](../../PLAN.md).

## The stack card — always included

Every starting prompt and every plan includes the stack, so nobody leaves it to the agent:

```text
Tech stack (do not change without asking me):
Vite + React + TypeScript + Tailwind CSS. UI components: shadcn/ui.
3D: React Three Fiber + drei (three.js). Rhino export: rhino3dm.
```

If you choose a different component library, write that instead — but write it. See [`hands-on/stack-card.md`](../../hands-on/stack-card.md).

## Approving well

- **Read the whole plan.** Cross out what you don't want. "Out of scope" is your friend.
- **Approve explicitly, and narrowly:** *"Plan approved. Implement step 1 only, then stop and show me."*
- **Plan mode** in Claude Code enforces this: it can't edit files until you approve.
- **Plans change.** When you learn something, update PLAN.md first, then the code.

## Key takeaways

- Vague goals are filled with average answers.
- Five starting points: interview, product map, experience, constraints, write-and-critique.
- Every route ends in a PLAN.md you approve. The stack is always in it.
- Approve one step at a time.

---

**Next:** [06 · Parameters: what do we control? →](../06-parameters/README.md)
