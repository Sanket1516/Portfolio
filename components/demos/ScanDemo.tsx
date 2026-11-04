"use client";

import { useState } from "react";
import { DemoFrame } from "@/components/ui";

const people = [
  { id: "70021", name: "Sample hosteller", kind: "hosteller" },
  { id: "70022", name: "Sample day scholar", kind: "day_scholar" },
  { id: "70023", name: "Sample blocked student", kind: "blocked" },
  { id: "99999", name: "Unknown ID", kind: "unknown" },
] as const;

type Log = { n: number; id: string; result: string; tone: string; detail: string };

// Mirrors the decision order in scanController.js: unknown, blocked, then direction from today's last log.
export default function ScanDemo() {
  const [state, setState] = useState<Record<string, "entered" | "exited">>({});
  const [late, setLate] = useState(false);
  const [log, setLog] = useState<Log[]>([]);

  const scan = (p: (typeof people)[number]) => {
    let result: string, tone: string, detail: string;
    if (p.kind === "unknown") {
      result = "UNAUTHORIZED"; tone = "text-rose"; detail = "No active student. Logged and broadcast to dashboards.";
    } else if (p.kind === "blocked") {
      result = "DENIED"; tone = "text-rose"; detail = "Software deny is immediate, even before a terminal processes the delete.";
    } else {
      const last = state[p.id];
      const next = last === "entered" ? "exited" : "entered";
      result = !last ? "ENTRY" : last === "entered" ? "EXIT" : "RE-ENTRY";
      tone = next === "entered" ? "text-green" : "text-blue";
      const flagged = p.kind === "hosteller" && late;
      detail = `${flagged ? "Past curfew: lateReturn flagged. " : ""}Socket event sent, parent alert queued without blocking the scan.`;
      setState((s) => ({ ...s, [p.id]: next }));
    }
    setLog((l) => [{ n: Date.now(), id: p.id, result, tone, detail }, ...l].slice(0, 4));
  };

  return (
    <DemoFrame title="smart-campus / POST /api/scan" note="A simulation of the scan decision logic with sample IDs. It does not touch a real system." accent="blue">
      <div className="grid grid-cols-2 gap-2">
        {people.map((p) => (
          <button key={p.id} type="button" onClick={() => scan(p)} className="border border-line-2 bg-bg p-3 text-left transition-colors hover:border-blue">
            <span className="mono block text-sm">{p.id}</span>
            <span className="block text-xs text-mute">{p.name}</span>
          </button>
        ))}
      </div>
      <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-mute">
        <input type="checkbox" checked={late} onChange={(e) => setLate(e.target.checked)} className="h-4 w-4 accent-[#5a97ff]" />
        It is past the 22:00 curfew
      </label>
      <ol className="mt-4 min-h-[12.5rem] space-y-px bg-line" aria-live="polite">
        {log.length === 0 && <li className="bg-bg-2 py-3 text-sm text-dim">Scan an ID. Scan the same one again to watch it toggle.</li>}
        {log.map((l) => (
          <li key={l.n} className="bg-bg-2 py-2.5">
            <div className="mono flex justify-between gap-3 text-xs"><span className={l.tone}>{l.result}</span><span className="text-dim">{l.id}</span></div>
            <p className="mt-1 text-xs leading-relaxed text-mute">{l.detail}</p>
          </li>
        ))}
      </ol>
    </DemoFrame>
  );
}
