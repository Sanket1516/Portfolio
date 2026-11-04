import { skills } from "@/data/profile";

// A slow ticker of the real stack between the hero and About. The list is rendered twice so the loop is seamless;
// the copy is hidden from assistive tech, and the whole strip is decorative (the Stack section lists it properly).
export function Ticker() {
  const names = skills.map((s) => s.name);
  const row = (copy: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={copy || undefined}>
      {names.map((n, i) => (
        <li key={n} className={`display flex items-center whitespace-nowrap text-[clamp(2.5rem,6vw,5rem)] leading-none ${i % 2 ? "outline-text" : "text-ink"}`}>
          {n}
          <span className="mx-[0.45em] inline-block h-[0.14em] w-[0.14em] rounded-full bg-blue" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee-host relative overflow-hidden border-y border-line py-6 md:py-8" aria-hidden="true">
      <div className="marquee" style={{ "--dur": `${names.length * 2.6}s` } as React.CSSProperties}>
        {row(false)}
        {row(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
