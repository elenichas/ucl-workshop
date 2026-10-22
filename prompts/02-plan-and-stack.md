# 02 · Plan, design language and stack → `stage-01-scaffold`

## What was asked
*"Go build it"* — with the whole planning conversation (01) as context.

## What Claude did first: files, not code

1. **PLAN.md** — goal, users, inputs → process → outputs, parameters with units and ranges, profiles, checks, exports, pages, out of scope, build order. Status: approved.
2. **DESIGN.md** — tokens (YAML) + principles + don'ts: *"A ceramics studio's catalogue crossed with a technical drawing."*
3. **CLAUDE.md** — the stack (with "do not change without asking"), where things live, how we work, commands. Kept short because it's read every turn.
4. The **scaffold**: Vite + React + TypeScript + Tailwind v4, an empty page that proves the stack works.

## A real-world hiccup
The first `npm install` failed: the session's network settings blocked the npm registry. Claude kept writing the parts that needed no network (the course chapters) and asked the instructor to allow `registry.npmjs.org` in Claude's settings. Once allowed, it continued.

> Environment problems are normal. A good move: **explain the blocker, propose the fix, keep doing what isn't blocked.**

## Why this order
If PLAN.md and DESIGN.md exist before the code, every later prompt can be short: *"implement step 3 of PLAN.md, following DESIGN.md"*. The files carry the context so the conversation doesn't have to.
