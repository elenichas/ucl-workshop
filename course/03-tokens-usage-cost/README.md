# 03 · Tokens, usage and cost

> **Part 1 · Foundations**

**In one sentence:** every word you send, every file Claude reads, and every word it writes back is counted in tokens — they are your budget, and a messy process spends it fast.

---

## What a token is

Models don't read letters or words; they read **tokens** — chunks of text. Roughly:

- 1 token ≈ ¾ of an English word
- 1,000 tokens ≈ 750 words ≈ 1.5 pages
- A 300-line code file ≈ 3,000–5,000 tokens

You pay for (or your plan limits) **input tokens** (what the model reads) and **output tokens** (what it writes). Output is usually more expensive — and the model's *thinking* before it answers counts as output too.

## What fills the context

The **context window** is everything the model can see right now. In Claude Code it holds:

```
┌──────────────────────────────────────────────────┐
│ System instructions + tool descriptions          │  fixed cost, every turn
│ CLAUDE.md                                        │  every turn  → keep it short
│ Skill names + descriptions                       │  tiny
│ The whole conversation so far                    │  grows every turn
│ Every file Claude has read                       │  big!
│ Every command output (test results, logs)        │  can be huge
└──────────────────────────────────────────────────┘
```

Crucially, **the whole context is sent again on every turn**. *Prompt caching* makes the repeated part much cheaper than reading it fresh — but not free: in a long conversation, even a one-line question carries everything before it.

## Why long chats go wrong

1. **Cost and limits** — you hit your usage limit sooner.
2. **Speed** — more to read = slower answers.
3. **Quality** — with a very full context, early instructions get diluted. The agent "forgets" decisions made an hour ago, contradicts itself, or redoes work.

When the context gets full, Claude Code will **compact** it (summarise older parts). Summaries lose detail, and compacting is itself a big request (it reads everything it summarises). `/clear` costs nothing. That is why important decisions belong **in files** (PLAN.md, CLAUDE.md, DESIGN.md), not only in the chat.

## Seeing what you use

- `/context` — what is taking up space right now.
- `/usage` — what this session has used and, on a paid plan, how close you are to your limits.
- Your account's usage page on claude.ai shows plan limits.

## Working economically — the habits

| Habit | Why it saves tokens |
|---|---|
| **Plan first** (plan mode, PLAN.md) | A wrong build costs 10× more than a conversation about the plan |
| **Small steps** | Each step has a small context; mistakes are caught early |
| **One task per conversation** — then `/clear` | You stop sending old, irrelevant history with every message |
| **Point to files** — "look at `starts/shapes.ts`" | Instead of "look at everything" (which reads the whole project) |
| **Keep CLAUDE.md short** | It's part of every request in every conversation |
| **Put decisions in files** | You can `/clear` freely; knowledge survives |
| **Ask for summaries, not dumps** | "Run the tests and tell me only what failed" |
| **Choose the model for the job** | Smaller/faster models for simple edits, bigger ones for planning |
| **Don't paste huge logs** | Paste the relevant 20 lines |

## A comparison you can show

Two ways to get the same result:

**A — "Build me a vase configurator."** → the agent invents everything, builds a lot, you dislike half of it, you ask for changes, it rewrites, the context fills up with abandoned attempts.

**B — Interview → PLAN.md → approve → build step 1 → check → `/clear` → step 2…** → each conversation is short and focused, decisions live in files, nothing is built twice.

B uses fewer tokens *and* gives you a result you understand. Efficiency and good process are the same thing.

## Key takeaways

- Tokens measure everything the model reads and writes. The whole context is sent with every turn.
- Long, messy chats are expensive, slow and lower quality.
- Decisions in files, small steps, fresh conversations.

---

**Next:** [04 · Setup and first conversation →](../04-setup-first-conversation/README.md)
