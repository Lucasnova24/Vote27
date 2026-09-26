import type { Candidate } from './types'

export const ACCENT = '#3B4FD8'
export const SHOW_POINTS = true
export const LIVE_DEBATE = true

// Real candidates for the 2027 French presidential election (1st round:
// 18 April 2027; 2nd round: 2 May 2027), one per party — when a party has
// several declared/pressenti figures (e.g. Le Pen vs Bardella for the RN,
// or the Parti socialiste's primary field), only the one polling highest
// is kept. Sorted descending by national voting-intention polls where a
// figure exists (Harris Interactive, 14 Sept. 2026 aggregate, itself an
// average across institutes); candidates with no individually-tracked
// figure (they poll too low to be broken out) are appended afterwards in
// alphabetical order, which is NOT a claim about their relative standing.
// Compiled from public reporting as of September 2026 — this is a very
// fast-moving list (declarations, primaries, legal rulings on eligibility,
// and poll standings all shift week to week), so re-check it periodically
// rather than trusting it as frozen fact.
export const CANDS: Candidate[] = [
  // — polled individually, descending —
  { name: 'Marine Le Pen', party: 'Rassemblement national', status: 'déclaré', color: '#3B4FD8', ink: '#1F2A8A', soft: '#E3E7FF', initials: 'ML' },
  { name: 'Jean-Luc Mélenchon', party: 'La France insoumise', status: 'déclaré', color: '#0E7A6B', ink: '#0A4F45', soft: '#D2F1EA', initials: 'JM' },
  { name: 'Édouard Philippe', party: 'Horizons', status: 'déclaré', color: '#A85400', ink: '#6E3A00', soft: '#FFEBC6', initials: 'EP' },
  { name: 'Raphaël Glucksmann', party: 'Place publique', status: 'pressenti', color: '#6B45D9', ink: '#3F238F', soft: '#E8E0FF', initials: 'RG' },
  { name: 'Gabriel Attal', party: 'Renaissance', status: 'déclaré', color: '#C2385A', ink: '#8C1F3D', soft: '#FFDCE5', initials: 'GA' },
  { name: 'Bruno Retailleau', party: 'Les Républicains', status: 'déclaré', color: '#0B6BB8', ink: '#0A4577', soft: '#D8EBFB', initials: 'BR' },
  { name: 'Éric Zemmour', party: 'Reconquête', status: 'déclaré', color: '#1F7A3E', ink: '#14532D', soft: '#DDF3E3', initials: 'EZ' },
  { name: 'Marine Tondelier', party: 'Les Écologistes', status: 'pressenti', color: '#B8541F', ink: '#7A3512', soft: '#FCE3D3', initials: 'MT' },
  { name: 'Fabien Roussel', party: 'Parti communiste français', status: 'déclaré', color: '#7A3E9D', ink: '#4E2766', soft: '#EFE0FA', initials: 'FR' },
  { name: 'Nicolas Dupont-Aignan', party: 'Debout la France', status: 'déclaré', color: '#B8175A', ink: '#7A0F3C', soft: '#FBDCE9', initials: 'ND' },
  { name: 'Nathalie Arthaud', party: 'Lutte ouvrière', status: 'déclaré', color: '#2C7DA0', ink: '#1B4E63', soft: '#D6ECF5', initials: 'NA' },

  // — not individually tracked in the polls above, alphabetical —
  { name: 'François Asselineau', party: 'Union populaire républicaine', status: 'déclaré', color: '#6E5B3E', ink: '#443923', soft: '#EDE6D8', initials: 'FA' },
  { name: 'Delphine Batho', party: 'Génération écologie', status: 'déclaré', color: '#475569', ink: '#293548', soft: '#E2E6EC', initials: 'DB' },
  { name: 'Xavier Bertrand', party: 'Nous, France', status: 'déclaré', color: '#C8341C', ink: '#8A1F0E', soft: '#FFDFD8', initials: 'XB' },
  { name: 'Karim Bouamrane', party: 'Parti socialiste', status: 'déclaré', color: '#3B4FD8', ink: '#1F2A8A', soft: '#E3E7FF', initials: 'KB' },
  { name: 'Bernard Cazeneuve', party: 'La Convention', status: 'déclaré', color: '#0E7A6B', ink: '#0A4F45', soft: '#D2F1EA', initials: 'BC' },
  { name: 'Sylvain Durif', party: 'Elvita', status: 'déclaré', color: '#A85400', ink: '#6E3A00', soft: '#FFEBC6', initials: 'SD' },
  { name: 'Anasse Kazib', party: 'Révolution permanente', status: 'déclaré', color: '#6B45D9', ink: '#3F238F', soft: '#E8E0FF', initials: 'AK' },
  { name: 'Selma Labib', party: 'NPA – Révolutionnaires', status: 'déclaré', color: '#C2385A', ink: '#8C1F3D', soft: '#FFDCE5', initials: 'SL' },
  { name: 'Francis Lalanne', party: 'France Libre', status: 'déclaré', color: '#0B6BB8', ink: '#0A4577', soft: '#D8EBFB', initials: 'FL' },
  { name: 'Jean Lassalle', party: 'Résistons !', status: 'pressenti', color: '#1F7A3E', ink: '#14532D', soft: '#DDF3E3', initials: 'JL' },
  { name: 'David Lisnard', party: 'Nouvelle Énergie', status: 'pressenti', color: '#B8541F', ink: '#7A3512', soft: '#FCE3D3', initials: 'DL' },
  { name: 'Florian Philippot', party: 'Les Patriotes', status: 'déclaré', color: '#7A3E9D', ink: '#4E2766', soft: '#EFE0FA', initials: 'FP' },
  { name: 'Dominique de Villepin', party: 'Sans étiquette', status: 'pressenti', color: '#B8175A', ink: '#7A0F3C', soft: '#FBDCE9', initials: 'DV' },
]

// The quiz question bank now lives in public.quiz_questions (supabase/
// quiz_bank_schema.sql, 1650 questions across 11 themes) — a new set of 5
// is picked deterministically each day by public.get_daily_quiz(), fetched
// via src/lib/useDailyQuiz.ts. This constant is just the daily question
// count, used for progress/scoring copy ("Sans faute", "Score X / 5"…).
export const QUIZ_DAILY_COUNT = 5

export const THEMES = ['Institutions', 'Économie', 'Écologie', 'Europe', 'Social', 'Sécurité']

export const TABS: Record<string, { soft: string; ink: string; dark: string }> = {
  accueil: { soft: '#E3E7FF', ink: '#1F2A8A', dark: '#8E9BFF' },
  isoloir: { soft: '#E8E0FF', ink: '#3F238F', dark: '#B7A2FF' },
  agenda: { soft: '#D8EBFB', ink: '#0A4577', dark: '#7CC0F5' },
  quiz: { soft: '#FFEBC6', ink: '#6E3A00', dark: '#F4B860' },
  profil: { soft: '#D2F1EA', ink: '#0A4F45', dark: '#5FD3BF' },
}

export const THEME_STYLE: Record<string, { solid: string; soft: string; ink: string }> = {
  Institutions: { solid: '#3B4FD8', soft: '#E3E7FF', ink: '#1F2A8A' },
  Économie: { solid: '#A85400', soft: '#FFEBC6', ink: '#6E3A00' },
  Écologie: { solid: '#1F7A3E', soft: '#DDF3E3', ink: '#14532D' },
  Europe: { solid: '#0B6BB8', soft: '#D8EBFB', ink: '#0A4577' },
  Social: { solid: '#C2385A', soft: '#FFDCE5', ink: '#8C1F3D' },
  Sécurité: { solid: '#6B45D9', soft: '#E8E0FF', ink: '#3F238F' },
}

// Styling for the 10 "Mes affinités" themes (public.affinite_themes, keyed
// by theme code) — a separate, wider palette from THEME_STYLE above, which
// stays tied to the older 6-theme "Programmes" comparison screen.
export const AFFINITE_THEME_STYLE: Record<string, { solid: string; soft: string; ink: string }> = {
  INST:  { solid: '#3B4FD8', soft: '#E3E7FF', ink: '#1F2A8A' },
  ECO:   { solid: '#A85400', soft: '#FFEBC6', ink: '#6E3A00' },
  TRAV:  { solid: '#C2385A', soft: '#FFDCE5', ink: '#8C1F3D' },
  ECOL:  { solid: '#1F7A3E', soft: '#DDF3E3', ink: '#14532D' },
  EUR:   { solid: '#0B6BB8', soft: '#D8EBFB', ink: '#0A4577' },
  SEC:   { solid: '#6B45D9', soft: '#E8E0FF', ink: '#3F238F' },
  IMMI:  { solid: '#B8175A', soft: '#FBDCE9', ink: '#7A0F3C' },
  EDU:   { solid: '#2C7DA0', soft: '#D6ECF5', ink: '#1B4E63' },
  SANTE: { solid: '#7A3E9D', soft: '#EFE0FA', ink: '#4E2766' },
  LOG:   { solid: '#B8541F', soft: '#FCE3D3', ink: '#7A3512' },
}

// Styling per real event category (public.event_category) and per
// reliability level (public.event_reliability) — see the `agenda` view,
// fetched live via src/lib/useAgenda.ts.
export const EVENT_CATEGORY_STYLE: Record<string, { soft: string; ink: string; label: string }> = {
  debat: { soft: '#FFDFD8', ink: '#8A1F0E', label: 'Débat' },
  meeting: { soft: '#E3E7FF', ink: '#1F2A8A', label: 'Meeting' },
  interview: { soft: '#FFEBC6', ink: '#6E3A00', label: 'Interview' },
  autre: { soft: '#E8E0FF', ink: '#3F238F', label: 'Autre' },
}

export const RELIABILITY_STYLE: Record<string, { soft: string; ink: string; label: string } | null> = {
  confirme: null,
  a_confirmer: { soft: '#FFF4DA', ink: '#6E3A00', label: 'À confirmer' },
  conditionnel: { soft: '#EFEBE2', ink: '#454A66', label: 'Conditionnel' },
}

export const AGENDA_FILTERS = ['Tout', 'Débat', 'Meeting', 'Interview', 'Autre']

export const CALENDAR = [
  { label: 'Clôture du vote hebdomadaire', when: 'dimanche', dot: '#F4B860' },
  { label: '1er tour', when: '18 avril 2027', dot: '#8E9BFF' },
  { label: '2nd tour', when: '2 mai 2027', dot: '#5FD3BF' },
]

export const BOUSSOLE_SCALE = [
  { label: "Tout à fait d'accord", v: 2, color: '#1F7A3E' },
  { label: "Plutôt d'accord", v: 1, color: '#6DB287' },
  { label: 'Sans avis', v: 0, color: '#B4B0A3' },
  { label: "Plutôt pas d'accord", v: -1, color: '#E39A8F' },
  { label: 'Pas du tout d\'accord', v: -2, color: '#C8341C' },
]

export const BADGES = [
  { name: 'Première voix', color: '#3B4FD8' },
  { name: 'Vote de débat', color: '#A85400' },
  { name: 'Sans faute', color: '#6B45D9' },
  { name: 'Affinités faites', color: '#0E7A6B' },
]
