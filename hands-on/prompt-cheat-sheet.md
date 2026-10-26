# Prompt cheat sheet

## The anatomy of a good prompt

```
CONTEXT    what this is, who it's for            "This is a vase configurator for students…"
TASK       one clear thing                        "Add a 'lean' parameter."
WHERE      files, if you know them                "in starts/shapes.ts (the Round start)"
LIMITS     what not to do                         "Don't change the UI. Don't add libraries."
DONE WHEN  how you'll check                       "A test proves the vase is still watertight."
PROCESS    how to proceed                         "Plan first and wait for my OK."
```

## Bad → better

| ❌ Vague | ✅ Specific |
|---|---|
| Build me a vase configurator. | *(Use a [starting point](starting-points/). Plan first.)* |
| Make it look better. | Read DESIGN.md. List the 5 biggest visual problems on the configurator page, most important first. Don't change code yet. |
| It's broken, fix it. | When I drag "Twist" past 200°, the console shows: `<paste error>`. Find the cause, explain it, then fix it. Add a test. |
| Add more features. | Add a "Share" button that copies a link containing all current parameters. Nothing else. |
| Make it faster. | The viewer stutters when I drag Height. First measure: buildVase time, triangle count, FPS. Then propose the smallest fix. |
| Use a nice font. | Use Instrument Serif for headings only; keep everything else as in DESIGN.md. |
| Write tests. | Write a test that a 2 mm wall fails on the clay printer. Show it failing before you change anything. |

## Prompts that teach you something

```text
Explain what you just changed, file by file, as if to a first-year
architecture student. What would break if I deleted each change?
```
```text
Before you change anything, tell me which files you'll touch and why.
```
```text
What are two other ways to do this, and why did you choose this one?
```
```text
Show me the diff and walk me through it.
```

## Steering

| You want to… | Do |
|---|---|
| Stop it mid-way | `Esc` (or the stop button in the app) |
| Approve every step | Manual mode (`Shift+Tab` in the terminal, the mode selector in the app) |
| Plan without changes | Plan mode (same switch) |
| Undo a change | `/rewind` (or `Esc` twice) — restores files Claude edited, not what commands did. Or *"undo what you just changed"* |
| Start a fresh conversation | `/clear` (decisions should be in files!) |
| See what's using context | `/context` |
| Make Claude remember a rule | Say *"add this to CLAUDE.md"* (just saying *"remember…"* goes into Claude's own notes instead) |
| See what Claude remembers | `/memory` |
| Save a workflow you repeat | Make it a skill (ask Claude: *"turn this into a skill"*) |

## Saving tokens

- One task per conversation, then `/clear`.
- Name the files instead of "look at everything".
- "Tell me only what failed" instead of full logs.
- Approve the plan before the build — rebuilding is the most expensive thing you can do.
