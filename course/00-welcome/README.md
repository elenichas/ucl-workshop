# 00 · Welcome

> **Part 1 — Foundations** · ~5 min

**In one sentence:** in three hours we will not become web developers. We will learn to *think* like people who build digital tools with an AI agent, and we will use a vase configurator to practise.

---

## What we are going to build

**Vessel** is a website where anyone can:

1. **Shape** a vase with sliders: height, diameters, ribs, twist, ripples.
2. **See** it in 3D, rotate it, cut it in half.
3. **Check** whether it can actually be printed on a given printer, in a given material.
4. **Download** it as a file for Rhino (`.3dm`) or a slicer (`.stl`).

The finished demo lives in [`site/`](../../site/). Open it, play with it, break it.

## Why a vase?

A vase is the smallest project that still has everything a real digital tool has:

| A real product has… | Our vase has… |
|---|---|
| Inputs | Sliders, a printer, a material |
| A process | An algorithm that turns numbers into geometry |
| Rules and constraints | "Clay can't overhang more than ~25°" |
| Outputs | A 3D view, a print report, files |
| Users with different needs | Students, the fabrication lab, you |

If you have used Grasshopper, you already know this way of thinking: **parameters → definition → geometry**. Today the "definition" is a website, and we describe it in words to an agent instead of wiring components.

## The one rule of this workshop

> **Don't open a chat and type "build me a vase configurator".**

You would get *something*. It would look like every other AI-generated website, you would not understand it, and you could not change it with intention. Instead we will:

1. **Think** — what are the inputs, the process, the outputs?
2. **Plan** — write it down in a file (`PLAN.md`) and approve it.
3. **Build in small steps** — one feature at a time, checking each one.
4. **Reflect** — what did the agent do, why, and was it right?

The process is the point. The website is the excuse.

## How the course is organised

| Part | Chapters | Question it answers |
|---|---|---|
| 1 — Foundations | 00–04 | What are AI models, agents, websites? What is Claude Code doing? |
| 2 — Thinking before building | 05–06 | How do I start? What exactly do I control? |
| 3 — Building the configurator | 07–10 | Algorithm, 3D viewer, printability, exports |
| 4 — Craft and quality | 11–17 | UI, responsiveness, accessibility, 3D interaction, avoiding AI slop, testing, shipping |
| 5 — Reflection | 18 | What does it mean to work with an agent? |

We will not cover everything in three hours. That is fine — the repo stays with you.

## How to follow along

- **Read the code of each stage:** every chapter that builds something points to a git tag (`stage-03-viewer`…) — the state of the app at that moment.
- **Read the real prompts:** [`prompts/`](../../prompts/) has the conversation behind each step, including the mistakes.
- **Get your hands dirty:** [`hands-on/`](../../hands-on/) has starting-point prompts and challenge cards.

---

**Next:** [01 · Fundamentals: AI and the web →](../01-fundamentals/README.md)
