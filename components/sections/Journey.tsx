"use client";

import { m, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight, Award } from "lucide-react";
import { certifications, timeline } from "@/data/profile";
import { Reveal, SectionHead } from "@/components/ui";

const kindLabel = { education: "Education", publication: "Publication", experience: "Experience", competition: "Competition", certification: "Certification" };

export function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  return (
    <section id="journey" className="hop-section bg-bg-2" aria-labelledby="journey-h">
      <div className="wrap">
        <SectionHead hop="06" title={<span id="journey-h">The route so far</span>} />
        <ol ref={ref} className="relative pl-6 md:pl-0">
          <span className="absolute inset-y-0 left-0 w-px bg-line md:left-[11rem]" aria-hidden="true" />
          <m.span className="absolute inset-y-0 left-0 w-px origin-top bg-blue md:left-[11rem]" style={{ scaleY }} aria-hidden="true" />
          {timeline.map((t, i) => (
            <Reveal as="li" key={t.title} className="relative grid gap-1 py-7 md:grid-cols-[11rem_1fr] md:gap-10">
              <span className={`absolute -left-[3.5px] top-9 h-2 w-2 md:left-[calc(11rem-3.5px)] ${t.highlight ? "bg-blue" : "border border-line-2 bg-bg-2"}`} aria-hidden="true" />
              <p className="mono pr-6 text-[11px] text-mute md:pt-2 md:text-right">{t.when}</p>
              <div className="max-w-3xl md:pl-2">
                <p className="label">{kindLabel[t.kind]}</p>
                <h3 className={`mt-1 font-semibold leading-snug ${t.highlight ? "text-2xl md:text-3xl" : "text-xl"}`}>
                  {t.href ? <a href={t.href} target="_blank" rel="noreferrer" className="inline-flex items-baseline gap-1 underline-offset-4 hover:underline">{t.title}<ArrowUpRight size={15} /></a> : t.title}
                </h3>
                <p className="mt-1 text-mute">{t.org}</p>
                <p className="text-sm text-dim">{t.detail}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-16">
          <h3 className="display mb-6 text-4xl">Certifications</h3>
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {certifications.map((c) => (
              <li key={c.name} className="flex gap-3 bg-bg-2 p-4">
                <Award size={17} className="mt-0.5 shrink-0 text-blue" aria-hidden="true" />
                <span><span className="block leading-snug">{c.name}</span><span className="mono text-[11px] text-dim">{c.by}</span></span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
