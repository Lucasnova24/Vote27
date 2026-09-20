export type Tab = 'accueil' | 'isoloir' | 'agenda' | 'quiz' | 'profil'

export type Route = 'vote' | 'quiz' | 'boussole' | 'estimation' | 'debat' | 'programmes' | null

export type AuthView = 'signup' | 'login'
export type AuthProvider = 'apple' | 'google' | 'anonymous' | 'email' | null

export interface Candidate {
  name: string
  party: string
  pct: number
  color: string
  initials: string
}

export interface QuizQuestion {
  q: string
  o: string[]
  a: number
  e: string
  s: string
}

export interface BoussoleStatement {
  t: string
  s: string
}

export interface AgendaEvent {
  day: string
  time: string
  title: string
  who: string
  tag: string
  live?: boolean
}

export interface AppState {
  // session / sync
  loading: boolean
  authBusy: boolean

  // navigation (client-only, not persisted to Supabase)
  tab: Tab
  route: Route
  filter: string
  theme: string

  // durable data, backed by Supabase
  points: number
  notifRead: boolean
  voteChoice: 'oui' | 'non' | null
  quizDoneToday: boolean
  quizScore: number
  est: number[]
  estSent: boolean
  bDone: boolean
  bAnswers: number[]
  debPick: number | null

  // quiz run — client-only while a run is in progress
  quizI: number
  quizSel: number | null
  quizFinished: boolean

  // boussole run — client-only while a run is in progress
  bMode: string | null
  bI: number

  // auth
  authed: boolean
  authView: AuthView
  authProvider: AuthProvider
  authFirst: string
  authLast: string
  authPseudo: string
  authEmail: string
  authPass: string
  authError: string | null
}
