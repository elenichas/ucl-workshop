# Hands-on

Time to build. You won't finish a whole website in 80 minutes — that's not the goal. The goal is to go through the loop a few times — **think → plan → build → check → note what changed** — and to make one thing that's yours.

## Choose your route

| Route | Start here | Good if… |
|---|---|---|
| **A · From scratch** | An empty folder + one of the [starting points](starting-points/) | You want to experience planning from zero |
| **B · Jump in at a stage** | A stage folder from the instructor (e.g. *stage-03-viewer*), then a [challenge card](challenge-cards.md) | You want to build features on something that already works |
| **C · Restyle** | `main` + the "Restyle it" card | You care most about the look and feel |

## Before you start

- [ ] `node -v` shows 20 or higher
- [ ] `claude` starts in the project folder, and you can log in (a paid plan is needed)
- [ ] The mode is set to **Manual** or **Plan** (`Shift+Tab` in the terminal, the mode selector in the app)
- [ ] Route B/C only: `cd site && npm install && npm run dev` shows the vase
- [ ] You've read the [prompt cheat sheet](prompt-cheat-sheet.md)
- [ ] You've got the [stack card](stack-card.md) ready to paste

## No Git needed

Your project is simply **a folder on your laptop**. You don't need a GitHub account or Git today.

- **Keeping track:** the chat itself is a log. Even better, ask Claude at the start: *"Keep a PROGRESS.md in this folder: after each step, write what I asked, what you changed and what we decided."* There's a [template](progress-template.md).
- **Undo:** Claude Code can rewind (`/rewind`) to an earlier point, including the files it edited — but not what commands did. Duplicate the folder before a big change.
- **Starting from a stage (route B):** get the stage folder from the instructor.
- **Your site is at `localhost`:** that link only works on your own laptop. Sharing it with others (building and hosting) is a next step for another day.

*Already comfortable with Git?* Every stage is also a tag: `git checkout stage-04-printability`.

## Files in this folder

All of these are also on the website's **Files** page, where you can copy or download them.

- [`starting-points/`](starting-points/) — five copy-paste prompts to begin a project systematically
- [`challenge-cards.md`](challenge-cards.md) — tasks at three levels
- [`prompt-cheat-sheet.md`](prompt-cheat-sheet.md) — good vs. bad prompts, useful commands
- [`stack-card.md`](stack-card.md) — the stack, and the choices you may make
- [`progress-template.md`](progress-template.md) — a template for your PROGRESS.md log
- [`system-map-worksheet.md`](system-map-worksheet.md) — map your vase configurator before you build
