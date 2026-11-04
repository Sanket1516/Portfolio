"use client";

import { AnimatePresence, m } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Github } from "@/components/icons";
import { featured, projects, type Project } from "@/data/projects";
import { ArchDiagram } from "@/components/ArchDiagram";
import { Reveal, SectionHead } from "@/components/ui";
import { accentClass } from "@/lib/accent";

const demos = {
  agents: dynamic(() => import("@/components/demos/AgentsDemo")),
  scan: dynamic(() => import("@/components/demos/ScanDemo")),
  review: dynamic(() => import("@/components/demos/ReviewDemo")),
  entropy: dynamic(() => import("@/components/demos/EntropyDemo")),
  flow: dynamic(() => import("@/components/demos/FlowDemo")),
};

function Chapter({ p, i }: { p: Project; i: number }) {
  const [open, setOpen] = useState(false);
  const a = accentClass[p.accent];
  const Demo = p.demo ? demos[p.demo] : null;
  const flip = i % 2 === 1;

  return (
    <article id={`work-${p.slug}`} className="border-t border-line py-14 md:py-24" aria-labelledby={`${p.slug}-h`}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className={`lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}>
          <div className="lg:sticky lg:top-24">
            <p className={`mono text-[11px] ${a.text}`}>{String(i + 1).padStart(2, "0")} · {p.kind}</p>
            <h3 id={`${p.slug}-h`} className="display mt-3 text-[clamp(3.25rem,7vw,6.5rem)]">{p.name}</h3>
            <p className="mt-4 text-xl leading-snug">{p.tagline}</p>
            <dl className="mt-7 space-y-4 text-[0.97rem]">
              <div><dt className="label">Problem</dt><dd className="mt-1 text-mute">{p.problem}</dd></div>
              <div><dt className="label">Solution</dt><dd className="mt-1 text-mute">{p.solution}</dd></div>
              <div><dt className="label">My part</dt><dd className="mt-1 text-mute">{p.role}</dd></div>
            </dl>
            <ul className="mt-7 grid grid-cols-2 gap-px border border-line bg-line">
              {p.metrics.map((x) => (
                <li key={x.label} className="bg-bg p-3">
                  <div className="display text-3xl">{x.value}</div>
                  <div className="mt-0.5 text-xs leading-snug text-mute">{x.label}</div>
                </li>
              ))}
            </ul>
            <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1">
              {p.stack.map((t) => <li key={t} className="mono text-[10.5px] text-dim">{t}</li>)}
            </ul>
            <p className="mt-4 text-xs text-dim">{p.status}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="btn btn-solid">
                Under the hood <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              <Link href={`/work/${p.slug}`} className="btn">Case study <ArrowUpRight size={14} /></Link>
              {p.repo && <a href={p.repo} target="_blank" rel="noreferrer" className="btn" aria-label={`${p.name} on GitHub`}><Github size={14} /> Code</a>}
            </div>
          </div>
        </div>
        <div className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
          <Reveal>{Demo && <Demo />}</Reveal>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <m.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }} className="overflow-hidden">
            <div className="pt-10"><ArchDiagram views={p.architecture} accent={a.hex} /></div>
          </m.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function Work() {
  const more = projects.filter((p) => !p.featured);
  return (
    <section id="work" className="hop-section !pb-0" aria-labelledby="work-h">
      <div className="wrap">
        <SectionHead hop="03" title={<span id="work-h">Things that run</span>} intro="Instead of screenshots, these chapters run the real logic in your browser. Open any of them to see the architecture." />
        {featured.map((p, i) => <Chapter key={p.slug} p={p} i={i} />)}
        <div className="border-t border-line py-14 md:py-20">
          <h3 className="display mb-8 text-5xl">More builds</h3>
          <ul>
            {more.map((p) => (
              <li key={p.slug} className="border-t border-line last:border-b">
                <Link href={`/work/${p.slug}`} className="group grid items-baseline gap-1 py-5 transition-[padding] md:grid-cols-[1fr_2fr_auto] md:gap-6 md:hover:pl-3">
                  <span className="display text-3xl">{p.name}</span>
                  <span className="text-mute">{p.tagline}</span>
                  <ArrowUpRight size={18} className="hidden text-dim group-hover:text-ink md:block" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
