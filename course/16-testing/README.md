# 16 · Testing: three ways to check a website

> **Part 4 — Craft and quality** · ~3 min · context

**In one sentence:** a website can be tested by you, by the agent clicking through it in a browser, or by small automatic checks the agent writes — and you decide which ones you want.

---

## 1 · You

The most important tester is you. Use the site like a visitor would, and report back to the agent **in plain words**:

```text
I moved the height slider and nothing happens. Let's fix it.
```

```text
On my phone the sliders are too small to drag.
```

You don't need to know *why* it's broken. Describe what you did, what you expected, and what happened instead.

## 2 · The agent, in a browser

Once it has a browser tool connected, the agent can open your website in a real browser, click, drag sliders, take screenshots — and look at them.

```text
Open the site, try every slider and button, and tell me
what doesn't work. Don't fix anything yet.
```

(This needs a browser tool, such as Playwright or Anthropic's *webapp-testing* skill. If it isn't set up, ask Claude to set it up — or test it yourself and report back.)

## 3 · The agent, with automatic tests

The agent can also write **small automatic checks** — little questions the computer asks the code every time something changes. For our vase:

- *Every vase must be a closed shape* (or the printer can't use it).
- *A 2 mm wall is fine in plastic but fails in clay.*
- *The downloaded file stands upright.*

They run in seconds, and they caught real bugs while building the demo — including a vase that was inside-out and looked perfect on screen.

**This is optional.** For a small experiment you may not need it. Ask:

```text
Would automatic tests help here? Which two or three would matter most?
```

One thing to watch: if a test fails, an agent sometimes "fixes" the test instead of the problem. Ask *"did you change the test or the code?"*

---

**Next:** [17 · From localhost to a shareable link →](../17-shipping/README.md)
