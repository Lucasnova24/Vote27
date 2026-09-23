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
  quiz_correct_total integer not null default 0,
  quiz_attempts_total integer not null default 0,
  ville text,
  region text,
  pays text,
  code_postal text,
  telephone text,
  interets text,
  date_naissance date,
  sexe text,
  created_at timestamptz not null default now()
);

-- Extra profile fields added by the "Compléter mon profil" screen and the
-- cumulative quiz accuracy stats shown on the "Quiz" tab — additive, safe to
-- re-run on a project created from an earlier version of this schema.
alter table public.profiles add column if not exists quiz_correct_total integer not null default 0;
alter table public.profiles add column if not exists quiz_attempts_total integer not null default 0;
alter table public.profiles add column if not exists ville text;
alter table public.profiles add column if not exists region text;
alter table public.profiles add column if not exists pays text;
alter table public.profiles add column if not exists code_postal text;
alter table public.profiles add column if not exists telephone text;
alter table public.profiles add column if not exists interets text;
-- Collected at signup for form validation but never actually persisted
-- until now — added so "Compléter mon profil" can show/edit them too.
alter table public.profiles add column if not exists date_naissance date;
alter table public.profiles add column if not exists sexe text;

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
-- estimations — kept for backward compatibility with older app versions;
-- the "Estimation du 1er tour" screen was replaced by first_round_picks
-- below (a single monthly candidate pick, not a percentage split).
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
-- first_round_picks — "Mon vote du 1er tour" weekly poll: one row per user
-- *per week* (week_start = the Sunday the pick belongs to, computed
-- client-side by src/lib/week.ts), so past weeks are kept as real history
-- instead of being overwritten.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.first_round_picks (
  user_id uuid not null references public.profiles (id) on delete cascade,
  week_start date not null,
  candidate_index integer not null,
  created_at timestamptz not null default now(),
  primary key (user_id, week_start)
);

-- Migrate a project created from an earlier version of this schema, where
-- first_round_picks had a single row per user (primary key user_id, no
-- week_start) — best-effort: any existing row is kept as this week's pick.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'first_round_picks' and column_name = 'updated_at'
  ) then
    alter table public.first_round_picks add column if not exists week_start date;
    update public.first_round_picks
      set week_start = (current_date - extract(dow from current_date)::int)
      where week_start is null;
    alter table public.first_round_picks alter column week_start set not null;
    alter table public.first_round_picks rename column updated_at to created_at;
    alter table public.first_round_picks drop constraint if exists first_round_picks_pkey;
    alter table public.first_round_picks add primary key (user_id, week_start);
  end if;
end $$;

alter table public.first_round_picks enable row level security;

drop policy if exists "first_round_picks: owner all" on public.first_round_picks;
create policy "first_round_picks: owner all" on public.first_round_picks
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
-- leagues / league_members — private groups ("Classements" on the Quiz tab).
-- A league is created with a random invite code; anyone with the code can
-- join. All writes go through the security-definer RPCs below, so there
-- are no insert/update/delete policies on these tables — a member can only
-- ever *read* their own leagues and fellow members.
-- ─────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;

create table if not exists public.leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.leagues enable row level security;

drop policy if exists "leagues: select member" on public.leagues;
create policy "leagues: select member" on public.leagues
  for select using (
    exists (
      select 1 from public.league_members m
      where m.league_id = leagues.id and m.user_id = auth.uid()
    )
  );

create table if not exists public.league_members (
  league_id uuid not null references public.leagues (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (league_id, user_id)
);

alter table public.league_members enable row level security;

drop policy if exists "league_members: select fellow member" on public.league_members;
create policy "league_members: select fellow member" on public.league_members
  for select using (
    exists (
      select 1 from public.league_members m2
      where m2.league_id = league_members.league_id and m2.user_id = auth.uid()
    )
  );

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
  delete from public.first_round_picks where user_id = auth.uid();
  update public.profiles
    set points = 0, notif_read = false, quiz_correct_total = 0, quiz_attempts_total = 0
    where id = auth.uid();
end;
$$;

-- Cumulative quiz accuracy — called once per answered question (the "Taux de
-- bonne réponse" / "Bonnes réponses" tiles on the Quiz tab read these back).
create or replace function public.increment_quiz_stat(is_correct boolean)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
    set quiz_attempts_total = quiz_attempts_total + 1,
        quiz_correct_total = quiz_correct_total + case when is_correct then 1 else 0 end
    where id = auth.uid();
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

-- ─────────────────────────────────────────────────────────────
-- RPCs — leagues (create with a fresh invite code, join by code, list mine,
-- list a league's members, leave)
-- ─────────────────────────────────────────────────────────────
create or replace function public.create_league(p_name text)
returns public.leagues
language plpgsql
security definer set search_path = public
as $$
declare
  v_code text;
  v_league public.leagues;
begin
  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'Le nom de la ligue est requis.';
  end if;
  loop
    v_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (select 1 from public.leagues where code = v_code);
  end loop;
  insert into public.leagues (name, code, owner_id)
    values (trim(p_name), v_code, auth.uid())
    returning * into v_league;
  insert into public.league_members (league_id, user_id) values (v_league.id, auth.uid());
  return v_league;
end;
$$;

create or replace function public.join_league(p_code text)
returns public.leagues
language plpgsql
security definer set search_path = public
as $$
declare
  v_league public.leagues;
begin
  select * into v_league from public.leagues where code = upper(trim(p_code));
  if v_league.id is null then
    raise exception 'Code de ligue invalide.';
  end if;
  insert into public.league_members (league_id, user_id)
    values (v_league.id, auth.uid())
    on conflict do nothing;
  return v_league;
end;
$$;

create or replace function public.leave_league(p_league_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  delete from public.league_members where league_id = p_league_id and user_id = auth.uid();
end;
$$;

-- The leagues the caller belongs to, with a live member count.
create or replace function public.get_my_leagues()
returns table (id uuid, name text, code text, owner_id uuid, member_count bigint)
language sql
security definer set search_path = public
as $$
  select l.id, l.name, l.code, l.owner_id, count(m2.user_id) as member_count
  from public.leagues l
  join public.league_members m on m.league_id = l.id and m.user_id = auth.uid()
  join public.league_members m2 on m2.league_id = l.id
  group by l.id, l.name, l.code, l.owner_id
  order by l.created_at desc;
$$;

-- A league's members ranked by points — only callable by a member of it.
create or replace function public.get_league_members(p_league_id uuid)
returns table (pseudo text, points integer)
language sql
security definer set search_path = public
as $$
  select coalesce(nullif(trim(p.pseudo), ''), 'Citoyen') as pseudo, p.points
  from public.league_members m
  join public.profiles p on p.id = m.user_id
  where m.league_id = p_league_id
    and exists (
      select 1 from public.league_members me
      where me.league_id = p_league_id and me.user_id = auth.uid()
    )
  order by p.points desc;
$$;

grant execute on function public.increment_points(integer) to authenticated;
grant execute on function public.increment_quiz_stat(boolean) to authenticated;
grant execute on function public.reset_progress() to authenticated;
grant execute on function public.get_leaderboard(integer) to authenticated;
grant execute on function public.create_league(text) to authenticated;
grant execute on function public.join_league(text) to authenticated;
grant execute on function public.leave_league(uuid) to authenticated;
grant execute on function public.get_my_leagues() to authenticated;
grant execute on function public.get_league_members(uuid) to authenticated;
