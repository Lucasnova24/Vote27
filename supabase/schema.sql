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
-- votes — the daily "vote obligatoire" question: one row per user *per day*
-- (vote_date = the Europe/Paris calendar day, computed client-side by
-- src/lib/day.ts), so the "Vote du jour" To do item resets every day
-- instead of staying "Fait" forever once a user has voted once.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.votes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  choice text not null check (choice in ('oui', 'non')),
  vote_date date not null default (now() at time zone 'Europe/Paris')::date,
  created_at timestamptz not null default now(),
  primary key (user_id, vote_date)
);

-- Migrate a project created from an earlier version of this schema, where
-- votes had a single row per user (primary key user_id, no vote_date).
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'votes' and column_name = 'vote_date'
  ) then
    alter table public.votes add column vote_date date;
    update public.votes set vote_date = (created_at at time zone 'Europe/Paris')::date;
    alter table public.votes alter column vote_date set not null;
    alter table public.votes alter column vote_date set default (now() at time zone 'Europe/Paris')::date;
    alter table public.votes drop constraint votes_pkey;
    alter table public.votes add primary key (user_id, vote_date);
  end if;
end $$;

alter table public.votes enable row level security;

drop policy if exists "votes: owner all" on public.votes;
create policy "votes: owner all" on public.votes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- quiz_attempts — daily quiz result: one row per user *per day* (quiz_date
-- = the Europe/Paris calendar day, computed client-side by src/lib/day.ts),
-- so the "Quiz du jour" To do item resets every day instead of staying
-- "Fait" forever once a user has done the quiz once.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.quiz_attempts (
  user_id uuid not null references public.profiles (id) on delete cascade,
  score integer not null,
  answers integer[] not null,
  quiz_date date not null default (now() at time zone 'Europe/Paris')::date,
  created_at timestamptz not null default now(),
  primary key (user_id, quiz_date)
);

-- Migrate a project created from an earlier version of this schema, where
-- quiz_attempts had a single row per user (primary key user_id, no
-- quiz_date).
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'quiz_attempts' and column_name = 'quiz_date'
  ) then
    alter table public.quiz_attempts add column quiz_date date;
    update public.quiz_attempts set quiz_date = (created_at at time zone 'Europe/Paris')::date;
    alter table public.quiz_attempts alter column quiz_date set not null;
    alter table public.quiz_attempts alter column quiz_date set default (now() at time zone 'Europe/Paris')::date;
    alter table public.quiz_attempts drop constraint quiz_attempts_pkey;
    alter table public.quiz_attempts add primary key (user_id, quiz_date);
  end if;
end $$;

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

-- A weekly pick is final until the next week starts: owners can read and
-- insert (for the current week only), but there is no update policy, so a
-- pick can't be changed. Deletes stay allowed for "Réinitialiser".
drop policy if exists "first_round_picks: owner all" on public.first_round_picks;
drop policy if exists "first_round_picks: owner read" on public.first_round_picks;
drop policy if exists "first_round_picks: owner insert this week" on public.first_round_picks;
drop policy if exists "first_round_picks: owner delete" on public.first_round_picks;
create policy "first_round_picks: owner read" on public.first_round_picks
  for select using (auth.uid() = user_id);
create policy "first_round_picks: owner insert this week" on public.first_round_picks
  for insert with check (
    auth.uid() = user_id
    and week_start <= (now() at time zone 'Europe/Paris')::date
    and week_start > (now() at time zone 'Europe/Paris')::date - 7
  );
create policy "first_round_picks: owner delete" on public.first_round_picks
  for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- debate_predictions — "who will be most convincing" pre-debate pick
-- ─────────────────────────────────────────────────────────────
create table if not exists public.debate_predictions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  candidate_index integer not null,
  created_at timestamptz not null default now()
);

-- The debate vote now targets the members of a real agenda debate (who may
-- not be presidential candidates at all), so it's keyed by slugs rather
-- than by an index into the app's CANDS roster.
alter table public.debate_predictions add column if not exists event_slug text;
alter table public.debate_predictions add column if not exists candidate_slug text;
alter table public.debate_predictions alter column candidate_index drop not null;

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

create table if not exists public.league_members (
  league_id uuid not null references public.leagues (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (league_id, user_id)
);

alter table public.league_members enable row level security;

-- Policies below reference league_members, so they must come after it exists.
drop policy if exists "leagues: select member" on public.leagues;
create policy "leagues: select member" on public.leagues
  for select using (
    exists (
      select 1 from public.league_members m
      where m.league_id = leagues.id and m.user_id = auth.uid()
    )
  );

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
  -- quiz_answers belongs to the daily-quiz migration (applied separately,
  -- not tracked in this file) — guarded so reset_progress still works on a
  -- database where it hasn't been run yet.
  if to_regclass('public.quiz_answers') is not null then
    execute 'delete from public.quiz_answers where user_id = $1' using auth.uid();
  end if;
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

-- Real tally of the "Vote du jour" ballots (votes rows are private per
-- user, so the aggregate goes through a security-definer function).
create or replace function public.get_vote_results()
returns table (choice text, total bigint)
language sql
stable
security definer set search_path = public
as $$
  select v.choice, count(*)::bigint from public.votes v
  where v.vote_date = (now() at time zone 'Europe/Paris')::date
  group by v.choice;
$$;

grant execute on function public.get_vote_results() to authenticated;

-- ═════════════════════════════════════════════════════════════
-- Agenda — real 2027 campaign events (interviews, débats, meetings,
-- primaries...), sourced with a reliability flag per event. This is
-- separate from the app's own CANDS roster (src/data.ts, one candidate
-- per party for voting/programmes/débat): here every individual in a
-- real scheduled event is tracked, including primary contenders who
-- won't all end up as the final candidate.
-- Collected 23/09/2026, spot-checked against LCP and Touteleurope.
-- ═════════════════════════════════════════════════════════════

do $$ begin
  create type public.event_category as enum ('interview', 'debat', 'meeting', 'autre');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.event_reliability as enum ('confirme', 'a_confirmer', 'conditionnel');
exception when duplicate_object then null; end $$;

-- exact  : date + heure connues
-- jour   : date connue, heure inconnue
-- mois   : seul le mois est connu
-- approx : période approximative (ex. « vers la Toussaint »)
do $$ begin
  create type public.date_precision as enum ('exact', 'jour', 'mois', 'approx');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.participant_role as enum ('participant', 'invite', 'organisateur');
exception when duplicate_object then null; end $$;

create table if not exists public.candidates (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  full_name        text not null,
  party            text not null,
  candidacy_status text not null,
  candidacy_note   text,
  website_url      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists public.events (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  category       public.event_category not null,
  subtype        text,
  title          text not null,
  description    text,
  event_date     date,
  end_date       date,
  start_time     time,
  date_precision public.date_precision not null default 'jour',
  date_label     text,
  location       text,
  city           text,
  media          text,
  reliability    public.event_reliability not null default 'confirme',
  source_name    text,
  source_url     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint end_after_start check (end_date is null or event_date is null or end_date >= event_date),
  constraint label_if_no_date check (event_date is not null or date_label is not null)
);

create table if not exists public.event_candidates (
  event_id     uuid not null references public.events(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  role         public.participant_role not null default 'participant',
  primary key (event_id, candidate_id)
);

create index if not exists events_category_idx on public.events (category);
create index if not exists events_date_idx on public.events (event_date);
create index if not exists event_candidates_cand_idx on public.event_candidates (candidate_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists candidates_updated_at on public.candidates;
create trigger candidates_updated_at before update on public.candidates
  for each row execute function public.set_updated_at();

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at before update on public.events
  for each row execute function public.set_updated_at();

alter table public.candidates enable row level security;
alter table public.events enable row level security;
alter table public.event_candidates enable row level security;

drop policy if exists "Lecture publique des candidats" on public.candidates;
create policy "Lecture publique des candidats"
  on public.candidates for select to anon, authenticated using (true);

drop policy if exists "Lecture publique des événements" on public.events;
create policy "Lecture publique des événements"
  on public.events for select to anon, authenticated using (true);

drop policy if exists "Lecture publique des participations" on public.event_candidates;
create policy "Lecture publique des participations"
  on public.event_candidates for select to anon, authenticated using (true);

-- Ready-to-consume view: computed status + candidates aggregated as JSON.
-- No `security_invoker` option here (Postgres 15+ only, and errors out on
-- older Postgres — which broke this view entirely on first deploy): the
-- RLS policies on all three underlying tables are public "using (true)"
-- reads anyway, so invoker vs. definer semantics make no difference here.
create or replace view public.agenda
as
select
  e.id,
  e.slug,
  e.category,
  e.subtype,
  e.title,
  e.description,
  e.event_date,
  e.end_date,
  e.start_time,
  e.date_precision,
  coalesce(e.date_label, to_char(e.event_date, 'DD/MM/YYYY')) as display_date,
  e.location,
  e.city,
  e.media,
  e.reliability,
  e.source_name,
  e.source_url,
  case
    when e.event_date is null then 'date_a_fixer'
    when coalesce(e.end_date, e.event_date) < (now() at time zone 'Europe/Paris')::date then 'passe'
    when e.event_date <= (now() at time zone 'Europe/Paris')::date then 'en_cours'
    else 'a_venir'
  end as status,
  coalesce(
    (select jsonb_agg(jsonb_build_object(
              'id', c.id, 'slug', c.slug, 'name', c.full_name,
              'party', c.party, 'role', ec.role)
            order by c.full_name)
       from public.event_candidates ec
       join public.candidates c on c.id = ec.candidate_id
      where ec.event_id = e.id),
    '[]'::jsonb
  ) as candidates
from public.events e;

grant select on public.agenda to anon, authenticated;

-- Debate vote rules, enforced server-side (needs the agenda tables above):
-- a vote is only accepted once today's debate has started, and only for
-- one of its actual members (event_candidates, role 'participant').
drop policy if exists "debate_predictions: owner all" on public.debate_predictions;
drop policy if exists "debate_predictions: owner read" on public.debate_predictions;
drop policy if exists "debate_predictions: owner delete" on public.debate_predictions;
drop policy if exists "debate_predictions: vote insert" on public.debate_predictions;
drop policy if exists "debate_predictions: vote update" on public.debate_predictions;

create policy "debate_predictions: owner read" on public.debate_predictions
  for select using (auth.uid() = user_id);
create policy "debate_predictions: owner delete" on public.debate_predictions
  for delete using (auth.uid() = user_id);

create or replace function public.debate_vote_allowed(p_event_slug text, p_candidate_slug text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1
      from public.events e
      join public.event_candidates ec on ec.event_id = e.id and ec.role = 'participant'
      join public.candidates c on c.id = ec.candidate_id
     where e.slug = p_event_slug
       and c.slug = p_candidate_slug
       and e.category = 'debat'
       and e.start_time is not null
       and e.event_date = (now() at time zone 'Europe/Paris')::date
       and (e.event_date + e.start_time) <= (now() at time zone 'Europe/Paris')
  );
$$;

create policy "debate_predictions: vote insert" on public.debate_predictions
  for insert with check (auth.uid() = user_id and public.debate_vote_allowed(event_slug, candidate_slug));
create policy "debate_predictions: vote update" on public.debate_predictions
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id and public.debate_vote_allowed(event_slug, candidate_slug));

-- Seed data — additive, safe to re-run (unique slugs, on conflict do nothing).
insert into public.candidates (slug, full_name, party, candidacy_status, candidacy_note, website_url) values
  ('marine-le-pen',         'Marine Le Pen',         'RN',                        'Déclarée (7 juillet 2026)',                'Condamnée en appel le même jour, pourvoi en cassation.', null),
  ('jean-luc-melenchon',    'Jean-Luc Mélenchon',    'LFI',                       'Déclaré (3 mai 2026)',                     '4e candidature ; refuse toute primaire.',               'https://lafranceinsoumise.fr/'),
  ('edouard-philippe',      'Édouard Philippe',      'Horizons',                  'Déclaré (septembre 2024)',                 null,                                                     'https://www.edouardphilippe.fr/'),
  ('gabriel-attal',         'Gabriel Attal',         'Renaissance',               'Déclaré (22 mai 2026)',                    null,                                                     'https://attalpresident.fr/'),
  ('bruno-retailleau',      'Bruno Retailleau',      'LR',                        'Désigné par les adhérents (19 avril 2026)','73,8 % des voix en consultation interne.',              null),
  ('marine-tondelier',      'Marine Tondelier',      'Les Écologistes',           'Déclarée',                                 'Hors primaire PS / Place publique.',                    'https://marinetondelier.fr/'),
  ('fabien-roussel',        'Fabien Roussel',        'PCF',                       'Déclaré (6 septembre 2026)',               'Validé à 72 % par les militants.',                       null),
  ('olivier-faure',         'Olivier Faure',         'PS',                        'Candidat à la primaire',                   'Primaire « Choisir 2027 ».',                             null),
  ('raphael-glucksmann',    'Raphaël Glucksmann',    'Place publique',            'Candidat à la primaire',                   'Primaire « Choisir 2027 ».',                             null),
  ('segolene-royal',        'Ségolène Royal',        'Primaire PS / Place publique','Candidate à la primaire',                'Primaire « Choisir 2027 ».',                             null),
  ('jerome-guedj',          'Jérôme Guedj',          'PS',                        'Candidat à la primaire',                   'Primaire « Choisir 2027 ».',                             null),
  ('emmanuel-maurel',       'Emmanuel Maurel',       'GRS',                       'Candidat à la primaire',                   'Primaire « Choisir 2027 ».',                             null),
  ('eric-zemmour',          'Éric Zemmour',          'Reconquête',                'Candidature confirmée oralement (17 sept. 2026)', 'Déclaration formelle attendue à l''automne.',   null),
  ('nicolas-dupont-aignan', 'Nicolas Dupont-Aignan', 'DLF',                       'Déclaré (19 septembre 2026)',              '4e candidature.',                                        null),
  ('david-lisnard',         'David Lisnard',         'Nouvelle Énergie',          'Déclaré',                                  'A quitté LR en avril 2026.',                             null),
  ('bernard-cazeneuve',     'Bernard Cazeneuve',     'Gauche (hors primaire)',    'Déclaré (16 juillet 2026)',                'A décliné la primaire socialiste.',                      null),
  ('delphine-batho',        'Delphine Batho',        'Génération écologie',       'Déclarée',                                 null,                                                     null),
  ('karim-bouamrane',       'Karim Bouamrane',       'PS',                        'Déclaré',                                  'Maire de Saint-Ouen.',                                   null),
  ('nathalie-arthaud',      'Nathalie Arthaud',      'LO',                        'Déclarée',                                 null,                                                     null)
on conflict (slug) do nothing;

insert into public.events
  (slug, category, subtype, title, description, event_date, end_date, start_time, date_precision, date_label, location, city, media, reliability, source_name, source_url)
values
  ('primaire-ps-debat-1', 'debat', 'Débat de primaire',
   'Débat n°1 de la primaire sociale-démocrate',
   'Format « Face aux Français », présenté par David Pujadas, en partenariat avec Le Parisien. Une dizaine de Français interpellent les candidats.',
   '2026-09-23', null, '20:40', 'exact', null,
   null, null, 'LCI', 'confirme', 'LCP',
   'https://lcp.fr/actualites/primaire-de-gauche-les-candidats-face-a-face-lors-d-un-premier-debat-televise-ce'),

  ('primaire-ps-debat-2', 'debat', 'Débat de primaire',
   'Débat n°2 de la primaire sociale-démocrate',
   'Horaire, chaîne précise et présentateurs non communiqués à ce stade.',
   '2026-10-01', null, null, 'jour', null,
   null, null, 'France Télévisions', 'a_confirmer', 'LCP',
   'https://lcp.fr/actualites/primaire-de-gauche-les-candidats-face-a-face-lors-d-un-premier-debat-televise-ce'),

  ('primaire-ps-debat-3', 'debat', 'Débat de primaire',
   'Débat n°3 de la primaire sociale-démocrate',
   'Horaire non communiqué à ce stade.',
   '2026-10-04', null, null, 'jour', null,
   null, null, 'BFMTV', 'a_confirmer', 'LCP',
   'https://lcp.fr/actualites/primaire-de-gauche-les-candidats-face-a-face-lors-d-un-premier-debat-televise-ce'),

  ('primaire-ps-tour-1', 'autre', 'Scrutin interne',
   '1er tour de la primaire « Choisir 2027 »',
   'Vote ouvert moyennant une participation financière.',
   '2026-10-09', '2026-10-10', null, 'jour', null,
   null, null, null, 'confirme', 'Toute l''Europe',
   'https://www.touteleurope.eu/vie-politique-des-etats-membres/presidentielle-2027-qui-sont-les-candidats-deja-declares/'),

  ('attal-meeting-lyon', 'meeting', 'Grand meeting',
   'Grand meeting de campagne de Gabriel Attal',
   'Inscription en ligne sur le site de campagne. Salle exacte à préciser.',
   '2026-10-10', null, null, 'jour', null,
   null, 'Lyon', null, 'confirme', 'Site de campagne Gabriel Attal',
   'https://attalpresident.fr/meeting'),

  ('primaire-ps-tour-2', 'autre', 'Scrutin interne',
   '2nd tour éventuel de la primaire « Choisir 2027 »',
   'Uniquement si aucun candidat n''est désigné au premier tour.',
   '2026-10-16', '2026-10-17', null, 'jour', null,
   null, null, null, 'conditionnel', 'LCP',
   'https://lcp.fr/actualites/primaire-de-gauche-les-candidats-face-a-face-lors-d-un-premier-debat-televise-ce'),

  ('zemmour-declaration', 'autre', 'Annonce',
   'Déclaration formelle de candidature d''Éric Zemmour',
   'Selon son entourage, déclaration attendue à l''automne, probablement dès octobre.',
   null, null, null, 'mois', 'Octobre 2026 (date non fixée)',
   null, null, null, 'a_confirmer', 'ICI',
   'https://www.ici.fr/infos/politique/presidentielle-2027-qui-sont-les-candidats-declares-1598133'),

  ('reunion-droite-centre-toussaint', 'autre', 'Réunion politique',
   'Réunion de la droite et du centre proposée par Édouard Philippe',
   'Invitations adressées aux partis et courants de la droite et du centre. Bruno Retailleau (LR) a décliné.',
   null, null, null, 'approx', 'Vers la Toussaint 2026',
   null, 'Paris', null, 'a_confirmer', 'Revue de presse (Le Monde, TF1 Info, AFP)',
   'https://www.titrespresse.com/20633512603/edouard-philippe-rencontre')
on conflict (slug) do nothing;

insert into public.event_candidates (event_id, candidate_id, role)
select e.id, c.id, 'participant'
from public.events e
cross join public.candidates c
where e.slug in ('primaire-ps-debat-1', 'primaire-ps-debat-2', 'primaire-ps-debat-3',
                 'primaire-ps-tour-1', 'primaire-ps-tour-2')
  and c.slug in ('olivier-faure', 'raphael-glucksmann', 'segolene-royal', 'jerome-guedj', 'emmanuel-maurel')
on conflict do nothing;

insert into public.event_candidates (event_id, candidate_id, role)
select e.id, c.id, v.role::public.participant_role
from (values
  ('attal-meeting-lyon',             'gabriel-attal',    'participant'),
  ('zemmour-declaration',            'eric-zemmour',     'participant'),
  ('reunion-droite-centre-toussaint','edouard-philippe', 'organisateur')
) as v(event_slug, candidate_slug, role)
join public.events e     on e.slug = v.event_slug
join public.candidates c on c.slug = v.candidate_slug
on conflict do nothing;
