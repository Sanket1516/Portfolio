import snapshot from "@/data/github-snapshot.json";
import { site } from "@/lib/site";

export type Repo = {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string;
  fork: boolean;
};

export type ContributionDay = { date: string; level: number; count: number };

export type GitHubData = {
  source: "live" | "snapshot";
  syncedAt: string;
  repos: Repo[];
  languages: Record<string, number>;
  contributions: ContributionDay[];
};

const REVALIDATE = 3600;
const USER = site.githubUser;

// The token stays on the server. It only raises the rate limit, since all of this data is public.
function apiHeaders(): HeadersInit {
  const h: Record<string, string> = { "User-Agent": "sanket-portfolio", Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, { headers: apiHeaders(), next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`GitHub ${path} returned ${res.status}`);
  return res.json() as Promise<T>;
}

export function parseContributions(html: string): ContributionDay[] {
  const days = new Map<string, ContributionDay>();
  for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"\s+id="(contribution-day-component-\d+-\d+)"\s+data-level="(\d)"/g))
    days.set(m[2], { date: m[1], level: Number(m[3]), count: 0 });
  for (const m of html.matchAll(/for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const count = /^(\d+) contribution/.exec(m[2]);
    const day = days.get(m[1]);
    if (day && count) day.count = Number(count[1]);
  }
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
}

type RawRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  languages_url: string;
};

async function fetchLive(): Promise<GitHubData> {
  const raw = await api<RawRepo[]>(`/users/${USER}/repos?per_page=100&sort=pushed`);
  const own = raw.filter((r) => !r.fork);
  const perRepo = await Promise.all(own.map((r) => api<Record<string, number>>(`/repos/${USER}/${r.name}/languages`)));
  const languages: Record<string, number> = {};
  for (const bytes of perRepo) for (const [lang, n] of Object.entries(bytes)) languages[lang] = (languages[lang] ?? 0) + n;

  const res = await fetch(`https://github.com/users/${USER}/contributions`, {
    headers: { "User-Agent": "sanket-portfolio" },
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) throw new Error(`contributions returned ${res.status}`);
  const contributions = parseContributions(await res.text());
  if (contributions.length < 300) throw new Error("contribution markup changed");

  return {
    source: "live",
    syncedAt: new Date().toISOString(),
    repos: raw.map((r) => ({
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
    contributions,
  };
}

// A failed fetch never produces invented numbers: the page shows the last committed snapshot and says so.
export async function getGitHubData(): Promise<GitHubData> {
  try {
    return await fetchLive();
  } catch (err) {
    console.warn("GitHub fetch failed, using snapshot:", err instanceof Error ? err.message : err);
    return { ...(snapshot as Omit<GitHubData, "source">), source: "snapshot" };
  }
}
