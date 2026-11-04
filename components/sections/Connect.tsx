"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Check, Copy, Download, FileText, Mail, Send } from "lucide-react";
import { Github, Linkedin } from "@/components/icons";
import { site } from "@/lib/site";
import { Magnetic, Reveal } from "@/components/ui";

type Status = "idle" | "sending" | "sent" | "fallback" | "error";

function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { setStatus("sent"); form.reset(); return; }
      if (res.status === 503) {
        // Mail is not configured on this deployment: hand the message to the visitor's mail app instead.
        const subject = encodeURIComponent(`Portfolio message from ${data.name}`);
        const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} <${data.email}>`);
        location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
        setStatus("fallback");
        return;
      }
      const j = await res.json().catch(() => null);
      setMessage(j?.error ?? "Something went wrong. Please email me directly.");
      setStatus("error");
    } catch {
      setMessage("The network failed. Please email me directly.");
      setStatus("error");
    }
  };

  const field = "w-full border-b border-line-2 bg-transparent py-3 outline-none transition-colors focus:border-blue";
  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label htmlFor="c-name" className="label">Name</label><input id="c-name" name="name" required maxLength={100} autoComplete="name" className={field} /></div>
        <div><label htmlFor="c-email" className="label">Email</label><input id="c-email" name="email" type="email" required maxLength={200} autoComplete="email" className={field} /></div>
      </div>
      <div><label htmlFor="c-msg" className="label">Message</label><textarea id="c-msg" name="message" required minLength={10} maxLength={4000} rows={4} className={`${field} resize-y`} /></div>
      <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="flex flex-wrap items-center gap-4">
        <Magnetic strength={0.35}>
          <button type="submit" disabled={status === "sending"} className="btn btn-solid disabled:opacity-60">{status === "sending" ? "Sending..." : "Send message"} <Send size={14} /></button>
        </Magnetic>
        <p role="status" className="text-sm">
          {status === "sent" && <span className="text-green">Sent. I will get back to you soon.</span>}
          {status === "fallback" && <span className="text-mute">Your mail app should now be open with this message.</span>}
          {status === "error" && <span className="text-rose">{message}</span>}
        </p>
      </div>
    </form>
  );
}

export function Connect() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { location.href = `mailto:${site.email}`; }
  };
  const links = [
    { href: site.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: site.github, label: "GitHub", icon: Github },
  ];
  return (
    <section id="connect" className="hop-section relative overflow-hidden" aria-labelledby="connect-h">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 55% at 72% 100%, rgb(90 151 255 / .16), transparent 70%), radial-gradient(40% 40% at 15% 90%, rgb(161 132 255 / .1), transparent 70%)" }} aria-hidden="true" />
      <div className="wrap relative">
        <p className="label mb-5"><span className="text-blue">HOP 08</span></p>
        <Reveal><h2 id="connect-h" className="display text-[clamp(3.5rem,12vw,11rem)]">Have an interesting problem?</h2></Reveal>
        <Reveal delay={100}><p className="mt-5 max-w-2xl text-xl text-mute sm:text-2xl">Let&apos;s engineer something extraordinary.</p></Reveal>
        <div className="mt-16 grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7"><ContactForm /></Reveal>
          <Reveal delay={100} className="lg:col-span-4 lg:col-start-9">
            <p className="label mb-2">Email</p>
            <div className="flex items-center gap-2">
              <a href={`mailto:${site.email}`} className="min-w-0 break-all underline-offset-4 hover:underline"><Mail size={15} className="mr-2 inline" aria-hidden="true" />{site.email}</a>
              <button type="button" onClick={copy} aria-label="Copy email address" className="-my-2 shrink-0 p-2 text-mute hover:text-ink">{copied ? <Check size={15} className="text-green" /> : <Copy size={15} />}</button>
            </div>
            <ul className="mt-7 border-t border-line">
              {links.map(({ href, label, icon: Icon }) => (
                <li key={label} className="border-b border-line">
                  <a href={href} target="_blank" rel="noreferrer" className="group flex items-center gap-3 py-3.5">
                    <Icon size={17} className="transition-transform group-hover:-rotate-6 group-hover:scale-110" aria-hidden="true" /> {label}
                    <ArrowUpRight size={15} className="ml-auto text-dim group-hover:text-ink" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a href={site.resume} download="Sanket_Mali_Resume.pdf" className="btn">Resume <Download size={14} /></a>
              <Link href="/resume" className="btn">Preview <FileText size={14} /></Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 py-7 pb-24 lg:pb-7">
        <p className="mono text-[11px] text-dim">© {new Date().getFullYear()} {site.name}</p>
        <nav aria-label="Footer" className="mono flex gap-5 text-[11px] text-mute">
          <a href={site.linkedin} target="_blank" rel="noreferrer" className="hover:text-ink">LinkedIn</a>
          <a href={site.github} target="_blank" rel="noreferrer" className="hover:text-ink">GitHub</a>
          <Link href="/work/site" className="hover:text-ink">How this site works</Link>
        </nav>
      </div>
    </footer>
  );
}
