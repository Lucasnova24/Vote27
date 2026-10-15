-- ═════════════════════════════════════════════════════════════
-- Vote2027 — suppression de compte (exigée par Apple App Store et Google Play)
-- À exécuter après supabase/schema.sql. Idempotent : peut être relancé.
--
-- public.delete_my_account() supprime l'utilisateur connecté dans auth.users.
-- Toutes les tables du schéma (profiles, votes, quiz_attempts, boussole_responses,
-- estimations, first_round_picks, debate_predictions, affinite_responses,
-- league_members, leagues dont il est propriétaire) référencent profiles(id) ou
-- auth.users(id) avec ON DELETE CASCADE : tout part avec le compte.
-- Les tables hors dépôt (ex. banque de quiz : quiz_answers…) qui portent une
-- colonne user_id sans cascade sont nettoyées explicitement ci-dessous, pour que
-- la suppression n'échoue pas sur une contrainte de clé étrangère.
--
-- Note : les ligues créées par l'utilisateur sont supprimées avec lui (cascade
-- sur owner_id), ce qui retire aussi leurs autres membres de ces ligues.
-- Fonctionne aussi pour les comptes anonymes (invités).
-- ═════════════════════════════════════════════════════════════

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer set search_path = public, auth
as $$
declare
  v_uid uuid := auth.uid();
  r record;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  -- Nettoyage défensif des tables publiques portant un user_id (hors cascade).
  for r in
    select c.table_name
    from information_schema.columns c
    join information_schema.tables t
      on t.table_schema = c.table_schema and t.table_name = c.table_name and t.table_type = 'BASE TABLE'
    where c.table_schema = 'public' and c.column_name = 'user_id' and c.data_type = 'uuid'
  loop
    execute format('delete from public.%I where user_id = $1', r.table_name) using v_uid;
  end loop;

  delete from public.profiles where id = v_uid;
  delete from auth.users where id = v_uid;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
