import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT, VOTE_RESULTS } from '../data'
import { backLink, infoBox, mono, primaryButton, screenWrap, sectionLabel, serif } from '../styles'

interface Props {
  state: AppState
  actions: AppActions
}

export default function VoteScreen({ state: s, actions }: Props) {
  const voteDone = s.voteChoice !== null

  return (
    <div className="rise-in" style={screenWrap}>
      <div onClick={actions.back} style={backLink}>‹ Retour</div>
      <div>
        <div style={sectionLabel}>Vote du jour · ferme à 20h</div>
        <h1 style={{ margin: '8px 0 0', fontFamily: serif, fontSize: 29, lineHeight: 1.15, fontWeight: 600, letterSpacing: '-.02em' }}>
          Le vote devrait-il être obligatoire ?
        </h1>
      </div>
      <div style={{ ...infoBox, borderRadius: 14, padding: 14, fontSize: 12.5, lineHeight: 1.55, color: '#4d5680' }}>
        Question posée à tous les inscrits. Un seul bulletin par jour, modifiable jusqu'à 20h. Le résultat est publié ce soir avec le détail par tranche d'âge.
      </div>

      {!voteDone && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div onClick={actions.vote('oui')} style={{ padding: 20, border: '1.5px solid #d3d9ec', borderRadius: 16, background: '#fff', cursor: 'pointer' }}>
            <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 600 }}>Oui</div>
            <div style={{ fontSize: 12.5, color: '#6b7392', marginTop: 3 }}>Voter serait un devoir civique sanctionné</div>
          </div>
          <div onClick={actions.vote('non')} style={{ padding: 20, border: '1.5px solid #d3d9ec', borderRadius: 16, background: '#fff', cursor: 'pointer' }}>
            <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 600 }}>Non</div>
            <div style={{ fontSize: 12.5, color: '#6b7392', marginTop: 3 }}>L'abstention reste une expression politique</div>
          </div>
        </div>
      )}

      {voteDone && (
        <div className="rise-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#fff', border: '1px solid #e3e7f3', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {VOTE_RESULTS(ACCENT).map((r) => (
              <div key={r.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  <span>{r.label}</span>
                  <span style={{ fontFamily: mono }}>{r.pct}</span>
                </div>
                <div style={{ height: 10, borderRadius: 9, background: '#eef0f7', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 9, transition: 'width .6s cubic-bezier(.2,.8,.2,1)', width: r.pct, background: r.color }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize: 11.5, color: '#6b7392', fontFamily: mono, paddingTop: 4, borderTop: '1px solid #eef0f7' }}>
              12 480 bulletins · clôture 20:00
            </div>
          </div>
          <div style={{ background: '#1b2a63', color: '#fff', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: 24, fontWeight: 600 }}>+15 ◆</div>
            <div style={{ fontSize: 12.5, color: '#c3cbe8', marginTop: 4 }}>Bulletin enregistré : {s.voteChoice === 'oui' ? 'Oui' : 'Non'}</div>
          </div>
          <div onClick={actions.back} style={primaryButton(ACCENT)}>Retour au bulletin</div>
        </div>
      )}
    </div>
  )
}
