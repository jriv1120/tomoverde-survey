import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ResendEvent {
  type: string;
  created_at: string;
  data: {
    email_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
    bounce?: { type?: string; message?: string };
    complaint?: { type?: string };
  };
}

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("[resend-webhook] RESEND_WEBHOOK_SECRET not set; rejecting");
    return NextResponse.json({ error: "Not configured" }, { status: 501 });
  }

  const body = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  let event: ResendEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, headers) as ResendEvent;
  } catch (e) {
    console.warn("[resend-webhook] signature verification failed:", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const recipient = event.data.to?.[0] ?? "unknown";
  switch (event.type) {
    case "email.bounced":
      console.error(
        `[resend-webhook] BOUNCE ${recipient} type=${event.data.bounce?.type} msg=${event.data.bounce?.message}`,
      );
      break;
    case "email.complained":
      console.error(
        `[resend-webhook] COMPLAINT ${recipient} type=${event.data.complaint?.type}`,
      );
      break;
    case "email.delivery_delayed":
      console.warn(`[resend-webhook] delayed ${recipient}`);
      break;
    case "email.delivered":
    case "email.sent":
    case "email.opened":
    case "email.clicked":
      // No-op; log at debug only to avoid noise.
      break;
    default:
      console.log(`[resend-webhook] ${event.type} ${recipient}`);
  }

  return NextResponse.json({ ok: true });
}
