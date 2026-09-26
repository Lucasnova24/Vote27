export type Tab = 'accueil' | 'isoloir' | 'agenda' | 'quiz' | 'profil'

export type Route = 'vote' | 'quiz' | 'boussole' | 'firstround' | 'debat' | 'programmes' | 'completeprofile' | 'agendaEvent' | null

export type AuthView = 'signup' | 'login'
export type AuthProvider = 'apple' | 'google' | 'anonymous' | 'email' | null

export type CandidateStatus = 'déclaré' | 'pressenti'

export interface Candidate {
  name: string
  party: string
  status: CandidateStatus
  color: string
  ink: string
  soft: string
  initials: string
}

export interface AppState {
  // session / sync
  loading: boolean
  authBusy: boolean

  // navigation (client-only, not persisted to Supabase)
  tab: Tab
  route: Route
  // agenda slug of the debate opened on the 'debat' route
  debateSlug: string | null
  // agenda slug of the event opened on the 'agendaEvent' route (its detail page)
  agendaSlug: string | null
  filter: string
  theme: string

  // durable data, backed by Supabase
  points: number
  notifRead: boolean
  voteChoice: 'oui' | 'non' | null
  // bumped each time a ballot is saved, so the results tally refreshes
  voteSaved: number
  quizDoneToday: boolean
  quizScore: number
  // "Mes affinités" — bDone once at least the short quiz's 20 statements are
  // answered; bAnswers maps affinite_questions.id to the user's -2..2 answer
  // (both the short and long quiz share the same ids, so this covers either).
  bDone: boolean
  bAnswers: Record<string, number>
  // tonight's debate vote: agenda event slug + chosen member's candidate slug
  debEvent: string | null
  debPick: string | null
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
  bMode: 'court' | 'complet' | null
  bI: number

  // client-only cosmetic state (not backed by Supabase)
  reminders: string[]

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
