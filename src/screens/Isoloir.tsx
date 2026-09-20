import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT } from '../data'
import { levelFromPoints, levelProgress } from '../lib/leveling'
import { h1, infoBox, mono, screenWrap, sectionLabel } from '../styles'

interface Props {
  state: AppState
  actions: AppActions
}

export default function Isoloir({ state: s, actions }: Props) {
  const voteDone = s.voteChoice !== null
  const level = levelFromPoints(s.points)
  const { xpIntoLevel, xpTarget } = levelProgress(s.points)

  const openVotes = [
    {
      title: 'Vote du jour', sub: 'Le vote obligatoire · ferme à 20h',
      tag: voteDone ? 'voté' : 'à voter',
      tagBg: voteDone ? '#e7f0e8' : '#fdf0e6', tagFg: voteDone ? '#2f6b3c' : '#9a5b1f',
      onClick: actions.openRoute('vote'),
    },
    {
      title: 'Estimation du 1er tour', sub: 'Clôture dimanche 8h',
      tag: s.estSent ? 'envoyée' : 'à faire',
      tagBg: s.estSent ? '#e7f0e8' : '#fdf0e6', tagFg: s.estSent ? '#2f6b3c' : '#9a5b1f',
      onClick: actions.openRoute('estimation'),
    },
    {
      title: 'Votes du débat de ce soir', sub: 'Avant, pendant et après',
      tag: '21h00', tagBg: '#eef0f7', tagFg: '#4d5680',
      onClick: actions.openRoute('debat'),
    },
  ]

  return (
    <div style={screenWrap}>
      <div>
        <div style={sectionLabel}>Isoloir</div>
        <h1 style={h1}>Tes votes ouverts</h1>
        <div style={{ fontSize: 13, color: '#6b7392', lineHeight: 1.45 }}>Ce qui est ouvert aujourd'hui, et ce qui est déjà tranché.</div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e3e7f3', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 2px rgba(16,22,46,.04)' }}>
        {openVotes.map((v, i) => (
          <div key={v.title} onClick={v.onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < openVotes.length - 1 ? '1px solid #eef0f7' : 'none', cursor: 'pointer' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-.01em' }}>{v.title}</div>
              <div style={{ fontSize: 11.5, color: '#6b7392', marginTop: 2 }}>{v.sub}</div>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 600, padding: '4px 9px', borderRadius: 999, whiteSpace: 'nowrap', background: v.tagBg, color: v.tagFg }}>{v.tag}</div>
            <div style={{ color: '#aab2cc', fontSize: 15 }}>›</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e3e7f3', borderRadius: 16, padding: 15 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 9 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-.01em' }}>{'Niveau ' + level}</div>
          <div style={{ fontFamily: mono, fontSize: 12, color: '#6b7392' }}>{xpIntoLevel + ' / ' + xpTarget + ' XP'}</div>
        </div>
        <div style={{ height: 8, borderRadius: 9, background: '#eef0f7', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 9, transition: 'width .4s ease', width: (xpIntoLevel / xpTarget * 100) + '%', background: ACCENT }} />
        </div>
        <div style={{ fontSize: 11.5, color: '#6b7392', marginTop: 8 }}>{(xpTarget - xpIntoLevel) + ' XP'} avant le niveau {level + 1}</div>
      </div>

      <div style={infoBox}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Comment les points sont comptés</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.55, color: '#4d5680' }}>
          Aucune mise, aucun argent. Participer rapporte peu, être juste rapporte beaucoup : moins de 2 points d'écart moyen sur une estimation donne le barème maximum.
        </div>
      </div>
    </div>
  )
}
