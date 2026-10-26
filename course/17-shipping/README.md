# 17 · From localhost to a shareable link

> **Part 4 — Craft and quality** · ~2 min · context — not something we do today

**In one sentence:** your site lives at `localhost` on your laptop; to give people a link they can open, it has to be built and put on a host — a next step, not part of today.

---

## Why your localhost link doesn't work for others

`http://localhost:5173` means *this computer* (see [chapter 04](../04-setup-first-conversation/README.md)). It only exists on your laptop, only while the site is running.

## Getting a real link

```
localhost  →  build the site  →  put it on a host  →  a link anyone can open
```

1. **Build** — the agent turns your project into a small set of finished files (a `dist` folder).
2. **Host** — those files go onto a service that serves them on the internet.

Several services do this, most with free plans for small sites:

| Host | In one line |
|---|---|
| **Vercel** | Popular for React sites; gives you a link for every change |
| **Netlify** | Drag in a folder, get a link |
| **GitHub Pages** | Free, lives next to your code on GitHub |
| **Cloudflare Pages** | Fast, generous free plan |
| **A Claude artifact** | If you use the Claude app: Claude builds the site and publishes it as a claude.ai link — private until you share it from its Share menu. Quickest; it runs in a protected frame, so some things (like downloads) may not work there. |

Most need an account. (The preview of this course's demo was shared as a Claude artifact.) Some connect to GitHub, so that every change you save is published automatically.

## When you're ready

It's one prompt away:

```text
Help me publish this site so I can share a link with friends.
Which host would you recommend for a beginner, and what do I need?
Explain each step before you do it.
```

## Before you share a link

- [ ] It works on a phone
- [ ] Text is readable (chapter 13)
- [ ] No placeholder or fake content
- [ ] You've opened a downloaded file in Rhino or a slicer

*(How the demo is published: a small automated script builds the site and publishes it to GitHub Pages every time the code changes — see `.github/workflows/deploy.yml` if you're curious.)*

---

**Next:** [18 · Working with an agent →](../18-working-with-an-agent/README.md)
