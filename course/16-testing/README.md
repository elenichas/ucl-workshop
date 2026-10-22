# 16 · Testing

> **Part 4 — Craft and quality** · ~8 min · code at tag `stage-07-shipped`

**In one sentence:** tests are questions you ask your code automatically, every time anything changes — and they are the best way to keep an agent honest.

---

## Why testing matters *more* with an agent

An agent can change twenty files in a minute. Without tests, how do you know it didn't break something it wasn't asked to touch? You'd have to click through everything, every time. Tests do that for you, in seconds.

They also **give the agent eyes**: Claude can run `npm test`, see the red, and fix it itself — before you ever look.

## Three levels

| Level | Asks | Our example | Tool |
|---|---|---|---|
| **Unit tests** | Does this one function do what it should? | "Every preset produces a watertight mesh." "A 2 mm wall passes in PLA but fails in clay." "The STL is Z-up." | Vitest — `npm test` |
| **Browser (end-to-end) tests** | Does the real website work when a person uses it? | "Open the configurator, choose the clay printer, see a wall-thickness problem, download an STL." On desktop **and** phone. | Playwright — `npm run test:e2e` |
| **Human testing** | Does it make sense? Is it good? | Give it to a classmate. Don't explain. Watch. | Your eyes |

Tests live next to the code they test: [`buildVase.test.ts`](../../site/src/geometry/buildVase.test.ts), [`printability.test.ts`](../../site/src/checks/printability.test.ts), [`formats.test.ts`](../../site/src/export/formats.test.ts), and browser tests in [`site/tests/e2e/`](../../site/tests/e2e/).

## Reading a test

```ts
it('a 2 mm wall is fine for PLA but fails for clay', () => {
  expect(verdictOf(check(DEFAULT_PARAMS, 'fdm-desktop', 'pla'), 'wall')).toBe('pass')
  expect(verdictOf(check(DEFAULT_PARAMS, 'clay', 'stoneware'), 'wall')).toBe('fail')
})
```

It reads almost like a sentence — and it *is* a piece of fabrication knowledge, written so a computer can check it forever.

## Letting Claude test its own work

- *"Run the tests. If anything fails, explain why before fixing."*
- *"Write a failing test for this bug first, then fix it."* (Test-first: proves the bug exists and that it's gone.)
- With the **Playwright MCP** or Anthropic's **webapp-testing** skill, Claude can open the site in a real browser, click around, take screenshots and *look* at them.

### Careful: agents can cheat (by accident)

When a test fails, an agent may "fix" it by changing the test instead of the code. Always check: **did the test change, or the code?** A rule for CLAUDE.md: *"Never weaken or delete a test to make it pass without asking me."*

## What to test (and what not to)

Test the things that would be **expensive to get wrong**: geometry (a non-watertight file wastes a print), the rules (a wrong "pass" wastes clay and kiln time), the exports (a vase lying on its side). Don't bother testing that a button is exactly 40 px tall.

## Try it

```text
Write a Playwright test: on a phone viewport, open the configurator,
switch to the Make tab, choose the Clay printer, and check that the print
check shows "Will not print as designed" for the default vase.
Then make the default clay preset pass, and test that too.
```

---

**Next:** [17 · Shipping →](../17-shipping/README.md)
