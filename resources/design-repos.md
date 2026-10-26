# Design repos and skills that fight AI slop

Open-source projects that give coding agents better taste. Grouped by **what they do**, with ideas for using each one on the vase configurator.

> ⚠️ **Before installing anything:** a skill or plugin is someone else's code *and* someone else's instructions to your agent. Check the repo, the author, the licence, and read the `SKILL.md`. Star counts quoted on social media are often wrong — look at the repo itself. Install commands change; the repo README is the authority.

---

## 1 · DESIGN.md collections — "make it look like X"

A **DESIGN.md** is a plain-text design system: tokens (colours, type, spacing) plus the reasoning and rules. Agents read it before building UI.

| Repo | What it is | Best for |
|---|---|---|
| [**Awesome DESIGN.md**](https://github.com/voltagent/awesome-design-md) | A large collection of DESIGN.md files extracted from real websites — tech, fintech, car brands, media, even retro sites from 1996–2001. Each comes with a preview page. | Borrowing a complete, coherent visual language in one file |
| [**Google DESIGN.md**](https://github.com/google-labs-code/design.md) | The format itself: YAML tokens + prose rationale. Includes a linter (`npx @google/design.md lint DESIGN.md`) that checks broken references and **colour contrast**, plus export to Tailwind. | Writing your *own* DESIGN.md properly. Our [`DESIGN.md`](../DESIGN.md) follows this shape. |

**Use on the vase app:** three students restyle the *same* configurator with three different DESIGN.md files (a luxury car brand, an editorial magazine, a 2001 web portal). Compare. Discuss: what did you borrow, what is still yours? Better still: write a DESIGN.md for an imaginary ceramics studio.

```text
Copy <brand>/DESIGN.md from the awesome-design-md collection into our project folder
as DESIGN.alt.md. On a new branch "style-<brand>", restyle only the landing
page with it. Keep the configurator and all tests unchanged.
```

---

## 2 · Taste and anti-slop skills — rules + critique

| Repo | What it is | Best for |
|---|---|---|
| [**Impeccable**](https://github.com/pbakaus/impeccable) | A design skill with commands to start a project (asks questions, writes `product.md` + `design.md`), **critique** (scored across several dimensions), **detect** anti-patterns, and adjust (`bolder`, `quieter`, `polish`, `distill`…). | A critique loop with a vocabulary |
| [**Hallmark**](https://github.com/Nutlope/hallmark) | Anti-slop skill with dozens of "slop tests", themes, and three modes: **audit**, **redesign**, and **study** — give it a screenshot or URL you love and it extracts structure, type pairing and colour into a portable `design.md`. | Turning a reference into a design brief |
| [**Taste Skill**](https://github.com/Leonxlnx/taste-skill) | A family of style skills: general anti-generic, minimalist, industrial-brutalist, high-end, image-to-code, redesign-existing. | Committing to one clear visual direction |
| [**UI/UX Pro Max**](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | A big catalogue: dozens of named UI styles, colour palettes by product type, font pairings, UX guidelines. Claude picks from concrete options instead of defaults. | Exploring options when you have no direction yet |

**Use on the vase app — the "study" workflow (most useful for architects):**

```text
1. Read resources/references/<gallery-site>.png. Study it and write
   DESIGN.alt.md: layout, type, colour, spacing, tone — tokens in YAML at
   the top, then principles, then don'ts. Don't touch code.
2. (You read and edit DESIGN.alt.md — your taste goes in here.)
3. Following DESIGN.alt.md, restyle the configurator. Keep all features.
   Plan first.
4. Critique the result against DESIGN.alt.md: 5 biggest gaps. Fix the top 3.
```

---

## 3 · Motion and interaction

| Repo | What it is | Best for |
|---|---|---|
| [**Emil Kowalski's skill**](https://github.com/emilkowalski/skill) | Strict rules for UI animation from a well-known design engineer: short, subtle, transform/opacity only, respect reduced motion; plus a review mode that justifies every change. | Slider feedback, button states, panel transitions |
| [**GSAP Skills**](https://github.com/greensock/gsap-skills) | Official skills from the makers of GSAP, a JavaScript animation library — including scroll-driven animation. | A scroll story on the landing page |
| [**Scroll World**](https://github.com/oso95/scroll-world) | Builds cinematic "fly-through" landing pages from AI-generated video clips scrubbed by scroll. Needs a paid video-generation tool and ffmpeg. | A demo to *show*, not for the workshop |

**Use on the vase app:** a landing page where scrolling "prints" the vase layer by layer, then hands over to the configurator (challenge R5). Emil's rules for the micro-feedback when a parameter changes.

---

## 4 · Components and visual effects

| Repo | What it is | Best for |
|---|---|---|
| [**React Bits**](https://github.com/DavidHDev/react-bits) | A large library of animated React components, text effects and backgrounds. | One signature moment (a title, a background) — not everything |
| [**Canvas UI**](https://github.com/DavidHDev/canvas-ui) | Same author: real, clickable HTML with WebGL shader effects drawn over it. React, Vue, Svelte, vanilla. | A subtle material effect (clay grain, glaze sheen) on the interface |

**Use on the vase app — and a lesson in restraint:** add *one* effect, then ask Claude to critique it against DESIGN.md. Effects are where slop comes back in.

---

## 5 · A whole design environment

| Repo | What it is |
|---|---|
| [**Open Design**](https://github.com/nexu-io/open-design) | An open-source, local design app that uses the coding agents you already have (Claude Code included) as its engine, with dozens of built-in design systems and skills. Prototypes, slides, more. |

**Use:** a demo of where design tools are heading — probably too much to install during a 3-hour workshop.

---

## Also from Anthropic

| Skill | Where | Use |
|---|---|---|
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) | Pushes UI away from generic defaults |
| `webapp-testing` | anthropics/skills | Lets Claude open the site in a browser (Playwright), click and screenshot |
| `skill-creator` | anthropics/skills | Write your own skill (e.g. your studio's design language) |
