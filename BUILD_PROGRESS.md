# Portfolio build: progress and handoff

**If you are a new Claude session or account: read this whole file first, then continue from "Next step".**
Do not redo the research. Everything found so far is recorded here. Update this file after each milestone.

Last updated: 2026-11-04 (polish session). Browser review list 1-5 done. Lighthouse: mobile 92/100/100/100, desktop 100/100/100/100.

## Next step

The first browser review (items 1-5) is done; see the log below. Suggested next work:

- Animated skyline path (real GPU) could not be checked headless: headless Chromium uses SwiftShader, which the site
  now detects and serves as still frames. Open it on a real machine and check the grow-in, drift and pulse.
- Remaining Lighthouse notes (not failing): ~59 KiB unused JS, 14 KiB legacy JS polyfills, forced reflow insight.
- DONE: `/work/[slug]` and `/resume` reviewed (desktop and phone). Case-study contents list is now a scroll-spy
  (`components/Toc.tsx`); metric values no longer wrap on phones. `/resume` PDF is served correctly (headless Chromium
  cannot preview PDFs, so its fallback text shows in screenshots; that is expected).
- Open questions for the user (below) are still unanswered.

Deployment (2026-11-04): Render STATIC SITE. `next.config.ts` has `output: "export"`, `trailingSlash: true`,
`images.unoptimized`. Build: `npm ci && npm run build`, publish directory `out`. `render.yaml` is a Blueprint with the
same settings plus security headers (a static export cannot set headers itself). `.node-version` pins Node 22.
Consequences: no ISR, so the GitHub section refreshes only when the site is rebuilt; no `next start` (use
`npm run preview` to serve `out/` locally). The OG image is now a static `app/opengraph-image.png` (frozen from the old
generated one) because an extensionless `/opengraph-image` file would get the wrong content type on a static host.
Set `NEXT_PUBLIC_SITE_URL` on Render to the live URL, or canonical/OG/sitemap point at portfolio.sanketmali.dev.

Motion layer (2026-11-04, user asked for "more dynamic and eye-catching"):
- Hero name: letters rise after the preloader (`.hero-char`, `--hero-delay`), a light sweep crosses them every 8s on a
  static overlay copy (`.sheen`), letters lift on hover; hero copy drifts up and fades on scroll (`--hp`).
- Section headings split into letters that rise from a mask (`SplitText` in `components/ui.tsx`; `SectionHead` now takes
  `title` + `titleId` strings), with a drawn blue rule next to the hop label.
- `components/sections/Ticker.tsx`: marquee of the real skill names between the hero and About (pauses on hover).
- Spotlight hover (`.spot`, one delegated pointer listener in `Chrome.tsx`) on stat cells, rules, metrics, demo frames.
- Giant outlined chapter numbers behind Work titles (`.chapter-num`).
- Everything has a reduced-motion fallback. Lighthouse after: mobile 93/100/100/100, desktop 100/100/100/100, CLS 0.

Functional test: `npm run e2e` (scripts/e2e.cjs) against `npm run preview` (static `out/`). 206/206 on the static build. 205/205 passed on 2026-11-04: all 12 routes,
404, every internal link and anchor, PDF/OG/robots/sitemap, nav, skyline hover, stack hover, under-the-hood, trace,
repo filter, every shell command + history + "/" shortcut, Konami dev mode, contact form (Formspree mocked: success,
error + mail-app fallback), mobile menu, mobile tabs, no phone overflow, reduced motion, zero console errors.

Review log:

1. DONE (2026-11-04). White hero was REAL in dev: StrictMode re-ran the effect and cleanup called `loseContext()`, so the
   second run drew into a dead context. Cleanup now frees buffers/programs only; canvas has `bg-bg` fallback.
2. DONE. Camera `dist 44`, look `[0, 4.6, 0]`, `YAW 0.58 / PITCH 0.17`, height scale 14. Lit edges, emissive roofs,
   horizon haze (clear colour = haze colour, so no hard horizon line).
3. DONE. Constellation replaced by a two-column Sankey layout (skills left/right by group, projects on a centre spine,
   curved links that flow on hover). Coordinates rounded with `r2()` to fix a server/client hydration mismatch.
4. DONE. Phones (390px) and tablet (820px) reviewed. Portrait skyline swings yaw +0.72 to look down the length of the
   year (dense city under the name); phone-only darker fade behind hero copy; hero footnote clears the floating menu
   button; Shell output 18rem on phones; heatmap opens scrolled to the latest weeks and responds to taps.
   Work chapters, ArchDiagram list (Systems), Telemetry and Connect looked fine on mobile. All repos show "today" because
   the snapshot really has every repo pushed within seconds on 4 Nov 2026. Not a bug.
5. DONE. Lighthouse mobile perf was 68 (TBT 7.3s): without a GPU, WebGL is rasterised on the CPU and the 60fps loop
   blocked the main thread. `Skyline.tsx` now detects software renderers (SwiftShader, llvmpipe, ...) via
   `WEBGL_debug_renderer_info` and draws still frames that redraw only on interaction (same path as reduced motion), and
   the animated loop starts on `requestIdleCallback`. `canvas.dataset.ready` is "still" in that mode.
   A11y fixes: About word-scrub uses an sr-only copy instead of `aria-label` on `<p>`, unlit words at .36 alpha (3:1),
   logo and "Code" links have accessible names that contain their visible text.
   `Reveal` now also reveals elements already above the viewport (deep links, restored scroll).
   When re-running Lighthouse, kill `next-server` too: a stale server serves old HTML and chunks 500.

Run commands: `npm install`, `npm run dev`, `npm run build`. If dev says "Can't resolve 'lucide-react'", the install is
corrupt (an interrupted install left only `.map` files): `rm -rf node_modules .next && npm ci`.
Headless screenshots: launch Chromium with `--use-angle=swiftshader --enable-unsafe-swiftshader` so WebGL2 renders. GitHub rate-limits anonymous calls, so the Telemetry section may show the
snapshot notice during development. That is expected.

User preference (2026-11-05): stop verifying and researching. Focus on building the best site. Do not redo research.

## The goal

Build Sanket Mali's complete, production-ready developer portfolio in this folder.
It must look award-level AND be technically credible. The original brief is long. Its core rules:

- Never invent facts, stats, or project claims. If something is missing, ask.
- Priority of sources: Resume > GitHub > LinkedIn. If sources conflict, ask before publishing.
- Never fabricate GitHub data. Never expose tokens in frontend code.
- No broken links, no non-functional buttons, no console errors.
- Reduced-motion support, accessible, mobile designed intentionally, great Lighthouse.
- Do not stop at a mockup. Implement and test the real site.

Required sections: preloader, hero (oversized name, status, terminal animation, 3D object, resume and LinkedIn CTAs),
navigation (scroll progress, active indicator, magnetic, custom mobile menu), about (counters, principles),
tech ecosystem (hover shows experience and projects, no percentage bars), project showcase with expandable case studies
and an "Under the Hood" reveal, interactive architecture diagrams, GitHub section (contribution graph, repo explorer,
language filter, loading and error handling), timeline, functional terminal (help about skills projects education contact
github, history, blinking cursor), contact (form, email, LinkedIn, GitHub, resume), easter eggs (Konami, dev mode),
resume preview and download, SEO.

## Progress

| Phase | Status |
|---|---|
| 0. Research: repo, resume, GitHub, LinkedIn | Done (LinkedIn blocked) |
| 1. Scaffold, design system, data layer | Done |
| 2. Hero, navigation, preloader | Done |
| 3. About, stack, timeline | Done, not visually reviewed |
| 4. Project showcase, case study pages | Done, not visually reviewed |
| 5. Interactive architecture diagrams | Done (`components/ArchDiagram.tsx`) |
| 6. GitHub section | Done, not visually reviewed |
| 7. Terminal, contact, easter eggs | Done, not visually reviewed |
| 8. SEO, responsive, a11y, performance pass | SEO files done. Visual, a11y and performance pass still to do |
| 9. Browser tests, Lighthouse, final review | Not started |

Structure: `app/` (home, `work/[slug]`, `resume`, SEO files), `components/sections/` (Hero, About, Stack, Work, Systems,
Telemetry, Journey, Shell, Connect), `components/demos/` (5 live demos), `components/{Chrome,DevMode,Skyline,ArchDiagram,ui,icons}.tsx`,
`data/{profile,projects}.ts`, `lib/{site,github,accent}.ts`.

## Decisions

- Stack: Next.js 16 App Router, TypeScript, Tailwind 4, `motion`. Hero 3D is hand-written WebGL2, not three.js
  (smaller bundle). No GSAP or R3F. Do not `git init` or deploy unless the user asks.
- Concept "SIGNAL": a packet travels a spine down the page. Sections are numbered hops. This extends the
  SANKET.SYS / SIGNAL identity already on the user's GitHub profile.
- Hero object: REAL contribution data as a 3D skyline. One tower per day. Hover shows that day.
- Projects get live in-browser demos of their real algorithms, labelled as demos: PassGuard entropy,
  Smart Campus scan state, DPI flow hash, Smart Form review gate.
- GitHub data: server-side with ISR (1h), optional server-only GITHUB_TOKEN, committed snapshot fallback.
- Contact form (2026-11-04, user request): posts to Formspree `https://formspree.io/f/mdaljozd` from the browser
  (`_gotcha` honeypot). On failure it offers a mailto fallback. The old `/api/contact` Resend route was removed.
- Featured (brief order): VAAKYA, Smart Campus, Smart Form, PassGuard, then DPI Engine. More: MetroMind, Wanderlust, Clause Search, Claim Fraud.
- Live demo links: none of the repos has a verified deployment, so show GitHub links only.

## Research findings

### Repo state

- This folder was EMPTY and is not a git repo. This is a new build.
- Old attempts, not worth reusing: `C:\Drive D\Projects\Portfolio react\React-Portfolio` (template),
  `C:\Drive D\Projects\Portfolio Website` (static HTML).
- Node 22.14, npm 10.9. `gh` CLI not available.

### Resume

`C:\Users\sanke\Downloads\Resume Updated with smart campus.pdf` (latest, 2026-11-04). Copy to `public/`, never edit.
It has no email or phone. It contains date of birth and a photo.

### Contact and links

- Public email from the GitHub profile: sanketmali0909@gmail.com (use this one).
  Do NOT publish btechcs23to27@gmail.com. That is the account email, not a public contact.
- GitHub: https://github.com/Sanket1516
- LinkedIn: https://www.linkedin.com/in/sanket-mali-4a40122b7/
- IEEE paper: https://ieeexplore.ieee.org/abstract/document/11400349
- Intended domain: https://portfolio.sanketmali.dev (NOT responding as of 2026-11-05).

### LinkedIn

Blocked (HTTP 999). Nothing was read. Only the URL is used.

### Project to repo mapping

| Brief | Evidence |
|---|---|
| VAAKYA | No repo. Team project, see the VAAKYA section below |
| Smart Campus | `Smart-Campus-Monitoring-System` |
| AI Agent for Government Forms | `Smart-Form-autofilling` (resume: "Smart Form Autofill") |
| PassGuard | `Cyber-Sec-Project` |
| Others | `Packet_analyzer` (C++ DPI), `metromind-ai-dms`, `Wanderlust-master`, `clause-finder-cuad`, `SCAM-and-Fraud-Detection` |

Local copies: Smart Form at `C:\Drive D\Projects\Smart Form autofilling`. Shallow clones of the rest were made in the
session scratchpad and may be gone. Re-clone from GitHub if needed.

### Verified against code

| Claim | Result |
|---|---|
| Next.js | Not in any repo. True only via this portfolio itself |
| PostgreSQL | Real: MetroMind |
| LangGraph | Real: Smart Form `backend/requirements.txt` |
| LangChain, Selenium | No evidence. Do NOT list |
| CloudFront | Not in Smart Campus. Only in the VAAKYA proposal. Do NOT show |
| Prometheus | Real on Smart Campus (`prom-client`, `/metrics`). NOT in either Wanderlust repo |
| CI | Smart Campus `deploy.yml` (Jest + Vitest, ECR, ECS). Smart Form `ci.yml` (ruff, black, pytest, Chroma, Playwright) |
| AWS shape | GitHub Actions, ECR, ECS Fargate, ALB (`/` frontend, `/api/*` backend), MongoDB Atlas, us-east-1 |

CGPA 8.68/10 (resume) and 3.47/4 (GitHub) are the same score converted. Use 8.68/10.
Contributors: repos are essentially all Sanket1516 commits.

### Honesty notes the site must keep

- Smart Campus terminal sync (about 90 eSSL X990, ADMS push) is tested on SIMULATED terminals only.
  `docs/TEST_RESULTS.md`: 90 of 91 Jest passed, sidecar 17, frontend 8. Hardware tests not performed.
- Resume's pilot (60 students, ~5s to under 1s) is resume-sourced. Repo docs claim no performance numbers. Flag to user.
- Smart Form: 239 pytest passed, recorded 2026-10-15. Quote with that date.
- Clause search: recall@4 0.043 to 0.448 on 54 held-out questions. Abstains correctly on only 3 of 10.
- MetroMind: 13-service architecture but its own README lists honest gaps (gateway in transition, doc drift).
- Wanderlust: no tests, no Docker, no webhook reconciliation (its README says so).
- GitHub: 329 contributions last year, peak day 46, 86 active days. 18 public repos, 0 stars. Do not feature stars.

### VAAKYA: PUBLISH, with the correct credit (user approved, source folder `C:\Drive D\NOMURA`)

- Real source: `C:\Drive D\NOMURA\INVINCIBLES\...Executive Summary.docx` and the slide PNGs in `C:\Drive D\NOMURA`.
- Ignore `Downloads\VAAKYA_Executive_Summary_v2 1.docx`. It is a stale draft naming the wrong person.
- Team Invincibles: Sanket Mali and Pinak Salunke. Nomura KakushIN 2026, Round 2 (Top 6, per resume).
- Sanket's role: frontend, accessibility-first UX, voice pipeline (Whisper + Coqui TTS), Firebase integration,
  OCR workflow integration, responsive PWA, user-facing design.
- Pinak's role: LangGraph orchestration, Financial Life Graph (Neo4j), RAG (Qdrant + LlamaIndex), LLM integration,
  FastAPI backend, overall architecture. Do NOT attribute these to Sanket.
- SUPERSEDED (2026-11-04, user's own statement): Sanket says he did all of the VAAKYA work himself and only shared
  responsibility on paper. The site now credits all VAAKYA work to Sanket and does not name Pinak anywhere.
  Note: the submitted Executive Summary still splits the roles, so the public site and that document now differ.
- Four agents: Educator, Strategy Builder, Sentinel, Connector, sharing a Financial Life Graph.
- Only code in the folder: `vaakya-plugin`, a Figma script generating a design system + 30 mobile screens.
- No public repo. Label it a hackathon design submission unless evidence of a build appears.
- Docs disagree: Gemini vs "KakushIN LLM", Qdrant vs pgvector, Cloudflare vs CloudFront. Latest slide: TECH STACK.png.
- Exec summary's About section lists AWS SAA and a transportation paper. Resume wins. Do not use them.

### DPI bug found (tell the user)

`Packet_analyzer/src/dpi_mt.cpp` lines 343 and 494: the reader picks an LB with `hash % 2`, then the LB picks a worker with
the same `hash % 2`. With the default 2x2 config, FP1 and FP2 never receive packets. Fix: use a different hash or bits.

### Security issue to tell the user

Public repos `Wanderlust` and `Wanderlust-master` track a `.env` with keys named `CLOUD_API_KEY`, `CLOUD_API_SECRET`,
`MAPBOX_TOKEN`. Values were deliberately not read. User should rotate them and purge history.

## Open questions for the user

1. VAAKYA: was a working demo built beyond the design and Figma screens? Is there a repo? The site says design submission for now.
2. Smart Campus: team project or solo? What was your part?
3. Pilot: resume says 60 students, repo says hardware tests not performed. Which is current?
4. LinkedIn: paste the headline, About, and experience, or send screenshots.
5. Technook internship is on the GitHub profile but not the resume. Dates and role?
6. Wanderlust: resume says Prometheus and Grafana, neither repo has them. The site omits it for now.
7. Availability wording "Open to software engineering roles, graduating 2027" is assumed. Confirm.
8. Selenium and LangChain: any repos proving these? Omitted for now.
9. Should the public resume PDF keep your date of birth?
10. portfolio.sanketmali.dev is not responding. Is that still the intended domain?
