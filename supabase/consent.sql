-- ═════════════════════════════════════════════════════════════
-- Vote2027 — consentement explicite au traitement des réponses (RGPD art. 9)
-- Les votes, affinités et pronostics peuvent révéler des opinions politiques :
-- l'app demande un consentement explicite avant la première saisie et en garde la
-- date ici (preuve). Idempotent. L'app fonctionne sans cette colonne, mais le
-- consentement n'est alors pas conservé d'une session à l'autre.
-- ═════════════════════════════════════════════════════════════

alter table public.profiles add column if not exists opinions_consent_at timestamptz;
