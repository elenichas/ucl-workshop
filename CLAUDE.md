# CLAUDE.md — project instructions

Claude Code reads this file at the start of every session in this folder.
Keep it short: everything here costs tokens every time.

## What this project is
A teaching repo for a two-and-a-half-hour workshop ("Prompt to Print"). It contains:
- `course/` — chapters in Markdown (the course content)
- `site/` — the demo web app: a 3D-printable vase configurator that also renders the course
- `hands-on/`, `prompts/`, `resources/`, `instructor/` — supporting material

## Tech stack (do not change without asking)
- Vite + React 19 + TypeScript (strict)
- Tailwind CSS v4 (via `@tailwindcss/vite`), design tokens in `site/src/index.css`
- UI primitives: Radix UI, shadcn/ui-style components in `site/src/components/ui/`
- 3D: three.js via React Three Fiber + drei
- Exports: three.js STL/OBJ exporters, `rhino3dm` for .3dm
- Tests: Vitest (unit), Playwright (browser)
- Do not add new frameworks or UI libraries without asking first.

## Where things live (site/src)
- `starts/` — the ways to start a vase. One module each: controls, representation, steps, results, field.
- `design/` — the Design object (all user choices), presets, control definitions.
- `geometry/` — pure functions: design -> vase mesh (shared pipeline, patterns, carve, analysis). No React here.
- `config/` — printers and materials. Change lab constraints here.
- `slides/` — the presentation deck (data), animated diagrams, PowerPoint export.
- `checks/` — printability rules. Each rule is a small function returning pass/warn/fail.
- `export/` — file exporters.
- `viewer/` — React Three Fiber scene.
- `components/` — UI. `pages/` — routes.

## How we work
- Plan first. For anything bigger than a small fix, write or update `PLAN.md` and wait for approval.
- Small steps: one feature, check it, commit.
- Units are **millimetres** everywhere.
- Follow `DESIGN.md` for anything visual. Avoid generic AI aesthetics (purple gradients, emoji icons, glassmorphism).
- Accessibility is not optional: labels on every control, keyboard works, contrast passes.
- After changing geometry or checks: run `npm test` in `site/`.
- Explain what you changed in plain language — the people reading are architecture students, not developers.

## Commands (run inside site/)
- `npm run dev` — local server
- `npm test` — unit tests
- `npm run build` — production build
- `npm run test:e2e` — browser tests
