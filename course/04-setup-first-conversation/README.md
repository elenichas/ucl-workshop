# 04 · Setup and first conversation

> **Part 1 — Foundations** · ~10 min (plus setup time during the hands-on)

**In one sentence:** get the tools on your laptop, open the project, and have a first conversation where you *ask* rather than *order*.

---

## What you need

| Tool | Why | Check it works |
|---|---|---|
| **Claude Code** (terminal, desktop app or VS Code) | The agent | `claude --version` |
| **Node.js 20+** | Runs the build tools and the local server | `node -v` |
| **git** | History, stages | `git --version` |
| A **code editor** (VS Code recommended) | To read what the agent wrote | — |
| A **GitHub account** | To get the repo and, later, publish | — |

Installation instructions change; follow the official page: [Claude Code — quickstart](https://docs.claude.com/en/docs/claude-code/quickstart).

## Get the project

```bash
git clone <the repo link you were given>
cd ucl-workshop/site
npm install          # downloads the packages in package.json (takes a minute)
npm run dev          # starts a local server — open the link it prints
```

`npm run dev` gives you a URL like `http://localhost:5173`. **localhost** means "this computer": the site is running only on your laptop. Change a file and the page updates instantly.

## Start Claude Code in the project

Open a terminal in the `ucl-workshop` folder and type `claude` (or open the folder in the desktop app / VS Code extension).

## Your first conversation: ask, don't order

Good first prompts make Claude **explain** the project to you. This is cheap, safe (nothing changes), and you learn the codebase:

```text
I'm an architecture student and new to web development.
Explain this project to me: what are the main folders, and how does a slider
change end up as a new vase on screen? Keep it short and use an analogy
from architecture or Grasshopper.
```

```text
Open site/src/geometry/buildVase.ts and explain the algorithm step by step,
like a recipe. Don't change anything.
```

```text
What would happen if I set the wall thickness to 0.2 mm? Trace it through
the code: which files are involved and which check would complain?
```

Notice what Claude does: which files it **reads**, in what order. That is it building a map of the project.

## Your first change: tiny and checkable

```text
Add a new preset called "Bud vase": tall and narrow, 220 mm high,
50 mm base, 70 mm belly at 30%, 30 mm top, 12 ribs, no twist.
Then tell me which file you changed.
```

Then:

1. Look at the result in the browser.
2. Look at the diff (what changed) — in VS Code's Source Control panel, or ask *"show me the diff"*.
3. If you like it: *"commit this with a clear message"*.

Congratulations: you have done the full loop — **ask → act → check → commit**.

## When things go wrong (they will)

| Symptom | Try |
|---|---|
| Page is blank | Open the browser console (right-click → Inspect → Console), copy the red error to Claude |
| `npm` command not found | Node.js isn't installed or the terminal needs restarting |
| Claude is going in circles | `Esc`, then explain what you actually want; or `/clear` and start the task again with a better prompt |
| You hate the change | `git checkout .` throws away uncommitted changes (ask Claude to do it if unsure) |

---

**Next:** [05 · Starting systematically →](../05-starting-systematically/README.md)
