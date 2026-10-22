# The stack card

Paste this into **every** plan and every starting prompt. The stack is a decision you make — not something you leave to the agent.

```text
Tech stack (do not change without asking me):
- Vite + React + TypeScript
- Tailwind CSS for styling
- UI components: shadcn/ui (Radix underneath)
- 3D: React Three Fiber + drei (three.js)
- Rhino export: rhino3dm
- Tests: Vitest (+ Playwright for the browser)
Do not add other frameworks or UI libraries without asking.
```

## Fixed for everyone

| Layer | Choice | Why |
|---|---|---|
| Build tool | Vite | Fast, simple, deploys easily as a static site |
| UI | React | Most widely used; agents know it very well |
| Language | TypeScript | Catches mistakes before they run; agents write better code with types |
| Styling | Tailwind CSS | Short class names; works naturally with DESIGN.md tokens |
| 3D | React Three Fiber + drei | three.js the React way; drei adds ready-made controls and helpers |
| Exports | three.js-style writers + rhino3dm | Rhino's own library, in the browser |

## Your choice: the component library

Replace the "UI components" line with the one you pick:

| Option | Character | Choose it if… |
|---|---|---|
| **shadcn/ui** *(default)* | Components copied into your project; you own and restyle the code | You want a good start *and* a distinctive result |
| **Radix UI only** | Unstyled, accessible building blocks | You want total design freedom and don't mind more work |
| **Mantine** | Big, complete, ready-styled kit | You want to move fast and care less about a unique look |
| **HeroUI** | Ready-styled, polished, animated | Same — fast, but harder to make your own |
| **None** | Tailwind only | You want to design every control yourself |

## Optional add-ons (for style, later)

From [`resources/design-repos.md`](../resources/design-repos.md): React Bits or Canvas UI (effects), GSAP (scroll animation), DESIGN.md files and taste skills (any stack). Add them **on purpose**, one at a time, and write them into the plan.

## A cheap experiment

```text
Without building anything: what would change in this project if we used
Vue instead of React? Which files, which libraries, what would get easier
or harder? Keep it to one short table.
```
