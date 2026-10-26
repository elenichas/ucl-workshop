# 13 · Accessibility: readable for everyone

> **Part 4 · Craft and quality**

**In one sentence:** before anything fancy, make sure everyone can read and use your site — enough contrast, no tiny text, and it works without a mouse.

---

This is not a full accessibility course. It's the **basics** every website should get right — and that AI-made sites often get wrong.

## The three basics

### 1 · Contrast
Text must stand out from its background. Light grey on light grey looks elegant on your screen and disappears on a projector, a phone in the sun, or for someone with weaker eyesight.

The international guidelines (**WCAG**) ask for a contrast of at least **4.5 : 1** for normal text (3 : 1 for large headings). You don't have to calculate it yourself — any contrast checker will tell you, and so will the agent.

| | Contrast | |
|---|---|---|
| Black on light grey | about 20 : 1 | ✓ easy to read |
| Light grey on light grey | about 1.6 : 1 | ✗ hard to read |

### 2 · Text size
No tiny text. Body text around **16 px or more**; small labels not much below 12 px. If you have to squint at your own screen, it's too small.

### 3 · Usable without a mouse
Some people use only a keyboard. Try it yourself: press **Tab** to move from control to control, arrows to move a slider, **Enter** to press a button. Can you reach everything? Can you see where you are?

## Going further

Full accessibility goes further — for example, **screen readers** that read the page aloud for people who can't see it, which means every control needs a proper label. (A nice design question for a 3D tool: how would you describe a vase in words to someone who can't see it?)

## You get a lot for free

Component libraries like **shadcn/ui** (built on Radix) already handle much of this: labels, keyboard support, focus outlines. If you use one, you're most of the way there.

## Ask the agent to check

```text
Check my site for accessibility basics: text contrast against its
background, font sizes, and whether everything works with the
keyboard only. List the problems first, before fixing anything.
```

---

**Next:** [14 · 3D interactions →](../14-3d-interactions/README.md)
