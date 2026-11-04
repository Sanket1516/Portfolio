"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { site } from "@/lib/site";
import { Magnetic } from "@/components/ui";
import type { Day } from "@/components/Skyline";

const Skyline = dynamic(() => import("@/components/Skyline"), { ssr: false });

const script = [
  { cmd: "whoami", out: "Software Engineer" },
  { cmd: "cat skills.txt", out: "Full Stack | Cloud | DevOps | AI" },
  { cmd: "system.status", out: "Building something meaningful..." },
];

function HeroTerminal() {
  const [lines, setLines] = useState<{ cmd: string; out?: string }[]>([]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLines(script);
      setDone(true);
      return;
    }
    let dead = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await wait(1300);
      for (let i = 0; i < script.length; i++) {
        for (let c = 1; c <= script[i].cmd.length; c++) {
          if (dead) return;
          setLines((l) => [...l.slice(0, i), { cmd: script[i].cmd.slice(0, c) }]);
          await wait(38);
        }
        await wait(220);
        if (dead) return;
        setLines((l) => [...l.slice(0, i), script[i]]);
        await wait(420);
      }
      setDone(true);
    })();
    return () => { dead = true; };
  }, []);
  return (
    <div className="glass ticks mono min-h-[11.5rem] border border-line p-4 text-[11px] leading-[1.75]" aria-label="Terminal introduction" role="img">
      {lines.map((l, i) => (
        <div key={i} className="mb-1">
          <div><span className="text-blue">$ </span>{l.cmd}</div>
          {l.out && <div className="text-mute">{l.out}</div>}
        </div>
      ))}
      {done && <span className="text-blue">$ </span>}
      <span className="caret" />
    </div>
  );
}

export function Hero({ days, total }: { days: Day[]; total: number }) {
  const host = useRef<HTMLElement>(null);
  return (
    <section ref={host} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden" aria-label="Introduction">
      <div className="absolute inset-0"><Skyline days={days} hostRef={host} /></div>
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to bottom, rgb(6 7 11 / .55), rgb(6 7 11 / 0) 42%, rgb(6 7 11 / 0) 60%, rgb(6 7 11 / .94) 90%, #06070b)" }} aria-hidden="true" />

      <div className="wrap pointer-events-none relative flex flex-1 flex-col pt-20 pb-6 lg:pt-24">
        <div className="pointer-events-auto mb-5 flex items-center gap-2.5 self-start">
          <span className="led" aria-hidden="true" />
          <p className="mono text-[11px] text-mute">{site.status} · {site.statusDetail}</p>
        </div>

        <h1 className="display text-[29vw] leading-[0.84] sm:text-[24vw] lg:whitespace-nowrap lg:text-[min(16.6vw,38vh)]">
          Sanket <br className="lg:hidden" />Mali
        </h1>

        <div className="mt-auto grid items-end gap-8 pt-10 lg:grid-cols-12">
          <div className="pointer-events-auto lg:col-span-7 xl:col-span-6">
            <p className="mono mb-4 text-[11px] leading-relaxed text-blue">{site.headline.join("  |  ")}</p>
            <p className="max-w-xl text-lg leading-snug sm:text-xl">
              I build full-stack systems, deploy them on AWS, and write down how they fail.
              Final-year Computer Science at NMIMS MPSTME.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Magnetic><a href="#work" className="btn btn-solid">Explore my work <ArrowDown size={14} /></a></Magnetic>
              <Magnetic><a href={site.resume} download="Sanket_Mali_Resume.pdf" className="btn glass">Resume <Download size={14} /></a></Magnetic>
              <Magnetic><a href={site.linkedin} target="_blank" rel="noreferrer" className="btn glass">LinkedIn <ArrowUpRight size={14} /></a></Magnetic>
            </div>
          </div>
          <div className="pointer-events-auto hidden md:block lg:col-span-4 lg:col-start-9 xl:col-span-3 xl:col-start-10">
            <HeroTerminal />
          </div>
        </div>

        <p className="mono mt-6 max-w-md text-[10px] leading-relaxed text-dim">
          The skyline is real: {total} GitHub contributions, one tower per day. <Link href="/work/site" className="pointer-events-auto underline underline-offset-2 hover:text-ink">How it works</Link>
        </p>
      </div>
    </section>
  );
}
