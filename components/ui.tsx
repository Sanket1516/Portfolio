"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { accentClass } from "@/lib/accent";

export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "section" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        // Also reveal anything already scrolled past (deep links, restored scroll), or it stays hidden above the fold.
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const props = { ref: ref as never, className: `reveal ${className}`, style: { "--d": `${delay}ms` } as React.CSSProperties };
  return <Tag {...props}>{children}</Tag>;
}

export function Magnetic({ children, strength = 0.28, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <span ref={ref} onPointerMove={onMove} onPointerLeave={reset} className={`inline-block transition-transform duration-200 ease-out ${className}`}>
      {children}
    </span>
  );
}

export function SectionHead({ hop, title, intro }: { hop: string; title: ReactNode; intro?: ReactNode }) {
  return (
    <header className="mb-12 md:mb-20">
      <Reveal>
        <p className="label mb-5"><span className="text-blue">HOP {hop}</span></p>
        <h2 className="display h-section">{title}</h2>
        {intro && <p className="mt-6 max-w-2xl text-lg text-mute">{intro}</p>}
      </Reveal>
    </header>
  );
}

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown(0);
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 1100);
        setShown(Math.round((1 - (1 - p) ** 3) * value));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return <span ref={ref} className="tabular-nums">{shown}{suffix}</span>;
}


export function DemoFrame({ title, note, children, accent = "blue" }: { title: string; note: string; children: ReactNode; accent?: string }) {
  return (
    <figure className="ticks border border-line bg-bg-2">
      <figcaption className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-2 w-2 rounded-full bg-line-2" /><i className="h-2 w-2 rounded-full bg-line-2" /><i className={`h-2 w-2 rounded-full ${accentClass[accent].bg}`} />
        </span>
        <span className="mono ml-2 truncate text-[11px] text-mute">{title}</span>
        <span className={`label ml-auto shrink-0 ${accentClass[accent].text}`}>Live demo</span>
      </figcaption>
      <div className="p-4 sm:p-6">{children}</div>
      <p className="border-t border-line px-4 py-3 text-xs leading-relaxed text-dim sm:px-6">{note}</p>
    </figure>
  );
}
