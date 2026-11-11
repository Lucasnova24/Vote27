-- ═════════════════════════════════════════════════════════════
-- Vote2027 — édition admin du contenu restant
-- À exécuter après admin_roles_schema.sql. Idempotent.
--
-- Ajoute droits de table + policy « admin write » (public.is_admin()) sur :
--   quiz_question_choices, quiz_daily_sets, quiz_daily_set_questions,
--   notifications_planning.
-- Les données des utilisateurs (votes, profils, réponses, ligues…) ne sont
-- volontairement PAS concernées.
-- ═════════════════════════════════════════════════════════════
do $$
declare t text;
begin
  foreach t in array array['quiz_question_choices','quiz_daily_sets','quiz_daily_set_questions','notifications_planning']
  loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('drop policy if exists %I on public.%I', t || ': admin write', t);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t || ': admin write', t);
  end loop;
end $$;
