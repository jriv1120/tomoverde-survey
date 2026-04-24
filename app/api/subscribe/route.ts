import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getResend, RESEND_CONFIG } from "@/lib/resend";
import { welcomeEmailHtml, welcomeEmailText } from "@/lib/emails/welcome";
import {
  adminNotificationHtml,
  adminNotificationSubject,
  adminNotificationText,
} from "@/lib/emails/admin-notification";

const ADMIN_EMAIL = "hello@tomoverde.com";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_TIME_MS = 3000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscribePayload {
  email?: string;
  first_name?: string;
  survey_response_id?: string | null;
  honeypot?: string;
  started_at?: number;
}

export async function POST(req: NextRequest) {
  let body: SubscribePayload;
  try {
    body = (await req.json()) as SubscribePayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { email, first_name, survey_response_id, honeypot, started_at } = body;

  // Honeypot → silently succeed, do nothing
  if (honeypot && honeypot.trim()) {
    return NextResponse.json({ ok: true });
  }

  // Time gate → silently succeed if suspicious
  if (
    typeof started_at !== "number" ||
    started_at <= 0 ||
    Date.now() - started_at < MIN_FILL_TIME_MS
  ) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof email !== "string" ||
    !EMAIL_REGEX.test(email) ||
    email.length > 254
  ) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanFirstName =
    typeof first_name === "string" && first_name.trim().length > 0
      ? first_name.trim().slice(0, 50)
      : null;
  const cleanSurveyId =
    typeof survey_response_id === "string" && survey_response_id.length > 0
      ? survey_response_id.slice(0, 64)
      : null;

  // Insert into Supabase
  try {
    const supabase = getSupabaseServer();
    const { error: insertError } = await supabase.from("subscribers").insert({
      email: cleanEmail,
      first_name: cleanFirstName,
      survey_response_id: cleanSurveyId,
      source: "survey",
    });

    if (insertError) {
      // 23505 = unique violation → already subscribed, silently succeed
      const code = (insertError as { code?: string }).code;
      if (code === "23505") {
        return NextResponse.json({ ok: true, alreadySubscribed: true });
      }
      console.error("[subscribe] supabase insert failed", insertError);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Try again in a moment." },
        { status: 500 },
      );
    }
  } catch (e) {
    console.error("[subscribe] handler error", e);
    return NextResponse.json(
      { ok: false, error: "Server misconfigured." },
      { status: 500 },
    );
  }

  // Fire-and-forget: add to Resend audience + send welcome email.
  // Gracefully skipped if Resend isn't configured yet.
  const resend = getResend();
  if (resend) {
    const tasks: Promise<unknown>[] = [];

    // Welcome email to the subscriber
    tasks.push(
      resend.emails.send({
        from: RESEND_CONFIG.from,
        to: cleanEmail,
        replyTo: RESEND_CONFIG.replyTo,
        subject: "Welcome to Tomoverde 🌱",
        html: welcomeEmailHtml(cleanFirstName ?? undefined),
        text: welcomeEmailText(cleanFirstName ?? undefined),
        headers: {
          "List-Unsubscribe":
            "<mailto:hello@tomoverde.com?subject=unsubscribe>",
        },
      }),
    );

    // Admin notification to Jorge — every new subscriber
    tasks.push(
      resend.emails.send({
        from: RESEND_CONFIG.from,
        to: ADMIN_EMAIL,
        replyTo: RESEND_CONFIG.replyTo,
        subject: adminNotificationSubject(cleanEmail),
        html: adminNotificationHtml({
          email: cleanEmail,
          firstName: cleanFirstName,
          surveyResponseId: cleanSurveyId,
        }),
        text: adminNotificationText({
          email: cleanEmail,
          firstName: cleanFirstName,
          surveyResponseId: cleanSurveyId,
        }),
      }),
    );

    if (RESEND_CONFIG.audienceId) {
      tasks.push(
        resend.contacts.create({
          email: cleanEmail,
          firstName: cleanFirstName ?? undefined,
          unsubscribed: false,
          audienceId: RESEND_CONFIG.audienceId,
        }),
      );
    }

    Promise.allSettled(tasks).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(
            `[subscribe] resend task ${i} failed`,
            r.reason,
          );
        }
      });
    });
  }

  return NextResponse.json({ ok: true });
}
