-- ═════════════════════════════════════════════════════════════
-- Vote2027 — notifications push (Web Push / PWA)
-- À exécuter après supabase/schema.sql. Idempotent.
--
-- Deux tables :
--   1. push_subscriptions       un abonnement push par appareil (créé par l'app
--                               quand l'utilisateur active les notifications)
--   2. notifications_planning   TON "tableur" : une ligne = une notification à
--                               envoyer à tous les abonnés, à une date et une
--                               heure (heure de Paris) que tu choisis. Se
--                               remplit dans Supabase Studio (Table Editor),
--                               à la main ou par import CSV
--                               (modèle : supabase/notifications_planning_modele.csv).
--
-- L'envoi est fait chaque minute par l'Edge Function `send-notifications`
-- (voir supabase/functions/ et la section pg_cron en bas de ce fichier).
-- ═════════════════════════════════════════════════════════════

-- ── Abonnements push ────────────────────────────────────────
create table if not exists public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

drop policy if exists "push_subscriptions: lecture des siens" on public.push_subscriptions;
create policy "push_subscriptions: lecture des siens" on public.push_subscriptions
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "push_subscriptions: ajout des siens" on public.push_subscriptions;
create policy "push_subscriptions: ajout des siens" on public.push_subscriptions
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "push_subscriptions: modification des siens" on public.push_subscriptions;
create policy "push_subscriptions: modification des siens" on public.push_subscriptions
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "push_subscriptions: suppression des siens" on public.push_subscriptions;
create policy "push_subscriptions: suppression des siens" on public.push_subscriptions
  for delete to authenticated using (user_id = auth.uid());

-- ── Planning des notifications (à remplir dans Studio) ─────
create table if not exists public.notifications_planning (
  id           uuid primary key default gen_random_uuid(),
  categorie    text not null default 'autre'
                 check (categorie in ('question_du_jour', 'evenements', 'vote_semaine', 'autre')),
  titre        text not null,                 -- ligne en gras de la notification
  message      text not null,                 -- texte de la notification
  lien         text not null default '/',     -- écran ouvert au toucher (laisser '/')
  date_envoi   date not null,                 -- jour d'envoi, heure de Paris
  heure_envoi  time not null,                 -- heure d'envoi, heure de Paris (ex. 08:30)
  actif        boolean not null default true, -- décocher pour suspendre sans supprimer
  envoye_le    timestamptz,                   -- rempli automatiquement à l'envoi
  nb_envois    integer,                       -- nb d'appareils atteints, rempli automatiquement
  created_at   timestamptz not null default now()
);

create index if not exists notifications_planning_due_idx
  on public.notifications_planning (date_envoi, heure_envoi) where envoye_le is null;

-- RLS activée sans aucune policy : seuls Studio / service_role y accèdent,
-- jamais l'app (clé anon).
alter table public.notifications_planning enable row level security;

-- Prend, de façon atomique, les notifications arrivées à échéance et les marque
-- comme envoyées (évite tout double envoi si deux exécutions se chevauchent).
-- Une notification vieille de plus de 6 h n'est PAS envoyée (ex. ligne créée en
-- retard, ou panne prolongée) pour ne pas notifier tout le monde hors de propos.
create or replace function public.claim_due_notifications()
returns setof public.notifications_planning
language sql
security definer set search_path = public
as $$
  update public.notifications_planning n
     set envoye_le = now()
   where n.id in (
     select id from public.notifications_planning
      where actif
        and envoye_le is null
        and ((date_envoi + heure_envoi) at time zone 'Europe/Paris') <= now()
        and ((date_envoi + heure_envoi) at time zone 'Europe/Paris') > now() - interval '6 hours'
      for update skip locked
   )
  returning n.*;
$$;

revoke all on function public.claim_due_notifications() from public, anon, authenticated;
grant execute on function public.claim_due_notifications() to service_role;

-- ── Déclenchement chaque minute (pg_cron + pg_net) ──────────
-- À faire UNE FOIS, après avoir déployé l'Edge Function (voir README) :
--
--   1. Database → Extensions : activer pg_cron et pg_net.
--   2. Choisir un secret (une longue chaîne aléatoire) et le ranger dans le Vault :
--        select vault.create_secret('<TON_SECRET>', 'cron_secret');
--      puis donner la même valeur à la fonction :  CRON_SECRET=<TON_SECRET>
--   3. Planifier l'appel (remplacer <PROJECT_REF>) :
--
--   select cron.schedule('send-notifications', '* * * * *', $cron$
--     select net.http_post(
--       url     := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-notifications',
--       headers := jsonb_build_object(
--         'Content-Type', 'application/json',
--         'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
--       ),
--       body    := '{}'::jsonb
--     );
--   $cron$);
--
-- Pour l'arrêter :  select cron.unschedule('send-notifications');
