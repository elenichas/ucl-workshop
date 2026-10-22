# 17 · Shipping

> **Part 4 — Craft and quality** · ~6 min

**In one sentence:** "shipping" means turning your project into optimised files and putting them on a server with a public link — for a static site like ours, that can be free and automatic.

---

## Build: from source to site

```bash
npm run build
```

Vite takes our TypeScript, React components, Tailwind classes and libraries and produces a `dist/` folder: one HTML file, a few compressed JS and CSS files, the WebAssembly for rhino3dm. That folder **is** the website. Any server that can serve files can host it.

Before building, the command runs the TypeScript checker: if types are wrong, the build stops. Another safety net.

## Where to host a static site

| Host | Cost | Notes |
|---|---|---|
| **GitHub Pages** | Free for public repos (private repos need a paid GitHub plan) | Lives next to the code. We use this. |
| Netlify, Vercel, Cloudflare Pages | Free tiers | Very easy, preview link for every change |
| Your university's web space | Free | Upload the `dist/` folder |

## Our setup: GitHub Pages, automatically

The file [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml) is a **GitHub Action** — a small script GitHub runs on its own computers. Every time we push to `main`, it:

1. installs the packages,
2. runs the unit tests (if they fail, nothing is published),
3. builds the site,
4. publishes `dist/` to GitHub Pages.

One-time setup: in the repo on GitHub → **Settings → Pages → Source: GitHub Actions**.

The site then lives at `https://<username>.github.io/ucl-workshop/`.

### Two details that trip everyone up

- **The sub-folder.** GitHub Pages serves the site under `/ucl-workshop/`, not `/`. Vite must know this, or every file link breaks: see `base` in [`vite.config.ts`](../../site/vite.config.ts).
- **Refreshing a page.** GitHub Pages only serves files; `/configure` isn't a file, so a refresh would 404. We use URLs like `/#/configure` (a "hash router") to avoid it.

## Before you share the link

- [ ] Works on a phone
- [ ] Keyboard-only run-through
- [ ] All tests green
- [ ] No placeholder text, no fake content
- [ ] Page title and description set (that's what shows in link previews)
- [ ] You've opened an exported file in Rhino / a slicer

## Try it

```text
Explain what .github/workflows/deploy.yml does, line by line, in plain
language. Then help me turn on GitHub Pages for my fork.
```

---

**Next:** [18 · Working with an agent →](../18-working-with-an-agent/README.md)
