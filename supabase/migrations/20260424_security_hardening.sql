-- Security hardening migration
-- Run in Supabase SQL editor (or via CLI) before the deploy goes live.
-- Safe to run repeatedly (all statements are idempotent).

-- 1. Rate limiting table + function (used by /api/submit and /api/subscribe)
create table if not exists public.rate_limits (
  key text primary key,
  count int not null,
  window_end timestamptz not null
);

alter table public.rate_limits enable row level security;
-- No policies => only the service role can read/write this table.

create or replace function public.check_rate_limit(
  p_key text,
  p_limit int,
  p_window_seconds int
) returns boolean
language plpgsql
security definer
as $$
declare
  existing_count int;
  existing_end timestamptz;
begin
  select count, window_end into existing_count, existing_end
  from public.rate_limits where key = p_key;

  if not found or existing_end < now() then
    insert into public.rate_limits (key, count, window_end)
    values (p_key, 1, now() + make_interval(secs => p_window_seconds))
    on conflict (key) do update
      set count = 1,
          window_end = excluded.window_end;
    return true;
  elsif existing_count >= p_limit then
    return false;
  else
    update public.rate_limits
      set count = count + 1
      where key = p_key;
    return true;
  end if;
end;
$$;

-- Opportunistic cleanup of expired windows. Safe to call often.
create or replace function public.cleanup_rate_limits()
returns void
language sql
security definer
as $$
  delete from public.rate_limits where window_end < now() - interval '1 hour';
$$;

-- 2. Tighten RLS: remove anon INSERT policies so writes MUST go through
-- the server API routes (which use the service role key and enforce honeypot,
-- time-gate, rate-limit, and validation logic). We drop by description because
-- the original policy names may vary; we re-enable RLS and add no anon policies.

-- survey_responses
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'survey_responses'
  loop
    execute format('drop policy %I on public.survey_responses', pol.policyname);
  end loop;
end $$;

alter table public.survey_responses enable row level security;
-- No policies => anon/authenticated cannot read, write, update, or delete.

-- subscribers
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'subscribers'
  loop
    execute format('drop policy %I on public.subscribers', pol.policyname);
  end loop;
end $$;

alter table public.subscribers enable row level security;
-- No policies => anon/authenticated cannot read, write, update, or delete.

-- Service role bypasses RLS, so /api/submit and /api/subscribe keep working.

-- 3. Grants — service role already has full access; no action needed.
-- Do NOT grant anon any privileges on these tables.
revoke all on public.survey_responses from anon, authenticated;
revoke all on public.subscribers from anon, authenticated;
revoke all on public.rate_limits from anon, authenticated;
