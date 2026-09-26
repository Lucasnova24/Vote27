-- ═════════════════════════════════════════════════════════════
-- Vote2027 — banque de questions du "Vote du jour" (oui/non)
-- À exécuter après supabase/schema.sql. Idempotent.
--
-- Remplace la question unique et figée codée en dur dans VoteScreen.tsx
-- par une banque de questions dont une est tirée chaque jour, de façon
-- déterministe (même mécanisme que get_daily_quiz : même question pour
-- tout le monde un jour donné, pour que le résultat affiché ait un sens).
-- ═════════════════════════════════════════════════════════════

create table if not exists public.vote_questions (
  code       text primary key,        -- 'V001'...
  ordre      integer not null,
  question   text not null,
  oui_label  text not null,
  non_label  text not null,
  statut     text not null default 'active' check (statut in ('active', 'a_verifier', 'retiree')),
  created_at timestamptz not null default now()
);

alter table public.vote_questions enable row level security;

drop policy if exists "vote_questions: lecture publique active" on public.vote_questions;
create policy "vote_questions: lecture publique active" on public.vote_questions
  for select to anon, authenticated using (statut = 'active');

insert into public.vote_questions (code, ordre, question, oui_label, non_label, statut) values
  ('V001', 1,  'Le vote devrait-il être obligatoire à toutes les élections nationales ?', 'Voter serait un devoir civique sanctionné', 'L''abstention reste une expression politique', 'active'),
  ('V002', 2,  'Faut-il revenir à un septennat présidentiel ?', 'Un mandat plus long stabilise l''action publique', 'Le quinquennat rapproche le Président des électeurs', 'active'),
  ('V003', 3,  'Faut-il inscrire le référendum d''initiative citoyenne dans la Constitution ?', 'Les citoyens doivent pouvoir proposer des lois', 'Le Parlement reste le bon niveau pour légiférer', 'active'),
  ('V004', 4,  'Faut-il supprimer le Sénat ?', 'Une chambre unique suffit et coûte moins cher', 'Le Sénat représente les territoires et modère la loi', 'active'),
  ('V005', 5,  'Faut-il instaurer la proportionnelle aux élections législatives ?', 'Chaque courant politique doit être représenté', 'Le scrutin majoritaire garantit des majorités stables', 'active'),
  ('V006', 6,  'Faut-il interdire le cumul des mandats dans le temps ?', 'Le renouvellement des élus doit être garanti', 'L''expérience d''un élu sert aussi les électeurs', 'active'),
  ('V007', 7,  'Faut-il abaisser l''âge légal de départ à la retraite ?', 'Le travail ne doit pas empiéter sur la fin de vie', 'L''équilibre des retraites impose de travailler plus longtemps', 'active'),
  ('V008', 8,  'Faut-il rétablir l''impôt de solidarité sur la fortune dans sa forme d''avant 2017 ?', 'Les grands patrimoines doivent davantage contribuer', 'Cet impôt pousserait les capitaux hors de France', 'active'),
  ('V009', 9,  'Faut-il sortir des accords de Schengen ?', 'La France doit reprendre le contrôle de ses frontières', 'La libre circulation profite à tous les Européens', 'active'),
  ('V010', 10, 'Faut-il relancer massivement la construction de réacteurs nucléaires ?', 'Le nucléaire garantit une énergie stable et décarbonée', 'Les renouvelables doivent être la priorité', 'active'),
  ('V011', 11, 'Faut-il légaliser le cannabis de façon encadrée ?', 'Un marché légal réduirait les trafics', 'La légalisation banaliserait un produit dangereux', 'active'),
  ('V012', 12, 'Faut-il rétablir les peines planchers pour les récidivistes ?', 'La récidive appelle une réponse pénale automatique', 'Le juge doit garder toute liberté d''appréciation', 'active'),
  ('V013', 13, 'Faut-il rendre le service national universel obligatoire ?', 'Chaque jeune doit vivre ce moment de cohésion nationale', 'L''obligation n''est pas la bonne méthode pour engager la jeunesse', 'active'),
  ('V014', 14, 'Faut-il autoriser le vote des étrangers non-européens aux élections locales ?', 'Vivre et payer ses impôts ici doit ouvrir ce droit', 'Le droit de vote doit rester lié à la nationalité', 'active'),
  ('V015', 15, 'Faut-il encadrer les loyers dans toutes les grandes villes ?', 'Se loger ne doit pas devenir inabordable', 'L''encadrement décourage la construction de logements', 'active'),
  ('V016', 16, 'Faut-il davantage taxer les résidences secondaires dans les zones tendues ?', 'Les logements vacants ou secondaires doivent contribuer', 'Cette taxe pénalise des propriétaires qui ne spéculent pas', 'active'),
  ('V017', 17, 'Faut-il autoriser une aide active à mourir encadrée par la loi ?', 'Chacun doit pouvoir choisir sa fin de vie', 'Les soins palliatifs doivent être la priorité', 'active'),
  ('V018', 18, 'Faut-il rendre gratuits les frais d''inscription à l''université ?', 'Les études supérieures ne doivent pas dépendre des moyens des familles', 'Une contribution responsabilise et finance les universités', 'active'),
  ('V019', 19, 'Faut-il porter le budget de la défense au-delà de 2 % du PIB ?', 'Le contexte international impose de réarmer', 'D''autres priorités budgétaires doivent passer avant', 'active'),
  ('V020', 20, 'Faut-il interdire la vente de véhicules thermiques neufs dès 2030 ?', 'Accélérer la transition automobile est nécessaire', 'Les ménages et l''industrie ont besoin de plus de temps', 'active')
on conflict (code) do update set
  ordre = excluded.ordre,
  question = excluded.question,
  oui_label = excluded.oui_label,
  non_label = excluded.non_label,
  statut = excluded.statut;

-- Which question a ballot answered — nullable for rows cast before this
-- migration (single fixed question, back then).
alter table public.votes add column if not exists question_code text references public.vote_questions (code);

-- Question du jour — même mécanisme déterministe que get_daily_quiz : une
-- seule question active par jour, identique pour tout le monde.
create or replace function public.get_daily_vote_question(p_date date default (now() at time zone 'Europe/Paris')::date)
returns table (
  code text,
  question text,
  oui_label text,
  non_label text
)
language sql
stable
security definer set search_path = public
as $$
  select v.code, v.question, v.oui_label, v.non_label
  from public.vote_questions v
  where v.statut = 'active'
  order by md5(v.code || p_date::text)
  limit 1;
$$;

grant execute on function public.get_daily_vote_question(date) to authenticated, anon;
