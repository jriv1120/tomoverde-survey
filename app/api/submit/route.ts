import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SubmitPayload {
  identity?: string;
  vibe_word?: string;
  event_types?: string[];
  blockers?: string[];
  consumption_formats?: string[];
  social_unit?: string;
  event_size?: string;
  price_band?: string;
  frequency?: string;
  discovery_channels?: string[];
  trust_drivers?: string[];
  ideal_event_freeform?: string;
  zip_code?: string;
  email?: string;
  website?: string;
  _startedAt?: number;
}

function coerceString(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t) return null;
  return t.slice(0, max);
}

function coerceStringArray(v: unknown, maxItems = 20, maxLen = 200): string[] | null {
  if (!Array.isArray(v)) return null;
  const out = v
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, maxItems)
    .map((s) => s.slice(0, maxLen));
  return out.length ? out : null;
}

export async function POST(req: NextRequest) {
  let body: SubmitPayload;
  try {
    body = (await req.json()) as SubmitPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.website && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof body._startedAt === "number" &&
    body._startedAt > 0 &&
    Date.now() - body._startedAt < 3000
  ) {
    return NextResponse.json({ error: "Too fast" }, { status: 429 });
  }

  const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;
  const referrer = req.headers.get("referer")?.slice(0, 500) ?? null;

  const row = {
    identity: coerceString(body.identity, 100),
    vibe_word: coerceString(body.vibe_word, 100),
    event_types: coerceStringArray(body.event_types),
    blockers: coerceStringArray(body.blockers),
    consumption_formats: coerceStringArray(body.consumption_formats),
    social_unit: coerceString(body.social_unit, 100),
    event_size: coerceString(body.event_size, 100),
    price_band: coerceString(body.price_band, 100),
    frequency: coerceString(body.frequency, 100),
    discovery_channels: coerceStringArray(body.discovery_channels),
    trust_drivers: coerceStringArray(body.trust_drivers),
    ideal_event_freeform: coerceString(body.ideal_event_freeform, 2000),
    zip_code: coerceString(body.zip_code, 10),
    email: coerceString(body.email, 320),
    user_agent: userAgent,
    referrer: referrer,
  };

  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase.from("survey_responses").insert(row);
    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
  } catch (e) {
    console.error("Handler error:", e);
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
