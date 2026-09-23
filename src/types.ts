export type Tab = 'accueil' | 'isoloir' | 'agenda' | 'quiz' | 'profil'

export type Route = 'vote' | 'quiz' | 'boussole' | 'firstround' | 'debat' | 'programmes' | 'completeprofile' | null

export type AuthView = 'signup' | 'login'
export type AuthProvider = 'apple' | 'google' | 'anonymous' | 'email' | null

export interface Candidate {
  name: string
  party: string
  pct: number
  color: string
  ink: string
  soft: string
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
  bDone: boolean
  bAnswers: number[]
  debPick: number | null
  firstRoundPick: number | null

  profileVille: string
  profileRegion: string
  profilePays: string
  profileCP: string
  profileTel: string
  profileInterets: string

  // quiz run — client-only while a run is in progress
  quizI: number
  quizSel: number | null
  quizFinished: boolean

  // boussole run — client-only while a run is in progress
  bMode: string | null
  bI: number

  // client-only cosmetic state (not backed by Supabase)
  reminders: string[]
  leagueCreated: boolean

  // real cumulative quiz accuracy, backed by Supabase
  quizCorrectTotal: number
  quizAttemptsTotal: number

  // auth
  authed: boolean
  authView: AuthView
  authProvider: AuthProvider
  authFirst: string
  authLast: string
  authPseudo: string
  authEmail: string
  authPass: string
  authDob: string
  authSex: string
  authError: string | null
}
