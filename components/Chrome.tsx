"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domMax, m, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { sections, site } from "@/lib/site";
import { Magnetic } from "@/components/ui";
import { DevMode } from "@/components/DevMode";

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    if (!enabled) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    const hero = document.getElementById("top");
    if (hero) io.observe(hero);
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

function Spine({ active }: { active: string }) {
  const { scrollYProgress } = useScroll();
  const y = useSpring(scrollYProgress, { stiffness: 220, damping: 40 });
  return (
    <div className="fixed inset-y-0 left-10 z-40 hidden w-px bg-line xl:block" aria-hidden="true">
      <m.div className="absolute inset-x-0 top-0 h-full origin-top bg-blue/60" style={{ scaleY: y }} />
      {sections.map((s, i) => {
        const on = s.id === active;
        return (
          <span key={s.id} className="absolute -left-[3px] flex items-center" style={{ top: `${((i + 1) / (sections.length + 1)) * 100}%` }}>
            <i className={`block h-[7px] w-[7px] border transition-colors ${on ? "border-blue bg-blue" : "border-line-2 bg-bg"}`} />
            <span className={`mono ml-3 text-[10px] transition-opacity ${on ? "text-ink opacity-100" : "opacity-0"}`}>{s.hop}</span>
          </span>
        );
      })}
      <m.span
        className="absolute -left-[4px] h-[9px] w-[9px] rounded-full bg-ink"
        style={{ top: useTop(y), boxShadow: "0 0 14px 2px #5a97ff" }}
      />
    </div>
  );
}

import { useTransform, type MotionValue } from "motion/react";
function useTop(v: MotionValue<number>) {
  return useTransform(v, (n) => `${n * 100}%`);
}

function DesktopNav({ active, onHome }: { active: string; onHome: boolean }) {
  return (
    <header className="fixed inset-x-0 top-4 z-50 hidden justify-center px-4 lg:flex">
      <nav aria-label="Primary" className="glass flex items-center gap-1 border border-line px-2 py-1.5">
        <Link href="/#top" className="display px-3 text-xl leading-none" aria-label="SM, Sanket Mali, home">SM</Link>
        <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />
        {sections.map((s) => {
          const on = active === s.id;
          return (
            <Magnetic key={s.id} strength={0.18}>
              <a href={onHome ? `#${s.id}` : `/#${s.id}`} aria-current={on ? "true" : undefined} className={`mono relative block px-3 py-2 text-[11px] transition-colors ${on ? "text-bg" : "text-mute hover:text-ink"}`}>
                {on && <m.span layoutId="nav-active" className="absolute inset-0 bg-ink" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                <span className="relative">{s.label}</span>
              </a>
            </Magnetic>
          );
        })}
        <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />
        <Link href="/resume" className="mono px-3 py-2 text-[11px] text-blue hover:text-ink">Resume</Link>
      </nav>
    </header>
  );
}

function MobileNav({ onHome }: { onHome: boolean }) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <Link href="/#top" className="glass display fixed left-4 top-4 z-50 border border-line px-3 py-1.5 text-xl leading-none" style={{ marginTop: "env(safe-area-inset-top)" }} aria-label="SM, Sanket Mali, home">SM</Link>
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="glass fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center border border-line-2"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <span className="relative block h-3 w-6" aria-hidden="true">
          <i className={`absolute left-0 h-px w-6 bg-ink transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
          <i className={`absolute left-0 h-px bg-ink transition-all duration-300 ${open ? "top-1.5 w-6 -rotate-45" : "top-3 w-4"}`} />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <m.nav
            id="mobile-menu"
            aria-label="Primary"
            initial={{ clipPath: "circle(0% at calc(100% - 3rem) calc(100% - 3rem))" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3rem) calc(100% - 3rem))" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3rem) calc(100% - 3rem))" }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}
            className="grid-bg fixed inset-0 z-50 flex flex-col justify-center overflow-y-auto bg-bg px-6 py-20"
          >
            <ul>
              {sections.map((s, i) => (
                <li key={s.id} className="border-b border-line">
                  <m.a
                    href={onHome ? `#${s.id}` : `/#${s.id}`}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.035 }}
                    className="flex items-baseline gap-4 py-2.5"
                  >
                    <span className="mono text-[11px] text-blue">{s.hop}</span>
                    <span className="display text-4xl">{s.label}</span>
                  </m.a>
                </li>
              ))}
            </ul>
            <Link href="/resume" onClick={() => setOpen(false)} className="mono mt-8 text-sm text-blue">Resume →</Link>
          </m.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

function CursorRing() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0, idle = true;
    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.translate = `${x}px ${y}px`;
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.3) raf = requestAnimationFrame(loop);
      else idle = true;
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      el.style.opacity = "1";
      const hit = (e.target as Element)?.closest?.("a,button,input,textarea,select,[role=button]");
      el.dataset.hot = hit ? "1" : "";
      if (idle) { idle = false; raf = requestAnimationFrame(loop); }
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => { removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className="group pointer-events-none fixed left-0 top-0 z-[80] opacity-0">
      <span className="block h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue/70 transition-[transform,background] duration-200 group-data-[hot='1']:scale-[1.7] group-data-[hot='1']:bg-blue/15" />
    </div>
  );
}

export function Chrome() {
  const path = usePathname();
  const onHome = path === "/";
  const active = useActiveSection(onHome);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    console.log("%cSANKET.SYS", "font:800 28px sans-serif;color:#5a97ff", "\nCurious how this works? Type devmode in the shell, or try the Konami code.\n" + site.github);
  }, []);

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <m.div className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-blue xl:hidden" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
        {onHome && <Spine active={active} />}
        <DesktopNav active={active} onHome={onHome} />
        <MobileNav onHome={onHome} />
        <CursorRing />
        <DevMode />
      </MotionConfig>
    </LazyMotion>
  );
}
