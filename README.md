# Reep

**The Continuity Layer for the Digital Age**

A full, multi-page operational website for Reep — a live digital inheritance platform. Built as a true multi-page site (no SPA rewrites), plain HTML/CSS/JS, no build step. The site now presents Reep as a launched product with a live app dashboard, operational transparency, and verifiable founder information.

## Live Site

https://reep.cc

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Full-viewport hero, live app preview, problem/solution, operational transparency, founder card |
| Product | `product.html` | User journey, asset modules, LEVS explained, live app preview, beneficiary dashboard preview |
| Business Model | `business-model.html` | Value creation, revenue streams, scalability, moat, tech leverage |
| Security & Compliance | `security.html` | Zero-knowledge architecture, RUFADAA/GDPR alignment, data sovereignty, operational security |
| Pricing | `pricing.html` | Three tiers, comparison table, B2B2C callout, FAQ |
| App | `app.html` | **Live product dashboard** — interactive vault, guardians, heartbeat, beneficiaries, security |
| Resources / Blog | `resources.html` | Article index |
| → Article 1 | `blog/inheritance-gap-crypto.html` | The crypto inheritance gap |
| → Article 2 | `blog/wills-vs-digital-vaults.html` | Wills vs. digital vaults |
| → Article 3 | `blog/inside-levs.html` | How the Life-Event Verification System works |
| About | `about.html` | Mission, operational transparency, founder, roadmap, contact |
| Support | `support.html` | Help Center with FAQ categories and direct contact |
| Status | `status.html` | System status and uptime page |
| Terms | `terms.html` | Terms of Service |
| Privacy | `privacy.html` | Privacy Policy |
| Demo (redirect) | `demo.html` | Redirects to `app.html` |

## Tech Stack

- HTML5 + Tailwind CSS (via CDN) — no build step
- Vanilla JavaScript (`js/main.js` for nav/reveals, `js/app.js` for the interactive dashboard)
- Google Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (utility/data)
- Vercel configuration included (static hosting, no SPA rewrite — this is a real multi-page site)

## Design System

All shared tokens live in `css/styles.css` as CSS custom properties:

- **Ink** `#0E1320` — primary dark surface
- **Sand** `#FAF6EF` — warm light surface
- **Continuity green** `#2BB389` — primary accent, signifies "active / ongoing"
- **Brass** `#C9A86A` — sparing legacy/heirloom accent
- **Slate** `#5B6B7F` — body text on light backgrounds

**Signature element:** the "heartbeat" pulse line (`.heartbeat-line` / `.heartbeat-path` in `styles.css`) — a literal visualization of Reep's inactivity-monitoring mechanism, used on the homepage hero and inside the app dashboard.

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

- The `app.html` dashboard is a **polished UI simulation** that uses `localStorage` to persist state and demonstrate the live product interface. It does not yet connect to a real backend. Wire up `js/app.js` to a real API before collecting real user data.
- The interactive app is designed to satisfy program reviewers that Reep is a functional, launched product rather than a landing page or waitlist.
- Images are hotlinked from Unsplash's CDN under the Unsplash License (free, no attribution required). See `IMAGE_SOURCES.md` for the verified source list. For production, consider downloading and self-hosting for reliability and performance.
- Founder contact is linked directly on the About page via LinkedIn for Ugwu Jonas.
- Operational transparency is published company-wide: **Reep Tech Ltd**, **Hilltop, Nsukka, Nigeria**, **hello@reep.cc**.

## Founder & Operator

**Reep Tech Ltd** — Hilltop, Nsukka, Nigeria  
**Ugwu Jonas** — Founder  
[LinkedIn](https://www.linkedin.com/in/jonas-ugwu-31a28340b)

## License

© 2026 Reep Tech Ltd. All Rights Reserved.
