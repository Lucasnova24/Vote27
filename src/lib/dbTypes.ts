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
  created_at: string
}

export interface VoteRow {
  user_id: string
  choice: 'oui' | 'non'
  created_at: string
}

export interface QuizAttemptRow {
  user_id: string
  score: number
  answers: number[]
  created_at: string
}

export interface BoussoleResponseRow {
  user_id: string
  answers: number[]
  created_at: string
}

export interface EstimationRow {
  user_id: string
  est_values: number[]
  submitted: boolean
  updated_at: string
}

export interface DebatePredictionRow {
  user_id: string
  candidate_index: number
  created_at: string
}

export interface LeaderboardRow {
  pseudo: string
  points: number
}
