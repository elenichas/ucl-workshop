# Starting point 4 · Start from constraints

**Use it when:** you think like a maker. What can the machine actually do?

## Prompt

```text
I want a configurator for 3D-printable vases that only lets people make
things that can really be printed in our lab.

Our lab has (fill in what you know, or say "unknown — propose typical values"):
- Printers: [e.g. 2 desktop plastic printers, 0.4 mm nozzle, 250×210×220 mm]
- Materials: [e.g. PLA in 5 colours, stoneware clay]
- Other limits: [e.g. max print time 6 hours, kiln size, budget per student]

Without writing code:
1. Turn each limit into a rule the app can check (input → pass/warn/fail +
   a sentence explaining why).
2. Decide which limits should restrict the sliders, and which should only warn.
3. Put printers and materials in editable profiles, so the lab can change
   them later without touching the rest of the code.
4. Write PLAN.md with all of this and a build order. Stop there.

Tech stack (do not change without asking me):
Vite + React + TypeScript + Tailwind CSS. UI components: shadcn/ui.
3D: React Three Fiber + drei. Rhino export: rhino3dm.
```

## Notice

- "Restrict vs. warn" is a real design decision: restricting is safe but frustrating; warning teaches.
- Talk to the lab technician. Their knowledge is the most valuable input in this whole project.
