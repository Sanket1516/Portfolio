import { NextResponse } from "next/server";
import { site } from "@/lib/site";

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

// Per-instance only. Enough to stop casual abuse; a shared store would be needed across replicas.
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Bots fill the hidden field. Reply as if it worked and send nothing.
  if (body.website) return NextResponse.json({ ok: true });

  const name = String(body.name ?? "").trim().slice(0, 100);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 4000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10)
    return NextResponse.json({ error: "Please check your name, email and message." }, { status: 422 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "Mail is not configured." }, { status: 503 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: site.email,
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      text: `${message}\n\nFrom: ${name} <${email}>`,
    }),
  });
  if (!res.ok) return NextResponse.json({ error: "The message could not be sent. Please email me directly." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
