import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT, VOTE_RESULTS } from '../data'
import { backLink, flowWrap, h1Size } from '../styles'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function VoteScreen({ state: s, actions, isWeb }: Props) {
  const voteDone = s.voteChoice !== null

  return (
    <div className="rise" style={flowWrap(isWeb)}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>
      <div className="stk" style={{ gap: 10 }}>
        <div className="eyebrow">Vote du jour · ferme à 20h</div>
        <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.04, fontWeight: 700 }}>Le vote devrait-il être obligatoire ?</h1>
      </div>
      <div style={{ background: '#E3E7FF', borderRadius: 18, padding: '14px 16px', fontSize: 14.5, lineHeight: 1.55, color: '#1F2A8A' }}>
        Question posée à tous les inscrits. Un seul bulletin par jour, modifiable jusqu'à 20h. Le résultat est publié ce soir avec le détail par tranche d'âge.
      </div>

      {!voteDone && (
        <div className="stk" style={{ gap: 12 }}>
          <button type="button" onClick={actions.vote('oui')} className="press" style={{ display: 'block', width: '100%', padding: '22px 20px', borderRadius: 22, background: '#E3E7FF', border: '1.5px solid #B8C0F5', textAlign: 'left' }}>
            <span className="dsp" style={{ display: 'block', fontSize: 32, fontWeight: 800, color: '#1F2A8A', lineHeight: 1 }}>Oui</span>
            <span style={{ display: 'block', fontSize: 14.5, color: '#2A3596', marginTop: 6 }}>Voter serait un devoir civique sanctionné</span>
          </button>
          <button type="button" onClick={actions.vote('non')} className="press" style={{ display: 'block', width: '100%', padding: '22px 20px', borderRadius: 22, background: '#FFEBC6', border: '1.5px solid #F2CD86', textAlign: 'left' }}>
            <span className="dsp" style={{ display: 'block', fontSize: 32, fontWeight: 800, color: '#6E3A00', lineHeight: 1 }}>Non</span>
            <span style={{ display: 'block', fontSize: 14.5, color: '#7A4300', marginTop: 6 }}>L'abstention reste une expression politique</span>
          </button>
        </div>
      )}

      {voteDone && (
        <div className="stk" style={{ gap: 14 }}>
          <div className="card rise stk" style={{ gap: 16 }}>
            {VOTE_RESULTS(ACCENT).map((r) => (
              <div key={r.label}>
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="row" style={{ gap: 8, fontSize: 16, fontWeight: 700 }}>
                    {r.label}
                    {s.voteChoice === r.label.toLowerCase() && <span className="tag" style={{ background: '#171B3C', color: '#fff' }}>Ton choix</span>}
                  </span>
                  <span className="dsp num" style={{ fontSize: 26, fontWeight: 700 }}>{r.pct}</span>
                </div>
                <div className="bar" style={{ height: 14 }}><i style={{ width: r.pct, background: r.color }} /></div>
              </div>
            ))}
            <div className="num" style={{ fontSize: 13, color: '#5C617B', paddingTop: 12, borderTop: '1px solid #EDE9DF' }}>Clôture 20:00</div>
          </div>
          <div className="pop" style={{ background: '#171B3C', color: '#fff', borderRadius: 22, padding: 22, textAlign: 'center' }}>
            <div className="dsp num" style={{ fontSize: 44, fontWeight: 800, color: '#F0A03C', lineHeight: 1 }}>+15 ◆</div>
            <div style={{ fontSize: 14.5, color: '#B9BEDD', marginTop: 8 }}>{'Bulletin enregistré : ' + (s.voteChoice === 'oui' ? 'Oui' : 'Non')}</div>
          </div>
          <button type="button" onClick={actions.back} className="btn" style={{ background: ACCENT }}>Retour au bulletin</button>
        </div>
      )}
    </div>
  )
}
