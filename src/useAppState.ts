import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'
import type {
  AffiniteResponseRow, DebatePredictionRow, FirstRoundPickRow, ProfileRow, QuizAttemptRow, VoteRow,
} from './lib/dbTypes'
import type { AppState, AuthProvider, Route, Tab } from './types'
import { currentWeekStart } from './lib/week'
import { currentDayStart } from './lib/day'

const initialState: AppState = {
  loading: true, authBusy: false,
  tab: 'accueil', route: null, debateSlug: null, agendaSlug: null, filter: 'Tout', theme: 'Institutions',
  points: 0, notifRead: false, voteChoice: null, voteSaved: 0,
  quizDoneToday: false, quizScore: 0,
  bDone: false, bAnswers: {},
  debEvent: null, debPick: null, firstRoundPick: null,
  profileVille: '', profileRegion: '', profilePays: '', profileCP: '', profileTel: '', profileInterets: '',
  quizI: 0, quizSel: null, quizFinished: false,
  bMode: null, bI: 0,
  reminders: [],
  quizCorrectTotal: 0, quizAttemptsTotal: 0,
  authed: false, authView: 'signup', authProvider: null,
  authFirst: '', authLast: '', authPseudo: '', authEmail: '', authPass: '', authDob: '', authSex: '', authError: null,
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
  const [profileRes, voteRes, quizRes, affRes, debRes, frRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', uid).maybeSingle(),
    supabase.from('votes').select('*').eq('user_id', uid).eq('vote_date', currentDayStart()).maybeSingle(),
    supabase.from('quiz_attempts').select('*').eq('user_id', uid).eq('quiz_date', currentDayStart()).maybeSingle(),
    supabase.from('affinite_responses').select('question_id,reponse').eq('user_id', uid),
    supabase.from('debate_predictions').select('*').eq('user_id', uid).maybeSingle(),
    supabase.from('first_round_picks').select('*').eq('user_id', uid).eq('week_start', currentWeekStart()).maybeSingle(),
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
  const affRows = (affRes.data as Pick<AffiniteResponseRow, 'question_id' | 'reponse'>[] | null) ?? []
  const bAnswers: Record<string, number> = {}
  affRows.forEach((r) => { bAnswers[r.question_id] = r.reponse })
  const deb = debRes.data as DebatePredictionRow | null
  const fr = frRes.data as FirstRoundPickRow | null

  return {
    loading: false, authed: true, authBusy: false, authError: null,
    tab: 'accueil', route: null,
    points: profile?.points ?? 0,
    notifRead: profile?.notif_read ?? false,
    quizCorrectTotal: profile?.quiz_correct_total ?? 0,
    quizAttemptsTotal: profile?.quiz_attempts_total ?? 0,
    authProvider: providerFromUser(user),
    authEmail: user.email ?? '',
    authFirst: profile?.first_name ?? '',
    authLast: profile?.last_name ?? '',
    authPseudo: profile?.pseudo ?? '',
    authDob: profile?.date_naissance ?? '',
    authSex: profile?.sexe ?? '',
    profileVille: profile?.ville ?? '',
    profileRegion: profile?.region ?? '',
    profilePays: profile?.pays ?? '',
    profileCP: profile?.code_postal ?? '',
    profileTel: profile?.telephone ?? '',
    profileInterets: profile?.interets ?? '',
    voteChoice: vote?.choice ?? null,
    quizDoneToday: !!quiz,
    quizScore: quiz?.score ?? 0,
    quizI: 0, quizSel: null, quizFinished: false,
    bDone: Object.keys(bAnswers).length >= 20,
    bAnswers,
    bMode: null, bI: 0,
    debEvent: deb?.event_slug ?? null,
    debPick: deb?.candidate_slug ?? null,
    firstRoundPick: fr?.candidate_index ?? null,
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
  const quizCodesRef = useRef<string[]>([])

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
  const openDebate = (slug: string) => () => update({ route: 'debat', debateSlug: slug })
  const openAgendaEvent = (slug: string) => () => update({ route: 'agendaEvent', agendaSlug: slug })

  const vote = (choice: 'oui' | 'non', questionCode: string) => () => {
    const wasVoted = stateRef.current.voteChoice !== null
    const uid = userIdRef.current
    update((s) => ({ voteChoice: choice, points: wasVoted ? s.points : s.points + 15 }))
    if (!uid) return
    supabase
      .from('votes')
      .upsert({ user_id: uid, choice, question_code: questionCode, vote_date: currentDayStart() }, { onConflict: 'user_id,vote_date' })
      .then((res) => {
        logIfError('votes upsert')(res)
        update((s) => ({ voteSaved: s.voteSaved + 1 }))
      })
    if (!wasVoted) supabase.rpc('increment_points', { delta: 15 }).then(logIfError('increment_points'))
  }

  // `correctIndex` describes today's daily quiz, fetched by the component
  // (useDailyQuiz) — this action stays generic and just compares.
  const answer = (i: number, correctIndex: number, questionCode: string) => () => {
    const uid = userIdRef.current
    update((s) => {
      if (s.quizSel !== null) return null
      const ok = i === correctIndex
      if (uid) {
        if (ok) supabase.rpc('increment_points', { delta: 20 }).then(logIfError('increment_points'))
        supabase.rpc('increment_quiz_stat', { is_correct: ok }).then(logIfError('increment_quiz_stat'))
      }
      quizCodesRef.current = [...quizCodesRef.current, questionCode]
      return {
        quizSel: i, quizScore: s.quizScore + (ok ? 1 : 0), points: s.points + (ok ? 20 : 0),
        quizAttemptsTotal: s.quizAttemptsTotal + 1, quizCorrectTotal: s.quizCorrectTotal + (ok ? 1 : 0),
      }
    })
  }

  const next = (total: number) => () => {
    const s = stateRef.current
    quizAnswersRef.current = [...quizAnswersRef.current, s.quizSel ?? -1]
    if (s.quizI >= total - 1) {
      const uid = userIdRef.current
      const finalAnswers = quizAnswersRef.current
      const finalCodes = quizCodesRef.current
      quizAnswersRef.current = []
      quizCodesRef.current = []
      update({ quizFinished: true, quizDoneToday: true })
      if (uid) {
        supabase
          .from('quiz_attempts')
          .upsert(
            { user_id: uid, score: s.quizScore, answers: finalAnswers, question_codes: finalCodes, quiz_date: currentDayStart() },
            { onConflict: 'user_id,quiz_date' },
          )
          .then(logIfError('quiz_attempts upsert'))
      }
    } else {
      update({ quizI: s.quizI + 1, quizSel: null })
    }
  }

  // `total` is the length of whichever question list is currently being run
  // (20 for the short quiz, 100 for the long one) — the component knows it
  // since it's the one that fetched the question bank.
  const bAnswer = (questionId: string, v: number, total: number) => () => {
    const uid = userIdRef.current
    update((s) => {
      const a = { ...s.bAnswers, [questionId]: v }
      const done = s.bI + 1 >= total
      if (uid) {
        supabase
          .from('affinite_responses')
          .upsert({ user_id: uid, question_id: questionId, reponse: v }, { onConflict: 'user_id,question_id' })
          .then(logIfError('affinite_responses upsert'))
      }
      return done ? { bAnswers: a, bDone: true, bMode: null } : { bAnswers: a, bI: s.bI + 1 }
    })
  }

  const bStart = (mode: 'court' | 'complet') => () => update({ bMode: mode, bI: 0, bAnswers: {} })
  const bRestart = () => update({ bMode: null, bI: 0, bAnswers: {}, bDone: false })

  const markRead = () => {
    update({ notifRead: true })
    const uid = userIdRef.current
    if (uid) supabase.from('profiles').update({ notif_read: true }).eq('id', uid).then(logIfError('profiles notif_read update'))
  }

  const setFilter = (f: string) => () => update({ filter: f })
  const setTheme = (t: string) => () => update({ theme: t })

  const setDebPick = (eventSlug: string, candidateSlug: string) => () => {
    update({ debEvent: eventSlug, debPick: candidateSlug })
    const uid = userIdRef.current
    if (uid) {
      supabase
        .from('debate_predictions')
        .upsert({ user_id: uid, event_slug: eventSlug, candidate_slug: candidateSlug, candidate_index: null })
        .then(logIfError('debate_predictions upsert'))
    }
  }

  // A weekly pick is final until next Sunday (no update policy server-side).
  const pickFirstRound = (i: number) => () => {
    if (stateRef.current.firstRoundPick !== null) return
    update({ firstRoundPick: i })
    const uid = userIdRef.current
    if (uid) {
      supabase
        .from('first_round_picks')
        .insert({ user_id: uid, week_start: currentWeekStart(), candidate_index: i })
        .then(logIfError('first_round_picks insert'))
    }
  }

  const toggleReminder = (title: string) => () => update((s) => {
    const on = s.reminders.indexOf(title) !== -1
    return { reminders: on ? s.reminders.filter((t) => t !== title) : s.reminders.concat([title]) }
  })

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
      if (!s.authDob) return update({ authError: 'Indique ta date de naissance.' })
      if (!s.authSex) return update({ authError: 'Sélectionne une option pour le sexe.' })
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
            .upsert({
              id: data.user.id, email: s.authEmail, first_name: s.authFirst, last_name: s.authLast, pseudo: s.authPseudo,
              date_naissance: s.authDob, sexe: s.authSex,
            })
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
  const setAuthDob = (e: ChangeEvent<HTMLInputElement>) => update({ authDob: e.target.value, authError: null })
  const setAuthSex = (e: ChangeEvent<HTMLSelectElement>) => update({ authSex: e.target.value, authError: null })

  const setProfileVille = (e: ChangeEvent<HTMLInputElement>) => update({ profileVille: e.target.value })
  const setProfileRegion = (e: ChangeEvent<HTMLInputElement>) => update({ profileRegion: e.target.value })
  const setProfilePays = (e: ChangeEvent<HTMLInputElement>) => update({ profilePays: e.target.value })
  const setProfileCP = (e: ChangeEvent<HTMLInputElement>) => update({ profileCP: e.target.value })
  const setProfileTel = (e: ChangeEvent<HTMLInputElement>) => update({ profileTel: e.target.value })
  const setProfileInterets = (e: ChangeEvent<HTMLInputElement>) => update({ profileInterets: e.target.value })

  const saveProfileExtra = () => {
    const s = stateRef.current
    const uid = userIdRef.current
    if (uid) {
      supabase
        .from('profiles')
        .update({
          first_name: s.authFirst || null,
          last_name: s.authLast || null,
          pseudo: s.authPseudo || null,
          date_naissance: s.authDob || null,
          sexe: s.authSex || null,
          ville: s.profileVille || null,
          region: s.profileRegion || null,
          pays: s.profilePays || null,
          code_postal: s.profileCP || null,
          telephone: s.profileTel || null,
          interets: s.profileInterets || null,
        })
        .eq('id', uid)
        .then(logIfError('profiles extra fields update'))
    }
    back()
  }

  const logout = () => {
    supabase.auth.signOut().then(logIfError('signOut'))
  }

  const resetAll = () => {
    const uid = userIdRef.current
    update({
      voteChoice: null, points: 0,
      quizI: 0, quizSel: null, quizScore: 0, quizFinished: false, quizDoneToday: false,
      notifRead: false, filter: 'Tout',
      bMode: null, bI: 0, bAnswers: {}, bDone: false, theme: 'Institutions', debEvent: null, debPick: null,
      firstRoundPick: null, reminders: [], quizCorrectTotal: 0, quizAttemptsTotal: 0,
      tab: 'accueil', route: null,
    })
    if (uid) supabase.rpc('reset_progress').then(logIfError('reset_progress'))
  }

  return {
    state,
    actions: {
      go, openRoute, openDebate, openAgendaEvent, back, vote, answer, next, bAnswer, bStart, bRestart,
      markRead, setFilter, setTheme, setDebPick, pickFirstRound,
      toggleReminder,
      authApple, authGoogle, authGuest, submitAuth, toggleAuthView,
      setAuthFirst, setAuthLast, setAuthPseudo, setAuthEmail, setAuthPass, setAuthDob, setAuthSex,
      setProfileVille, setProfileRegion, setProfilePays, setProfileCP, setProfileTel, setProfileInterets,
      saveProfileExtra,
      logout, resetAll,
    },
  }
}

export type AppActions = ReturnType<typeof useAppState>['actions']
