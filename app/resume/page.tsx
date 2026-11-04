import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Resume", description: "Resume of Sanket Mali, B.Tech Computer Science.", alternates: { canonical: "/resume" } };

export default function ResumePage() {
  return (
    <main id="main" className="wrap pt-24 pb-24 lg:pt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/" className="mono inline-flex items-center gap-2 text-[11px] text-mute hover:text-ink"><ArrowLeft size={13} /> Home</Link>
          <h1 className="display mt-4 text-6xl md:text-8xl">Resume</h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <a href={site.resume} download="Sanket_Mali_Resume.pdf" className="btn btn-solid">Download PDF <Download size={14} /></a>
          <a href={site.resume} target="_blank" rel="noreferrer" className="btn">Open in a new tab <ExternalLink size={14} /></a>
        </div>
      </div>
      <object data={site.resume} type="application/pdf" aria-label="Resume preview" className="mt-8 h-[82vh] w-full border border-line bg-bg-2">
        <p className="p-6 text-mute">Your browser cannot preview PDFs here. Use the download button above.</p>
      </object>
    </main>
  );
}
