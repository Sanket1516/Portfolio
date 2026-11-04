"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { skillGroups, skills, type Skill, type SkillGroup } from "@/data/profile";
import { projects } from "@/data/projects";
import { Reveal, SectionHead } from "@/components/ui";

const nameOf = (slug: string) => projects.find((p) => p.slug === slug)?.name ?? slug;

const groupColor: Record<SkillGroup, string> = {
  Frontend: "#5a97ff", Backend: "#eceff7", Databases: "#a184ff", "Cloud & DevOps": "#5cf2a8", Languages: "#ffb65c", "AI & Automation": "#ff7d9c",
};

// Round so the server and the browser produce identical attributes (trig differs in the last digit).
const r2 = (v: number) => Math.round(v * 100) / 100;

const LEFT: SkillGroup[] = ["Frontend", "Backend", "Databases"];
const RIGHT: SkillGroup[] = ["Cloud & DevOps", "Languages", "AI & Automation"];
const GROUP_GAP = 1.4; // in item slots, leaves room for the group caption

// A Sankey-like layout: skills on two gently bowed columns, projects on a central spine.
// Every label owns its own row, so nothing can overlap however the data changes.
function layout() {
  const nodes: Record<string, { x: number; y: number; side: -1 | 0 | 1 }> = {};
  const captions: { group: SkillGroup; x: number; y: number; side: -1 | 1 }[] = [];
  const column = (groups: SkillGroup[], side: -1 | 1) => {
    const items = groups.map((g) => skills.filter((s) => s.group === g));
    const slots = items.reduce((n, g) => n + g.length, 0) + GROUP_GAP * groups.length;
    let k = GROUP_GAP;
    items.forEach((list, gi) => {
      const t0 = (k - GROUP_GAP * 0.55) / slots;
      captions.push({ group: groups[gi], x: r2(50 + side * (28 + 6 * Math.sin(t0 * Math.PI))), y: r2(2 + t0 * 96), side });
      list.forEach((sk) => {
        const t = k / slots;
        nodes[sk.name] = { x: r2(50 + side * (28 + 6 * Math.sin(t * Math.PI))), y: r2(2 + t * 96), side };
        k += 1;
      });
      k += GROUP_GAP;
    });
  };
  column(LEFT, -1);
  column(RIGHT, 1);
  const slugs = [...new Set(skills.flatMap((s) => s.projects.map((p) => p.slug)))];
  slugs.forEach((slug, i) => {
    nodes[`p:${slug}`] = { x: 50, y: r2(7 + (i / Math.max(1, slugs.length - 1)) * 86), side: 0 };
  });
  return { nodes, slugs, captions };
}

const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const mx = (a.x + b.x) / 2;
  return `M${a.x} ${a.y}C${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`;
};

function Detail({ skill }: { skill: Skill | null }) {
  if (!skill) return <p className="text-mute">Hover or focus a technology to see where it was actually used. Select a project to see what it was built with.</p>;
  return (
    <div aria-live="polite">
      <p className="label" style={{ color: groupColor[skill.group] }}>{skill.group}</p>
      <h3 className="display mt-2 text-5xl">{skill.name}</h3>
      <p className="mt-3 text-mute">{skill.experience}</p>
      {skill.projects.length > 0 && (
        <ul className="mt-5 space-y-3">
          {skill.projects.map((p) => (
            <li key={p.slug} className="border-t border-line pt-3">
              <Link href={`/work/${p.slug}`} className="font-semibold underline-offset-4 hover:underline">{nameOf(p.slug)}</Link>
              <p className="text-sm text-mute">{p.note}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Constellation() {
  const { nodes, slugs, captions } = useMemo(layout, []);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [project, setProject] = useState<string | null>(null);
  const uses = (s: Skill, slug: string) => s.projects.some((p) => p.slug === slug);
  const lit = (s: Skill) => (skill ? skill.name === s.name : project ? uses(s, project) : true);
  const active = skill !== null || project !== null;

  return (
    <div className="hidden gap-10 lg:grid lg:grid-cols-[1fr_20rem] xl:grid-cols-[1fr_22rem]">
      <div className="relative aspect-[1.2] w-full" onMouseLeave={() => { setSkill(null); setProject(null); }}>
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {skills.flatMap((s) =>
            s.projects.map((p) => {
              const on = skill?.name === s.name || project === p.slug;
              return (
                <path
                  key={s.name + p.slug}
                  d={curve(nodes[s.name], nodes[`p:${p.slug}`])}
                  fill="none"
                  stroke={on ? groupColor[s.group] : "rgb(255 255 255)"}
                  strokeOpacity={on ? 0.9 : active ? 0.025 : 0.07}
                  strokeWidth={on ? 1.4 : 1}
                  vectorEffect="non-scaling-stroke"
                  className={on ? "flow-line" : undefined}
                  style={{ transition: "stroke-opacity .3s" }}
                />
              );
            }),
          )}
        </svg>
        {captions.map((c) => (
          <p key={c.group} className={`label pointer-events-none absolute -translate-y-1/2 whitespace-nowrap ${c.side < 0 ? "-translate-x-full pr-4 text-right" : "pl-4"}`} style={{ left: `${c.x}%`, top: `${c.y}%`, color: groupColor[c.group] }}>
            {c.group}
          </p>
        ))}
        {slugs.map((slug) => {
          const n = nodes[`p:${slug}`];
          const on = project === slug || (skill ? uses(skill, slug) : false);
          return (
            <button key={slug} type="button" onMouseEnter={() => { setProject(slug); setSkill(null); }} onFocus={() => { setProject(slug); setSkill(null); }} className={`mono absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border bg-bg px-2.5 py-1.5 text-[10px] transition-[color,border-color,opacity] duration-300 ${on ? "border-ink text-ink" : "border-line-2 text-mute"}`} style={{ left: `${n.x}%`, top: `${n.y}%`, opacity: active && !on ? 0.4 : 1 }}>
              {nameOf(slug)}
            </button>
          );
        })}
        {skills.map((s) => {
          const n = nodes[s.name];
          const on = lit(s);
          const left = n.side < 0;
          return (
            <button key={s.name} type="button" onMouseEnter={() => { setSkill(s); setProject(null); }} onFocus={() => { setSkill(s); setProject(null); }} className={`absolute flex -translate-y-1/2 items-center gap-2 whitespace-nowrap py-0.5 text-[13px] font-medium transition-opacity duration-300 ${left ? "-translate-x-full flex-row-reverse pl-1" : "pr-1"}`} style={{ left: `calc(${n.x}% + ${left ? 4 : -4}px)`, top: `${n.y}%`, opacity: on ? 1 : 0.25 }}>
              <i className="h-2 w-2 shrink-0 rounded-full" style={{ background: groupColor[s.group], boxShadow: skill?.name === s.name ? `0 0 12px ${groupColor[s.group]}` : undefined }} aria-hidden="true" />
              {s.name}
            </button>
          );
        })}
      </div>
      <aside className="ticks self-start border border-line bg-bg-2 p-6 lg:sticky lg:top-24">
        <Detail skill={skill} />
        {project && !skill && (
          <div className="mt-4" aria-live="polite">
            <h3 className="display text-4xl">{nameOf(project)}</h3>
            <p className="mt-2 text-sm text-mute">{skills.filter((s) => uses(s, project)).map((s) => s.name).join(" · ")}</p>
            <Link href={`/work/${project}`} className="mono mt-3 inline-block text-[11px] text-blue">Read the case study →</Link>
          </div>
        )}
      </aside>
    </div>
  );
}

function MobileSkills() {
  const [group, setGroup] = useState<SkillGroup>("Frontend");
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="lg:hidden">
      <div role="tablist" aria-label="Skill categories" className="scrollbar-thin -mx-5 flex gap-1.5 overflow-x-auto px-5 pb-3">
        {skillGroups.map((g) => (
          <button key={g} role="tab" aria-selected={g === group} type="button" onClick={() => { setGroup(g); setOpen(null); }} className={`mono shrink-0 border px-3 py-2 text-[11px] ${g === group ? "border-ink bg-ink text-bg" : "border-line text-mute"}`}>{g}</button>
        ))}
      </div>
      <ul className="mt-2">
        {skills.filter((s) => s.group === group).map((s) => {
          const on = open === s.name;
          return (
            <li key={s.name} className="border-t border-line last:border-b">
              <button type="button" aria-expanded={on} onClick={() => setOpen(on ? null : s.name)} className="flex w-full items-center justify-between py-4 text-left">
                <span className="text-lg font-semibold">{s.name}</span>
                <span className="mono text-dim">{on ? "−" : "+"}</span>
              </button>
              {on && <div className="pb-5"><Detail skill={s} /></div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Stack() {
  return (
    <section id="stack" className="hop-section grid-bg" aria-labelledby="stack-h">
      <div className="wrap">
        <SectionHead hop="02" title={<span id="stack-h">The stack, with receipts</span>} intro="No percentage bars. Every technology links to where it was used and how." />
        <Reveal><Constellation /></Reveal>
        <MobileSkills />
      </div>
    </section>
  );
}
