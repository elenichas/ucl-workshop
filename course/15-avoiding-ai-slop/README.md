# 15 · Avoiding AI slop

> **Part 4 — Craft and quality** · ~12 min

**In one sentence:** AI-made websites look alike because models produce the *average* of what they've seen — taste has to come from you, written down where the agent can read it.

---

## What "AI slop" looks like

You have seen these sites. The tells:

- Purple-to-blue gradients, gradient text, glowing blurred blobs
- A hero headline, a subtitle, two buttons, then **three feature cards with emoji icons**
- Inter or system font, everything centred, everything rounded, pills everywhere
- Glassmorphism (frosted transparent panels) for no reason
- Fake testimonials, "Trusted by 10,000+ teams", lorem-ipsum-ish copy ("Unlock your creativity")
- Every component library's default look, untouched
- Animations on everything

None of these are *wrong*. They are **unchosen**. They're what you get when nobody decided.

## Why it happens

A model predicts the most likely next thing. Asked for "a modern landing page", the most likely page is the one it has seen ten thousand times. Vague prompt → average answer. (Same lesson as chapter 05.)

## How to avoid it

### 1 · Decide a direction before you build
A sentence with a point of view beats "modern and clean":
*"A ceramics studio's catalogue crossed with a technical drawing. Calm, warm, precise. The object is the hero."*

### 2 · Write a DESIGN.md
Our [`DESIGN.md`](../../DESIGN.md) has:
- **Tokens** (machine-readable): colours, fonts, spacing, radius — in a YAML block at the top, in the format proposed by [Google's DESIGN.md spec](https://github.com/google-labs-code/design.md)
- **Principles** (human-readable): "The object first", "Lines, not shadows", "Square-ish"
- **Don'ts**: "No purple gradients. No emoji icons. No three-card hero."

The don'ts list is surprisingly powerful. Models respond well to explicit exclusions.

### 3 · Use real references
Screenshots of sites, books, exhibitions, packaging you love. Not "make it like Apple" — *"study this screenshot: the type scale, the amount of white space, how images are cropped."*

### 4 · Critique, then refine
Build → ask for a critique against DESIGN.md → fix the top 3 → repeat. Make the agent your critic, not just your builder.

### 5 · Restyle the components
shadcn/ui components are copied into your project precisely so you can change them. Untouched defaults are a tell.

## Using design repos and skills

A growing set of open-source repos exist to give agents better taste. They fall into five families — full list with links in [`resources/design-repos.md`](../../resources/design-repos.md):

| Family | Examples | Creative use for our vase app |
|---|---|---|
| **DESIGN.md collections** — design systems extracted from real sites | Awesome DESIGN.md, Google DESIGN.md | Three students restyle the *same* configurator with three different DESIGN.md files → discuss taste and authorship |
| **Taste / anti-slop skills** — rules + critique commands | Impeccable, Hallmark, Taste Skill, UI/UX Pro Max | *Study* a screenshot of a gallery site you love → generate a DESIGN.md → apply → critique |
| **Motion** | Emil Kowalski's skill, GSAP skills, Scroll World | A landing page where the vase is "printed" layer by layer as you scroll |
| **Components & effects** | React Bits, Canvas UI | A subtle clay-grain shader over the UI — and a lesson in restraint |
| **Design environments** | Open Design | A whole local design studio using your Claude Code |

### Example: restyle from a reference (the "study" workflow)

```text
1. Read resources/references/my-reference.png. Study it and write DESIGN.md
   capturing layout, typography, colour, spacing and tone — tokens in a YAML
   block at the top, then principles, then a list of don'ts.
   Don't touch any code.
```
*(You read DESIGN.md and edit it. This is where **your** taste goes in.)*
```text
2. Following DESIGN.md, restyle the configurator page. Keep every feature
   and the 3D viewer working. Plan first.
3. Critique the result against DESIGN.md. List the 5 biggest gaps.
   Fix only the top 3.
```

### Example: borrow a design system, on purpose

```text
Copy the DESIGN.md for <a brand> from the awesome-design-md collection
into our project folder as DESIGN.alt.md. Restyle only the landing page
with it. Keep the configurator unchanged.
(Tip: duplicate your project folder first, so the original stays safe.)
```

Then discuss: what does the vase app *become* in another brand's language? What did you borrow, and what is still yours?

### A word of caution

Installing a skill (`npx skills add …`) runs **someone else's code** and gives **someone else's instructions** to your agent. Before installing: check the repo, the author, the stars, the licence, and read the `SKILL.md`. Star counts on social-media lists are often inflated — look at the repo itself.

## Try it

Pick one: (a) write your own DESIGN.md from a reference, (b) apply an existing one from the collection, (c) install a critique skill and run it on the current site. Compare results with your neighbour.

---

**Next:** [16 · Testing →](../16-testing/README.md)
