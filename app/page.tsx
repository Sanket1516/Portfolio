import { getGitHubData } from "@/lib/github";
import { skills } from "@/data/profile";
import { projects } from "@/data/projects";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Ticker } from "@/components/sections/Ticker";
import { Stack } from "@/components/sections/Stack";
import { Work } from "@/components/sections/Work";
import { Systems } from "@/components/sections/Systems";
import { Telemetry } from "@/components/sections/Telemetry";
import { Journey } from "@/components/sections/Journey";
import { Shell } from "@/components/sections/Shell";
import { Connect, Footer } from "@/components/sections/Connect";

export default async function Home() {
  const gh = await getGitHubData();
  const total = gh.contributions.reduce((n, d) => n + d.count, 0);
  const days = gh.contributions.map(({ date, count }) => ({ date, count }));
  const stats = [
    { value: projects.filter((p) => p.slug !== "site").length, label: "Projects documented here" },
    { value: skills.length, label: "Technologies used in real work" },
    { value: 10, suffix: "+", label: "Hackathons" },
    { value: 3, suffix: "+", label: "Years building, since 2023" },
  ];
  return (
    <>
      <main id="main">
        <Hero days={days} total={total} />
        <Ticker />
        <About stats={stats} />
        <Stack />
        <Work />
        <Systems />
        <Telemetry data={gh} />
        <Journey />
        <Shell />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
