"use client";

import { useMemo, useState } from "react";
import { DemoFrame } from "@/components/ui";

// Ported from PassGuard's analysis_service.py and cracktime_service.py.
const WALKS = ["qwerty", "asdf", "zxcv", "qazwsx", "1qaz", "2wsx", "qwert", "asdfg", "zxcvb", "poiuy", "lkjhg", "mnbvc"];
const SEQ = ["abc", "bcd", "cde", "def", "efg", "fgh", "ghi", "hij", "ijk", "jkl", "klm", "lmn", "mno", "nop", "opq", "pqr", "qrs", "rst", "stu", "tuv", "uvw", "vwx", "wxy", "xyz", "012", "123", "234", "345", "456", "567", "678", "789", "890"];
const COMMON = ["password", "admin", "login", "welcome", "master", "letmein", "dragon", "monkey", "shadow", "sunshine", "princess", "football", "baseball", "soccer", "hockey", "batman", "trustno1", "iloveyou", "qwerty", "abc123", "111111", "123456", "password1"];
const UNLEET: Record<string, string> = { "@": "a", "3": "e", "1": "l", "0": "o", $: "s", "7": "t" };
const RATES = [["CPU", 1e6], ["GPU", 1e9], ["GPU cluster", 1e11]] as const;
const LABELS = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

function detect(pw: string) {
  const out: string[] = [];
  const lower = pw.toLowerCase();
  const walk = WALKS.find((w) => lower.includes(w));
  if (walk) out.push(`Keyboard walk: ${walk}`);
  if (SEQ.some((s) => lower.includes(s))) out.push("Sequential characters");
  if (/(.)\1{2,}/.test(pw)) out.push("Repeated characters");
  if (/\d{2}[/-]\d{2}[/-]\d{2,4}/.test(pw) || /^(19|20)\d{6}$/.test(pw)) out.push("Date-like pattern");
  const base = [...lower].map((c) => UNLEET[c] ?? c).join("").replace(/\d+$/, "");
  if (COMMON.includes(base) && base !== lower) out.push("Leet speak of a common word");
  if (COMMON.includes(lower)) out.push("Commonly used password");
  return out;
}

function duration(s: number) {
  const y = 86400 * 365;
  if (!isFinite(s)) return "Beyond a trillion years";
  if (s < 0.001) return "Instant";
  if (s < 1) return `${(s * 1000).toFixed(1)} ms`;
  if (s < 60) return `${s.toFixed(1)} seconds`;
  if (s < 3600) return `${(s / 60).toFixed(1)} minutes`;
  if (s < 86400) return `${(s / 3600).toFixed(1)} hours`;
  if (s < y) return `${(s / 86400).toFixed(1)} days`;
  if (s < y * 1e3) return `${(s / y).toFixed(1)} years`;
  if (s < y * 1e6) return `${(s / (y * 1e3)).toFixed(1)} thousand years`;
  if (s < y * 1e9) return `${(s / (y * 1e6)).toFixed(1)} million years`;
  if (s < y * 1e12) return `${(s / (y * 1e9)).toFixed(1)} billion years`;
  return `${(s / (y * 1e12)).toFixed(1)} trillion years`;
}

export default function EntropyDemo() {
  const [pw, setPw] = useState("Pa$$w0rd");
  const r = useMemo(() => {
    const n = (/[a-z]/.test(pw) ? 26 : 0) + (/[A-Z]/.test(pw) ? 26 : 0) + (/\d/.test(pw) ? 10 : 0) + (/[^a-zA-Z0-9]/.test(pw) ? 33 : 0);
    const bits = pw.length && n ? pw.length * Math.log2(n) : 0;
    const patterns = pw ? detect(pw) : [];
    const score = Math.max(0, Math.round(Math.min(100, bits * 1.2) - patterns.length * 10));
    return { n, bits, patterns, score, label: LABELS[Math.min(4, Math.floor(score / 20))] };
  }, [pw]);
  const color = r.score < 40 ? "var(--color-rose)" : r.score < 60 ? "var(--color-amber)" : "var(--color-green)";

  return (
    <DemoFrame title="passguard / analysis_service" note="Runs entirely in your browser with the same formulas as PassGuard. Nothing you type is stored or sent. Please still use a made-up password." accent="amber">
      <label className="label mb-2 block" htmlFor="pw-demo">Try a password</label>
      <input id="pw-demo" value={pw} onChange={(e) => setPw(e.target.value.slice(0, 64))} autoComplete="off" spellCheck={false} className="mono w-full border border-line-2 bg-bg px-4 py-3 text-base outline-none focus:border-amber" />
      <div className="mt-5 grid grid-cols-3 gap-px bg-line">
        {[["Length L", pw.length], ["Charset N", r.n], ["Entropy H", `${r.bits.toFixed(1)} bits`]].map(([k, v]) => (
          <div key={k} className="bg-bg-2 py-3 pr-2 sm:px-3">
            <div className="label">{k}</div>
            <div className="display mt-1 text-3xl tabular-nums">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <div className="mb-1.5 flex justify-between text-sm"><span style={{ color }}>{r.label}</span><span className="mono text-xs text-mute">{r.score} / 100</span></div>
        <div className="h-1 bg-line"><div className="h-full transition-[width] duration-300" style={{ width: `${r.score}%`, background: color }} /></div>
      </div>
      <ul className="mt-4 min-h-[3.25rem] space-y-1 text-sm">
        {r.patterns.length ? r.patterns.map((p) => <li key={p} className="text-rose">− 10 · {p}</li>) : <li className="text-dim">No exploitable patterns detected</li>}
      </ul>
      <table className="mt-4 w-full border-t border-line text-sm">
        <caption className="sr-only">Average time to crack</caption>
        <tbody>
          {RATES.map(([k, rate]) => (
            <tr key={k} className="border-b border-line">
              <th scope="row" className="py-2 text-left font-normal text-mute">{k}</th>
              <td className="py-2 text-right tabular-nums">{duration(2 ** (r.bits - 1) / rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DemoFrame>
  );
}
