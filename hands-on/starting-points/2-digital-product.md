# Starting point 2 · Map it as a digital product

**Use it when:** you like structure — lists, tables, priorities.

## Prompt

```text
Treat this as a digital product: a web-based configurator for
3D-printable vases, for architecture students and a university
fabrication lab.

Map it out, without writing code:
1. Users and what each one wants to achieve
2. Inputs → process → outputs (as a simple diagram)
3. A feature list sorted into MUST / SHOULD / COULD for a first version
4. The riskiest technical parts, and how we could test them early
5. What we will explicitly NOT build

Write it all to PLAN.md, ending with a build order in small steps
(each step should be something I can see or test). Then stop.

Tech stack (do not change without asking me):
Vite + React + TypeScript + Tailwind CSS. UI components: shadcn/ui.
3D: React Three Fiber + drei. Rhino export: rhino3dm.
```

## Notice

- Be ruthless with MUST. Everything else can wait.
- "Riskiest parts" is a great question: in our project it was the Rhino export (a large WebAssembly library) and keeping the 3D fast while dragging sliders.
