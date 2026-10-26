# 02 · What is Claude Code?

> **Part 1 — Foundations** · ~15 min

**In one sentence:** you chat, and the agent writes the code — Claude Code is an AI that works *inside your project folder*: it looks at your files, writes into them and checks the result, while you watch and steer.

---

## Where it runs

Claude Code works in the Claude desktop app, in a code editor like VS Code, in a terminal, or on the web. Same agent, different windows. In this workshop we use whichever your laptop is set up with.

## What happens when you ask

You never type code yourself. **You are writing code through the chat** — the agent does the typing. When you send a message, roughly this happens:

```
1. You ask        "Make the vase twist as it goes up."
2. It thinks      "I should see how the vase shape is made."
3. It looks       opens the files in your folder that matter
4. It writes      changes those files       ← this is where the code gets written
5. It checks      tries it, looks for errors   (not happy? → back to 2)
6. It tells you   "I added a twist slider. Here's what changed…"
```

This is **the agent loop**: think → act → look → repeat. Every step uses tokens (chapter 03) and every step is visible to you. **Read the steps, not just the final message** — that's where you learn what's going on.

## What it can do

| It can… | Why you care |
|---|---|
| **Look** at and search your files | It learns *your* project instead of guessing |
| **Write** — change or create files | This is where your website gets built |
| **Run** things — start the site, run checks | It can try its own work; in Manual mode it asks you first |
| **Look things up** online | For documentation it wasn't trained on |
| **Hand off** a sub-task to a helper | Keeps the main conversation focused |

### Who approves what: permission modes

Claude Code has a few **modes** that decide how often it asks you:

- **Manual** — asks before it changes a file or runs a command (reading files doesn't ask). You can approve once, approve for the session, or say no and explain why.
- **Auto** — a second model reviews each action and lets routine ones run without asking. Recent versions often **start in this mode**.
- **Accept edits** — edits files without asking; still asks before most commands.
- **Plan** — looks around and writes a plan, changes nothing (below).

**For this workshop, choose Manual or Plan**, so you see and approve every step. Switch with `Shift+Tab` in the terminal, or with the mode selector under the prompt box in the desktop app and VS Code. Saying no is a valid and useful answer.

## Modes worth knowing

- **Plan mode** — Claude thinks and proposes a plan but **changes nothing** until you approve. Use it for anything bigger than a small fix.
- **Stop** — press `Esc` (or the stop button in the app) to stop it mid-way if it is going in the wrong direction. Then redirect.
- **Rewind** — `/rewind` (or `Esc` twice) goes back to an earlier point in the conversation, including earlier versions of the files Claude edited. It does **not** undo what commands did (installing packages, files a script created). Before a big change, also duplicate the folder.

## How you give it lasting knowledge

| Mechanism | What it is | Our example |
|---|---|---|
| **CLAUDE.md** | A file of project instructions read at the start of every session. `/init` can draft one. | Our stack, folder structure, "units are mm" — see [`CLAUDE.md`](../../CLAUDE.md) |
| **Auto memory** | Short notes Claude writes *itself* (on by default) and reads at the start of each session. See and edit them with `/memory`. | You don't decide what goes in — so keep real decisions in your own files |
| **PLAN.md** (convention, not a feature) | The plan you agreed on, in a file both of you can read | [`PLAN.md`](../../PLAN.md) |
| **DESIGN.md** (convention) | The visual language | [`DESIGN.md`](../../DESIGN.md) |
| **Skills** | Folders of know-how (a `SKILL.md` + optional scripts/references) that Claude loads *only when relevant* | [`.claude/skills/printability-review`](../../.claude/skills/printability-review/SKILL.md) |
| **Connectors (MCP)** | Connections to outside tools: a browser, Figma, a database, even Rhino | Playwright MCP lets Claude open the site and look at it |
| **Hooks** | Scripts that run automatically at certain moments (e.g. format code after every edit) | Not used today |

## Skills, in more detail

A **skill** is packaged expertise. It's a folder:

```
.claude/skills/printability-review/
├── SKILL.md          ← name, description ("use when…"), and the instructions
└── references/       ← optional: longer notes, checklists, scripts
```

Only the **name and description** sit in Claude's context all the time (a few tokens). When your request matches the description, Claude reads the full instructions. This is called *progressive disclosure*, and it is why you can have many skills without filling the context.

Skills relevant to this project:

| Skill | Source | Use it for |
|---|---|---|
| `frontend-design` | Anthropic ([skills repo](https://github.com/anthropics/skills)) | Pushing the UI away from generic defaults |
| `webapp-testing` | Anthropic | Letting Claude open the site in a real browser and test it |
| `skill-creator` | Anthropic | Writing your own skills |
| `printability-review` | **this project** | Reviewing a vase design against printer/material rules |
| `vase-design-language` | **this project** | Keeping new UI consistent with DESIGN.md |
| Impeccable, Hallmark, Taste Skill… | Community | Design critique and anti-slop — see [`resources/design-repos.md`](../../resources/design-repos.md) |

> **The lesson:** a skill is just *know-how written down*. If you find yourself explaining the same thing to Claude twice, it should be a skill (or a line in CLAUDE.md).

## Useful commands

Type `/` in Claude Code to see the full, current list. A few you will use:

| Command | Does |
|---|---|
| `/init` | Drafts a CLAUDE.md by reading your project |
| `/clear` | Starts a fresh conversation (same project) |
| `/compact` | Summarises the conversation so far to free up context |
| `/context` | Shows what is filling the context window |
| `/model` | Switch model |
| `/rewind` | Go back to an earlier point (conversation and Claude's file edits) |
| `/memory` | See CLAUDE.md and Claude's own notes |
| `/help` | Everything else |

## Key takeaways

- You chat; the agent writes the code — in a loop: think → act → look → repeat.
- Watch the steps, not just the final answer.
- Choose the mode (Manual or Plan today), small steps, approve or refuse actions.
- CLAUDE.md, skills and connectors are how you give it lasting knowledge and new abilities.

## Go deeper

- [Claude Code documentation](https://code.claude.com/docs/en/overview) · [Permission modes](https://code.claude.com/docs/en/permission-modes) · [Memory](https://code.claude.com/docs/en/memory)
- [Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) · [anthropics/skills](https://github.com/anthropics/skills)
- [Model Context Protocol](https://modelcontextprotocol.io)

---

**Next:** [03 · Tokens, usage and cost →](../03-tokens-usage-cost/README.md)
