# 01 · Fundamentals: AI and the web

> **Part 1 — Foundations** · ~15 min

**In one sentence:** before we use an agent to build a website, we need a mental model of both — what an AI model actually is, and what a website actually is.

---

## Part A — AI fundamentals

### What is an AI model?

A **large language model** (LLM) is a very large mathematical function trained on huge amounts of text and code. Given some text, it predicts what text should come next — one small piece at a time.

That's it. No database of facts to look things up in, no understanding in the human sense, and the model itself remembers nothing between conversations (tools like Claude Code add memory by writing notes into files). But at enough scale, "predict the next piece" becomes surprisingly capable: it can explain, translate, reason through steps, and write code.

| Term | Plain meaning |
|---|---|
| **Model** | The trained function. Claude, GPT, Gemini are families of models. |
| **Prompt** | Everything you give the model as input. |
| **Token** | The unit models read and write — roughly ¾ of an English word. "Parametric" might be 2–3 tokens. |
| **Context window** | How much text the model can "see" at once (its working memory for this conversation). |
| **Training** | Done by the lab, before you use it. Talking to the model doesn't change it. (Whether your chats may be used to train *future* models is a setting in your account — check it.) |
| **Hallucination** | When the model confidently produces something plausible but wrong. Prediction, not lookup. |

### Chat vs. agent

A **chatbot** answers. An **agent** *acts*.

```
CHAT                                  AGENT
you ──> model ──> answer             you ──> model ──> "I need to read vase.ts"
                                                  │
                                                  ▼
                                            [tool: read file]  ──> result back to model
                                                  │
                                                  ▼
                                      model ──> "I'll change line 12"
                                                  │
                                                  ▼
                                            [tool: edit file] ──> result
                                                  │
                                                  ▼
                                      model ──> "Let me run the tests" ... ──> done
```

An agent is a model **in a loop**, with **tools** (read files, write files, run commands, search the web) and a **goal**. It decides which tool to use next based on what happened last. Claude Code is an agent.

### Why this matters for you

- The model only knows your project through its context. **If it's not in the prompt or the files, it falls back on what it learned in training** — which may be outdated, or simply not what your project needs.
- It is very good at the *average* answer — which is exactly why AI-made websites all look alike (chapter 15).
- It can be wrong with total confidence. **You are the one who checks.**

---

## Part B — Web fundamentals

### What is a website, physically?

A website is **files** that a **browser** downloads and runs.

| File type | Job | Architecture analogy |
|---|---|---|
| **HTML** | Structure and content: headings, buttons, text | The plan: what rooms exist |
| **CSS** | Appearance: colour, type, spacing, layout | The materials and finishes |
| **JavaScript** | Behaviour: what happens when you drag a slider | The building services: things that move and respond |

When you open a URL:

```
your browser ──"give me /configure"──> a server (a computer somewhere)
            <──── HTML, CSS, JS files ───
your browser runs the JavaScript ──> draws the page ──> you drag a slider ──> JS recomputes the vase
```

Our vase app is a **static site**: the server only hands over files. All the computing (geometry, 3D, checks, file export) happens **in your browser, on your laptop**. No server-side code, no database. This is why it can be hosted for free.

### Front end, back end

- **Front end** — what runs in the browser. *Everything we build today.*
- **Back end** — code on a server: accounts, payments, databases. *Not today.*

### Your project is a folder

A website project is simply **a folder of files** on your laptop. The agent writes into that folder; you look at the result in the browser at `localhost` (see [chapter 04](../04-setup-first-conversation/README.md)).

To keep track of what changed, today we use the chat itself and a `PROGRESS.md` file the agent updates after each step. Professionals use **Git** — a tool that saves numbered versions of the folder, like drawing revisions (rev A, rev B, rev C) — and **GitHub** to keep those versions online. Worth learning later; **not needed today**.

### The tech stack: layers of decisions

A "stack" is the set of tools a project is built with. Each layer is a decision — **we make it, we don't leave it to the agent.**

| Layer | Our choice | What it does | Alternatives |
|---|---|---|---|
| Language | **TypeScript** | JavaScript + types: the computer checks that a "height" is a number before the code runs | JavaScript |
| UI framework | **React** | Builds the page from reusable components (`<Slider>`, `<Viewer>`) that update when data changes | Vue, Svelte, Angular |
| Styling | **Tailwind CSS** | Write styles as short class names: `bg-paper text-ink p-4` | plain CSS, CSS modules |
| Components | **shadcn/ui** (built on Radix) | Ready-made accessible sliders, tabs, buttons — copied into *our* code so we can restyle them | Radix only, Mantine, HeroUI, none |
| 3D | **three.js** via **React Three Fiber** | Draws 3D on the graphics card (WebGL); R3F lets us write it as React components | Babylon.js, plain three.js |
| Build tool | **Vite** | Turns our source files into the optimised files a browser downloads; runs the local dev server | Next.js, Parcel |
| CAD export | **rhino3dm** | Rhino's own geometry library, running in the browser | — |

See [`hands-on/stack-card.md`](../../hands-on/stack-card.md) for the sentence you paste into every plan.

### Packages, and a word of caution

Most of the stack is **packages** — code written by others, downloaded by `npm install` from the npm registry and listed in `package.json`. Every package is code that runs on your machine. The same goes for skills and plugins you install for Claude Code. **Look before you install**: who made it, how many people use it, what licence.

---

## Key takeaways

- A model predicts text; an agent is a model in a loop with tools.
- A website is HTML + CSS + JS that the browser runs; ours computes everything in the browser.
- Your project is a folder. Keep a log of what changed (PROGRESS.md); Git can come later.
- The stack is a design decision. Name it explicitly.

## Go deeper

- MDN — [How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)
- GitHub — [About Git](https://docs.github.com/en/get-started/using-git/about-git) (for later)
- Anthropic — [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

---

**Next:** [02 · What is Claude Code? →](../02-what-is-claude-code/README.md)
