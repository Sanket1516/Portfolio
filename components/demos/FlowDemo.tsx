"use client";

import { useMemo, useState } from "react";
import { DemoFrame } from "@/components/ui";

const MASK = (1n << 64n) - 1n;

// FiveTupleHash from types.h, assuming a 64-bit size_t and identity std::hash for integers.
function hash(src: number, dst: number, sp: number, dp: number, proto: number) {
  let h = 0n;
  for (const v of [src, dst, sp, dp, proto]) h = (h ^ ((BigInt(v) + 0x9e3779b9n + ((h << 6n) & MASK) + (h >> 2n)) & MASK)) & MASK;
  return h;
}

function route(h: bigint, fixed: boolean) {
  const lb = Number(h % 2n);
  const fp = Number((fixed ? h >> 1n : h) % 2n);
  return { lb, worker: lb * 2 + fp };
}

export default function FlowDemo() {
  const [port, setPort] = useState(54321);
  const [fixed, setFixed] = useState(false);
  const h = hash(0xc0a80164, 0xacd90ece, port, 443, 6);
  const r = route(h, fixed);

  const dist = useMemo(() => {
    const c = [0, 0, 0, 0];
    for (let i = 0; i < 4000; i++) {
      const v = hash(0xc0a80000 + (i * 7919) % 65536, 0xacd90ece, 1024 + (i * 104729) % 60000, 443, 6);
      c[route(v, fixed).worker]++;
    }
    return c;
  }, [fixed]);
  const max = Math.max(...dist);

  return (
    <DemoFrame title="dpi-engine / FiveTupleHash" note="A browser port of the C++ hash and the default 2×2 thread layout, run over 4,000 synthetic flows. The imbalance is a real issue I found in the engine while building this page." accent="rose">
      <label className="label mb-2 block" htmlFor="port-demo">Source port: <span className="text-ink">{port}</span></label>
      <input id="port-demo" type="range" min={1024} max={65535} value={port} onChange={(e) => setPort(+e.target.value)} className="w-full accent-[#ff7d9c]" />
      <p className="mono mt-3 break-all text-[11px] leading-relaxed text-mute">
        192.168.1.100:{port} → 172.217.14.206:443 TCP<br />hash = 0x{h.toString(16)}
      </p>
      <p className="mt-3 text-sm">This flow goes to <span className="text-rose">LB {r.lb}</span>, then <span className="text-rose">worker {r.worker}</span>. Every packet in it follows the same path.</p>

      <div className="mt-5" role="img" aria-label={`Worker load: ${dist.map((d, i) => `worker ${i} ${d} flows`).join(", ")}`}>
        <div className="flex h-28 items-end gap-2">
          {dist.map((d, i) => (
            <div key={i} className="flex h-full flex-1 flex-col justify-end">
              <span className="mono mb-1 text-center text-[10px] text-mute">{d}</span>
              <div className={`transition-all duration-500 ${i === r.worker ? "bg-rose" : "bg-line-2"}`} style={{ height: `${(d / max) * 78}%`, minHeight: 2 }} />
            </div>
          ))}
        </div>
        <div className="mono mt-1.5 flex gap-2 text-[10px] text-dim">{dist.map((_, i) => <span key={i} className="flex-1 text-center">FP {i}</span>)}</div>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-mute">
        <input type="checkbox" checked={fixed} onChange={(e) => setFixed(e.target.checked)} className="mt-1 h-4 w-4 accent-[#ff7d9c]" />
        <span>Apply the fix. Both stages use <code className="mono text-[11px]">hash % 2</code>, so each LB only ever picks one of its workers. Taking the next bit balances them.</span>
      </label>
    </DemoFrame>
  );
}
