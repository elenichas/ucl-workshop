# 18 · Working with an agent

> **Part 5 — Reflection** · ~10 min, ideally as a discussion

**In one sentence:** the agent writes the code; you remain responsible for what it means, whether it's right, and whether it's good.

---

## What we did, in one picture

```
think ──► plan (PLAN.md, DESIGN.md) ──► build one step ──► check (look, test) ──► note it ──┐
  ▲                                                                                        │
  └──────────────────────────────── learn, update the plan ◄──────────────────────────────┘
```

The agent works at **every** step — it thinks, plans and checks too. The difference is who decides:

| Step | The agent | You |
|---|---|---|
| Think | asks questions, suggests options | decide what it's for |
| Plan | drafts PLAN.md | edit it, approve it |
| Build one step | writes the code | keep the step small |
| Check | runs checks, looks in the browser | judge: is it right, is it good? |
| Note it | updates PROGRESS.md | read it, correct it |
| Learn | forgets between chats | update the plan |

**The agent works at every step. The decisions stay yours.**

## What agents are good at

- Turning a clear description into working code, quickly
- Explaining code, libraries, error messages
- Boilerplate: setup, configuration, the hundredth slider
- Following written rules (CLAUDE.md, DESIGN.md, skills) consistently
- Running tests and fixing what they reveal

## Where they fail

- **Vague goals** → average results (chapters 05 and 15)
- **Confident mistakes** — plausible code that is subtly wrong (our inside-out vase)
- **Long sessions** → forgotten decisions, contradictions (chapter 03)
- **Taste** — they can apply taste you give them; they don't have a point of view of their own
- **The physical world** — they don't know your lab's printer jams on PETG. You do.
- **Over-building** — adding features, abstractions and dependencies nobody asked for

## Habits worth keeping

1. **Plan first, in a file.** Approve narrowly.
2. **Small steps; keep track.** A PROGRESS.md and the rewind button make mistakes cheap.
3. **Read the steps the agent takes**, not just the final message.
4. **Ask for explanations.** "Explain what you changed and why, as if to a first-year student."
5. **Test what's expensive to get wrong.**
6. **Write repeated instructions down** — CLAUDE.md, a skill.
7. **Fresh conversation per task.** Decisions live in files.
8. **Say no.** Refusing an action and explaining why is a normal part of the loop.

## Questions for discussion

- **Authorship.** If the agent wrote every line, who designed the vase configurator? What exactly did *you* contribute?
- **Understanding.** Do you need to understand the code? How much? What's the architecture equivalent — do you need to know how a structural engineer calculates a beam?
- **Taste and sameness.** If everyone uses the same models, will every website — and every vase — converge? What resists that?
- **Responsibility.** The checks said "ready to print" and the print collapsed in the kiln. Whose fault is it?
- **Skills and labour.** What should an architecture student learn now that agents write code? What becomes *more* valuable?
- **Cost.** Tokens are energy and money. When is it worth it?

## Where to go next

- Continue a challenge card at home: [`hands-on/challenge-cards.md`](../../hands-on/challenge-cards.md)
- Start a new folder and build another configurator: a chair, a brick, a façade panel, a lamp
- Read the real build conversation: [the prompt log](../../prompts/)
- Browse [the resources](../../resources/)

> The best prompt you'll write is the one you thought about before typing.

---

**Back to:** [00 · Welcome](../00-welcome/README.md)
