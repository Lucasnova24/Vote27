-- ═════════════════════════════════════════════════════════════
-- Vote2027 — « Mes affinités » : banque de questions + rapprochement candidats
-- À exécuter après supabase/schema.sql (les tables ci-dessous référencent
-- public.profiles et public.candidates). Idempotent : chaque instruction
-- peut être rejouée sans dupliquer ni écraser les réponses des utilisateurs.
--
-- Contenu :
--   1. 9 candidats de src/data.ts (CANDS) absents de public.candidates
--   2. affinite_themes            — 10 thèmes
--   3. affinite_questions         — 100 énoncés (poids + appartenance au quiz court)
--   4. affinite_candidate_positions — positions des candidats par énoncé (à sourcer)
--   5. affinite_responses         — réponses des utilisateurs
--   6. get_affinite_scores() / get_affinite_scores_par_theme() — calcul du score
--   7. reset_progress() mis à jour pour purger aussi les réponses d'affinités
-- ═════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- 1. Compléter public.candidates avec les candidats de CANDS (src/data.ts)
--    qui n'apparaissent pas encore dans la table (celle-ci ne couvrait que
--    l'agenda ; on l'utilise ici aussi comme référentiel du matching).
-- ─────────────────────────────────────────────────────────────
insert into public.candidates (slug, full_name, party, candidacy_status) values

  ('francois-asselineau', 'François Asselineau', 'UPR', 'Déclaré'),
  ('xavier-bertrand', 'Xavier Bertrand', 'Nous, France', 'Déclaré'),
  ('sylvain-durif', 'Sylvain Durif', 'Elvita', 'Déclaré'),
  ('anasse-kazib', 'Anasse Kazib', 'Révolution permanente', 'Déclaré'),
  ('selma-labib', 'Selma Labib', 'NPA – Révolutionnaires', 'Déclarée'),
  ('francis-lalanne', 'Francis Lalanne', 'France Libre', 'Déclaré'),
  ('jean-lassalle', 'Jean Lassalle', 'Résistons !', 'Pressenti'),
  ('florian-philippot', 'Florian Philippot', 'Les Patriotes', 'Déclaré'),
  ('dominique-de-villepin', 'Dominique de Villepin', 'Sans étiquette', 'Pressenti')

on conflict (slug) do nothing;


-- ─────────────────────────────────────────────────────────────
-- 2. Thèmes
-- ─────────────────────────────────────────────────────────────
create table if not exists public.affinite_themes (
  code  text primary key,
  label text not null,
  ordre integer not null
);

alter table public.affinite_themes enable row level security;

drop policy if exists "affinite_themes: lecture publique" on public.affinite_themes;
create policy "affinite_themes: lecture publique" on public.affinite_themes
  for select to anon, authenticated using (true);

insert into public.affinite_themes (code, label, ordre) values

  ('INST', 'Institutions & démocratie', 1),
  ('ECO', 'Économie & fiscalité', 2),
  ('TRAV', 'Travail & protection sociale', 3),
  ('ECOL', 'Écologie & énergie', 4),
  ('EUR', 'Europe & international', 5),
  ('SEC', 'Sécurité & justice', 6),
  ('IMMI', 'Immigration & intégration', 7),
  ('EDU', 'Éducation & jeunesse', 8),
  ('SANTE', 'Santé', 9),
  ('LOG', 'Logement & territoires', 10)

on conflict (code) do update set label = excluded.label, ordre = excluded.ordre;


-- ─────────────────────────────────────────────────────────────
-- 3. Questions — 100 énoncés, 10 par thème. `dans_quiz_20` marque les 20
--    retenus pour le quiz court (2 par thème, cf. méthodologie). `poids`
--    vaut 2 pour les énoncés jugés les plus identitaires/clivants, 1 sinon
--    — ajustable plus tard sans avoir à recollecter les réponses.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.affinite_questions (
  id            text primary key,        -- 'Q001'..'Q100'
  ordre         integer not null,
  theme_code    text not null references public.affinite_themes (code),
  enonce        text not null,
  poids         smallint not null default 1 check (poids between 1 and 3),
  dans_quiz_20  boolean not null default false,
  dans_quiz_100 boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists affinite_questions_theme_idx on public.affinite_questions (theme_code);

alter table public.affinite_questions enable row level security;

drop policy if exists "affinite_questions: lecture publique" on public.affinite_questions;
create policy "affinite_questions: lecture publique" on public.affinite_questions
  for select to anon, authenticated using (true);

insert into public.affinite_questions (id, ordre, theme_code, enonce, poids, dans_quiz_20, dans_quiz_100) values

  ('Q001', 1, 'INST', 'Le vote doit être obligatoire à toutes les élections nationales.', 1, true, true),
  ('Q002', 2, 'INST', 'Le référendum d''initiative citoyenne (RIC) doit être inscrit dans la Constitution.', 2, false, true),
  ('Q003', 3, 'INST', 'Le cumul des mandats dans le temps (plus de trois mandats consécutifs) doit être interdit.', 2, false, true),
  ('Q004', 4, 'INST', 'La proportionnelle doit remplacer le scrutin majoritaire pour les élections législatives.', 1, true, true),
  ('Q005', 5, 'INST', 'Le Sénat doit être supprimé.', 1, false, true),
  ('Q006', 6, 'INST', 'Le mandat présidentiel doit redevenir un septennat non renouvelable.', 1, false, true),
  ('Q007', 7, 'INST', 'Les ministres doivent démissionner de leur mandat de parlementaire ou d''élu local dès leur nomination.', 1, false, true),
  ('Q008', 8, 'INST', 'Le vote des étrangers non-européens doit être autorisé aux élections locales.', 2, false, true),
  ('Q009', 9, 'INST', 'Un droit de révocation des élus en cours de mandat doit être instauré.', 1, false, true),
  ('Q010', 10, 'INST', 'Le nombre de parlementaires doit être réduit d''au moins un tiers.', 1, false, true),
  ('Q011', 11, 'ECO', 'L''État doit réduire la dépense publique même si cela touche certains services.', 1, true, true),
  ('Q012', 12, 'ECO', 'L''impôt sur la fortune doit être rétabli sous sa forme d''avant 2017.', 2, false, true),
  ('Q013', 13, 'ECO', 'Les droits de succession doivent être allégés.', 1, false, true),
  ('Q014', 14, 'ECO', 'Le SMIC doit être fortement augmenté.', 2, true, true),
  ('Q015', 15, 'ECO', 'La durée légale du travail doit être portée sous les 35 heures.', 1, false, true),
  ('Q016', 16, 'ECO', 'Les grandes entreprises qui versent des dividendes en hausse doivent voir leurs impôts augmenter.', 1, false, true),
  ('Q017', 17, 'ECO', 'La France doit sortir de l''euro pour retrouver une monnaie nationale.', 2, false, true),
  ('Q018', 18, 'ECO', 'La dette publique doit être réduite en priorité, avant toute nouvelle dépense sociale.', 1, false, true),
  ('Q019', 19, 'ECO', 'Les aides publiques aux entreprises doivent être conditionnées au maintien de l''emploi en France.', 1, false, true),
  ('Q020', 20, 'ECO', 'La fraude et l''évasion fiscales doivent devenir une priorité absolue de l''action publique, même au prix d''un contrôle fiscal renforcé.', 1, false, true),
  ('Q021', 21, 'TRAV', 'L''âge légal de départ à la retraite doit être abaissé à 60 ans.', 2, true, true),
  ('Q022', 22, 'TRAV', 'Le RSA doit être conditionné à des heures d''activité obligatoires.', 1, false, true),
  ('Q023', 23, 'TRAV', 'L''assurance chômage doit être rendue plus stricte pour inciter au retour à l''emploi.', 1, false, true),
  ('Q024', 24, 'TRAV', 'Un revenu de base universel doit être instauré pour tous les citoyens.', 2, true, true),
  ('Q025', 25, 'TRAV', 'La semaine de travail doit être réduite à 4 jours, à salaire égal.', 1, false, true),
  ('Q026', 26, 'TRAV', 'Les seniors doivent bénéficier d''un dispositif obligatoire de maintien dans l''emploi après 55 ans.', 1, false, true),
  ('Q027', 27, 'TRAV', 'Le contrat de travail à durée indéterminée doit rester la norme, avec un encadrement plus strict des contrats courts.', 1, false, true),
  ('Q028', 28, 'TRAV', 'Les cotisations sociales des entreprises doivent être allégées pour favoriser l''embauche.', 1, false, true),
  ('Q029', 29, 'TRAV', 'La négociation collective par branche doit primer sur les accords d''entreprise.', 1, false, true),
  ('Q030', 30, 'TRAV', 'L''héritage des grandes fortunes doit être davantage taxé pour financer la protection sociale.', 1, false, true),
  ('Q031', 31, 'ECOL', 'Les objectifs climatiques doivent primer sur la compétitivité économique à court terme.', 1, true, true),
  ('Q032', 32, 'ECOL', 'La France doit relancer massivement la construction de réacteurs nucléaires.', 2, true, true),
  ('Q033', 33, 'ECOL', 'La vente de véhicules thermiques neufs doit être interdite dès 2030 au lieu de 2035.', 1, false, true),
  ('Q034', 34, 'ECOL', 'Une taxe carbone plus élevée doit s''appliquer aux produits importés très polluants.', 1, false, true),
  ('Q035', 35, 'ECOL', 'Les zones à faibles émissions (ZFE) dans les grandes villes doivent être supprimées.', 2, false, true),
  ('Q036', 36, 'ECOL', 'L''agriculture intensive doit être davantage réglementée pour protéger la biodiversité.', 1, false, true),
  ('Q037', 37, 'ECOL', 'Les grands projets d''infrastructure (autoroutes, aéroports) contestés pour raisons environnementales doivent être abandonnés par principe.', 1, false, true),
  ('Q038', 38, 'ECOL', 'Le développement de l''éolien terrestre doit être freiné au profit d''autres énergies.', 1, false, true),
  ('Q039', 39, 'ECOL', 'Une partie du budget de l''État doit être fléchée en priorité vers la rénovation thermique des logements.', 1, false, true),
  ('Q040', 40, 'ECOL', 'La chasse et la pêche traditionnelles doivent être protégées contre de nouvelles restrictions environnementales.', 1, false, true),
  ('Q041', 41, 'EUR', 'Davantage de décisions doivent être prises à l''échelle européenne plutôt qu''au niveau national.', 1, true, true),
  ('Q042', 42, 'EUR', 'La France doit conserver un droit de veto sur toute nouvelle compétence transférée à l''Union européenne.', 1, false, true),
  ('Q043', 43, 'EUR', 'La politique agricole commune (PAC) doit être renégociée pour mieux protéger les agriculteurs français.', 1, false, true),
  ('Q044', 44, 'EUR', 'La France doit augmenter significativement son budget de défense, au-delà de 2 % du PIB.', 2, true, true),
  ('Q045', 45, 'EUR', 'La France doit maintenir sa dissuasion nucléaire comme pilier de sa politique de défense.', 1, false, true),
  ('Q046', 46, 'EUR', 'L''Union européenne doit s''élargir à de nouveaux pays candidats dans les prochaines années.', 1, false, true),
  ('Q047', 47, 'EUR', 'La France doit réduire son engagement militaire dans les opérations extérieures.', 1, false, true),
  ('Q048', 48, 'EUR', 'Un budget européen commun, financé par un impôt européen, doit être créé.', 2, false, true),
  ('Q049', 49, 'EUR', 'La France doit renforcer ses partenariats commerciaux en dehors de l''Union européenne.', 1, false, true),
  ('Q050', 50, 'EUR', 'Les accords de libre-échange (type Mercosur) doivent être rejetés s''ils ne respectent pas les normes agricoles françaises.', 1, false, true),
  ('Q051', 51, 'SEC', 'Il faut renforcer les effectifs de police plutôt que les dispositifs de prévention.', 1, true, true),
  ('Q052', 52, 'SEC', 'Les peines planchers doivent être rétablies pour les récidivistes.', 2, true, true),
  ('Q053', 53, 'SEC', 'Le port de la caméra-piéton doit être obligatoire pour tous les policiers en intervention.', 1, false, true),
  ('Q054', 54, 'SEC', 'Les mineurs délinquants doivent pouvoir être jugés comme des majeurs dès 16 ans pour les faits les plus graves.', 2, false, true),
  ('Q055', 55, 'SEC', 'La vidéosurveillance algorithmique doit être généralisée dans l''espace public.', 1, false, true),
  ('Q056', 56, 'SEC', 'Les moyens de la justice (magistrats, greffiers) doivent être augmentés en priorité par rapport aux effectifs policiers.', 1, false, true),
  ('Q057', 57, 'SEC', 'Les peines alternatives à l''incarcération doivent être développées pour désengorger les prisons.', 1, false, true),
  ('Q058', 58, 'SEC', 'La légalisation encadrée du cannabis permettrait de mieux lutter contre les trafics.', 2, false, true),
  ('Q059', 59, 'SEC', 'Le renseignement doit disposer de pouvoirs de surveillance élargis pour prévenir le terrorisme, même au prix de certaines libertés individuelles.', 1, false, true),
  ('Q060', 60, 'SEC', 'La construction de nouvelles places de prison doit être une priorité budgétaire.', 1, false, true),
  ('Q061', 61, 'IMMI', 'Les quotas d''immigration doivent être fixés chaque année par le Parlement.', 2, true, true),
  ('Q062', 62, 'IMMI', 'L''accès à certaines prestations sociales doit être conditionné à une durée minimale de résidence en France.', 1, false, true),
  ('Q063', 63, 'IMMI', 'Le regroupement familial doit être restreint.', 1, false, true),
  ('Q064', 64, 'IMMI', 'La régularisation des travailleurs sans papiers occupant des métiers en tension doit être facilitée.', 1, false, true),
  ('Q065', 65, 'IMMI', 'Le droit du sol doit être maintenu sans condition supplémentaire.', 2, false, true),
  ('Q066', 66, 'IMMI', 'L''aide médicale d''État (AME) pour les personnes en situation irrégulière doit être supprimée.', 2, true, true),
  ('Q067', 67, 'IMMI', 'Les capacités d''accueil des demandeurs d''asile doivent être augmentées.', 1, false, true),
  ('Q068', 68, 'IMMI', 'La binationalité doit pouvoir être retirée en cas de condamnation pour des faits graves.', 1, false, true),
  ('Q069', 69, 'IMMI', 'L''apprentissage du français et des valeurs républicaines doit être une condition obligatoire de la naturalisation.', 1, false, true),
  ('Q070', 70, 'IMMI', 'La France doit sortir des accords de Schengen pour reprendre le contrôle total de ses frontières.', 2, false, true),
  ('Q071', 71, 'EDU', 'Les classes de primaire et de collège doivent être limitées à moins de 20 élèves.', 1, true, true),
  ('Q072', 72, 'EDU', 'Le port de l''uniforme doit être généralisé dans les établissements scolaires publics.', 1, false, true),
  ('Q073', 73, 'EDU', 'L''autonomie des établissements scolaires doit être renforcée dans le recrutement des enseignants.', 1, false, true),
  ('Q074', 74, 'EDU', 'Le redoublement doit être facilité lorsque le niveau d''un élève n''est pas suffisant.', 1, false, true),
  ('Q075', 75, 'EDU', 'L''enseignement privé sous contrat ne doit plus bénéficier de financements publics.', 2, false, true),
  ('Q076', 76, 'EDU', 'Le service national universel doit devenir obligatoire pour tous les jeunes.', 2, false, true),
  ('Q077', 77, 'EDU', 'Les filières d''apprentissage et professionnelles doivent être davantage valorisées dès le collège.', 1, false, true),
  ('Q078', 78, 'EDU', 'Les frais d''inscription à l''université doivent rester gratuits ou quasi gratuits pour tous les étudiants.', 1, true, true),
  ('Q079', 79, 'EDU', 'L''usage du téléphone portable doit être interdit dans tous les établissements scolaires, y compris au lycée.', 1, false, true),
  ('Q080', 80, 'EDU', 'Une allocation d''autonomie doit être versée à tous les étudiants, sous condition de ressources ou non.', 1, false, true),
  ('Q081', 81, 'SANTE', 'Les déserts médicaux doivent être combattus par une obligation d''installation des jeunes médecins dans les zones sous-dotées.', 1, false, true),
  ('Q082', 82, 'SANTE', 'L''hôpital public doit recevoir des moyens supplémentaires en priorité sur les cliniques privées.', 1, true, true),
  ('Q083', 83, 'SANTE', 'La fin de vie doit pouvoir être choisie par une aide active à mourir encadrée par la loi.', 2, true, true),
  ('Q084', 84, 'SANTE', 'Le reste à charge des patients doit être encore réduit, quitte à augmenter les cotisations.', 1, false, true),
  ('Q085', 85, 'SANTE', 'La prévention et le sport-santé doivent recevoir davantage de moyens qu''aujourd''hui.', 1, false, true),
  ('Q086', 86, 'SANTE', 'Les dépassements d''honoraires médicaux doivent être strictement plafonnés.', 1, false, true),
  ('Q087', 87, 'SANTE', 'La santé mentale des jeunes doit devenir une priorité nationale avec un remboursement élargi des consultations.', 1, false, true),
  ('Q088', 88, 'SANTE', 'Le numerus clausus (ou son équivalent actuel) doit être supprimé pour former plus de médecins.', 1, false, true),
  ('Q089', 89, 'SANTE', 'Les mutuelles santé privées doivent voir leur rôle réduit au profit d''une sécurité sociale renforcée.', 1, false, true),
  ('Q090', 90, 'SANTE', 'La vaccination obligatoire doit pouvoir être étendue en cas de crise sanitaire grave.', 1, false, true),
  ('Q091', 91, 'LOG', 'La construction de logements sociaux doit être imposée plus fortement aux communes qui n''en construisent pas assez.', 1, false, true),
  ('Q092', 92, 'LOG', 'L''encadrement des loyers doit être généralisé à toutes les grandes villes.', 2, true, true),
  ('Q093', 93, 'LOG', 'Les zones rurales doivent bénéficier d''un plan prioritaire contre la fermeture des services publics (écoles, gares, hôpitaux de proximité).', 1, false, true),
  ('Q094', 94, 'LOG', 'La construction de nouveaux logements doit être limitée pour lutter contre l''artificialisation des sols.', 1, false, true),
  ('Q095', 95, 'LOG', 'Les résidences secondaires doivent être davantage taxées dans les zones tendues.', 1, false, true),
  ('Q096', 96, 'LOG', 'La décentralisation doit être approfondie, avec plus de pouvoirs donnés aux régions.', 1, true, true),
  ('Q097', 97, 'LOG', 'Les métropoles doivent recevoir moins de moyens de l''État au profit des territoires ruraux et périurbains.', 1, false, true),
  ('Q098', 98, 'LOG', 'La fracture numérique doit être résorbée par un investissement prioritaire dans la couverture très haut débit des zones rurales.', 1, false, true),
  ('Q099', 99, 'LOG', 'Les meublés touristiques de courte durée doivent être davantage réglementés dans les zones en tension locative.', 1, false, true),
  ('Q100', 100, 'LOG', 'Un droit au logement opposable réellement effectif doit être garanti par l''État.', 1, false, true)

on conflict (id) do update set
  ordre = excluded.ordre,
  theme_code = excluded.theme_code,
  enonce = excluded.enonce,
  poids = excluded.poids,
  dans_quiz_20 = excluded.dans_quiz_20,
  dans_quiz_100 = excluded.dans_quiz_100;


-- ─────────────────────────────────────────────────────────────
-- 4. Positions des candidats — une ligne par (candidat, question).
--    position : -2..2 sur la même échelle que les réponses des utilisateurs,
--    ou NULL tant qu'elle n'est pas renseignée.
--    confiance : 'sourcee' (déclaration/vote/programme cité en source_url),
--    'deduite' (déduite du programme ou de la ligne du parti, pondérée à 60 %
--    dans le score), 'inconnue' (par défaut — exclue du score).
--    La ligne ci-dessous crée une position vierge pour CHAQUE candidat x
--    CHAQUE question : il ne reste plus qu'à faire des UPDATE (ou un import
--    CSV) pour renseigner position/confiance/source_url au fil du sourçage.
-- ─────────────────────────────────────────────────────────────
do $$ begin
  create type public.affinite_confiance as enum ('sourcee', 'deduite', 'inconnue');
exception when duplicate_object then null; end $$;

create table if not exists public.affinite_candidate_positions (
  candidate_id uuid not null references public.candidates (id) on delete cascade,
  question_id  text not null references public.affinite_questions (id) on delete cascade,
  position     smallint check (position between -2 and 2),
  confiance    public.affinite_confiance not null default 'inconnue',
  source_url   text,
  note         text,
  updated_at   timestamptz not null default now(),
  primary key (candidate_id, question_id)
);

create index if not exists affinite_positions_question_idx on public.affinite_candidate_positions (question_id);

drop trigger if exists affinite_candidate_positions_updated_at on public.affinite_candidate_positions;
create trigger affinite_candidate_positions_updated_at before update on public.affinite_candidate_positions
  for each row execute function public.set_updated_at();

alter table public.affinite_candidate_positions enable row level security;

drop policy if exists "affinite_candidate_positions: lecture publique" on public.affinite_candidate_positions;
create policy "affinite_candidate_positions: lecture publique" on public.affinite_candidate_positions
  for select to anon, authenticated using (true);

-- Génère les lignes vierges (candidat x question) — sans écraser une
-- position déjà renseignée grâce à `on conflict do nothing`.
insert into public.affinite_candidate_positions (candidate_id, question_id)
select c.id, q.id
from public.candidates c
cross join public.affinite_questions q
on conflict (candidate_id, question_id) do nothing;


-- ─────────────────────────────────────────────────────────────
-- 5. Réponses des utilisateurs — une ligne par (utilisateur, question),
--    ré-répondre à une question (quiz court puis quiz long, ou l'inverse)
--    met simplement à jour la même ligne.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.affinite_responses (
  user_id     uuid not null references public.profiles (id) on delete cascade,
  question_id text not null references public.affinite_questions (id) on delete cascade,
  reponse     smallint not null check (reponse between -2 and 2),
  created_at  timestamptz not null default now(),
  primary key (user_id, question_id)
);

alter table public.affinite_responses enable row level security;

drop policy if exists "affinite_responses: owner all" on public.affinite_responses;
create policy "affinite_responses: owner all" on public.affinite_responses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────
-- 6. Calcul du score de rapprochement — voir la méthodologie détaillée dans
--    le classeur Excel joint (feuille « Méthodologie »). Résumé :
--
--    Pour chaque question répondue par l'utilisateur et positionnée pour un
--    candidat donné :
--      accord_i = 4 - |réponse_utilisateur_i - position_candidat_i|   (0 à 4)
--      contribution_i = poids_i × multiplicateur_confiance_i × accord_i
--
--    score_candidat = 100 × Σ(contribution_i) / Σ(poids_i × 4)
--
--    Le multiplicateur (sourcée = 1.0, déduite = 0.6) ne s'applique QU'AU
--    NUMÉRATEUR, jamais au dénominateur : une position déduite, même en
--    plein accord, plafonne donc sa propre contribution à 60 % plutôt que
--    de compter comme une certitude à 100 %. (Diviser aussi le dénominateur
--    par le multiplicateur annulerait ce dernier dans le ratio et ferait
--    remonter une position purement déduite au même score qu'une position
--    sourcée — ce qui reviendrait à afficher une certitude que les données
--    ne permettent pas.) 'inconnue' reste exclue en amont (ni au numérateur
--    ni au dénominateur) : une position non documentée doit compter comme
--    "on ne sait pas", jamais comme un désaccord.
--    Un candidat n'apparaît que si au moins 5 questions communes (score
--    global) ou 2 questions communes (score par thème) sont disponibles,
--    pour éviter un score construit sur un échantillon non significatif.
--    Ces deux seuils sont les seuls « paramètres magiques » de la formule ;
--    ils sont isolés ici pour être faciles à retoucher.
-- ─────────────────────────────────────────────────────────────
create or replace function public.get_affinite_scores()
returns table (
  candidate_id uuid,
  candidate_slug text,
  candidate_name text,
  party text,
  score numeric,
  nb_questions_communes integer
)
language sql
stable
security definer set search_path = public
as $$
  with pairs as (
    select
      cp.candidate_id,
      r.reponse,
      cp.position,
      q.poids,
      case cp.confiance when 'sourcee' then 1.0 when 'deduite' then 0.6 else 0.0 end as mult
    from public.affinite_responses r
    join public.affinite_questions q on q.id = r.question_id
    join public.affinite_candidate_positions cp on cp.question_id = r.question_id
    where r.user_id = auth.uid()
      and cp.position is not null
      and cp.confiance <> 'inconnue'
  )
  select
    c.id as candidate_id,
    c.slug as candidate_slug,
    c.full_name as candidate_name,
    c.party,
    round(100.0 * sum(p.poids * p.mult * (4 - abs(p.reponse - p.position))) / nullif(sum(p.poids) * 4, 0), 1) as score,
    count(*)::integer as nb_questions_communes
  from public.candidates c
  join pairs p on p.candidate_id = c.id
  group by c.id, c.slug, c.full_name, c.party
  having count(*) >= 5
  order by score desc nulls last;
$$;

-- Détail thème par thème pour un candidat donné (utilisé pour l'écran de
-- détail « Pourquoi ce score ? »). Seuil abaissé à 2 questions communes,
-- car un thème n'en compte que 2 dans le quiz court.
create or replace function public.get_affinite_scores_par_theme(p_candidate_id uuid)
returns table (
  theme_code text,
  theme_label text,
  score numeric,
  nb_questions integer
)
language sql
stable
security definer set search_path = public
as $$
  with pairs as (
    select
      q.theme_code,
      r.reponse,
      cp.position,
      q.poids,
      case cp.confiance when 'sourcee' then 1.0 when 'deduite' then 0.6 else 0.0 end as mult
    from public.affinite_responses r
    join public.affinite_questions q on q.id = r.question_id
    join public.affinite_candidate_positions cp
      on cp.question_id = r.question_id and cp.candidate_id = p_candidate_id
    where r.user_id = auth.uid()
      and cp.position is not null
      and cp.confiance <> 'inconnue'
  )
  select
    t.code as theme_code,
    t.label as theme_label,
    round(100.0 * sum(p.poids * p.mult * (4 - abs(p.reponse - p.position))) / nullif(sum(p.poids) * 4, 0), 1) as score,
    count(*)::integer as nb_questions
  from public.affinite_themes t
  join pairs p on p.theme_code = t.code
  group by t.code, t.label, t.ordre
  having count(*) >= 2
  order by t.ordre;
$$;

grant execute on function public.get_affinite_scores() to authenticated;
grant execute on function public.get_affinite_scores_par_theme(uuid) to authenticated;


-- ─────────────────────────────────────────────────────────────
-- 7. reset_progress() — remplace la version de supabase/schema.sql pour
--    purger aussi les réponses d'affinités lors d'une réinitialisation
--    complète du profil (« Réinitialiser ma progression »).
-- ─────────────────────────────────────────────────────────────
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
  delete from public.affinite_responses where user_id = auth.uid();
  update public.profiles
    set points = 0, notif_read = false, quiz_correct_total = 0, quiz_attempts_total = 0
    where id = auth.uid();
end;
$$;
