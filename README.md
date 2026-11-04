# Sanket Mali: portfolio

**Live site:** [portfolio-eues.onrender.com](https://portfolio-eues.onrender.com/)

Next.js 16, TypeScript, Tailwind 4, Motion and hand-written WebGL2.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

- `data/profile.ts` and `data/projects.ts` hold all content. The site, the shell and the constellation all read from them.
- `lib/site.ts` holds links and the availability line.
- `npm run snapshot` refreshes `data/github-snapshot.json`, the fallback used when GitHub is unreachable.
- `.env.example` lists the optional settings. The site works with none of them.
- `BUILD_PROGRESS.md` records the plan, findings and open questions.

Live on Render at <https://portfolio-eues.onrender.com/>, built from `render.yaml`. It also deploys to any Next.js host, such as Vercel. Set `NEXT_PUBLIC_SITE_URL` to the final domain.
