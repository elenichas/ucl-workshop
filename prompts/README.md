# The real build log

This folder records **how the demo was actually built**: the requests, the decisions, and the mistakes. Read it alongside the git tags — each file matches a stage.

The demo was built with Claude in one long session, starting from a planning conversation with the instructor. The prompts below are the requests as given (lightly condensed), followed by what happened. Nothing is staged to look smoother than it was — the bugs are part of the lesson.

| File | Stage tag | What it shows |
|---|---|---|
| [`01-interview.md`](01-interview.md) | — | The planning conversation: how the brief grew through questions |
| [`02-plan-and-stack.md`](02-plan-and-stack.md) | `stage-01-scaffold` | Turning the conversation into PLAN.md, DESIGN.md, CLAUDE.md; choosing the stack |
| [`03-algorithm.md`](03-algorithm.md) | `stage-02-algorithm` | The geometry, and the inside-out vase the tests caught |
| [`04-viewer.md`](04-viewer.md) | `stage-03-viewer` | 3D viewer, and performance decisions made up front |
| [`05-printability.md`](05-printability.md) | `stage-04-printability` | Profiles and rules |
| [`06-exports.md`](06-exports.md) | `stage-05-exports` | STL/OBJ/3DM, and the `ws` bug that only showed up in a real browser |
| [`07-craft-and-shipping.md`](07-craft-and-shipping.md) | `stage-06-craft`, `stage-07-shipped` | UI, responsive, accessibility (a contrast failure), tests, deploy |
| [`08-ways-to-start-and-slides.md`](08-ways-to-start-and-slides.md) | `stage-08-ways-to-start`, `stage-09-presentation` | Nine ways to start, patterns, the system map, presentation + PowerPoint — and five things the checks caught |
| [`09-redesign-with-a-design-skill.md`](09-redesign-with-a-design-skill.md) | after `stage-09` | Reviewing the site with the *frontend-design* skill, and redesigning it from the print lab |

## Patterns to notice

- **The plan came from questions**, not from the first prompt.
- **Tests caught what screenshots couldn't** (inverted triangles look perfect on screen).
- **A real browser caught what unit tests couldn't** (the 3DM export crashed only in the built site).
- **Measuring caught what eyes couldn't** (the accent colour was 4.3 : 1 — just below the 4.5 contrast minimum).
- Every fix was small, explained, and committed.
