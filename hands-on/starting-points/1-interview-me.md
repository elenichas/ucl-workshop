# Starting point 1 · Interview me

**Use it when:** you have an idea but haven't thought it through. The interview will surface questions you didn't know you had.

## Prompt

```text
I want to build a web app: a configurator for 3D-printable vases.

Before writing any code, interview me about what it needs.
- Ask ONE question at a time and wait for my answer.
- Start broad (who is it for, what should they get at the end), then go
  specific (parameters, ranges, constraints, printers, materials, exports,
  how it should look and feel).
- If my answer is vague, ask a follow-up.
- Suggest options when I'm unsure, but let me decide.
- After about 10–15 questions, summarise what you heard and ask me to confirm.

Then write PLAN.md with: goal, users, inputs → process → outputs,
parameters (name, unit, range), constraints, tech stack, pages,
out of scope, and a build order in small steps. Stop there.

Tech stack (do not change without asking me):
Vite + React + TypeScript + Tailwind CSS. UI components: shadcn/ui.
3D: React Three Fiber + drei. Rhino export: rhino3dm.
```

## Notice

- Which questions surprised you? Those are the gaps an agent would otherwise have filled with a guess.
- In our own planning, the question *"which printers will students use?"* led to printer and material **profiles** — see [`prompts/01-interview.md`](../../prompts/01-interview.md).
