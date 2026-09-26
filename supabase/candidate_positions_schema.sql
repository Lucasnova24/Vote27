-- ═════════════════════════════════════════════════════════════
-- Vote2027 — "Programmes" côte à côte (src/screens/Programmes.tsx)
-- À exécuter après supabase/schema.sql. Idempotent.
--
-- Une ligne par (candidat, thème) : un résumé sourcé du programme du
-- candidat sur ce thème, avec l'année du programme cité (2027 dès que
-- publié et sourcé ; 2022 en repli sinon, cf. tâche "Intégrer les
-- programmes 2022 si ceux de 2027 ne sont pas encore disponibles").
--
-- Livré VOLONTAIREMENT VIDE : contrairement aux tables de contenu factuel
-- (agenda, candidats), un résumé de programme est une synthèse qui peut
-- déformer une position si elle est mal sourcée — remplir cette table est
-- un travail de sourçage à part entière (voir méthodologie déjà appliquée
-- à affinite_candidate_positions), pas quelque chose à générer de mémoire.
-- Une ligne insérée DOIT avoir un source_url vérifiable.
-- ═════════════════════════════════════════════════════════════

create table if not exists public.candidate_positions (
  id              uuid primary key default gen_random_uuid(),
  candidate_id    uuid not null references public.candidates (id) on delete cascade,
  theme           text not null check (theme in ('Institutions', 'Économie', 'Écologie', 'Europe', 'Social', 'Sécurité')),
  resume          text not null,
  annee_programme integer not null check (annee_programme in (2022, 2027)),
  source_url      text not null,
  updated_at      timestamptz not null default now(),
  unique (candidate_id, theme)
);

create index if not exists candidate_positions_theme_idx on public.candidate_positions (theme);

drop trigger if exists candidate_positions_updated_at on public.candidate_positions;
create trigger candidate_positions_updated_at before update on public.candidate_positions
  for each row execute function public.set_updated_at();

alter table public.candidate_positions enable row level security;

drop policy if exists "candidate_positions: lecture publique" on public.candidate_positions;
create policy "candidate_positions: lecture publique" on public.candidate_positions
  for select to anon, authenticated using (true);

-- Écriture réservée aux admins (public.is_admin(), défini dans
-- admin_roles_schema.sql — à exécuter avant celui-ci, ou après : l'ordre
-- n'importe pas, cette policy est juste ignorée tant que la fonction
-- n'existe pas encore, et rejouable une fois qu'elle existe).
do $$
begin
  if exists (select 1 from pg_proc where proname = 'is_admin' and pronamespace = 'public'::regnamespace) then
    execute 'drop policy if exists "candidate_positions: admin write" on public.candidate_positions';
    execute 'create policy "candidate_positions: admin write" on public.candidate_positions for all using (public.is_admin()) with check (public.is_admin())';
  end if;
end $$;
