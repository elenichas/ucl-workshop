# 02 · What is Claude Code?

> **Part 1 — Foundations** · ~15 min

**In one sentence:** Claude Code is an AI agent that works *inside your project folder* — it reads your files, edits them, runs commands, and checks the results, in a loop, while you watch and steer.

---

## Where it runs

Claude Code started as a command-line tool (you type `claude` in a terminal inside your project). Today you can also use it from the Claude desktop app, in VS Code / JetBrains, and on the web. Same agent, different windows. In this workshop we use whichever your laptop is set up with.

## What happens in the background

When you type a request, this is roughly what happens:

```
1. YOU         "Add a twist parameter to the vase."
                     │
2. CONTEXT     Claude Code gathers: your message + CLAUDE.md + the conversation so far
               + descriptions of the tools and skills it has
                     │
3. MODEL       Claude thinks: "I should look at how parameters are defined."
                     │
4. TOOL CALL   Read  site/src/config/parameters.ts          ← you may see this in the UI
                     │
5. RESULT      the file's content goes back into the context
                     │
6. MODEL       "Now I'll edit profile.ts to rotate the ribs…"
                     │
7. TOOL CALL   Edit  site/src/geometry/profile.ts           ← you may be asked to approve
                     │
8. TOOL CALL   Bash  npm test                                ← it checks its own work
                     │
9. RESULT      "13 passed"  (or: "1 failed" → back to step 6)
                     │
10. ANSWER     "I added twist. Here is what changed and why…"
```

This is **the agent loop**: think → act → observe → repeat. Every step costs tokens (chapter 03) and every step is visible to you. **Read the steps, not just the final message.** That is where you learn what is happening.

## The tools it has

| Tool | What it does | Why you care |
|---|---|---|
| **Read / Glob / Grep** | Open and search files | It learns *your* project instead of guessing |
| **Edit / Write** | Change or create files | This is where your code changes |
| **Bash** | Run terminal commands (`npm test`, `git commit`) | It can install, build, test — powerful, so it asks first |
| **Web search / fetch** | Look things up online | For documentation it wasn't trained on |
| **Subagents** | Hand a sub-task to a fresh helper | Keeps the main conversation focused |

### Permissions

By default Claude Code **asks before** editing files or running commands. You can approve once, approve for the session, or say no and explain why. Saying no is a valid and useful answer.

## Modes worth knowing

- **Plan mode** — Claude researches and proposes a plan but **changes nothing** until you approve. Use it for anything bigger than a small fix. (In the terminal: press `Shift+Tab` to cycle modes.)
- **Interrupt** — press `Esc` to stop it mid-way if it is going in the wrong direction. Then redirect.
- **Rewind** — you can go back to an earlier point in the conversation (and, with checkpoints, earlier file states). Combined with git, mistakes are cheap.

## How you give it lasting knowledge

| Mechanism | What it is | Our example |
|---|---|---|
| **CLAUDE.md** | A file of project instructions read at the start of every session. `/init` can draft one. | Our stack, folder structure, "units are mm" — see [`CLAUDE.md`](../../CLAUDE.md) |
| **PLAN.md** (convention, not a feature) | The plan you agreed on, in a file both of you can read | [`PLAN.md`](../../PLAN.md) |
| **DESIGN.md** (convention) | The visual language | [`DESIGN.md`](../../DESIGN.md) |
| **Skills** | Folders of know-how (a `SKILL.md` + optional scripts/references) that Claude loads *only when relevant* | [`.claude/skills/printability-review`](../../.claude/skills/printability-review/SKILL.md) |
| **MCP servers** | Connections to outside tools: a browser, Figma, a database, even Rhino | Playwright MCP lets Claude open the site and look at it |
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
| `printability-review` | **this repo** | Reviewing a vase design against printer/material rules |
| `vase-design-language` | **this repo** | Keeping new UI consistent with DESIGN.md |
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
| `/help` | Everything else |

## Key takeaways

- Claude Code is an agent in a loop: think → use a tool → look at the result → repeat.
- Watch the tool calls. That is "what happens in the background".
- Plan mode first, small steps, approve or refuse actions.
- CLAUDE.md, skills and MCP are how you give it lasting knowledge and new abilities.

## Go deeper

- [Claude Code documentation](https://docs.claude.com/en/docs/claude-code/overview)
- [Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) · [anthropics/skills](https://github.com/anthropics/skills)
- [Model Context Protocol](https://modelcontextprotocol.io)

---

**Next:** [03 · Tokens, usage and cost →](../03-tokens-usage-cost/README.md)
