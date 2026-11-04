"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import type { GitHubData, Repo } from "@/lib/github";
import { site } from "@/lib/site";
import { Reveal, SectionHead } from "@/components/ui";

const LANG: Record<string, string> = { Python: "#5a97ff", JavaScript: "#ffd166", TypeScript: "#a184ff", "C++": "#ff7d9c", HTML: "#ffb65c", CSS: "#5cf2a8" };
const langColor = (l: string | null) => (l && LANG[l]) || "#7f889e";
const levels = ["#12151f", "#173060", "#2a56b4", "#5a97ff", "#c4d9ff"];

const fmtDate = (d: string) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function ago(iso: string, now: number) {
  const days = Math.floor((now - Date.parse(iso)) / 864e5);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function Heatmap({ days }: { days: GitHubData["contributions"] }) {
  const [hover, setHover] = useState<string | null>(null);
  const first = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  const S = 13;
  const cols = Math.ceil((days.length + first) / 7);
  return (
    <div>
      <div className="scrollbar-thin overflow-x-auto">
        <svg viewBox={`0 0 ${cols * S} ${7 * S}`} className="min-w-[44rem]" role="img" aria-label={`Contribution calendar with ${days.reduce((n, d) => n + d.count, 0)} contributions over the last year`} onMouseLeave={() => setHover(null)}>
          {days.map((d, i) => {
            const p = i + first;
            return <rect key={d.date} x={Math.floor(p / 7) * S} y={(p % 7) * S} width={S - 3} height={S - 3} fill={levels[d.level]} onMouseEnter={() => setHover(`${d.count} on ${fmtDate(d.date)}`)} />;
          })}
        </svg>
      </div>
      <p className="mono mt-3 h-4 text-[11px] text-mute">{hover ?? "Hover a day"}</p>
    </div>
  );
}

function Languages({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const rows = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 6);
  return (
    <div>
      <div className="flex h-2 gap-px overflow-hidden" aria-hidden="true">
        {rows.map(([l, n]) => <div key={l} style={{ width: `${(n / total) * 100}%`, background: langColor(l) }} />)}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3">
        {rows.map(([l, n]) => (
          <li key={l} className="flex items-center gap-2">
            <i className="h-2 w-2 rounded-full" style={{ background: langColor(l) }} aria-hidden="true" />
            <span>{l}</span>
            <span className="mono ml-auto text-[11px] text-dim">{((n / total) * 100).toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Explorer({ repos, syncedAt }: { repos: Repo[]; syncedAt: string }) {
  const own = useMemo(() => repos.filter((r) => !r.fork), [repos]);
  const langs = useMemo(() => ["All", ...[...new Set(own.map((r) => r.language).filter(Boolean) as string[])].sort()], [own]);
  const [lang, setLang] = useState("All");
  const [sel, setSel] = useState<string | null>(null);
  const now = Date.parse(syncedAt);
  const list = own.filter((r) => lang === "All" || r.language === lang).sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));
  const active = list.find((r) => r.name === sel) ?? list[0];

  return (
    <div>
      <div role="group" aria-label="Filter repositories by language" className="flex flex-wrap gap-1.5">
        {langs.map((l) => (
          <button key={l} type="button" aria-pressed={l === lang} onClick={() => { setLang(l); setSel(null); }} className={`mono border px-2.5 py-1.5 text-[11px] transition-colors ${l === lang ? "border-ink bg-ink text-bg" : "border-line text-mute hover:border-line-2"}`}>{l}</button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_20rem]">
        <ul className="scrollbar-thin max-h-[26rem] overflow-y-auto border-t border-line">
          {list.map((r) => (
            <li key={r.name} className="border-b border-line">
              <button type="button" aria-pressed={active?.name === r.name} onClick={() => setSel(r.name)} className={`flex w-full items-center gap-3 px-2 py-3 text-left transition-colors ${active?.name === r.name ? "bg-bg-3" : "hover:bg-bg-3/60"}`}>
                <i className="h-2 w-2 shrink-0 rounded-full" style={{ background: langColor(r.language) }} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{r.name}</span>
                <span className="mono shrink-0 text-[10.5px] text-dim">{ago(r.pushedAt, now)}</span>
              </button>
            </li>
          ))}
        </ul>
        {active && (
          <aside className="ticks self-start border border-line bg-bg-2 p-5">
            <h4 className="break-words font-semibold">{active.name}</h4>
            <p className="mt-2 min-h-[3rem] text-sm text-mute">{active.description ?? "No description on GitHub."}</p>
            <div className="mono mt-3 flex items-center gap-4 text-[11px] text-mute">
              <span>{active.language ?? "Mixed"}</span>
              <span className="flex items-center gap-1"><Star size={11} /> {active.stars}</span>
              <span className="flex items-center gap-1"><GitFork size={11} /> {active.forks}</span>
            </div>
            <a href={active.url} target="_blank" rel="noreferrer" className="mono mt-4 inline-flex items-center gap-1 text-[11px] text-blue">Open on GitHub <ArrowUpRight size={12} /></a>
          </aside>
        )}
      </div>
    </div>
  );
}

export function Telemetry({ data }: { data: GitHubData }) {
  const total = data.contributions.reduce((n, d) => n + d.count, 0);
  const active = data.contributions.filter((d) => d.count).length;
  const peak = Math.max(...data.contributions.map((d) => d.count));
  const repos = data.repos.filter((r) => !r.fork).length;
  const synced = new Date(data.syncedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return (
    <section id="telemetry" className="hop-section" aria-labelledby="telemetry-h">
      <div className="wrap">
        <SectionHead hop="05" title={<span id="telemetry-h">Live telemetry</span>} intro="Pulled from GitHub on the server, never hard-coded." />
        <Reveal>
          <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="mono flex items-center gap-2 text-[11px] text-mute">
              <span className={data.source === "live" ? "led" : "h-[7px] w-[7px] rounded-full bg-amber"} aria-hidden="true" />
              {data.source === "live" ? "Live from GitHub, refreshed hourly" : `GitHub is unreachable. Showing the snapshot from ${synced}`}
            </p>
            <a href={site.github} target="_blank" rel="noreferrer" className="mono inline-flex items-center gap-1 text-[11px] text-blue">@{site.githubUser} <ArrowUpRight size={12} /></a>
          </div>
          <dl className="mb-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[[total, "Contributions, last 12 months"], [active, "Active days"], [peak, "Busiest single day"], [repos, "Public repositories"]].map(([v, l]) => (
              <div key={l as string}><dd className="display text-6xl tabular-nums">{v}</dd><dt className="mt-1 text-sm text-mute">{l}</dt></div>
            ))}
          </dl>
          <Heatmap days={data.contributions} />
        </Reveal>
        <div className="mt-14 grid gap-12">
          <Reveal><h3 className="label mb-4">Languages, by bytes across public repositories</h3><Languages data={data.languages} /></Reveal>
          <Reveal><h3 className="label mb-4">Repository explorer</h3><Explorer repos={data.repos} syncedAt={data.syncedAt} /></Reveal>
        </div>
      </div>
    </section>
  );
}
