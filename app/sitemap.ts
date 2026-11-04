import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/resume", ...projects.map((p) => `/work/${p.slug}`)].map((path) => ({ url: `${site.url}${path}` }));
}
