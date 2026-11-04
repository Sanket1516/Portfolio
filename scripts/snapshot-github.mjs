// Writes data/github-snapshot.json: the fallback used when GitHub is unreachable at runtime.
// Run with `npm run snapshot`. Uses GITHUB_TOKEN from the environment if it is set.
import { writeFileSync } from "node:fs";

const USER = "Sanket1516";
const headers = { "User-Agent": "sanket-portfolio", Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const json = async (url) => {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return res.json();
};

function parseContributions(html) {
  const days = new Map();
  for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"\s+id="(contribution-day-component-\d+-\d+)"\s+data-level="(\d)"/g))
    days.set(m[2], { date: m[1], level: Number(m[3]), count: 0 });
  for (const m of html.matchAll(/for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const count = /^(\d+) contribution/.exec(m[2]);
    const day = days.get(m[1]);
    if (day && count) day.count = Number(count[1]);
  }
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
}

const repos = await json(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`);
const languages = {};
for (const repo of repos.filter((r) => !r.fork)) {
  const bytes = await json(repo.languages_url);
  for (const [lang, n] of Object.entries(bytes)) languages[lang] = (languages[lang] ?? 0) + n;
}

const res = await fetch(`https://github.com/users/${USER}/contributions`, { headers: { "User-Agent": headers["User-Agent"] } });
if (!res.ok) throw new Error(`contributions returned ${res.status}`);

const snapshot = {
  syncedAt: new Date().toISOString(),
  repos: repos.map((r) => ({
    name: r.name,
    description: r.description,
    url: r.html_url,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    pushedAt: r.pushed_at,
    fork: r.fork,
  })),
  languages,
  contributions: parseContributions(await res.text()),
};

writeFileSync(new URL("../data/github-snapshot.json", import.meta.url), JSON.stringify(snapshot));
console.log(`snapshot: ${snapshot.repos.length} repos, ${snapshot.contributions.length} days`);
