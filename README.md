# Reep

**The Continuity Layer for the Digital Age**

A full, multi-page marketing site for Reep — a mission-critical digital inheritance platform. Rebuilt from the ground up as a true multi-page site (no SPA rewrites), plain HTML/CSS/JS, no build step.

## Live Site

https://reep.app *(placeholder — update once domain is live)*

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Full-viewport hero, problem/solution, feature grid, business model teaser |
| Product | `product.html` | User journey, asset modules, LEVS explained, beneficiary dashboard preview |
| Business Model | `business-model.html` | Value creation, revenue streams, scalability, moat, tech leverage |
| Security & Compliance | `security.html` | Zero-knowledge architecture, RUFADAA/GDPR, data sovereignty, audit trails |
| Pricing | `pricing.html` | Three tiers, comparison table, B2B2C callout, FAQ |
| Demo / Signup | `demo.html` | Focused waitlist page — "Coming Soon" framing, no real backend yet |
| Resources / Blog | `resources.html` | Article index |
| → Article 1 | `blog/inheritance-gap-crypto.html` | The crypto inheritance gap |
| → Article 2 | `blog/wills-vs-digital-vaults.html` | Wills vs. digital vaults |
| → Article 3 | `blog/inside-levs.html` | How the Life-Event Verification System works |
| About | `about.html` | Mission, founders, roadmap, contact |

## Tech Stack

- HTML5 + Tailwind CSS (via CDN) — no build step
- Vanilla JavaScript (`js/main.js` for nav/reveals, `js/waitlist.js` for the signup form)
- Google Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (utility/data)
- Vercel configuration included (static hosting, no SPA rewrite — this is a real multi-page site)

## Design System

All shared tokens live in `css/styles.css` as CSS custom properties:

- **Ink** `#0E1320` — primary dark surface
- **Sand** `#FAF6EF` — warm light surface
- **Continuity green** `#2BB389` — primary accent, signifies "active / ongoing"
- **Brass** `#C9A86A` — sparing legacy/heirloom accent
- **Slate** `#5B6B7F` — body text on light backgrounds

**Signature element:** the "heartbeat" pulse line (`.heartbeat-line` / `.heartbeat-path` in `styles.css`) — a literal visualization of Reep's inactivity-monitoring mechanism, used on the homepage hero and the waitlist success state.

## Quick Start (Local)

```
python3 -m http.server 8000
```
Then open `http://localhost:8000`. No build step required.

## Deployment (Vercel)

1. Push this folder to a GitHub repository
2. Import the repo at vercel.com
3. Vercel auto-detects `vercel.json` (clean URLs, security headers)
4. Add the custom domain in Project → Settings → Domains

## Important Notes

- The waitlist form (`demo.html` / `js/waitlist.js`) does **not** submit anywhere yet — it shows a polished success state client-side only. Wire up `handleWaitlistSubmit()` in `js/waitlist.js` to a real backend or provider (e.g. ConvertKit, Buttondown, custom API) before launch.
- Images are hotlinked from Unsplash's CDN under the Unsplash License (free, no attribution required). See `IMAGE_SOURCES.md` for the verified source list. For production, consider downloading and self-hosting for reliability and performance.
- Founder contact is now linked directly on the About page via LinkedIn for Ugwu Jonas.

## Founder

**Ugwu Jonas** — Founder
[LinkedIn](https://www.linkedin.com/in/jonas-ugwu-31a28340b)

## License

© 2026 Reep Systems. All Rights Reserved.
