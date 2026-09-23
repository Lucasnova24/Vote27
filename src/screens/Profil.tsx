import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { BADGES, QUIZ, SETTINGS_ROWS } from '../data'
import { getDisplayName } from '../lib/displayName'
import { levelFromPoints, levelProgress } from '../lib/leveling'
import { gapPage, h1Size } from '../styles'
import Grid2 from '../components/Grid2'
import { BoussoleIcon, ChevronRight, LogoDiamond, PersonIcon } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function Profil({ state: s, actions, isWeb }: Props) {
  const gap = gapPage(isWeb)
  const level = levelFromPoints(s.points)
  const { xpIntoLevel, xpTarget, pct } = levelProgress(s.points)
  const levelOffset = (201.06 * (1 - pct / 100)).toFixed(2)

  const accountLine =
    s.authProvider === 'apple' ? 'Connectée avec Apple'
    : s.authProvider === 'google' ? 'Connectée avec Google Play'
    : s.authProvider === 'anonymous' ? 'Session invitée — progression locale uniquement'
    : s.authEmail || 'Compte e-mail'

  const badgeUnlocked: Record<string, boolean> = {
    'Première voix': s.voteChoice !== null,
    'Bon pronostic': s.debPick !== null,
    'Sans faute': s.quizDoneToday && s.quizScore === QUIZ.length,
    'Affinités faites': s.bDone,
  }

  const stats = [
    { value: s.quizAttemptsTotal > 0 ? Math.round((s.quizCorrectTotal / s.quizAttemptsTotal) * 100) + ' %' : '—', label: 'justesse aux quiz' },
    { value: String(s.quizAttemptsTotal), label: 'réponses aux quiz' },
  ]

  const colA = (
    <>
      <section className="card" style={{ order: 1, background: '#171B3C', borderColor: '#171B3C', color: '#fff' }} aria-label="Niveau et statistiques">
        <div className="row" style={{ gap: 16 }}>
          <div style={{ position: 'relative', width: 76, height: 76, flex: 'none' }}>
            <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
              <circle cx="38" cy="38" r="32" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth={8} />
              <circle className="ring" cx="38" cy="38" r="32" fill="none" stroke="#F0A03C" strokeWidth={8} strokeLinecap="round" strokeDasharray="201.06" style={{ strokeDashoffset: levelOffset }} transform="rotate(-90 38 38)" />
            </svg>
            <span className="dsp num" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800 }}>{level}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="eyebrow" style={{ color: '#A7ADD3' }}>{'Niveau ' + level}</div>
            <div className="dsp" style={{ fontSize: 23, lineHeight: 1.1, fontWeight: 700, marginTop: 4 }}>{getDisplayName(s)}</div>
            <div className="num" style={{ fontSize: 13, color: '#B9BEDD', marginTop: 6 }}>{xpIntoLevel + ' / ' + xpTarget + ' XP'}</div>
          </div>
        </div>
        <div className="bar" style={{ marginTop: 16, background: 'rgba(255,255,255,.14)' }}><i style={{ width: pct + '%', background: '#F0A03C' }} /></div>
        <div style={{ fontSize: 13.5, color: '#B9BEDD', marginTop: 10 }}>{(xpTarget - xpIntoLevel) + ' XP avant le niveau ' + (level + 1)}</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {stats.map((st) => (
            <div key={st.label} style={{ flex: 1, textAlign: 'center', padding: '12px 6px', borderRadius: 16, background: 'rgba(255,255,255,.1)' }}>
              <div className="dsp num" style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{st.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 5, color: '#B9BEDD' }}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      <button type="button" onClick={actions.openRoute('boussole')} className="press" style={{ order: 2, display: 'block', width: '100%', textAlign: 'left', background: '#5A36C8', color: '#fff', borderRadius: 22, padding: 20 }}>
        <span className="row" style={{ gap: 12, justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="dsp" style={{ display: 'block', fontSize: 25, lineHeight: 1.05, fontWeight: 700, maxWidth: 230 }}>
            {s.bDone ? 'Mes affinités sont faites' : 'Mes affinités ne sont pas faites'}
          </span>
          <span style={{ flex: 'none' }}><BoussoleIcon size={44} /></span>
        </span>
        <span style={{ display: 'block', fontSize: 14.5, lineHeight: 1.5, color: '#E4DBFF', marginTop: 10 }}>20 ou 100 questions. Tes réponses restent sur cet appareil.</span>
        <span className="btn" style={{ marginTop: 16, background: '#fff', color: '#3F238F' }}>{s.bDone ? 'Voir mon résultat' : 'Commencer'}<ChevronRight size={16} /></span>
      </button>

      <button type="button" onClick={actions.openRoute('completeprofile')} className="card lift row" style={{ order: 3, width: '100%', gap: 12, textAlign: 'left' }}>
        <span style={{ width: 44, height: 44, borderRadius: 14, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EFEBE2', color: '#454A66' }}><PersonIcon /></span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700 }}>Compléter mon profil</span>
          <span style={{ display: 'block', fontSize: 13, color: '#5C617B', marginTop: 2 }}>Ville, région, pays, téléphone, centres d'intérêt</span>
        </span>
        <ChevronRight size={18} color="#5C617B" />
      </button>

      <section style={{ order: 4 }} aria-label="Badges">
        <h2 className="dsp" style={{ margin: '6px 0 12px', fontSize: 22, fontWeight: 700 }}>Badges</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
          {BADGES.map((b) => {
            const unlocked = badgeUnlocked[b.name]
            return (
              <div key={b.name} style={{ background: '#fff', border: '1px solid #E7E2D6', borderRadius: 20, padding: '14px 8px', textAlign: 'center', opacity: unlocked ? 1 : 0.45 }}>
                <div style={{ width: 46, height: 46, margin: '0 auto', borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', background: unlocked ? b.color : '#8B90A8' }}>
                  <LogoDiamond size={20} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 9, lineHeight: 1.2 }}>{b.name}</div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )

  const colB = (
    <>
      <section className="card" style={{ order: 5, padding: 6 }} aria-label="Réglages">
        {SETTINGS_ROWS.map((label) => (
          <button key={label} type="button" className="row sep rowh" style={{ width: '100%', gap: 12, minHeight: 58, padding: '0 14px', borderRadius: 16 }}>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 600, textAlign: 'left' }}>{label}</span>
            <ChevronRight size={18} color="#5C617B" />
          </button>
        ))}
      </section>

      <div className="stk" style={{ order: 6, alignItems: 'center', gap: 2, textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: '#5C617B', paddingBottom: 4 }}>{accountLine}</div>
        <button type="button" onClick={actions.logout} style={{ minHeight: 44, padding: '0 16px', fontSize: 14, fontWeight: 700, color: '#454A66' }}>Se déconnecter</button>
        <button type="button" onClick={actions.resetAll} style={{ minHeight: 44, padding: '0 16px', fontSize: 14, fontWeight: 700, color: '#B0301A' }}>Réinitialiser ma progression</button>
        <div style={{ fontSize: 12.5, color: '#5C617B', lineHeight: 1.55, padding: '8px 12px 0', maxWidth: 420 }}>
          Vote 2027 est une application civique indépendante et non officielle. Les candidats affichés sont réels (déclarés ou pressentis) ; les votes, quiz et pronostics de l'app n'ont aucune valeur de sondage officiel.
        </div>
      </div>
    </>
  )

  return (
    <div className="rise stk" style={{ gap }}>
      <div className="stk" style={{ gap: 8, marginBottom: 4 }}>
        <div className="eyebrow">Profil</div>
        <h1 className="dsp" style={{ margin: 0, fontWeight: 700, lineHeight: 1, fontSize: h1Size(isWeb) }}>{getDisplayName(s)}</h1>
        <div style={{ fontSize: 15, color: '#454A66' }}>{accountLine}</div>
      </div>
      <Grid2 isWeb={isWeb} gap={gap} colA={colA} colB={colB} />
    </div>
  )
}
