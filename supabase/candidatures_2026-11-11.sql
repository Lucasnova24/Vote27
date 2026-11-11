-- ═════════════════════════════════════════════════════════════
-- Vote2027 — mise à jour des candidatures (11 novembre 2026)
-- Idempotent : peut être rejoué. Le seed de schema.sql utilise
-- « on conflict do nothing » et ne réécrit donc pas les lignes existantes ;
-- ce fichier applique les changements sur une base déjà peuplée.
-- ═════════════════════════════════════════════════════════════

-- Nouveaux candidats déclarés
insert into public.candidates (slug, full_name, party, candidacy_status, candidacy_note, website_url) values
  ('olivier-becht',   'Olivier Becht',   'Sans étiquette', 'Déclaré (octobre 2026)',      'Se revendique de l''« extrême centre ».', null),
  ('teddy-riner',     'Teddy Riner',     'Sans étiquette', 'Déclaré (9 novembre 2026)',   'Annonce en vidéo et dans Le Parisien.',   null),
  ('francois-ruffin', 'François Ruffin', 'Debout !',       'Déclaré (14 septembre 2026)', 'Annonce dans Libération.',                null)
on conflict (slug) do update set
  full_name = excluded.full_name, party = excluded.party,
  candidacy_status = excluded.candidacy_status, candidacy_note = excluded.candidacy_note,
  updated_at = now();

-- Les Écologistes : choix reporté au vote des adhérents (10-13 déc. 2026)
update public.candidates
   set candidacy_status = 'Pressentie',
       candidacy_note = 'Vote des adhérents Écologistes du 10 au 13 décembre 2026 (candidature ou ralliement).',
       updated_at = now()
 where slug = 'marine-tondelier';

-- Primaire « Choisir 2027 » : perdants (Glucksmann désigné le 11 octobre 2026)
update public.candidates
   set candidacy_status = case when slug = 'segolene-royal'
                               then 'Éliminée à la primaire (11 octobre 2026)'
                               else 'Éliminé à la primaire (11 octobre 2026)' end,
       candidacy_note = 'Primaire « Choisir 2027 », remportée par Raphaël Glucksmann.',
       updated_at = now()
 where slug in ('olivier-faure', 'segolene-royal', 'jerome-guedj', 'emmanuel-maurel');
