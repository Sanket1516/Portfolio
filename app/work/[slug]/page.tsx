import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Github } from "@/components/icons";
import { getProject, projects } from "@/data/projects";
import { ArchDiagram } from "@/components/ArchDiagram";
import { accentClass } from "@/lib/accent";
import { Footer } from "@/components/sections/Connect";
import { Toc } from "@/components/Toc";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return { title: p.name, description: p.tagline, alternates: { canonical: `/work/${p.slug}` }, openGraph: { title: `${p.name} | Sanket Mali`, description: p.tagline } };
}

const vaakyaScreens = ["home", "assessment", "goals", "life-graph", "scam"];

function Block({ id, title, items }: { id: string; title: string; items: string[] }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-10">
      <h2 className="display text-4xl md:text-5xl">{title}</h2>
      <div className="mt-5 max-w-3xl space-y-4 text-mute">{items.map((t) => <p key={t}>{t}</p>)}</div>
    </section>
  );
}

export default async function CaseStudy({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const a = accentClass[p.accent];
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  const toc = [["overview", "Overview"], ["problem", "Problem"], ["architecture", "Architecture"], ["decisions", "Decisions"], ["backend", "Backend"], ["data", "Data"], ["api", "API"], ["security", "Security"], ["deployment", "Deployment"], ["challenges", "Challenges"], ["limits", "Honest limits"]] as [string, string][];

  return (
    <>
      <main id="main" className="wrap pt-24 lg:pt-32">
        <Link href="/#work" className="mono inline-flex items-center gap-2 text-[11px] text-mute hover:text-ink"><ArrowLeft size={13} /> All work</Link>
        <header className="mt-8 pb-12">
          <p className={`mono text-[11px] ${a.text}`}>{p.kind}</p>
          <h1 className="display mt-3 text-[clamp(4rem,13vw,11rem)]">{p.name}</h1>
          <p className="mt-5 max-w-3xl text-xl sm:text-2xl">{p.tagline}</p>
          <p className="mt-4 text-sm text-dim">{p.status}</p>
          <ul className="mt-8 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
            {p.metrics.map((x) => (
              <li key={x.label} className="bg-bg p-4"><div className="display whitespace-nowrap text-[clamp(1.6rem,7vw,2.25rem)]">{x.value}</div><div className="mt-1 text-xs text-mute">{x.label}</div></li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {p.repo && <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-solid"><Github size={14} /> View the code</a>}
            <ul className="flex flex-wrap gap-x-3 gap-y-1">{p.stack.map((t) => <li key={t} className="mono text-[10.5px] text-dim">{t}</li>)}</ul>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[11rem_1fr]">
          <nav aria-label="On this page" className="hidden lg:block">
            <Toc items={toc} />
          </nav>
          <div className="min-w-0">
            <Block id="overview" title="Overview" items={[...p.overview, p.role]} />
            {p.slug === "vaakya" && (
              <section aria-label="VAAKYA screens" className="pb-10">
                <ul className="scrollbar-thin -mx-5 flex gap-4 overflow-x-auto px-5 pb-3 md:mx-0 md:px-0">
                  {vaakyaScreens.map((s) => (
                    <li key={s} className="shrink-0">
                      <Image src={`/work/vaakya/${s}.webp`} alt={`VAAKYA ${s.replace("-", " ")} screen`} width={440} height={940} sizes="210px" className="h-auto w-[210px] rounded-[1.6rem]" />
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-dim">Screens from the submission, generated from one design system with a custom Figma script.</p>
              </section>
            )}
            <section id="problem" className="scroll-mt-24 border-t border-line py-10">
              <h2 className="display text-4xl md:text-5xl">Problem and solution</h2>
              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <div><p className="label mb-2">Problem</p><p className="text-mute">{p.problem}</p></div>
                <div><p className="label mb-2">Solution</p><p className="text-mute">{p.solution}</p></div>
              </div>
            </section>
            <section id="architecture" className="scroll-mt-24 border-t border-line py-10">
              <h2 className="display mb-6 text-4xl md:text-5xl">System architecture</h2>
              <ArchDiagram views={p.architecture} accent={a.hex} />
            </section>
            <section id="decisions" className="scroll-mt-24 border-t border-line py-10">
              <h2 className="display text-4xl md:text-5xl">Technology decisions</h2>
              <dl className="mt-6 grid gap-px bg-line md:grid-cols-2">
                {p.decisions.map((d) => (
                  <div key={d.choice} className="bg-bg p-5"><dt className="font-semibold">{d.choice}</dt><dd className="mt-1.5 text-sm text-mute">{d.why}</dd></div>
                ))}
              </dl>
            </section>
            <Block id="backend" title="Backend" items={p.backend} />
            <Block id="data" title="Database design" items={p.data} />
            <Block id="api" title="API communication" items={p.api} />
            <Block id="security" title="Authentication and security" items={p.security} />
            <Block id="deployment" title="Deployment" items={p.deployment} />
            <section id="challenges" className="scroll-mt-24 border-t border-line py-10">
              <h2 className="display text-4xl md:text-5xl">Challenges and solutions</h2>
              <ol className="mt-6 space-y-5">
                {p.challenges.map((c, n) => (
                  <li key={c.challenge} className="grid gap-1 sm:grid-cols-[2.5rem_1fr]">
                    <span className={`mono text-[11px] ${a.text}`}>0{n + 1}</span>
                    <div><p className="font-semibold">{c.challenge}</p><p className="mt-1 text-mute">{c.solution}</p></div>
                  </li>
                ))}
              </ol>
            </section>
            <section id="limits" className="scroll-mt-24 border-t border-line py-10">
              <h2 className="display text-4xl md:text-5xl">Honest limits</h2>
              <ul className="mt-5 max-w-3xl space-y-3 border-l-2 border-amber pl-5 text-mute">{p.limits.map((l) => <li key={l}>{l}</li>)}</ul>
            </section>
            <Link href={`/work/${next.slug}`} className="group mt-6 flex items-center justify-between border-y border-line py-8">
              <span><span className="label block">Next</span><span className="display text-5xl md:text-7xl">{next.name}</span></span>
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </main>
      <div className="mt-16"><Footer /></div>
    </>
  );
}
