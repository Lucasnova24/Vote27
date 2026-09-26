-- ═════════════════════════════════════════════════════════════
-- Vote2027 — comptes administrateurs
-- À exécuter après supabase/schema.sql (et après les autres fichiers
-- additifs s'ils sont déjà en place — l'ordre entre eux n'importe pas).
--
-- Choix retenu : pas de panneau d'administration dédié dans l'app pour le
-- moment (trop gros chantier à lui seul) — la gestion de contenu (candidats,
-- agenda, quiz, questions Mes affinités, vote du jour, programmes) continue
-- de se faire via Supabase Studio, qui utilise déjà la clé service_role et
-- contourne toutes les policies RLS : aucune configuration n'est requise
-- pour ça, elle marche déjà. Ce script ajoute uniquement :
--   1. une colonne profiles.role ('user' | 'admin')
--   2. une fonction public.is_admin() utilisable dans des policies RLS
--   3. des policies d'écriture (insert/update/delete) réservées aux admins
--      sur les tables de contenu, pour préparer un futur écran d'admin
--      DANS l'app (avec la clé anon, donc soumis aux RLS) sans devoir
--      redonner les clés service_role à qui que ce soit.
--
-- Pour promouvoir un compte en admin (à exécuter manuellement, une fois le
-- compte déjà créé par une inscription normale dans l'app) :
--   update public.profiles set role = 'admin' where email = 'ton-adresse@exemple.fr';
-- ═════════════════════════════════════════════════════════════

alter table public.profiles add column if not exists role text not null default 'user' check (role in ('user', 'admin'));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false);
$$;

grant execute on function public.is_admin() to authenticated;

-- Contenu éditorial : lecture publique déjà en place (schema.sql /
-- affinites_schema.sql / quiz_bank_schema.sql / vote_bank_schema.sql) ;
-- on ajoute ici les policies d'écriture réservées aux admins.
do $$
declare
  t text;
begin
  foreach t in array array[
    'candidates', 'events', 'event_candidates',
    'affinite_themes', 'affinite_questions', 'affinite_candidate_positions',
    'quiz_themes', 'quiz_questions',
    'vote_questions'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', t || ': admin write', t);
    execute format(
      'create policy %I on public.%I for all using (public.is_admin()) with check (public.is_admin())',
      t || ': admin write', t
    );
  end loop;
end $$;

-- candidate_positions (programmes 2022/2027) n'existe que si
-- candidate_positions_schema.sql a déjà été exécuté — policy ajoutée là-bas
-- directement pour ne pas dépendre de l'ordre d'exécution des scripts.
