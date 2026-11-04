"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import { ArchDiagram } from "@/components/ArchDiagram";
import { Reveal, SectionHead } from "@/components/ui";
import { accentClass } from "@/lib/accent";

const order = ["smart-campus", "smart-form", "vaakya", "passguard", "dpi-engine", "metromind"];
const list = order.map((s) => projects.find((p) => p.slug === s)!);

export function Systems() {
  const [slug, setSlug] = useState(order[0]);
  const p = list.find((x) => x.slug === slug)!;
  return (
    <section id="systems" className="hop-section bg-bg-2" aria-labelledby="systems-h">
      <div className="wrap">
        <SectionHead hop="04" title="Trace a request" titleId="systems-h" intro="Pick a system and follow a real flow through it, or select any component to see what it does and where it lives in the code." />
        <Reveal>
          <div role="tablist" aria-label="Systems" className="scrollbar-thin -mx-5 mb-4 flex gap-1 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
            {list.map((x) => (
              <button key={x.slug} role="tab" aria-selected={x.slug === slug} type="button" onClick={() => setSlug(x.slug)} className={`shrink-0 border-b-2 px-3 py-2.5 text-sm transition-colors ${x.slug === slug ? `${accentClass[x.accent].border} text-ink` : "border-transparent text-mute hover:text-ink"}`}>
                {x.name}
              </button>
            ))}
          </div>
          <ArchDiagram key={slug} views={p.architecture} accent={accentClass[p.accent].hex} />
        </Reveal>
      </div>
    </section>
  );
}
