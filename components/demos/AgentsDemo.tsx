"use client";

import Image from "next/image";
import { useState } from "react";
import { DemoFrame } from "@/components/ui";

const flows = [
  { agent: "Educator", ask: "Ask a question", img: "ask", steps: ["User asks a financial question", "Educator agent activated", "Guidance delivered in simple language", "Learning progress updated"] },
  { agent: "Strategy Builder", ask: "Set a goal", img: "goals", steps: ["User creates a financial goal", "Strategy Builder activated", "Personalised plan generated", "Goal progress tracked"] },
  { agent: "Sentinel", ask: "Check a message", img: "scam", steps: ["User uploads a suspicious message", "Sentinel agent activated", "Scam risk analysis performed", "Safety recommendation delivered"] },
  { agent: "Connector", ask: "Find schemes", img: "schemes", steps: ["User requests government schemes", "Connector agent activated", "Eligible schemes identified", "Application guidance provided"] },
];

export default function AgentsDemo() {
  const [i, setI] = useState(2);
  const f = flows[i];
  return (
    <DemoFrame title="vaakya / agent flows" note="A walkthrough of the submitted design, using the actual screens designed for it. It is not a running product." accent="violet">
      <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
        <div>
          <div role="tablist" aria-label="Agent flows" className="grid grid-cols-2 gap-1.5">
            {flows.map((x, n) => (
              <button key={x.agent} role="tab" aria-selected={n === i} type="button" onClick={() => setI(n)} className={`border p-2.5 text-left transition-colors ${n === i ? "border-violet bg-violet/10" : "border-line hover:border-line-2"}`}>
                <span className="block text-sm">{x.ask}</span>
                <span className="mono block text-[10px] text-mute">{x.agent}</span>
              </button>
            ))}
          </div>
          <ol className="mt-5 space-y-3 border-l border-line-2 pl-4">
            {f.steps.map((s, n) => (
              <li key={s} className="relative text-sm">
                <i className="absolute -left-[20.5px] top-[7px] h-2 w-2 rounded-full bg-violet" aria-hidden="true" />
                <span className={n === 1 ? "text-violet" : ""}>{s}</span>
              </li>
            ))}
            <li className="relative text-sm text-mute">
              <i className="absolute -left-[20.5px] top-[7px] h-2 w-2 rounded-full bg-green" aria-hidden="true" />
              Financial Confidence Score updated
            </li>
          </ol>
        </div>
        <Image key={f.img} src={`/work/vaakya/${f.img}.webp`} alt={`VAAKYA ${f.agent} mobile screen`} width={440} height={940} sizes="190px" className="mx-auto h-auto w-[170px] rounded-[1.4rem] sm:w-[190px]" />
      </div>
    </DemoFrame>
  );
}
