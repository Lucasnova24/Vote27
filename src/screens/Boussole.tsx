import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { BOUSSOLE, BOUSSOLE_SCALE, THEME_STYLE } from '../data'
import { backLink, flowWrap, h1Size, qSize } from '../styles'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function Boussole({ state: s, actions, isWeb }: Props) {
  const bIntro = !s.bMode && !s.bDone
  const bRunning = !!s.bMode && !s.bDone
  const bq = BOUSSOLE[Math.min(s.bI, BOUSSOLE.length - 1)]
  const bts = THEME_STYLE[bq.t]

  const results = BOUSSOLE.map((stmt, i) => ({
    theme: stmt.t,
    statement: stmt.s,
    answer: BOUSSOLE_SCALE.find((o) => o.v === s.bAnswers[i]) ?? BOUSSOLE_SCALE[2],
    style: THEME_STYLE[stmt.t],
  }))

  return (
    <div className="rise" style={flowWrap(isWeb)}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>

      {bIntro && (
        <div className="stk" style={{ gap: 16 }}>
          <div className="stk" style={{ gap: 8 }}>
            <div className="eyebrow" style={{ color: '#3F238F' }}>Mes affinités</div>
            <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.02, fontWeight: 700 }}>Où vous situez-vous ?</h1>
            <div style={{ fontSize: 15, color: '#454A66' }}>Vos réponses restent sur cet appareil.</div>
          </div>
          <div style={{ background: '#E8E0FF', borderRadius: 20, padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#2E1A70', marginBottom: 6 }}>Comment ça marche</div>
            <div style={{ fontSize: 14.5, lineHeight: 1.55, color: '#3F238F' }}>
              Vous répondez à des affirmations sur six thèmes. Ce test décrit votre propre positionnement, thème par thème — il ne vous rapproche pas d'un candidat en particulier et n'est pas une recommandation de vote.
            </div>
          </div>
          <button type="button" onClick={actions.bStart} className="lift" style={{ display: 'block', width: '100%', background: '#fff', border: '1.5px solid #D3C6FA', borderRadius: 22, padding: 18, textAlign: 'left' }}>
            <span className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="dsp" style={{ fontSize: 23, fontWeight: 700 }}>Version courte</span>
              <span className="tag num" style={{ background: '#E8E0FF', color: '#3F238F' }}>20 questions</span>
            </span>
            <span style={{ display: 'block', fontSize: 14.5, color: '#454A66', marginTop: 6 }}>Environ 4 minutes. Les six thèmes principaux.</span>
          </button>
          <button type="button" onClick={actions.bStart} className="lift" style={{ display: 'block', width: '100%', background: '#fff', border: '1.5px solid #D3C6FA', borderRadius: 22, padding: 18, textAlign: 'left' }}>
            <span className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="dsp" style={{ fontSize: 23, fontWeight: 700 }}>Version longue</span>
              <span className="tag num" style={{ background: '#E8E0FF', color: '#3F238F' }}>100 questions</span>
            </span>
            <span style={{ display: 'block', fontSize: 14.5, color: '#454A66', marginTop: 6 }}>Environ 20 minutes. Résultats détaillés thème par thème.</span>
          </button>
          <div style={{ background: '#EFEBE2', borderRadius: 20, padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Limites</div>
            <div style={{ fontSize: 14.5, lineHeight: 1.55, color: '#454A66' }}>
              Un programme ne se résume pas à des affirmations binaires. Mes affinités ouvre la comparaison, elle ne la termine pas : chaque position renvoie à sa source dans les programmes.
            </div>
          </div>
        </div>
      )}

      {bRunning && (
        <div className="stk" style={{ gap: 20 }}>
          <div>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="tag num" style={{ background: '#EFEBE2', color: '#14162B' }}>{(Math.min(s.bI, BOUSSOLE.length - 1) + 1) + ' / 6'}</span>
              <span className="tag" style={{ background: bts.soft, color: bts.ink }}>{bq.t}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }} aria-hidden="true">
              {BOUSSOLE.map((_, i) => (
                <span key={i} style={{ flex: 1, height: 8, borderRadius: 99, transition: 'background-color .3s ease', background: i < s.bI ? '#6B45D9' : i === s.bI ? '#B7A2FF' : '#E7E2D6' }} />
              ))}
            </div>
          </div>
          <h1 className="dsp" style={{ margin: 0, fontSize: qSize(isWeb), lineHeight: 1.1, fontWeight: 700 }}>{bq.s}</h1>
          <div className="stk" style={{ gap: 10 }}>
            {BOUSSOLE_SCALE.map((opt) => (
              <button key={opt.label} type="button" onClick={actions.bAnswer(opt.v)} className="lift row" style={{ width: '100%', gap: 14, minHeight: 58, padding: '0 18px', background: '#fff', border: '1.5px solid #E7E2D6', borderRadius: 18, fontSize: 16, fontWeight: 600 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', flex: 'none', background: opt.color }} />{opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {s.bDone && (
        <div className="stk" style={{ gap: 16 }}>
          <div className="stk" style={{ gap: 8 }}>
            <div className="eyebrow" style={{ color: '#3F238F' }}>Résultat</div>
            <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.02, fontWeight: 700 }}>Ton profil politique</h1>
            <div style={{ fontSize: 14.5, color: '#454A66', lineHeight: 1.5 }}>Ta position sur les six thèmes, à partir de tes réponses. Ce n'est pas une recommandation de vote.</div>
          </div>
          <div className="card pop stk" style={{ gap: 16 }}>
            {results.map((r) => (
              <div key={r.theme} className="row" style={{ gap: 12, alignItems: 'center' }}>
                <span style={{ width: 40, height: 40, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: r.style.soft, color: r.style.ink }} aria-hidden="true">
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: r.answer.color }} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{r.theme}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: r.answer.color }}>{r.answer.label}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#5C617B' }}>{r.statement}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#E8E0FF', borderRadius: 20, padding: '14px 16px', fontSize: 14.5, lineHeight: 1.55, color: '#3F238F' }}>
            Ce résultat ne compare pas tes réponses à celles des candidats : on n'a pas encore leurs positions sourcées sur ces thèmes. Refais le test quand tu veux : rien n'est envoyé.
          </div>
          <button type="button" onClick={actions.bRestart} className="btn" style={{ background: '#fff', color: '#14162B', border: '1.5px solid #DDD7C9' }}>Refaire le test</button>
        </div>
      )}
    </div>
  )
}
