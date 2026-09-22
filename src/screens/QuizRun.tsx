import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT, QUIZ } from '../data'
import { backLink, flowWrap, qSize } from '../styles'
import { ChevronLeft, SourceIcon } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function QuizRun({ state: s, actions, isWeb }: Props) {
  const q = QUIZ[Math.min(s.quizI, QUIZ.length - 1)]
  const revealed = s.quizSel !== null

  return (
    <div className="rise" style={flowWrap(isWeb)}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Quitter</button>

      {!s.quizFinished && (
        <div className="stk" style={{ gap: 20 }}>
          <div>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="eyebrow" style={{ color: '#6E3A00' }}>{'Question ' + (s.quizI + 1) + ' / 5'}</span>
              <span className="tag num" style={{ background: '#FFEBC6', color: '#6E3A00' }}>{'Score ' + s.quizScore + ' / 5'}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }} aria-hidden="true">
              {QUIZ.map((_, i) => (
                <span key={i} style={{ flex: 1, height: 8, borderRadius: 99, transition: 'background-color .3s ease', background: i < s.quizI + (revealed ? 1 : 0) ? '#A85400' : i === s.quizI ? '#F0C27A' : '#E7E2D6' }} />
              ))}
            </div>
          </div>
          <h1 className="dsp" style={{ margin: 0, fontSize: qSize(isWeb), lineHeight: 1.08, fontWeight: 700 }}>{q.q}</h1>
          <div className="stk" style={{ gap: 10 }}>
            {q.o.map((label, i) => {
              const correct = i === q.a
              const picked = s.quizSel === i
              let bg = '#FFFFFF', bc = '#E7E2D6', markBg = '#EFEBE2', markFg = '#454A66', mark = String.fromCharCode(65 + i)
              if (revealed && correct) { bg = '#EAF6EE'; bc = '#8CC9A0'; markBg = '#1F7A3E'; markFg = '#FFFFFF'; mark = '✓' }
              else if (revealed && picked) { bg = '#FDEBE7'; bc = '#EFA99C'; markBg = '#C8341C'; markFg = '#FFFFFF'; mark = '✕' }
              else if (revealed) { bg = '#FBFAF6' }
              return (
                <button key={i} type="button" onClick={actions.answer(i)} disabled={revealed} className="row lift" style={{ width: '100%', gap: 14, minHeight: 64, padding: '12px 16px', border: '1.5px solid', borderRadius: 18, background: bg, borderColor: bc }}>
                  <span style={{ width: 34, height: 34, borderRadius: 11, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, background: markBg, color: markFg }}>{mark}</span>
                  <span style={{ flex: 1, fontSize: 16.5, fontWeight: 600, letterSpacing: '-.01em', lineHeight: 1.3, textAlign: 'left' }}>{label}</span>
                </button>
              )
            })}
          </div>
          {revealed && (
            <div className="rise stk" style={{ gap: 14 }}>
              <div className="card" style={{ background: '#FFF4DA', borderColor: '#F2DFAE', boxShadow: 'none' }}>
                <div style={{ fontSize: 15, lineHeight: 1.55, color: '#14162B' }}>{q.e}</div>
                <div className="row" style={{ gap: 8, fontSize: 13, fontWeight: 600, color: '#6E3A00', marginTop: 10 }}><SourceIcon />{'Source · ' + q.s}</div>
              </div>
              <button type="button" onClick={actions.next} className="btn" style={{ background: '#A85400' }}>
                {s.quizI >= QUIZ.length - 1 ? 'Voir mon score' : 'Question suivante'}
              </button>
            </div>
          )}
        </div>
      )}

      {s.quizFinished && (
        <div className="stk" style={{ gap: 14 }}>
          <div className="pop" style={{ background: '#171B3C', color: '#fff', borderRadius: 26, padding: '28px 24px', textAlign: 'center' }}>
            <div className="eyebrow" style={{ color: '#A7ADD3' }}>Quiz terminé</div>
            <div className="dsp num" style={{ fontSize: 72, fontWeight: 800, lineHeight: 1, margin: '14px 0 10px', color: '#F0A03C' }}>{s.quizScore + ' / 5'}</div>
            <span className="tag" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: 13.5, padding: '6px 14px' }}>{'+' + s.quizScore * 20 + ' ◆ crédités'}</span>
          </div>
          <div className="card">
            <div className="row" style={{ gap: 10, marginBottom: 6 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8341C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .3 1.4 1 2 2 2 0-3-1-5 1-8Z" /></svg>
              <span style={{ fontSize: 15.5, fontWeight: 700 }}>Prochaine tentative demain à 00h00</span>
            </div>
            <div style={{ fontSize: 14.5, lineHeight: 1.55, color: '#454A66' }}>Une seule tentative par jour : c'est ce qui rend le classement comparable. Reviens demain pour continuer à progresser.</div>
          </div>
          <button type="button" onClick={actions.go('quiz')} className="btn" style={{ background: ACCENT }}>Voir le classement</button>
        </div>
      )}
    </div>
  )
}
