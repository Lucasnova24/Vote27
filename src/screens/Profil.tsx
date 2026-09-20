import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT, SETTINGS_ROWS } from '../data'
import { getDisplayName } from '../lib/displayName'
import { levelFromPoints, levelProgress } from '../lib/leveling'
import { h1, mono, screenWrap, sectionLabel, serif } from '../styles'

interface Props {
  state: AppState
  actions: AppActions
}

export default function Profil({ state: s, actions }: Props) {
  const level = levelFromPoints(s.points)
  const { xpIntoLevel, xpTarget } = levelProgress(s.points)

  const stats = [
    { value: s.voteChoice ? 'Fait' : 'À faire', label: 'vote du jour' },
    { value: s.quizDoneToday ? s.quizScore + ' / 5' : 'À faire', label: 'quiz' },
    { value: s.bDone ? 'Faite' : 'À faire', label: 'boussole' },
  ]

  const badges = [
    { name: 'Première voix', color: '#2f4bb0', unlocked: s.voteChoice !== null },
    { name: 'Sans faute', color: '#7a4a8c', unlocked: s.quizDoneToday && s.quizScore === 5 },
    { name: 'Bon pronostic', color: '#9a5b1f', unlocked: s.debPick !== null },
    { name: 'Boussole faite', color: '#4a7a56', unlocked: s.bDone },
  ]

  const accountLine =
    s.authProvider === 'apple' ? 'Connectée avec Apple'
    : s.authProvider === 'google' ? 'Connectée avec Google Play'
    : s.authProvider === 'anonymous' ? 'Session invitée — supprimée si tu te déconnectes'
    : s.authEmail || 'Compte e-mail'

  return (
    <div style={screenWrap}>
      <div>
        <div style={sectionLabel}>Profil</div>
        <h1 style={h1}>{getDisplayName(s)}</h1>
        <div style={{ fontSize: 13, color: '#6b7392' }}>{accountLine}</div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e3e7f3', borderRadius: 16, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{'Niveau ' + level}</div>
          <div style={{ fontFamily: mono, fontSize: 12, color: '#6b7392' }}>{xpIntoLevel + ' / ' + xpTarget + ' XP'}</div>
        </div>
        <div style={{ height: 6, borderRadius: 9, background: '#eef0f7', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 9, width: (xpIntoLevel / xpTarget * 100) + '%', background: ACCENT }} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          {stats.map((st) => (
            <div key={st.label} style={{ flex: 1, textAlign: 'center', padding: '10px 6px', background: '#f7f9fd', border: '1px solid #eef0f7', borderRadius: 12 }}>
              <div style={{ fontFamily: mono, fontSize: 17, fontWeight: 600 }}>{st.value}</div>
              <div style={{ fontSize: 10.5, color: '#6b7392', marginTop: 2 }}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {!s.bDone && (
        <div onClick={actions.openRoute('boussole')} style={{ background: '#1b2a63', color: '#fff', borderRadius: 16, padding: 16, cursor: 'pointer' }}>
          <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 600 }}>Ta boussole n'est pas faite</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.45, color: '#c3cbe8', marginTop: 6 }}>20 questions, 4 minutes. Tes réponses restent liées à ton compte.</div>
          <div style={{ marginTop: 12, display: 'inline-flex', background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 9, padding: '8px 12px', fontSize: 12.5, fontWeight: 600 }}>
            Commencer ›
          </div>
        </div>
      )}

      <div>
        <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 600, margin: '4px 0 10px' }}>Badges</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {badges.map((b) => (
            <div key={b.name} style={{ background: '#fff', border: '1px solid #e3e7f3', borderRadius: 14, padding: '12px 8px', textAlign: 'center', opacity: b.unlocked ? 1 : 0.4 }}>
              <div style={{ width: 30, height: 30, margin: '0 auto', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#fff', background: b.unlocked ? b.color : '#aab2cc' }}>◆</div>
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 7, lineHeight: 1.25 }}>{b.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e3e7f3', borderRadius: 16, overflow: 'hidden' }}>
        {SETTINGS_ROWS.map((label, i) => (
          <div
            key={label}
            onClick={label === 'Se déconnecter' ? actions.logout : undefined}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < SETTINGS_ROWS.length - 1 ? '1px solid #eef0f7' : 'none', cursor: 'pointer' }}
          >
            <div style={{ flex: 1, fontSize: 13.5 }}>{label}</div>
            <div style={{ color: '#aab2cc', fontSize: 15 }}>›</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div onClick={actions.logout} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#4d5680', cursor: 'pointer', padding: 4 }}>Se déconnecter</div>
        <div onClick={actions.resetAll} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#b03a4a', cursor: 'pointer', padding: 4 }}>Réinitialiser ma progression</div>
      </div>
      <div style={{ fontSize: 11.5, color: '#8189a8', lineHeight: 1.5, textAlign: 'center', padding: '0 12px' }}>
        Vote 2027 est une application civique indépendante. Les candidats et sondages affichés ici sont fictifs.
      </div>
    </div>
  )
}
