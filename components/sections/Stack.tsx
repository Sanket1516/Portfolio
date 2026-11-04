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

// Skills sit on two alternating ellipses, in group order. Projects sit on a small inner ring.
function layout() {
  const nodes: Record<string, { x: number; y: number }> = {};
  const ordered = skillGroups.flatMap((g) => skills.filter((s) => s.group === g));
  const gap = 0.9;
  const usable = Math.PI * 2 - gap * skillGroups.length * 0.1;
  const step = usable / ordered.length;
  let a = -Math.PI / 2, last: SkillGroup | null = null;
  ordered.forEach((s, i) => {
    if (last && last !== s.group) a += gap * 0.1;
    last = s.group;
    const far = i % 2 === 0;
    nodes[s.name] = { x: 50 + Math.cos(a) * (far ? 44 : 34), y: 50 + Math.sin(a) * (far ? 45 : 35) };
    a += step;
  });
  const slugs = [...new Set(skills.flatMap((s) => s.projects.map((p) => p.slug)))];
  slugs.forEach((slug, i) => {
    const t = (i / slugs.length) * Math.PI * 2 - Math.PI / 2;
    nodes[`p:${slug}`] = { x: 50 + Math.cos(t) * 17, y: 50 + Math.sin(t) * 19 };
  });
  return { nodes, slugs };
}

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
  const { nodes, slugs } = useMemo(layout, []);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [project, setProject] = useState<string | null>(null);
  const uses = (s: Skill, slug: string) => s.projects.some((p) => p.slug === slug);
  const lit = (s: Skill) => (skill ? skill.name === s.name : project ? uses(s, project) : true);

  return (
    <div className="hidden gap-8 lg:grid lg:grid-cols-[1fr_21rem]">
      <div className="relative aspect-[1.28] w-full" onMouseLeave={() => { setSkill(null); setProject(null); }}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {skills.flatMap((s) =>
            s.projects.map((p) => {
              const a = nodes[s.name], b = nodes[`p:${p.slug}`];
              const on = skill?.name === s.name || project === p.slug;
              return <line key={s.name + p.slug} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={on ? groupColor[s.group] : "rgb(255 255 255 / .055)"} strokeWidth={on ? 1.3 : 1} vectorEffect="non-scaling-stroke" />;
            }),
          )}
        </svg>
        {slugs.map((slug) => {
          const n = nodes[`p:${slug}`];
          const on = project === slug || (skill ? uses(skill, slug) : false);
          return (
            <button key={slug} type="button" onMouseEnter={() => { setProject(slug); setSkill(null); }} onFocus={() => { setProject(slug); setSkill(null); }} className={`mono absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border bg-bg px-2 py-1 text-[10px] transition-colors ${on ? "border-ink text-ink" : "border-line text-mute"}`} style={{ left: `${n.x}%`, top: `${n.y}%` }}>
              {nameOf(slug)}
            </button>
          );
        })}
        {skills.map((s) => {
          const n = nodes[s.name];
          const on = lit(s);
          return (
            <button key={s.name} type="button" onMouseEnter={() => { setSkill(s); setProject(null); }} onFocus={() => { setSkill(s); setProject(null); }} className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap px-1 py-0.5 text-[13px] font-medium transition-opacity" style={{ left: `${n.x}%`, top: `${n.y}%`, opacity: on ? 1 : 0.28 }}>
              <i className="h-1.5 w-1.5 rounded-full" style={{ background: groupColor[s.group], boxShadow: skill?.name === s.name ? `0 0 10px ${groupColor[s.group]}` : undefined }} aria-hidden="true" />
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
