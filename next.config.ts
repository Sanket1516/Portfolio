import type { NextConfig } from "next";

// Built as a fully static site (HTML/CSS/JS in `out/`) so it can be served from any static host or CDN,
// such as a Render Static Site. Security headers live in render.yaml, because a static export cannot set them.
const config: NextConfig = {
  output: "export",
  // Emit /work/vaakya/index.html instead of /work/vaakya.html, which every static host serves without rewrites.
  trailingSlash: true,
  // There is no image-optimization server on a static host; the images are already sized WebP.
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default config;
