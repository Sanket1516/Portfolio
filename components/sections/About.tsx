"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { interests, principles } from "@/data/profile";
import { Counter, Reveal, SectionHead } from "@/components/ui";

const statement = "I care about the part after the demo works. What happens when the terminal is offline, when the model is wrong, when a test fails at midnight. That is where the engineering is.";

function ScrollText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [lit, setLit] = useState(0);
  const words = text.split(" ");
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setLit(words.length);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const p = (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.4);
        setLit(Math.round(Math.max(0, Math.min(1, p)) * words.length));
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => { removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [words.length]);
  return (
    <p ref={ref} className="text-[clamp(1.75rem,4.4vw,3.5rem)] font-medium leading-[1.14] tracking-tight">
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="transition-colors duration-300" style={{ color: i < lit ? "var(--color-ink)" : "rgb(255 255 255 / .36)" }}>{w} </span>
      ))}
    </p>
  );
}

export function About({ stats }: { stats: { value: number; suffix?: string; label: string }[] }) {
  return (
    <section id="about" className="hop-section" aria-labelledby="about-h">
      <div className="wrap">
        <SectionHead hop="01" title="Whoami" titleId="about-h" />
        <div className="max-w-5xl"><ScrollText text={statement} /></div>

        <dl className="mt-20 grid grid-cols-2 border-t border-l border-line md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 70} className="spot border-r border-b border-line p-5 md:p-7">
              <dd className="display text-[clamp(3.25rem,7vw,6rem)]"><Counter value={s.value} suffix={s.suffix} /></dd>
              <dt className="mt-2 text-sm text-mute">{s.label}</dt>
            </Reveal>
          ))}
        </dl>

        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <h3 className="display text-4xl">Rules I build by</h3>
              <p className="mt-4 text-mute">Not slogans. Each one is a decision you can find in the code.</p>
              <p className="label mt-10">Drawn to</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {interests.map((t) => <li key={t} className="border border-line px-2.5 py-1 text-sm text-mute">{t}</li>)}
              </ul>
            </Reveal>
          </div>
          <ol className="lg:col-span-8">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.rule} delay={i * 60} className="border-t border-line last:border-b">
                <Link href={`/work/${p.slug}`} className="spot group grid gap-2 px-2 py-6 transition-[padding] duration-300 sm:grid-cols-[3rem_1fr_auto] sm:gap-4 sm:hover:pl-4">
                  <span className="mono text-[11px] text-blue">0{i + 1}</span>
                  <span>
                    <span className="block text-xl font-semibold">{p.rule}</span>
                    <span className="mt-1 block text-mute">{p.proof}</span>
                  </span>
                  <ArrowUpRight size={18} className="hidden text-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink sm:block" />
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
