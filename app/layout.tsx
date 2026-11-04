import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Hanken_Grotesk, Martian_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { Chrome } from "@/components/Chrome";
import "./globals.css";

const display = Big_Shoulders({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-big-shoulders", display: "swap", adjustFontFallback: false });
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
const mono = Martian_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-martian", display: "swap", adjustFontFallback: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | Sanket Mali" },
  description: site.description,
  authors: [{ name: site.name, url: site.github }],
  openGraph: { type: "website", title: site.title, description: site.description, url: "/", siteName: site.name },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#06070b", width: "device-width", initialScale: 1 };

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: "Software Engineer",
  alumniOf: "MPSTME, NMIMS University",
  sameAs: [site.github, site.linkedin],
};

// Runs before paint: enables JS-only styles, and skips the preloader after the first visit in a session.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('booted'))d.classList.add('booted');else sessionStorage.setItem('booted','1')}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <div className="boot" aria-hidden="true">
          <div>
            <div className="boot-name"><span>Sanket Mali</span></div>
            <div className="boot-bar" />
          </div>
        </div>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">
          Skip to content
        </a>
        <Chrome />
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  );
}
