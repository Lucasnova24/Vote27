import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT, BOUSSOLE, BOUSSOLE_SCALE, BOUSSOLE_SEED, CANDS } from '../data'
import { backLink, card, h1, infoBox, mono, primaryButton, screenWrap, sectionLabel, serif } from '../styles'

interface Props {
  state: AppState
  actions: AppActions
}

export default function Boussole({ state: s, actions }: Props) {
  const bIntro = !s.bMode && !s.bDone
  const bRunning = !!s.bMode && !s.bDone
  const bq = BOUSSOLE[Math.min(s.bI, BOUSSOLE.length - 1)]

  const bias = s.bAnswers.reduce((a, b) => a + b, 0)
  const bMatches = CANDS.map((c, i) => ({
    name: c.name,
    color: c.color,
    pct: Math.max(18, Math.min(94, BOUSSOLE_SEED[i] + bias * (i % 2 === 0 ? 2 : -2))),
  })).sort((a, b) => b.pct - a.pct)

  return (
    <div className="rise-in" style={screenWrap}>
      <div onClick={actions.back} style={backLink}>‹ Retour</div>

      {bIntro && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={sectionLabel}>Ma boussole</div>
            <h1 style={h1}>Où vous situez-vous ?</h1>
            <div style={{ fontSize: 13, color: '#6b7392' }}>Vos réponses restent sur cet appareil.</div>
          </div>
          <div style={{ ...infoBox, borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Comment ça marche</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.55, color: '#4d5680' }}>
              Vous répondez à des affirmations. Vos positions sont comparées à celles des candidats, extraites de leurs prises de position publiques et sourcées une par une. Ce n'est pas une recommandation de vote.
            </div>
          </div>
          <div onClick={actions.bStart} style={{ background: '#fff', border: '1.5px solid #d3d9ec', borderRadius: 16, padding: 16, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 600 }}>Version courte</div>
              <div style={{ fontFamily: mono, fontSize: 12, color: '#6b7392' }}>20 questions</div>
            </div>
            <div style={{ fontSize: 12.5, color: '#6b7392', marginTop: 5 }}>Environ 4 minutes. Les six thèmes principaux.</div>
          </div>
          <div onClick={actions.bStart} style={{ background: '#fff', border: '1.5px solid #d3d9ec', borderRadius: 16, padding: 16, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 600 }}>Version longue</div>
              <div style={{ fontFamily: mono, fontSize: 12, color: '#6b7392' }}>24 questions</div>
            </div>
            <div style={{ fontSize: 12.5, color: '#6b7392', marginTop: 5 }}>Environ 8 minutes. Résultats détaillés thème par thème.</div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Limites</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.55, color: '#6b7392' }}>
              Un programme ne se résume pas à des affirmations binaires. La boussole ouvre la comparaison, elle ne la termine pas : chaque position renvoie à sa source dans les programmes.
            </div>
          </div>
        </div>
      )}

      {bRunning && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7392', marginBottom: 8, fontFamily: mono }}>
              <span>{(s.bI + 1) + ' / 6'}</span><span>{bq.t}</span>
            </div>
            <div style={{ height: 4, borderRadius: 9, background: '#e1e5f1', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 9, transition: 'width .35s ease', width: (s.bI / BOUSSOLE.length * 100) + '%', background: ACCENT }} />
            </div>
          </div>
          <h1 style={{ margin: '4px 0 0', fontFamily: serif, fontSize: 25, lineHeight: 1.25, fontWeight: 600, letterSpacing: '-.015em' }}>{bq.s}</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {BOUSSOLE_SCALE.map((opt) => (
              <div key={opt.label} onClick={actions.bAnswer(opt.v)} style={{ padding: '14px 16px', background: '#fff', border: '1.5px solid #e3e7f3', borderRadius: 13, fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 10, height: 10, transform: 'rotate(45deg)', flex: 'none', background: opt.color }} />{opt.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {s.bDone && (
        <div className="rise-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={sectionLabel}>Résultat</div>
            <h1 style={{ margin: '6px 0 4px', fontFamily: serif, fontSize: 29, lineHeight: 1.1, fontWeight: 600, letterSpacing: '-.02em' }}>Proximité par candidat</h1>
            <div style={{ fontSize: 12.5, color: '#6b7392', lineHeight: 1.5 }}>Sur les six affirmations. Ce n'est pas une recommandation de vote.</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e3e7f3', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 13 }}>
            {bMatches.map((m) => (
              <div key={m.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 600 }}>{m.pct + '%'}</div>
                </div>
                <div style={{ height: 8, borderRadius: 9, background: '#eef0f7', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 9, transition: 'width .7s cubic-bezier(.2,.8,.2,1)', width: m.pct + '%', background: m.color }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...infoBox, borderRadius: 14, padding: 14, fontSize: 12.5, lineHeight: 1.55, color: '#4d5680' }}>
            Chaque position de candidat renvoie à sa source dans les programmes. Refaites la boussole quand vous voulez : rien n'est envoyé.
          </div>
          <div onClick={actions.openRoute('programmes')} style={primaryButton(ACCENT)}>Comparer les programmes</div>
        </div>
      )}
    </div>
  )
}
