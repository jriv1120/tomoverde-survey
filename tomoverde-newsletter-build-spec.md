# Tomoverde Newsletter & Welcome Email — Build Spec

**Goal:** After a user finishes the 14-question survey, offer them the chance to join the Tomoverde newsletter. Capturing their email triggers a welcome email and adds them to a Resend Audience for future monthly broadcasts.

**Stack additions on top of existing setup:** Resend (email) + one new Supabase table (`subscribers`) + one new API route (`/api/subscribe`) + one new frontend screen.

---

## 0. Prerequisites (Jorge does these)

- [ ] Buy `tomoverde.com` (Namecheap / Porkbun / Cloudflare Registrar)
- [ ] Create Resend account at resend.com
- [ ] In Resend → Audiences → create audience named "Tomoverde Newsletter" → copy the Audience ID
- [ ] In Resend → API Keys → create a key with "Sending access" + "Contacts access" → copy it
- [ ] In Resend → Domains → add `tomoverde.com` → paste the DNS records into your registrar (SPF, DKIM, DMARC). Verification usually takes <1 hour. **Not a blocker** — we can build and test against Resend's test domain first.

---

## 1. Environment variables

Add to `.env.local` and Vercel project settings:

```
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_AUDIENCE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
# Once tomoverde.com is verified in Resend, change the above to:
# RESEND_FROM_EMAIL=Tomoverde <hello@tomoverde.com>
RESEND_REPLY_TO=jorge@tomoverde.com
NEXT_PUBLIC_SITE_URL=https://tomoverde-survey.vercel.app
```

---

## 2. Supabase migration

Run in Supabase SQL Editor:

```sql
-- Subscribers table (separate from survey_responses by design)
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  survey_response_id uuid references public.survey_responses(id) on delete set null,
  source text not null default 'survey',
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- Case-insensitive uniqueness on email
create unique index subscribers_email_lower_idx
  on public.subscribers (lower(email));

-- Enable RLS
alter table public.subscribers enable row level security;

-- Anon role can INSERT only (no SELECT, no UPDATE, no DELETE)
create policy "anon can insert subscribers"
  on public.subscribers
  for insert
  to anon
  with check (true);

-- Service role (used server-side) has full access by default via bypass
```

Same security model as `survey_responses`: the anon key can add a subscriber but can't read the list. All reads happen server-side via service role or through the Supabase dashboard.

---

## 3. Install Resend

```bash
npm install resend
```

---

## 4. Resend client helper

Create `lib/resend.ts`:

```typescript
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const RESEND_CONFIG = {
  from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
  replyTo: process.env.RESEND_REPLY_TO,
  audienceId: process.env.RESEND_AUDIENCE_ID!,
};
```

---

## 5. Welcome email template

Create `lib/emails/welcome.ts`:

```typescript
export function welcomeEmailHtml(firstName?: string): string {
  const greeting = firstName ? `Hey ${escapeHtml(firstName)},` : 'Hey friend,';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Welcome to Tomoverde</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0a;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:14px;letter-spacing:0.12em;text-transform:uppercase;color:#8ab87a;">Tomoverde</p>
              <p style="margin:4px 0 0;font-size:14px;color:#8a8a8a;font-style:italic;">Where connection grows.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 24px;">
              <h1 style="margin:0;font-size:32px;line-height:1.2;color:#f5f5f0;font-weight:600;letter-spacing:-0.02em;">
                You're in. Welcome to Tomoverde.
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 20px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#d8d8d2;">
                ${greeting}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 20px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#d8d8d2;">
                <em>Tomo</em> means friendship. <em>Verde</em> means green. We're building the cannabis community New Jersey deserves &mdash; one where connection matters more than the transaction.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 12px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#d8d8d2;">
                Here's what we'll send you:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:8px 0;font-size:16px;line-height:1.6;color:#d8d8d2;">
                    &mdash; <strong style="color:#f5f5f0;">Events &amp; experiences</strong> worth your time. Curated, not a firehose.
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:16px;line-height:1.6;color:#d8d8d2;">
                    &mdash; <strong style="color:#f5f5f0;">Venues</strong> doing cannabis-friendly right &mdash; the spots locals actually love.
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:16px;line-height:1.6;color:#d8d8d2;">
                    &mdash; <strong style="color:#f5f5f0;">How cannabis is moving forward</strong> &mdash; policy, advocacy, and the stories behind the culture.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 24px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#d8d8d2;">
                One note a month. Sometimes two if something real is happening. Never more.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 32px;border-left:3px solid #8ab87a;padding-left:20px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#d8d8d2;">
                <strong style="color:#f5f5f0;">One favor:</strong> hit reply and tell us what kind of event you'd actually show up to. We read every response, and the early community shapes everything that comes next.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 8px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#d8d8d2;">
                Welcome home,
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 48px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#f5f5f0;">
                Jorge &amp; the Tomoverde team
              </p>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #2a2a2a;padding-top:24px;">
              <p style="margin:0;font-size:13px;line-height:1.5;color:#6a6a6a;">
                Tomoverde &middot; Where connection grows &middot; New Jersey
              </p>
              <p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#6a6a6a;">
                You're getting this because you joined the Tomoverde community. Don't want these? <a href="{{RESEND_UNSUBSCRIBE_URL}}" style="color:#8ab87a;text-decoration:underline;">Unsubscribe</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function welcomeEmailText(firstName?: string): string {
  const greeting = firstName ? `Hey ${firstName},` : 'Hey friend,';
  return `${greeting}

You're in. Welcome to Tomoverde.

Tomo means friendship. Verde means green. We're building the cannabis community New Jersey deserves — one where connection matters more than the transaction.

Here's what we'll send you:

— Events & experiences worth your time. Curated, not a firehose.
— Venues doing cannabis-friendly right — the spots locals actually love.
— How cannabis is moving forward — policy, advocacy, and the stories behind the culture.

One note a month. Sometimes two if something real is happening. Never more.

One favor: hit reply and tell us what kind of event you'd actually show up to. We read every response, and the early community shapes everything that comes next.

Welcome home,
Jorge & the Tomoverde team

Tomoverde · Where connection grows · New Jersey
Unsubscribe: {{RESEND_UNSUBSCRIBE_URL}}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

Resend auto-replaces `{{RESEND_UNSUBSCRIBE_URL}}` with a valid unsubscribe link when you pass `headers: { 'List-Unsubscribe': '<{{RESEND_UNSUBSCRIBE_URL}}>' }` in the send call. (Shown in the API route below.)

---

## 6. API route: `/api/subscribe`

Create `app/api/subscribe/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { resend, RESEND_CONFIG } from '@/lib/resend';
import { welcomeEmailHtml, welcomeEmailText } from '@/lib/emails/welcome';

// Reuse the same security posture as /api/submit
const MIN_FILL_TIME_MS = 3000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      first_name,
      survey_response_id,
      honeypot,
      started_at,
    } = body ?? {};

    // Honeypot
    if (honeypot) {
      return NextResponse.json({ ok: true }, { status: 200 }); // silently succeed
    }

    // Time gate
    if (
      typeof started_at !== 'number' ||
      Date.now() - started_at < MIN_FILL_TIME_MS
    ) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Validate email
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 254) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Validate first name (optional but capped)
    const cleanFirstName =
      typeof first_name === 'string' && first_name.trim().length > 0
        ? first_name.trim().slice(0, 50)
        : null;

    const cleanEmail = email.trim().toLowerCase();

    // Insert into Supabase (idempotent-ish: if email exists, surface a friendly message)
    const supabase = supabaseServer();
    const { error: insertError } = await supabase
      .from('subscribers')
      .insert({
        email: cleanEmail,
        first_name: cleanFirstName,
        survey_response_id: survey_response_id ?? null,
        source: 'survey',
      });

    if (insertError) {
      // 23505 = unique violation (already subscribed)
      if ((insertError as any).code === '23505') {
        return NextResponse.json(
          { ok: true, alreadySubscribed: true },
          { status: 200 }
        );
      }
      console.error('[subscribe] supabase insert failed', insertError);
      return NextResponse.json(
        { ok: false, error: 'Something went wrong. Try again in a moment.' },
        { status: 500 }
      );
    }

    // Fire-and-forget: add to Resend audience + send welcome email.
    // If either fails, the subscriber is still saved — we don't want to lose them.
    Promise.allSettled([
      resend.contacts.create({
        email: cleanEmail,
        firstName: cleanFirstName ?? undefined,
        unsubscribed: false,
        audienceId: RESEND_CONFIG.audienceId,
      }),
      resend.emails.send({
        from: RESEND_CONFIG.from,
        to: cleanEmail,
        replyTo: RESEND_CONFIG.replyTo,
        subject: 'Welcome to Tomoverde 🌱',
        html: welcomeEmailHtml(cleanFirstName ?? undefined),
        text: welcomeEmailText(cleanFirstName ?? undefined),
        headers: {
          'List-Unsubscribe': '<{{RESEND_UNSUBSCRIBE_URL}}>',
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      }),
    ]).then((results) => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(
            `[subscribe] resend ${i === 0 ? 'contacts.create' : 'emails.send'} failed`,
            r.reason
          );
        }
      });
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('[subscribe] unexpected error', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Try again in a moment.' },
      { status: 500 }
    );
  }
}
```

---

## 7. Frontend: email capture screen

Create `components/SubscribeStep.tsx` (match your existing survey styling — this is the structure + copy; adapt classNames to your system):

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';

type Props = {
  surveyResponseId?: string | null;
  onDone: () => void;
};

export default function SubscribeStep({ surveyResponseId, onDone }: Props) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit() {
    setError(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          first_name: firstName,
          survey_response_id: surveyResponseId,
          honeypot,
          started_at: startedAt.current,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? 'Something went wrong.');
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError('Network error. Try again.');
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-4">You're in. 🌱</h2>
        <p className="text-lg opacity-80 mb-8">
          Check your inbox — a welcome note is on its way.
        </p>
        <button onClick={onDone} className="btn-primary">
          Done
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="uppercase tracking-widest text-sm opacity-60 mb-2">
        One more thing
      </p>
      <h2 className="text-3xl font-semibold mb-4">
        Want events, venues, and advocacy in your inbox?
      </h2>
      <p className="text-lg opacity-80 mb-8">
        Drop your email and we'll send you one note a month — events near you,
        venues worth knowing, and how cannabis is moving forward in New Jersey.
        No spam. Unsubscribe anytime.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="first_name" className="block text-sm opacity-70 mb-1">
            First name
          </label>
          <input
            id="first_name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            maxLength={50}
            autoComplete="given-name"
            className="w-full input"
            placeholder="Jorge"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm opacity-70 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
            autoComplete="email"
            className="w-full input"
            placeholder="you@example.com"
            required
          />
        </div>

        {/* Honeypot — hidden from real users */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-6">
        <button
          onClick={handleSubmit}
          disabled={loading || !email}
          className="btn-primary"
        >
          {loading ? 'Signing you up…' : 'Count me in'}
        </button>
        <button
          onClick={onDone}
          className="text-sm opacity-60 hover:opacity-100 underline"
          type="button"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
```

---

## 8. Wire into the survey flow

In the survey page/component, after Q14 submits successfully to `/api/submit`:

1. Capture the returned `survey_response_id` from `/api/submit` (if it isn't already being returned, update that route to `return NextResponse.json({ ok: true, id: row.id })`).
2. Advance to a new step that renders `<SubscribeStep surveyResponseId={id} onDone={goToThankYou} />`.
3. `onDone` routes the user to the final thank-you screen — same one they'd see whether they subscribed or skipped.

---

## 9. Testing checklist

- [ ] Submit the survey with a fresh email → row appears in `subscribers` table
- [ ] Welcome email arrives within ~30 seconds
- [ ] Subscriber appears in Resend → Audiences → Tomoverde Newsletter
- [ ] Resubmit with the same email → returns `alreadySubscribed: true`, no duplicate row, no duplicate welcome email
- [ ] Skip button on the capture screen → no subscriber row, survey submission still intact
- [ ] Honeypot: fill the hidden field via devtools → returns 200 but no row inserted
- [ ] Submit too fast (< 3s) → returns 200 but no row inserted
- [ ] Unsubscribe link in the welcome email works

---

## 10. Sending your first monthly newsletter (once you have subscribers)

No code needed. In the Resend dashboard:

1. Go to Broadcasts → New Broadcast
2. Select the "Tomoverde Newsletter" audience
3. Write your note (Resend has a simple editor, or paste HTML)
4. Preview, send to yourself as a test, then send to the audience

You can reuse the visual style from the welcome email template by copying its HTML structure into the Broadcast editor.

---

## What's intentionally NOT in this build

- Admin notifications to Jorge when someone new subscribes. Easy add later: one more `resend.emails.send` call in the API route with `to: jorge@tomoverde.com`.
- Double opt-in (confirm-your-email flow). CAN-SPAM doesn't require it for US; revisit if you ever target EU seriously.
- Preference center (let subscribers pick event types). Worth building once you have >500 subscribers and enough event variety to segment.

---
