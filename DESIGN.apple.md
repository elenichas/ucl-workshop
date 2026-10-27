---
name: Vessel (Apple HIG style)
source: "Apple Human Interface Guidelines, applied with the apple-hig skill (github.com/AyushRajSinghParihar/apple-human-interface-skills)"
colors:
  paper: "#F2F2F7"          # grouped background (light)
  paper-raised: "#FFFFFF"   # grouped content: cards, panels, controls
  stage: "#FFFFFF"          # behind the 3D vase
  ink: "#000000"            # label
  ink-muted: "#6C6C70"      # secondary label, darkened so small text passes 4.5 : 1
  line: "#C6C6C8"           # separator
  filament: "#0071E3"       # the one tint: filled primary buttons, selected segment, slider fill (white text on it)
  accent: "#0066CC"         # the tint when it is text (links), so it passes 4.5 : 1
  ok: "#1E7A35"
  warn: "#C93400"
  fail: "#D70015"
  night-paper: "#000000"
  night-raised: "#1C1C1E"
  night-ink: "#FFFFFF"
  night-muted: "#98989F"
  night-line: "#38383A"
  night-accent: "#409CFF"
typography:
  family: "The system font (SF Pro on Apple devices), with platform fallbacks"
  display: "Bold, slightly tightened tracking, for titles only"
  body: "Regular and semibold; semantic roles (title, body, supporting detail, action label)"
  numbers: "The same family with tabular figures"
  code: "ui-monospace (SF Mono on Apple devices)"
radius:
  sm: 10
  md: 12
---

# Vessel — Apple HIG style

> One of three styles of the site. Choose **Apple HIG** in the style switch at the top of the website to see it.

## What the guidelines asked for, and how we applied them

| HIG topic | Guidance (paraphrased) | In Vessel |
|---|---|---|
| Typography | Prefer system text styles; give titles, body, supporting detail and action labels a clear relationship | The system font; bold titles, regular body, smaller secondary text; no decorative faces |
| Color | Assign colour by meaning; one interactive accent; keep states readable without colour; specify light and dark variants | One blue tint for actions and selection; status keeps its icon and word; every pair checked for contrast in both appearances |
| Materials | Use translucent material for important navigation and controls, not for every content card | Only the top navigation bar is translucent; content sits on plain grouped backgrounds |
| Layout | Group related items, keep relationships when space changes | Grouped panels on a grey background; controls stack on phones |
| Buttons | One or two prominent actions per view; style, not size, ranks related choices | Filled blue for the primary action, outlined for secondary |
| Segmented controls | Single choice among closely related views, with a clearly selected segment | The style switch itself, and the start choices |
| Sliders | Bounded values with live results and exact numeric entry | Every slider has a number field and updates the vase live |

## Principles
1. **Clarity.** Legible text at every size, precise icons, and only one tint colour.
2. **Deference.** The interface steps back so the vase leads: plain grouped surfaces, no decoration, no layer-line effect.
3. **Depth.** Layers are shown with material and grouping (the translucent navigation bar over the page), not with drop shadows on every card.

## Don'ts
- No custom display font; no all-caps labels; no second tint colour.
- No glass on content cards: translucency is for navigation only.
- No blue text below 4.5 : 1. The brighter system blue is used as a fill with white text, a darker blue for links.

## Limits of a website
The HIG is written for native Apple apps. On the web we follow its visual and interaction guidance, but things like Dynamic Type, VoiceOver ordering and native control behaviour need checking on real Apple devices.
