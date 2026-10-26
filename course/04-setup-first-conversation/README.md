# 04 · Setup and first conversation

> **Part 1 — Foundations** · ~10 min (plus setup time during the hands-on)

**In one sentence:** you start from an empty folder on your laptop, and your first conversation with the agent is about thinking, not building.

---

## What you need

| Tool | Why | Check it works |
|---|---|---|
| **Claude Code** (desktop app, terminal or VS Code) | The agent | it opens and answers |
| A **paid Claude plan** (Pro or higher) | Claude Code isn't included in the free plan | you can log in to Claude Code |
| **Node.js 20+** | Runs the website on your laptop while you work | `node -v` |
| A **code editor** (VS Code recommended) — optional | To peek at what the agent wrote | — |

That's it. **No GitHub account and no Git needed today.** Installation instructions change; follow the official page: [Claude Code — quickstart](https://code.claude.com/docs/en/quickstart).

> **No paid plan?** You can still follow the thinking part of the course in a normal claude.ai chat. Ask for a **single, self-contained HTML file** (three.js loaded from a CDN, sliders, an STL download button), save it and double-click it to open it in a browser — no Node.js needed. Claude can't see or run your file in a chat, so *you* are the check step: open it, describe what's wrong, paste back the new version. The free plan's limits are tight, so small steps and fresh chats matter even more.

## Your project is a folder

Make an empty folder — `my-vase-configurator` — and open Claude Code in it. Everything the agent writes will land in that folder. That folder *is* your project.

Before your first prompt, set the mode to **Manual** or **Plan**, so it asks before changing anything (see [chapter 02](../02-what-is-claude-code/README.md)).

## Your first prompt: ask, don't order

You're starting from a blank canvas, so the first conversation is about **how to think** about the thing — not about building it:

```text
I want to make a website where people can design their own
3D-printable vase. I have never built a website.
Before we build anything: how should I think about it?
What are the inputs, the process and the outputs?
Explain it with an analogy from architecture or Grasshopper.
Don't write any code yet.
```

More good first questions:

```text
What would a first, very small version of this website include?
What could I leave out for now?
```

```text
What decisions do I need to make before we start
(for example: which printers, which materials, how it should look)?
Ask me about them one at a time.
```

Nothing changes, nothing breaks, and you learn the shape of the problem. When you're ready, move on to [chapter 05](../05-starting-systematically/README.md) and turn the conversation into a plan.

## The loop, once

1. **Ask** — *"How should I think about a vase configurator?"*
2. **Act** — *"Build step 1 of the plan, then stop."* (The agent writes code into your folder.)
3. **Check** — look at it in the browser; ask *"what did you change, in plain words?"*
4. **Note it** — *"Add what we just did to PROGRESS.md."*

### Keeping track without Git

- **The chat is a log.** You can scroll back and see every request and every change.
- **Better: a progress file.** At the start, ask: *"Keep a PROGRESS.md in this folder. After each step, write what I asked, what you changed and what we decided."*
- **Undo:** Claude Code can rewind (`/rewind`) to an earlier point, including the files it edited. It doesn't undo what commands did (like installing packages), so before a big change, also duplicate the folder.

### Your own .md files

Write your decisions down in your project folder, so Claude stays consistent from one chat to the next. A new chat doesn't carry over the conversation you had before. Claude Code keeps a few notes of its own (auto memory), but you don't choose what goes in them — your own files are the memory you control.

| File | What goes in it | Our example |
|---|---|---|
| `PLAN.md` | What you're building, step by step, and the stack | [PLAN.md](../../PLAN.md) |
| `DESIGN.md` | How it should look: colours, type, do's and don'ts | [DESIGN.md](../../DESIGN.md) |
| `PROGRESS.md` | What you asked, what changed, what you decided | [template](../../hands-on/progress-template.md) |
| `CLAUDE.md` | Short rules Claude reads at the start of every chat | [CLAUDE.md](../../CLAUDE.md) |

You don't have to write them yourself: ask Claude to draft each one, then read and edit it. All of ours are on the **Files** page of this website.

(Professionals use Git for this — a history of saved versions. It's worth learning later; you don't need it today.)

## Your site lives at localhost

When the agent starts your website, you'll see a link like:

```
http://localhost:5173
```

**localhost means "this computer".** The page is running only on your laptop, only while that process runs. Perfect for designing and testing — and invisible to everyone else.

The classic beginner moment: proudly pasting `http://localhost:5173` into the group chat… and everyone replies *"This site can't be reached."* As the old joke goes: *there's no place like 127.0.0.1* (127.0.0.1 is localhost's address).

To give people a link they can open, the site has to be **built and put on a host** — see [chapter 17](../17-shipping/README.md). That's a next step, not for today.

## When things go wrong (they will)

| Symptom | Try |
|---|---|
| The page is blank | Tell the agent: *"The page is blank. Look at the browser's error messages and fix it."* |
| `node` command not found | Node.js isn't installed, or the app needs restarting |
| The agent is going in circles | Stop it, explain what you actually want — or start a fresh chat with a better prompt |
| You hate the change | Ask it to undo, or rewind the conversation |

---

**Next:** [05 · Starting systematically →](../05-starting-systematically/README.md)
