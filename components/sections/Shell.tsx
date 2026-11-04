"use client";

import { useEffect, useRef, useState } from "react";
import { certifications, skillGroups, skills, timeline } from "@/data/profile";
import { projects } from "@/data/projects";
import { sections, site } from "@/lib/site";
import { toggleDevMode } from "@/components/DevMode";
import { Reveal, SectionHead } from "@/components/ui";

type Line = { kind: "in" | "out" | "err"; text: string; href?: string };

const out = (...t: string[]): Line[] => t.map((text) => ({ kind: "out", text }));
const link = (text: string, href: string): Line => ({ kind: "out", text, href });
const COMMANDS = ["help", "about", "skills", "projects", "project", "education", "certs", "contact", "github", "linkedin", "resume", "whoami", "ls", "open", "history", "date", "devmode", "clear", "sudo"];

function run(raw: string, history: string[]): Line[] | "clear" {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  const arg = args.join(" ").toLowerCase();
  switch (cmd.toLowerCase()) {
    case "": return [];
    case "help":
      return out(
        "about               who I am", "skills [group]      what I work with", "projects            everything I have built",
        "project <name>      one project in detail", "education           degree and schools", "certs               certifications", "contact             how to reach me",
        "github | linkedin   profiles", "resume              the PDF", "open <section>      jump to a section", "history | date | clear",
      );
    case "whoami": return out("Software Engineer");
    case "about":
      return out(`${site.name}. ${site.headline.join(", ")}.`, "Final-year B.Tech Computer Science, MPSTME, NMIMS University.", "I build full-stack systems, deploy them on AWS, and explore applied AI.");
    case "skills": {
      if (arg) {
        const g = skillGroups.find((x) => x.toLowerCase().startsWith(arg));
        if (!g) return [{ kind: "err", text: `no group '${arg}'. Try: ${skillGroups.join(", ")}` }];
        return skills.filter((s) => s.group === g).map((s) => ({ kind: "out", text: `${s.name.padEnd(16)} ${s.experience}` }));
      }
      return skillGroups.map((g) => ({ kind: "out", text: `${g.padEnd(16)} ${skills.filter((s) => s.group === g).map((s) => s.name).join(", ")}` }));
    }
    case "projects": return projects.map((p) => link(`${p.slug.padEnd(14)} ${p.tagline}`, `/work/${p.slug}`));
    case "project": {
      const p = projects.find((x) => x.slug === arg || x.slug.startsWith(arg) || x.name.toLowerCase().startsWith(arg));
      if (!arg || !p) return [{ kind: "err", text: `usage: project <name>. Try: ${projects.map((x) => x.slug).join(", ")}` }];
      return [...out(p.name, p.tagline, `stack: ${p.stack.join(", ")}`, `status: ${p.status}`), link("read the case study →", `/work/${p.slug}`), ...(p.repo ? [link("view the code →", p.repo)] : [])];
    }
    case "education": return timeline.filter((t) => t.kind === "education").map((t) => ({ kind: "out", text: `${t.when.padEnd(13)} ${t.title}, ${t.org}. ${t.detail}` }));
    case "certs": return certifications.map((c) => ({ kind: "out", text: `${c.by.padEnd(5)} ${c.name}` }));
    case "contact": return [link(`email     ${site.email}`, `mailto:${site.email}`), link("linkedin  /in/sanket-mali-4a40122b7", site.linkedin), link(`github    ${site.githubUser}`, site.github)];
    case "github": return [link(site.github, site.github)];
    case "linkedin": return [link(site.linkedin, site.linkedin)];
    case "resume": return [link("Sanket_Mali_Resume.pdf →", "/resume")];
    case "ls": return out(...sections.map((s) => `${s.id}/`), "resume.pdf");
    case "open": {
      const s = sections.find((x) => x.id === arg || x.label.toLowerCase() === arg);
      if (!s) return [{ kind: "err", text: `no section '${arg}'. Run ls.` }];
      document.getElementById(s.id)?.scrollIntoView();
      return out(`opening ${s.id}`);
    }
    case "history": return out(...history.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`));
    case "date": return out(new Date().toString());
    case "devmode": toggleDevMode(); return out("developer mode toggled");
    case "clear": return "clear";
    case "sudo": return arg.includes("hire") ? out("Permission granted. Sending you to the contact form.") : [{ kind: "err", text: `${site.githubUser} is not in the sudoers file. Try: sudo hire` }];
    case "vim": return out("Nice try. Nobody gets out of vim from a portfolio.");
    case "exit": return out("There is no escape. But there is a contact form.");
    case "rm": return [{ kind: "err", text: "rm: operation not permitted. This site is held together by tests." }];
    default: return [{ kind: "err", text: `command not found: ${cmd}. Run help.` }];
  }
}

export function Shell() {
  const [lines, setLines] = useState<Line[]>(out("sanket.sys shell. Type help to begin."));
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight }); }, [lines]);

  // Press / anywhere to jump to the shell.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(t.tagName)) {
        e.preventDefault();
        document.getElementById("shell")?.scrollIntoView();
        input.current?.focus({ preventScroll: true });
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const typeOut = (result: Line[], prompt: Line) => {
    setLines((l) => [...l, prompt]);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setLines((l) => [...l, ...result]);
    result.forEach((line, i) => setTimeout(() => setLines((l) => [...l, line]), 26 * (i + 1)));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = value;
    const nextHistory = cmd.trim() ? [...history, cmd] : history;
    const result = run(cmd, nextHistory);
    setValue("");
    setCursor(-1);
    setHistory(nextHistory);
    if (result === "clear") return setLines([]);
    typeOut(result, { kind: "in", text: cmd });
    if (cmd.startsWith("sudo") && cmd.includes("hire")) setTimeout(() => document.getElementById("connect")?.scrollIntoView(), 700);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      if (!history.length) return;
      const next = e.key === "ArrowUp" ? (cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1)) : cursor < 0 ? -1 : cursor + 1 >= history.length ? -1 : cursor + 1;
      setCursor(next);
      setValue(next < 0 ? "" : history[next]);
    } else if (e.key === "Tab") {
      const match = COMMANDS.filter((c) => c.startsWith(value.trim().toLowerCase()));
      if (value.trim() && match.length === 1) { e.preventDefault(); setValue(match[0] + " "); }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <section id="shell" className="hop-section" aria-labelledby="shell-h">
      <div className="wrap">
        <SectionHead hop="07" title="Skip the UI" titleId="shell-h" intro={<>A working shell over the same data as this page. Try <code className="mono text-sm text-ink">help</code>, or press <kbd className="mono border border-line-2 px-1.5 text-sm text-ink">/</kbd> anywhere.</>} />
        <Reveal>
          <div className="ticks border border-line-2 bg-[#05060a]" onClick={() => { if (!getSelection()?.toString()) input.current?.focus({ preventScroll: true }); }}>
            <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
              <span className="led" aria-hidden="true" />
              <span className="mono text-[11px] text-mute">guest@sanket.sys</span>
            </div>
            <div ref={box} className="scrollbar-thin mono h-[18rem] overflow-y-auto p-4 sm:h-[26rem] text-[12px] leading-[1.85] sm:text-[13px]" role="log" aria-label="Shell output" aria-live="polite">
              {lines.map((l, i) => (
                <div key={i} className={`whitespace-pre-wrap break-words ${l.kind === "err" ? "text-rose" : l.kind === "in" ? "text-ink" : "text-mute"}`}>
                  {l.kind === "in" && <span className="text-blue">$ </span>}
                  {l.href ? <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="underline-offset-2 hover:text-ink hover:underline">{l.text}</a> : l.text}
                </div>
              ))}
            </div>
            <form onSubmit={submit} className="mono flex items-center gap-2 border-t border-line px-4 py-3 text-[13px]">
              <label htmlFor="shell-input" className="text-blue"><span className="sr-only">Command</span>$</label>
              <input ref={input} id="shell-input" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKey} autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} enterKeyHint="send" className="w-full bg-transparent caret-blue outline-none" placeholder="help" style={{ fontSize: "16px" }} />
            </form>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 md:hidden">
            {["help", "projects", "skills", "contact"].map((c) => (
              <button key={c} type="button" onClick={() => { const nh = [...history, c]; setHistory(nh); const r = run(c, nh); if (r !== "clear") typeOut(r, { kind: "in", text: c }); }} className="mono border border-line px-3 py-2 text-[11px] text-mute">{c}</button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
