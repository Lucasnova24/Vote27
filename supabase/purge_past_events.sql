-- Suppression automatique des événements passés, sauf les débats (on garde
-- l'historique des débats). Les lignes event_candidates partent avec
-- l'événement (on delete cascade).
-- À exécuter une fois dans le SQL Editor de Supabase.

create extension if not exists pg_cron;

create or replace function public.purge_past_events()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.events
  where category <> 'debat'
    and coalesce(end_date, event_date) < (now() at time zone 'Europe/Paris')::date;
$$;

revoke all on function public.purge_past_events() from public, anon, authenticated;

-- Tous les jours à 03:00 UTC (04:00/05:00 à Paris). Ré-exécutable sans doublon.
select cron.unschedule('purge-past-events')
  where exists (select 1 from cron.job where jobname = 'purge-past-events');
select cron.schedule('purge-past-events', '0 3 * * *', $$select public.purge_past_events()$$);
