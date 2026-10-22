# 12 · Responsiveness

> **Part 4 — Craft and quality** · ~6 min

**In one sentence:** one website, every screen — the layout should *reorganise* for a phone, not just shrink.

---

## Why it matters

Most people will first open your link on a phone (from a message, a QR code at the exhibition, Instagram). If it's broken there, it's broken.

## How it works: breakpoints

CSS can apply different rules depending on the screen width. Tailwind makes this short: classes without a prefix apply everywhere (mobile first), and `md:` / `lg:` apply from a certain width upwards.

```tsx
<div className="grid lg:grid-cols-[1fr_400px]">   // 1 column on phones, 2 columns on laptops
<h1 className="text-6xl md:text-8xl">            // smaller title on phones
```

| Prefix | From width | Typical device |
|---|---|---|
| (none) | 0 | phones |
| `md:` | 768 px | tablets |
| `lg:` | 1024 px | laptops |

## What changes in our configurator

| | Phone | Laptop |
|---|---|---|
| Layout | Vase on top (~half the screen), controls scroll below | Vase left (fills height), controls right, scrolling independently |
| Height | `svh` units so the browser's address bar doesn't hide the vase | `100dvh` minus the header |
| Hints | "drag to orbit · scroll to zoom" hidden (no scroll wheel on phones) | Shown |
| Selects | Native `<select>`: opens the phone's own picker | Same element, styled |

## 3D on small screens — special care

- **Touch:** one finger orbits, two fingers pinch to zoom. OrbitControls handles this; the canvas uses `touch-action: none` so the page doesn't scroll while you rotate. But that means… users need somewhere *else* to scroll. Never make the 3D view fill the whole phone screen.
- **Performance:** phones have weaker GPUs. Our draft/full trick and the pixel-ratio cap matter even more.
- **Thumb reach:** controls with at least ~40 px tall touch targets.

## Testing it

- Browser dev tools → device toolbar (`Cmd/Ctrl + Shift + M`) → pick a phone.
- Better: open it on your real phone. With `npm run dev -- --host`, the dev server prints a network URL you can open on a phone on the same Wi-Fi.
- Automated: our Playwright tests run on a desktop **and** a phone viewport (chapter 16).

## Try it

```text
Check the configurator at 375 px wide (iPhone SE). List everything that is
cramped, cut off, or too small to tap. Then fix the top 3, keeping desktop
unchanged. Take before/after screenshots if you can.
```

---

**Next:** [13 · Accessibility →](../13-accessibility/README.md)
