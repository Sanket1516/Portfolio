"use client";

import { useEffect, useState } from "react";

// Case-study contents with a scroll-spy: the section nearest the top of the viewport is marked current.
export function Toc({ items }: { items: [string, string][] }) {
  const [active, setActive] = useState(items[0]?.[0]);
  useEffect(() => {
    const els = items.map(([id]) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  return (
    <ul className="sticky top-24 space-y-2 border-l border-line">
      {items.map(([id, label]) => {
        const on = id === active;
        return (
          <li key={id}>
            <a href={`#${id}`} aria-current={on ? "location" : undefined} className={`mono -ml-px block border-l py-0.5 pl-3 text-[11px] transition-colors ${on ? "border-blue text-ink" : "border-transparent text-dim hover:text-ink"}`}>
              {label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
