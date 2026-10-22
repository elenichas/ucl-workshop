# Starting point 3 · Start from the experience

**Use it when:** what you care about most is how it looks and feels — the website as an object, not just a tool.

## Prompt

```text
I want to build a configurator for 3D-printable vases that feels like
[a fashion editorial / a ceramics gallery catalogue / a museum archive /
a Japanese stationery shop — choose or write your own], not like software.

Don't write code. Start from the experience:
- Mood in 5 words
- 3–5 references (real websites, magazines, books, spaces) and what to take from each
- Typography (display + text + numbers), colour, spacing, image/3D presentation
- Pace: what happens in the first 5 seconds, the first minute
- Where the configurator controls live so they don't spoil the mood
- A list of things this site must NEVER look like

Then work out which configurator features serve that experience.
Write two files: DESIGN.md (tokens in a YAML block at the top, then
principles, then don'ts) and PLAN.md (features and a build order).
Stop there.

Tech stack (do not change without asking me):
Vite + React + TypeScript + Tailwind CSS. UI components: shadcn/ui
(restyled to DESIGN.md). 3D: React Three Fiber + drei.
```

## Notice

- Bring real references: drop screenshots into `resources/references/` and tell Claude to look at them.
- The "never look like" list is the most powerful part. Make it specific.
- See [chapter 15](../../course/15-avoiding-ai-slop/README.md) and [`resources/design-repos.md`](../../resources/design-repos.md) for skills that help here (Hallmark's *study*, Impeccable's *craft*).
