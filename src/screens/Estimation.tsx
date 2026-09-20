import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT, CANDS } from '../data'
import { backLink, card, mono, screenWrap, sectionLabel, serif } from '../styles'

interface Props {
  state: AppState
  actions: AppActions
}

export default function Estimation({ state: s, actions }: Props) {
  const total = s.est.reduce((a, b) => a + b, 0)
  const ok = total >= 98 && total <= 102

  return (
    <div className="rise-in" style={screenWrap}>
      <div onClick={actions.back} style={backLink}>‹ Retour</div>
      <div>
        <div style={sectionLabel}>Estimation du 1er tour · clôture dimanche 8h</div>
        <h1 style={{ margin: '8px 0 4px', fontFamily: serif, fontSize: 29, lineHeight: 1.12, fontWeight: 600, letterSpacing: '-.02em' }}>Ton estimation</h1>
        <div style={{ fontSize: 13, color: '#6b7392', lineHeight: 1.45 }}>Répartis 100 points. Moins de 2 points d'écart moyen : barème maximum.</div>
      </div>

      <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {CANDS.map((c, i) => (
          <div key={c.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontFamily: mono, fontSize: 14, fontWeight: 600 }}>{s.est[i] + ' %'}</div>
            </div>
            <input type="range" min={0} max={45} value={s.est[i]} onChange={actions.setEst(i)} style={{ width: '100%', height: 22 }} />
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12, borderTop: '1px solid #eef0f7' }}>
          <div style={{ fontSize: 12.5, color: '#6b7392' }}>Total réparti</div>
          <div style={{ fontFamily: mono, fontSize: 15, fontWeight: 600, color: ok ? '#2f6b3c' : '#b03a4a' }}>{total + ' / 100'}</div>
        </div>
      </div>

      <div onClick={actions.sendEstimate} style={{ textAlign: 'center', padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#fff', background: s.estSent ? ACCENT : ok ? ACCENT : '#aab2cc' }}>
        {s.estSent ? 'Estimation envoyée ✓' : ok ? 'Envoyer mon estimation' : 'Le total doit faire 100'}
      </div>

      <div style={{ background: '#e8ecf8', border: '1px solid #dce1f2', borderRadius: 14, padding: 14, fontSize: 12.5, lineHeight: 1.55, color: '#4d5680' }}>
        Aucune mise, aucun argent. Ton estimation est comparée aux résultats officiels dimanche soir, puis convertie en points.
      </div>
    </div>
  )
}
