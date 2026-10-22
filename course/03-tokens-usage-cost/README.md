# 03 · Tokens, usage and cost

> **Part 1 — Foundations** · ~8 min

**In one sentence:** every word you send, every file Claude reads, and every word it writes back is counted in tokens — they are your budget, and a messy process spends it fast.

---

## What a token is

Models don't read letters or words; they read **tokens** — chunks of text. Roughly:

- 1 token ≈ ¾ of an English word
- 1,000 tokens ≈ 750 words ≈ 1.5 pages
- A 300-line code file ≈ 3,000–5,000 tokens

You pay for (or your plan limits) **input tokens** (what the model reads) and **output tokens** (what it writes). Output is usually more expensive.

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

Crucially, **the whole context is re-read on every turn**. A long conversation means each new message is more expensive than the last.

## Why long chats go wrong

1. **Cost and limits** — you hit your usage limit sooner.
2. **Speed** — more to read = slower answers.
3. **Quality** — with a very full context, early instructions get diluted. The agent "forgets" decisions made an hour ago, contradicts itself, or redoes work.

When the context gets full, Claude Code will **compact** it (summarise older parts). Summaries lose detail. That is why important decisions belong **in files** (PLAN.md, CLAUDE.md, DESIGN.md), not only in the chat.

## Seeing what you use

- `/context` — what is taking up space right now.
- `/cost` or `/usage` (depending on your version and plan) — what this session has used.
- Your account's usage page on claude.ai shows plan limits.

## Working economically — the habits

| Habit | Why it saves tokens |
|---|---|
| **Plan first** (plan mode, PLAN.md) | A wrong build costs 10× more than a conversation about the plan |
| **Small steps** | Each step has a small context; mistakes are caught early |
| **One task per conversation** — then `/clear` | You stop paying to re-read old, irrelevant history |
| **Point to files** — "look at `starts/shapes.ts`" | Instead of "look at everything" (which reads the whole repo) |
| **Keep CLAUDE.md short** | It's read on every single turn |
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

- Tokens measure everything the model reads and writes. The whole context is re-read each turn.
- Long, messy chats are expensive, slow and lower quality.
- Decisions in files, small steps, fresh conversations.

---

**Next:** [04 · Setup and first conversation →](../04-setup-first-conversation/README.md)
