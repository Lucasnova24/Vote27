import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'
import type {
  BoussoleResponseRow, DebatePredictionRow, EstimationRow, ProfileRow, QuizAttemptRow, VoteRow,
} from './lib/dbTypes'
import type { AppState, AuthProvider, Route, Tab } from './types'
import { BOUSSOLE, QUIZ } from './data'

const initialState: AppState = {
  loading: true, authBusy: false,
  tab: 'accueil', route: null, filter: 'Tout', theme: 'Institutions',
  points: 0, notifRead: false, voteChoice: null,
  quizDoneToday: false, quizScore: 0,
  est: [20, 20, 20, 20, 20], estSent: false,
  bDone: false, bAnswers: [],
  debPick: null,
  quizI: 0, quizSel: null, quizFinished: false,
  bMode: null, bI: 0,
  authed: false, authView: 'signup', authProvider: null,
  authFirst: '', authLast: '', authPseudo: '', authEmail: '', authPass: '', authError: null,
}

function providerFromUser(user: User): AuthProvider {
  const provider = (user.app_metadata as { provider?: string } | undefined)?.provider
  if (provider === 'apple') return 'apple'
  if (provider === 'google') return 'google'
  if (user.is_anonymous) return 'anonymous'
  if (provider === 'email' || user.email) return 'email'
  return null
}

function mapAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'E-mail ou mot de passe incorrect.'
  if (/already registered/i.test(message)) return 'Un compte existe déjà avec cet e-mail.'
  if (/rate limit/i.test(message)) return 'Trop de tentatives, réessaie dans un instant.'
  if (/anonymous sign-ins are disabled/i.test(message)) return "La connexion invitée n'est pas activée sur ce projet Supabase."
  if (/provider is not enabled/i.test(message)) return "Ce fournisseur de connexion n'est pas activé sur ce projet Supabase."
  return message
}

async function loadUserData(user: User): Promise<Partial<AppState>> {
  const uid = user.id
  const [profileRes, voteRes, quizRes, bousRes, estRes, debRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', uid).maybeSingle(),
    supabase.from('votes').select('*').eq('user_id', uid).maybeSingle(),
    supabase.from('quiz_attempts').select('*').eq('user_id', uid).maybeSingle(),
    supabase.from('boussole_responses').select('*').eq('user_id', uid).maybeSingle(),
    supabase.from('estimations').select('*').eq('user_id', uid).maybeSingle(),
    supabase.from('debate_predictions').select('*').eq('user_id', uid).maybeSingle(),
  ])

  let profile = profileRes.data as ProfileRow | null
  if (!profile) {
    // the auth trigger usually creates this row instantly, but fall back
    // to an explicit upsert in case this runs before it has.
    const { data } = await supabase
      .from('profiles')
      .upsert({ id: uid, email: user.email ?? null })
      .select()
      .maybeSingle()
    profile = data as ProfileRow | null
  }

  const vote = voteRes.data as VoteRow | null
  const quiz = quizRes.data as QuizAttemptRow | null
  const bous = bousRes.data as BoussoleResponseRow | null
  const est = estRes.data as EstimationRow | null
  const deb = debRes.data as DebatePredictionRow | null

  return {
    loading: false, authed: true, authBusy: false, authError: null,
    tab: 'accueil', route: null,
    points: profile?.points ?? 0,
    notifRead: profile?.notif_read ?? false,
    authProvider: providerFromUser(user),
    authEmail: user.email ?? '',
    authFirst: profile?.first_name ?? '',
    authLast: profile?.last_name ?? '',
    authPseudo: profile?.pseudo ?? '',
    voteChoice: vote?.choice ?? null,
    quizDoneToday: !!quiz,
    quizScore: quiz?.score ?? 0,
    quizI: 0, quizSel: null, quizFinished: false,
    bDone: !!bous,
    bAnswers: bous?.answers ?? [],
    bMode: null, bI: 0,
    est: est?.est_values ?? [20, 20, 20, 20, 20],
    estSent: est?.submitted ?? false,
    debPick: deb?.candidate_index ?? null,
  }
}

function logIfError(label: string) {
  return ({ error }: { error: { message: string } | null }) => {
    if (error) console.error(`[supabase] ${label}:`, error.message)
  }
}

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState)
  const stateRef = useRef(state)
  const userIdRef = useRef<string | null>(null)
  const quizAnswersRef = useRef<number[]>([])

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const update = (
    patch: Partial<AppState> | ((s: AppState) => Partial<AppState> | null),
  ) => {
    setState((s) => {
      const p = typeof patch === 'function' ? patch(s) : patch
      return p ? { ...s, ...p } : s
    })
  }

  useEffect(() => {
    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (session?.user) {
        userIdRef.current = session.user.id
        if (event === 'TOKEN_REFRESHED') return
        update({ loading: true })
        loadUserData(session.user).then((patch) => {
          if (active) update(patch)
        })
      } else {
        userIdRef.current = null
        setState({ ...initialState, loading: false })
      }
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const go = (tab: Tab) => () => update({ tab, route: null })
  const openRoute = (route: Route) => () => update({ route })
  const back = () => update({ route: null })

  const vote = (choice: 'oui' | 'non') => () => {
    const wasVoted = stateRef.current.voteChoice !== null
    const uid = userIdRef.current
    update((s) => ({ voteChoice: choice, points: wasVoted ? s.points : s.points + 15 }))
    if (!uid) return
    supabase.from('votes').upsert({ user_id: uid, choice }).then(logIfError('votes upsert'))
    if (!wasVoted) supabase.rpc('increment_points', { delta: 15 }).then(logIfError('increment_points'))
  }

  const answer = (i: number) => () => {
    const uid = userIdRef.current
    update((s) => {
      if (s.quizSel !== null) return null
      const ok = i === QUIZ[s.quizI].a
      if (ok && uid) supabase.rpc('increment_points', { delta: 20 }).then(logIfError('increment_points'))
      return { quizSel: i, quizScore: s.quizScore + (ok ? 1 : 0), points: s.points + (ok ? 20 : 0) }
    })
  }

  const next = () => {
    const s = stateRef.current
    quizAnswersRef.current = [...quizAnswersRef.current, s.quizSel ?? -1]
    if (s.quizI >= QUIZ.length - 1) {
      const uid = userIdRef.current
      const finalAnswers = quizAnswersRef.current
      quizAnswersRef.current = []
      update({ quizFinished: true, quizDoneToday: true })
      if (uid) {
        supabase
          .from('quiz_attempts')
          .upsert({ user_id: uid, score: s.quizScore, answers: finalAnswers })
          .then(logIfError('quiz_attempts upsert'))
      }
    } else {
      update({ quizI: s.quizI + 1, quizSel: null })
    }
  }

  const bAnswer = (v: number) => () => {
    const uid = userIdRef.current
    update((s) => {
      const a = s.bAnswers.concat([v])
      const done = a.length >= BOUSSOLE.length
      if (done && uid) {
        supabase.from('boussole_responses').upsert({ user_id: uid, answers: a }).then(logIfError('boussole_responses upsert'))
      }
      return done ? { bAnswers: a, bDone: true } : { bAnswers: a, bI: s.bI + 1 }
    })
  }

  const bStart = () => update({ bMode: 'court', bI: 0, bAnswers: [] })

  const setEst = (i: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value)
    update((s) => {
      const est = s.est.slice()
      est[i] = v
      return { est, estSent: false }
    })
  }

  const sendEstimate = () => {
    const s = stateRef.current
    const total = s.est.reduce((a, b) => a + b, 0)
    if (total < 98 || total > 102) return
    update({ estSent: true })
    const uid = userIdRef.current
    if (uid) {
      supabase
        .from('estimations')
        .upsert({ user_id: uid, est_values: s.est, submitted: true })
        .then(logIfError('estimations upsert'))
    }
  }

  const markRead = () => {
    update({ notifRead: true })
    const uid = userIdRef.current
    if (uid) supabase.from('profiles').update({ notif_read: true }).eq('id', uid).then(logIfError('profiles notif_read update'))
  }

  const setFilter = (f: string) => () => update({ filter: f })
  const setTheme = (t: string) => () => update({ theme: t })

  const setDebPick = (i: number) => () => {
    update({ debPick: i })
    const uid = userIdRef.current
    if (uid) {
      supabase
        .from('debate_predictions')
        .upsert({ user_id: uid, candidate_index: i })
        .then(logIfError('debate_predictions upsert'))
    }
  }

  const authApple = () => {
    update({ authBusy: true, authError: null })
    supabase.auth.signInWithOAuth({ provider: 'apple' }).then(({ error }) => {
      if (error) update({ authBusy: false, authError: mapAuthError(error.message) })
    })
  }

  const authGoogle = () => {
    update({ authBusy: true, authError: null })
    supabase.auth.signInWithOAuth({ provider: 'google' }).then(({ error }) => {
      if (error) update({ authBusy: false, authError: mapAuthError(error.message) })
    })
  }

  const authGuest = () => {
    update({ authBusy: true, authError: null })
    supabase.auth.signInAnonymously().then(({ error }) => {
      if (error) update({ authBusy: false, authError: mapAuthError(error.message) })
    })
  }

  const submitAuth = () => {
    const s = stateRef.current
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.authEmail)) return update({ authError: 'Adresse e-mail invalide.' })
    if (s.authPass.length < 8) return update({ authError: 'Le mot de passe doit faire 8 caractères minimum.' })
    if (s.authView === 'signup') {
      if (!s.authFirst.trim() || !s.authLast.trim()) return update({ authError: 'Indique ton prénom et ton nom.' })
      if (s.authPseudo.trim().length < 3) return update({ authError: 'Le pseudo doit faire 3 caractères minimum.' })
    }
    update({ authBusy: true, authError: null })
    ;(async () => {
      if (s.authView === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: s.authEmail,
          password: s.authPass,
          options: { data: { first_name: s.authFirst, last_name: s.authLast, pseudo: s.authPseudo } },
        })
        if (error) return update({ authBusy: false, authError: mapAuthError(error.message) })
        if (data.user) {
          await supabase
            .from('profiles')
            .upsert({ id: data.user.id, email: s.authEmail, first_name: s.authFirst, last_name: s.authLast, pseudo: s.authPseudo })
        }
        update({ authBusy: false, authPass: '' })
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: s.authEmail, password: s.authPass })
        if (error) return update({ authBusy: false, authError: mapAuthError(error.message) })
        update({ authBusy: false, authPass: '' })
      }
    })()
  }

  const toggleAuthView = () =>
    update((s) => ({ authView: s.authView === 'signup' ? 'login' : 'signup', authError: null }))

  const setAuthFirst = (e: ChangeEvent<HTMLInputElement>) => update({ authFirst: e.target.value, authError: null })
  const setAuthLast = (e: ChangeEvent<HTMLInputElement>) => update({ authLast: e.target.value, authError: null })
  const setAuthPseudo = (e: ChangeEvent<HTMLInputElement>) => update({ authPseudo: e.target.value, authError: null })
  const setAuthEmail = (e: ChangeEvent<HTMLInputElement>) => update({ authEmail: e.target.value, authError: null })
  const setAuthPass = (e: ChangeEvent<HTMLInputElement>) => update({ authPass: e.target.value, authError: null })

  const logout = () => {
    supabase.auth.signOut().then(logIfError('signOut'))
  }

  const resetAll = () => {
    const uid = userIdRef.current
    update({
      voteChoice: null, points: 0,
      quizI: 0, quizSel: null, quizScore: 0, quizFinished: false, quizDoneToday: false,
      notifRead: false, filter: 'Tout', est: [20, 20, 20, 20, 20], estSent: false,
      bMode: null, bI: 0, bAnswers: [], bDone: false, theme: 'Institutions', debPick: null,
      tab: 'accueil', route: null,
    })
    if (uid) supabase.rpc('reset_progress').then(logIfError('reset_progress'))
  }

  return {
    state,
    actions: {
      go, openRoute, back, vote, answer, next, bAnswer, bStart, setEst, sendEstimate,
      markRead, setFilter, setTheme, setDebPick,
      authApple, authGoogle, authGuest, submitAuth, toggleAuthView,
      setAuthFirst, setAuthLast, setAuthPseudo, setAuthEmail, setAuthPass,
      logout, resetAll,
    },
  }
}

export type AppActions = ReturnType<typeof useAppState>['actions']
