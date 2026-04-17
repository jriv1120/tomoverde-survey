# Tomoverde — Event Survey

A mobile-first survey asking people what kind of cannabis events they actually want. Responses feed directly into Tomoverde's event programming. _Where connection grows._

## Stack

- **Next.js 16** (App Router) + React 19
- **Tailwind CSS v4**
- **Supabase** (Postgres + RLS for anon inserts only)
- **Vercel Analytics**
- Typography: Fraunces (serif) + Inter (sans) via `next/font/google`

## Local development

```bash
npm install
cp .env.example .env.local
# fill in Supabase URL and publishable key
npm run dev
```

Dev server runs at <http://localhost:3000>.

## Environment variables

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable key (anon role) |

## Database

Schema lives in Supabase. Table `public.survey_responses` has RLS enabled with a single policy allowing anonymous `INSERT` only — no `SELECT`, no `UPDATE`, no `DELETE` from the anon role. Responses are viewed via the Supabase dashboard or service-role key.

## Anti-abuse

- **Honeypot field** (`website`) — hidden from humans, filled by naive bots; submissions are silently dropped.
- **Time gate** — submissions < 3s after page load are rejected with 429.
- No persistent IP rate-limit in v1. Add Upstash + edge middleware if abuse shows up.

## Drafts

Partial responses are saved to `localStorage` under `tomoverde_survey_draft_v1` (debounced 200ms). On return within 7 days, the survey prompts to resume or start over. Draft is cleared after successful submit.

## Routes

- `/` — Landing
- `/survey` — 14-question flow
- `/thanks` — Confirmation + share
- `/api/submit` — POST handler (server-only Supabase insert)

## Deploy

Pushes to `main` auto-deploy via Vercel. Env vars must be set in the Vercel project settings.

## Live

Deployed: https://tomoverde-survey.vercel.app  
Repo: https://github.com/jriv1120/tomoverde-survey
