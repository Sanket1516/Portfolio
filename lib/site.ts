export const site = {
  name: "Sanket Mali",
  title: "Sanket Mali | Full-Stack Developer and Software Engineer",
  headline: ["Full-Stack Developer", "Software Engineer", "Cloud & AI Enthusiast"],
  description:
    "Sanket Mali is a final-year B.Tech Computer Science student at NMIMS MPSTME who builds full-stack systems, deploys them on AWS, and writes up the engineering behind them.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio.sanketmali.dev",
  email: "sanketmali0909@gmail.com",
  github: "https://github.com/Sanket1516",
  githubUser: "Sanket1516",
  linkedin: "https://www.linkedin.com/in/sanket-mali-4a40122b7/",
  ieee: "https://ieeexplore.ieee.org/abstract/document/11400349",
  resume: "/Sanket_Mali_Resume.pdf",
  status: "Open to software engineering roles",
  statusDetail: "Graduating 2027",
} as const;

export const sections = [
  { id: "about", hop: "01", label: "About" },
  { id: "stack", hop: "02", label: "Stack" },
  { id: "work", hop: "03", label: "Work" },
  { id: "systems", hop: "04", label: "Systems" },
  { id: "telemetry", hop: "05", label: "GitHub" },
  { id: "journey", hop: "06", label: "Journey" },
  { id: "shell", hop: "07", label: "Shell" },
  { id: "connect", hop: "08", label: "Connect" },
] as const;
