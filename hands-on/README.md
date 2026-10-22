# Hands-on

Time to build. You won't finish a whole website in 80 minutes — that's not the goal. The goal is to go through the loop a few times — **think → plan → build → check → commit** — and to make one thing that's yours.

## Choose your route

| Route | Start here | Good if… |
|---|---|---|
| **A · From scratch** | An empty folder + one of the [starting points](starting-points/) | You want to experience planning from zero |
| **B · Jump in at a stage** | `git checkout stage-03-viewer` (or any stage), then a [challenge card](challenge-cards.md) | You want to build features on something that already works |
| **C · Restyle** | `main` + the "Restyle it" card | You care most about the look and feel |

## Before you start

- [ ] `node -v` shows 20 or higher
- [ ] `claude` starts in the project folder
- [ ] `cd site && npm install && npm run dev` shows the vase
- [ ] You've read the [prompt cheat sheet](prompt-cheat-sheet.md)
- [ ] You've got the [stack card](stack-card.md) ready to paste

## Working on a stage without losing it

```bash
git checkout stage-04-printability       # go to that moment
git switch -c my-experiment              # make your own branch from there
# ... work, commit as often as you like ...
git switch main                          # back to the finished demo at any time
```

## Files in this folder

- [`starting-points/`](starting-points/) — five copy-paste prompts to begin a project systematically
- [`challenge-cards.md`](challenge-cards.md) — tasks at three levels
- [`prompt-cheat-sheet.md`](prompt-cheat-sheet.md) — good vs. bad prompts, useful commands
- [`stack-card.md`](stack-card.md) — the stack, and the choices you may make
