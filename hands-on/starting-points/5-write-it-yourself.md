# Starting point 5 · Write it yourself, then ask for critique

**Use it when:** you want full control and want Claude as a critic, not an author.

## Step 1 — write PLAN.md by hand (15 minutes)

```markdown
# PLAN — <name>

## Goal (one sentence)

## Users

## Inputs → Process → Outputs

## Parameters
| Name | Unit | Range | Default |
|---|---|---|---|

## Constraints (printers, materials, rules)

## Tech stack
Vite + React + TypeScript + Tailwind CSS. UI components: shadcn/ui.
3D: React Three Fiber + drei. Rhino export: rhino3dm.

## Pages

## Out of scope

## Build order
1.
2.
3.
```

## Step 2 — ask for critique

```text
Read my PLAN.md. Don't build anything and don't rewrite it.
Tell me:
1. What's missing that I'll need?
2. What's ambiguous — where would you have to guess?
3. What's risky or harder than it looks?
4. What would you cut for a first version?
Then ask me questions, one at a time, about the ambiguous parts.
```

## Step 3 — you update the plan

Make the changes yourself, or say *"apply only points 1 and 3 to PLAN.md"*. The plan stays yours.
