"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export const toggleDevMode = () => dispatchEvent(new Event("devmode:toggle"));

type Stats = { fps: number; dom: number; ttfb: number; dcl: number; load: number; heap: number | null; gpu: string };

// Everything here is measured in your browser right now. Nothing is a mocked number.
export function DevMode() {
  const [on, setOn] = useState(false);
  const [s, setS] = useState<Stats | null>(null);

  useEffect(() => {
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      i = e.key === KONAMI[i] ? i + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (i === KONAMI.length) { i = 0; setOn((v) => !v); }
    };
    const onToggle = () => setOn((v) => !v);
    addEventListener("keydown", onKey);
    addEventListener("devmode:toggle", onToggle);
    return () => { removeEventListener("keydown", onKey); removeEventListener("devmode:toggle", onToggle); };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("devmode", on);
    if (!on) return;
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    let gpu = "unavailable";
    try {
      const gl = document.createElement("canvas").getContext("webgl2");
      const ext = gl?.getExtension("WEBGL_debug_renderer_info");
      if (gl && ext) gpu = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)).replace(/^ANGLE \(|\)$/g, "");
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {}
    let raf = 0, frames = 0, last = performance.now();
    const loop = (now: number) => {
      frames++;
      if (now - last >= 500) {
        const mem = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
        setS({
          fps: Math.round((frames * 1000) / (now - last)),
          dom: document.getElementsByTagName("*").length,
          ttfb: Math.round(nav?.responseStart ?? 0),
          dcl: Math.round(nav?.domContentLoadedEventEnd ?? 0),
          load: Math.round(nav?.loadEventEnd ?? 0),
          heap: mem ? Math.round(mem.usedJSHeapSize / 1048576) : null,
          gpu,
        });
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [on]);

  if (!on) return null;
  const rows: [string, string][] = s
    ? [["FPS", String(s.fps)], ["DOM nodes", String(s.dom)], ["TTFB", `${s.ttfb} ms`], ["DOM ready", `${s.dcl} ms`], ["Load", `${s.load} ms`], ["JS heap", s.heap === null ? "n/a" : `${s.heap} MB`], ["GPU", s.gpu]]
    : [];
  return (
    <aside aria-label="Developer mode" className="glass mono fixed bottom-5 left-5 z-[75] w-[min(19rem,calc(100vw-2.5rem))] border border-green/50 p-4 text-[11px]">
      <div className="mb-3 flex items-center justify-between text-green">
        <span>DEVELOPER MODE</span>
        <button type="button" onClick={() => setOn(false)} aria-label="Close developer mode" className="-m-2 p-2 text-mute hover:text-ink"><X size={14} /></button>
      </div>
      <dl className="space-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-dim">{k}</dt>
            <dd className="truncate text-right">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 border-t border-line pt-3 leading-relaxed text-dim">Measured live in your browser. Section outlines are on.</p>
    </aside>
  );
}
