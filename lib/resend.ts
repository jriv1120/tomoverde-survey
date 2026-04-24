import { Resend } from "resend";

let cached: Resend | null = null;

export function getResend(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

export const RESEND_CONFIG = {
  from: process.env.RESEND_FROM_EMAIL || "Tomoverde <hello@tomoverde.com>",
  replyTo: process.env.RESEND_REPLY_TO || "hello@tomoverde.com",
  audienceId: process.env.RESEND_AUDIENCE_ID || null,
};
