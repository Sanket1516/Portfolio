"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { ArchNode, ArchView, NodeKind } from "@/data/projects";

const W = 960, NW = 170, NH = 62;

const kindStyle: Record<NodeKind, { stroke: string; label: string }> = {
  client: { stroke: "#5a97ff", label: "Client" },
  service: { stroke: "#eceff7", label: "Service" },
  data: { stroke: "#a184ff", label: "Data" },
  external: { stroke: "#ffb65c", label: "External" },
  ops: { stroke: "#5cf2a8", label: "Infrastructure" },
};

function edgePath(a: ArchNode, b: ArchNode) {
  const ac = a.x + NW / 2, bc = b.x + NW / 2;
  if (Math.abs(ac - bc) < NW * 0.6) {
    const down = b.y > a.y;
    const y1 = down ? a.y + NH : a.y, y2 = down ? b.y : b.y + NH;
    const my = (y1 + y2) / 2;
    return `M${ac} ${y1} C${ac} ${my} ${bc} ${my} ${bc} ${y2}`;
  }
  const right = bc > ac;
  const x1 = right ? a.x + NW : a.x, x2 = right ? b.x : b.x + NW;
  const y1 = a.y + NH / 2, y2 = b.y + NH / 2;
  const mx = (x1 + x2) / 2;
  return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
}

export function ArchDiagram({ views, accent = "#5a97ff" }: { views: ArchView[]; accent?: string }) {
  const [viewIdx, setViewIdx] = useState(0);
  const view = views[Math.min(viewIdx, views.length - 1)];
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const nodes = useMemo(() => Object.fromEntries(view.nodes.map((n) => [n.id, n])), [view]);

  useEffect(() => { setSelected(null); setStep(-1); setPlaying(false); }, [viewIdx, views]);

  const steps = view.trace?.steps ?? [];
  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length - 1) { setPlaying(false); return; }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setTimeout(() => setStep((s) => s + 1), step < 0 ? 0 : reduced ? 3000 : 2100);
    return () => clearTimeout(id);
  }, [playing, step, steps.length]);

  const currentId = step >= 0 ? steps[step]?.node : selected;
  const current = currentId ? nodes[currentId] : null;
  const prev = step > 0 ? nodes[steps[step - 1].node] : null;
  const packetPath = prev && current && step >= 0 ? edgePath(prev, current) : null;

  const isLinked = (from: string, to: string) => selected === from || selected === to;

  const play = () => {
    if (playing) return setPlaying(false);
    if (step >= steps.length - 1) setStep(-1);
    setSelected(null);
    setPlaying(true);
  };

  return (
    <div className="grid-bg ticks border border-line bg-bg-2">
      <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
        <div role="tablist" aria-label="Architecture views" className="flex flex-wrap gap-1">
          {views.map((v, i) => (
            <button key={v.id} role="tab" aria-selected={i === viewIdx} type="button" onClick={() => setViewIdx(i)} className={`mono px-3 py-2 text-[11px] transition-colors ${i === viewIdx ? "bg-ink text-bg" : "text-mute hover:text-ink"}`}>
              {v.title}
            </button>
          ))}
        </div>
        {view.trace && (
          <button type="button" onClick={play} className="btn ml-auto !min-h-9 !py-1.5" style={{ borderColor: accent }}>
            {playing ? <Pause size={13} /> : <Play size={13} />} {view.trace.title}
          </button>
        )}
      </div>

      <p className="px-4 pt-4 text-sm text-mute">{view.caption}</p>

      {/* Desktop: a real diagram */}
      <div className="hidden p-4 md:block">
        <svg viewBox={`0 0 ${W} ${view.height}`} className="h-auto w-full" role="group" aria-label={`${view.title} diagram`}>
          {view.edges.map(([from, to, label]) => {
            const a = nodes[from], b = nodes[to];
            if (!a || !b) return null;
            const d = edgePath(a, b);
            const lit = isLinked(from, to);
            return (
              <g key={`${from}-${to}`}>
                <path d={d} fill="none" stroke={lit ? accent : "rgb(255 255 255 / .2)"} strokeWidth={lit ? 1.6 : 1} className="flow-line" />
                {label && (
                  <text x={(a.x + b.x + NW) / 2} y={(a.y + b.y + NH) / 2 - 7} textAnchor="middle" className="mono" fontSize="10" fill="#a4adc2">{label}</text>
                )}
              </g>
            );
          })}
          {packetPath && (
            <circle key={step} r="5" fill={accent} style={{ filter: `drop-shadow(0 0 6px ${accent})` }}>
              <animateMotion dur="0.8s" fill="freeze" path={packetPath} />
            </circle>
          )}
          {view.nodes.map((n) => {
            const on = n.id === currentId;
            const st = kindStyle[n.kind];
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-label={`${n.label}. ${n.detail}`}
                aria-pressed={on}
                onClick={() => { setPlaying(false); setStep(-1); setSelected(on ? null : n.id); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setStep(-1); setSelected(on ? null : n.id); } }}
                className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[3]"
              >
                <rect x={n.x} y={n.y} width={NW} height={NH} fill={on ? accent : "#0f121b"} fillOpacity={on ? 0.2 : 1} stroke={on ? accent : st.stroke} strokeOpacity={on ? 1 : 0.42} strokeWidth={on ? 1.6 : 1} />
                <rect x={n.x} y={n.y} width="3" height={NH} fill={st.stroke} />
                <text x={n.x + 14} y={n.y + 26} fontSize="14" fontWeight="600" fill="#eceff7" fontFamily="var(--font-sans)">{n.label}</text>
                {n.sub && <text x={n.x + 14} y={n.y + 45} fontSize="9.5" fill="#a4adc2" className="mono">{n.sub}</text>}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Phone: the same data as a readable flow, not a shrunken diagram */}
      <ol className="space-y-2 p-4 md:hidden">
        {view.nodes.map((n) => {
          const on = n.id === currentId;
          return (
            <li key={n.id}>
              <button type="button" aria-expanded={on} onClick={() => { setPlaying(false); setStep(-1); setSelected(on ? null : n.id); }} className="w-full border bg-bg-3/70 p-3 text-left transition-colors" style={{ borderColor: on ? accent : "var(--color-line)" }}>
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{n.label}</span>
                  <span className="mono text-[10px] text-mute">{n.sub}</span>
                </span>
                {on && <span className="mt-2 block text-sm text-mute">{n.detail}</span>}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="min-h-[7.5rem] border-t border-line p-4" aria-live="polite">
        {step >= 0 && steps[step] ? (
          <>
            <p className="label mb-2" style={{ color: accent }}>Step {step + 1} of {steps.length} · {current?.label}</p>
            <p className="max-w-3xl">{steps[step].text}</p>
          </>
        ) : current ? (
          <>
            <p className="label mb-2" style={{ color: kindStyle[current.kind].stroke }}>{kindStyle[current.kind].label} · {current.label}</p>
            <p className="max-w-3xl">{current.detail}</p>
            {current.evidence && <p className="mono mt-2 text-[11px] text-dim">{current.evidence}</p>}
          </>
        ) : (
          <p className="text-mute">Select any component to see what it does{view.trace ? ", or follow the trace above." : "."}</p>
        )}
      </div>
    </div>
  );
}
