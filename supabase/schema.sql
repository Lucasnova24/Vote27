-- Vote2027 — Supabase schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`) on a fresh project.
-- Safe to re-run: every statement is idempotent.

-- ─────────────────────────────────────────────────────────────
-- profiles — one row per authenticated user (incl. anonymous/guest)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  pseudo text,
  points integer not null default 0,
  notif_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: select own" on public.profiles;
create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────
-- votes — the daily "vote obligatoire" question (one row per user)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.votes (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  choice text not null check (choice in ('oui', 'non')),
  created_at timestamptz not null default now()
);

alter table public.votes enable row level security;

drop policy if exists "votes: owner all" on public.votes;
create policy "votes: owner all" on public.votes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- quiz_attempts — daily quiz result (one row per user)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.quiz_attempts (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  score integer not null,
  answers integer[] not null,
  created_at timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;

drop policy if exists "quiz_attempts: owner all" on public.quiz_attempts;
create policy "quiz_attempts: owner all" on public.quiz_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- boussole_responses — political-compass answers (one row per user)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.boussole_responses (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  answers integer[] not null,
  created_at timestamptz not null default now()
);

alter table public.boussole_responses enable row level security;

drop policy if exists "boussole_responses: owner all" on public.boussole_responses;
create policy "boussole_responses: owner all" on public.boussole_responses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- estimations — first-round point allocation (one row per user)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.estimations (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  est_values integer[] not null,
  submitted boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.estimations enable row level security;

drop policy if exists "estimations: owner all" on public.estimations;
create policy "estimations: owner all" on public.estimations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- debate_predictions — "who will be most convincing" pre-debate pick
-- ─────────────────────────────────────────────────────────────
create table if not exists public.debate_predictions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  candidate_index integer not null,
  created_at timestamptz not null default now()
);

alter table public.debate_predictions enable row level security;

drop policy if exists "debate_predictions: owner all" on public.debate_predictions;
create policy "debate_predictions: owner all" on public.debate_predictions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Auto-create a profile row whenever a new auth user is created
-- (covers email/password, anonymous/guest, and OAuth sign-ups alike)
-- ─────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- RPCs — atomic point crediting and full progress reset
-- ─────────────────────────────────────────────────────────────
create or replace function public.increment_points(delta integer)
returns integer
language plpgsql
security definer set search_path = public
as $$
declare
  new_total integer;
begin
  update public.profiles
    set points = points + delta
    where id = auth.uid()
    returning points into new_total;
  return new_total;
end;
$$;

create or replace function public.reset_progress()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  delete from public.votes where user_id = auth.uid();
  delete from public.quiz_attempts where user_id = auth.uid();
  delete from public.boussole_responses where user_id = auth.uid();
  delete from public.estimations where user_id = auth.uid();
  delete from public.debate_predictions where user_id = auth.uid();
  update public.profiles set points = 0, notif_read = false where id = auth.uid();
end;
$$;

-- Global leaderboard (pseudo + points only — never emails or other PII).
-- security definer lets it read across all profiles without a broad SELECT
-- policy on the table itself.
create or replace function public.get_leaderboard(limit_n integer default 10)
returns table (pseudo text, points integer)
language sql
security definer set search_path = public
as $$
  select coalesce(nullif(trim(pseudo), ''), 'Citoyen') as pseudo, points
  from public.profiles
  order by points desc
  limit limit_n;
$$;

grant execute on function public.increment_points(integer) to authenticated;
grant execute on function public.reset_progress() to authenticated;
grant execute on function public.get_leaderboard(integer) to authenticated;
