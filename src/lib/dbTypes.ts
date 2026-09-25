// Row shapes matching supabase/schema.sql, applied manually via `as` at each
// query call site (the client itself is untyped — see supabaseClient.ts).

export interface ProfileRow {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  pseudo: string | null
  points: number
  notif_read: boolean
  quiz_correct_total: number
  quiz_attempts_total: number
  ville: string | null
  region: string | null
  pays: string | null
  code_postal: string | null
  telephone: string | null
  interets: string | null
  date_naissance: string | null
  sexe: string | null
  created_at: string
}

export interface VoteRow {
  user_id: string
  choice: 'oui' | 'non'
  vote_date: string
  created_at: string
}

export interface QuizAttemptRow {
  user_id: string
  score: number
  answers: number[]
  quiz_date: string
  created_at: string
}

export interface BoussoleResponseRow {
  user_id: string
  answers: number[]
  created_at: string
}

// "Mes affinités" v2 — supabase/affinites_schema.sql
export interface AffiniteThemeRow {
  code: string
  label: string
  ordre: number
}

export interface AffiniteQuestionRow {
  id: string
  ordre: number
  theme_code: string
  enonce: string
  poids: number
  dans_quiz_20: boolean
  dans_quiz_100: boolean
}

export interface AffiniteResponseRow {
  user_id: string
  question_id: string
  reponse: number
  created_at: string
}

// Matches public.get_affinite_scores()
export interface AffiniteScoreRow {
  candidate_id: string
  candidate_slug: string
  candidate_name: string
  party: string
  score: number | null
  nb_questions_communes: number
}

// Matches public.get_affinite_scores_par_theme(p_candidate_id)
export interface AffiniteThemeScoreRow {
  theme_code: string
  theme_label: string
  score: number | null
  nb_questions: number
}

export interface FirstRoundPickRow {
  user_id: string
  week_start: string
  candidate_index: number
  created_at: string
}

export interface DebatePredictionRow {
  user_id: string
  candidate_index: number | null
  event_slug: string | null
  candidate_slug: string | null
  created_at: string
}

export interface LeaderboardRow {
  pseudo: string
  points: number
}

export interface LeagueRow {
  id: string
  name: string
  code: string
  owner_id: string
  member_count: number
}

export interface LeagueMemberRow {
  pseudo: string
  points: number
}

export type EventCategory = 'interview' | 'debat' | 'meeting' | 'autre'
export type EventReliability = 'confirme' | 'a_confirmer' | 'conditionnel'
export type DatePrecision = 'exact' | 'jour' | 'mois' | 'approx'
export type AgendaStatus = 'date_a_fixer' | 'passe' | 'en_cours' | 'a_venir'

export interface AgendaCandidateRef {
  id: string
  slug: string
  name: string
  party: string
  role: 'participant' | 'invite' | 'organisateur'
}

// Matches the public.agenda view (supabase/schema.sql).
export interface AgendaRow {
  id: string
  slug: string
  category: EventCategory
  subtype: string | null
  title: string
  description: string | null
  event_date: string | null
  end_date: string | null
  start_time: string | null
  date_precision: DatePrecision
  display_date: string
  location: string | null
  city: string | null
  media: string | null
  reliability: EventReliability
  source_name: string | null
  source_url: string | null
  status: AgendaStatus
  candidates: AgendaCandidateRef[]
}
