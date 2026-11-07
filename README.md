<div align="center">

# Sanket Mali — Portfolio

**Live site:** [portfolio-eues.onrender.com](https://portfolio-eues.onrender.com/)

![Next.js](https://img.shields.io/badge/Next.js_16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-06B6D4?logo=tailwindcss&logoColor=white)
![WebGL2](https://img.shields.io/badge/WebGL2-990000?logo=webgl&logoColor=white)
![Lighthouse](https://img.shields.io/badge/Lighthouse-100%2F100%2F100%2F100-0CCE6B?logo=lighthouse&logoColor=white)

<img src="docs/screenshots/hero.png" alt="Portfolio hero: SANKET MALI over a 3D skyline of GitHub contributions" width="900" />

</div>

A personal portfolio built as an interactive system rather than a page of screenshots. The hero skyline is drawn with hand-written WebGL2 — **one tower per day of real GitHub contributions** — and the project chapters run real logic in the browser.

## Screenshots

| About (`whoami`) | Stack, with receipts |
|:---:|:---:|
| <img src="docs/screenshots/about.png" alt="About section" width="440" /> | <img src="docs/screenshots/stack.png" alt="Interactive stack graph" width="440" /> |
| **Things that run (project chapters)** | **Trace a request** |
| <img src="docs/screenshots/work.png" alt="Work section with VAAKYA" width="440" /> | <img src="docs/screenshots/systems.png" alt="System trace view" width="440" /> |
| **Journey** | **Built-in shell** |
| <img src="docs/screenshots/journey.png" alt="Education and achievements timeline" width="440" /> | <img src="docs/screenshots/shell.png" alt="Interactive terminal with help, whoami and projects commands" width="440" /> |

<p align="center">
  <img src="docs/screenshots/mobile.png" alt="Mobile view" width="260" /><br/>
  <sub>Mobile</sub>
</p>

## Features

- **GitHub skyline** — WebGL2 3D city where each tower is one day of contributions, with a still-frame fallback for software renderers and reduced motion
- **Stack with receipts** — hover any technology to see exactly which project used it
- **Project chapters** — live demos instead of static images, plus case studies at `/work/[slug]`
- **Trace a request** — follow a real request through a system's architecture, component by component
- **Shell** — a working terminal over the same data as the page (`help`, `whoami`, `projects`, history, `/` shortcut)
- **Motion layer** — split-text headings, spotlight hover, marquee ticker, all with reduced-motion fallbacks
- **Fast and accessible** — Lighthouse 100/100/100/100 on desktop, CLS 0
- Resume at `/resume`, OG image, sitemap and robots

## Tech stack

Next.js 16 (static export) · React 19 · TypeScript · Tailwind CSS 4 · Motion · WebGL2 · lucide-react · deployed on Render

## Getting started

```bash
npm install
npm run dev                       # http://localhost:3000
npm run build && npm run preview  # static export served from out/
npm run e2e                       # functional tests against the preview build
```

| File | Purpose |
|---|---|
| `data/profile.ts`, `data/projects.ts` | All content — the site, the shell and the skyline read from them |
| `lib/site.ts` | Links and the availability line |
| `npm run snapshot` | Refreshes `data/github-snapshot.json`, the fallback used when GitHub is unreachable |
| `.env.example` | Optional settings (site URL, GitHub token, Resend key). The site works with none of them |
| `BUILD_PROGRESS.md` | Plan, findings and open questions |

## Deployment

Live on Render as a static site, built from `render.yaml` (`npm ci && npm run build`, publish `out/`). It also deploys to any static host such as Vercel or Netlify. Set `NEXT_PUBLIC_SITE_URL` to the final domain.

## Author

**Sanket Mali** · [GitHub](https://github.com/Sanket1516)
