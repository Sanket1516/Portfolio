import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sanket Mali, Full-Stack Developer and Software Engineer";

export default function OpengraphImage() {
  const bars = [8, 0, 22, 4, 0, 40, 12, 0, 66, 18, 6, 0, 30, 96, 20, 0, 44, 10, 0, 58, 16, 0, 140, 36, 8, 0, 72, 24, 0, 50];
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#06070b", color: "#eceff7", padding: 64, justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 124, fontWeight: 800, letterSpacing: -3 }}>SANKET MALI</div>
        <div style={{ fontSize: 34, color: "#5a97ff", marginTop: 12 }}>Full-Stack Developer · Software Engineer · Cloud & AI</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 150 }}>
        {bars.map((h, i) => <div key={i} style={{ width: 26, height: Math.max(4, h), background: h > 60 ? "#a184ff" : "#5a97ff", opacity: h ? 1 : 0.3 }} />)}
      </div>
    </div>,
    size,
  );
}
