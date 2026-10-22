# Instructor notes

- [`run-sheet.md`](run-sheet.md) — the 3-hour timeline, what to present / flip through / skip, a pre-session checklist, and what to watch for during the hands-on.

## Adapting to the real lab

When you learn which printers and materials the lab has:

1. Edit `site/src/config/printers.ts` and `site/src/config/materials.ts` (remove what doesn't exist, adjust build volume and nozzle).
2. Run `npm test` in `site/` — tests that reference removed printers will tell you what to update.
3. Check the presets still print: open the app, try each preset on each printer.

Or leave it as is and do it **live with Claude** as the opening demo of the hands-on — the "real-world constraint" story.

## Sharing the repo with students

The repo is private. Options:
- Add students as collaborators (GitHub → Settings → Collaborators), or
- Make it public on the day (Settings → General → Danger zone → Change visibility) — this also lets GitHub Pages host it for free.
