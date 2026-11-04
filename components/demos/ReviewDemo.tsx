"use client";

import { useState } from "react";
import { Check, Lock, ShieldAlert } from "lucide-react";
import { DemoFrame } from "@/components/ui";

const fields = [
  { id: "name", label: "Full name", value: "Demo Candidate", source: "marksheet.pdf · p.1", state: "ready" },
  { id: "dob", label: "Date of birth", value: "15/01/2004", source: "certificate.pdf · p.1", state: "sensitive" },
  { id: "pct", label: "Class 12 percentage", value: "88.4", source: "Computed from printed totals", state: "ready" },
  { id: "pwd", label: "Password", value: "", source: "Never collected", state: "blocked" },
] as const;

export default function ReviewDemo() {
  const [ticked, setTicked] = useState<Record<string, boolean>>({ name: true, pct: true });
  const [filled, setFilled] = useState<string[]>([]);
  const toggle = (id: string) => { setFilled([]); setTicked((t) => ({ ...t, [id]: !t[id] })); };

  const fill = () => {
    const chosen = fields.filter((f) => ticked[f.id] && f.state !== "blocked").map((f) => f.id);
    setFilled([]);
    chosen.forEach((id, i) => setTimeout(() => setFilled((f) => [...f, id]), 180 * (i + 1)));
  };

  return (
    <DemoFrame title="smart-form / extension review" note="A sample of the review step with invented data. The real extension fills through the native setter, then re-reads the DOM to verify." accent="green">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="label mb-3">Review</p>
          <ul className="space-y-2">
            {fields.map((f) => (
              <li key={f.id}>
                <label className={`flex gap-3 border border-line p-2.5 ${f.state === "blocked" ? "opacity-70" : "cursor-pointer hover:border-line-2"}`}>
                  {f.state === "blocked" ? <Lock size={15} className="mt-0.5 shrink-0 text-amber" /> : <input type="checkbox" checked={!!ticked[f.id]} onChange={() => toggle(f.id)} className="mt-1 h-4 w-4 shrink-0 accent-[#5cf2a8]" />}
                  <span className="min-w-0">
                    <span className="block text-sm">{f.label}</span>
                    <span className="block truncate text-xs text-dim">{f.source}</span>
                    {f.state === "sensitive" && <span className="mt-1 flex items-center gap-1 text-[11px] text-amber"><ShieldAlert size={11} /> Sensitive: needs an explicit tick</span>}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <button type="button" onClick={fill} className="btn mt-3 w-full justify-center hover:!border-green">Fill ticked fields</button>
        </div>
        <div>
          <p className="label mb-3">The web form</p>
          <div className="space-y-2.5 border border-line bg-bg p-3">
            {fields.map((f) => {
              const on = filled.includes(f.id);
              return (
                <div key={f.id}>
                  <div className="mb-1 text-xs text-mute">{f.label}</div>
                  <div className="flex min-h-9 items-center justify-between border border-line px-2.5 text-sm">
                    <span>{on ? f.value : ""}</span>
                    {on && <Check size={14} className="text-green" aria-label="Verified" />}
                  </div>
                </div>
              );
            })}
            <div className="mono mt-1 border border-dashed border-line-2 py-2 text-center text-[11px] text-dim">Submit stays with you</div>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
