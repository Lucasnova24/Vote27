import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT } from '../data'
import { backLink, flowWrap, qSize } from '../styles'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function QuizRun({ state: s, actions, isWeb }: Props) {
  const total = s.dailyQuiz.length

  if (total === 0) {
    return (
      <div className="rise" style={flowWrap(isWeb)}>
        <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Quitter</button>
        <div className="card" style={{ marginTop: 20 }}>
          <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 6 }}>Pas de quiz aujourd'hui</div>
          <div style={{ fontSize: 14.5, color: '#454A66', lineHeight: 1.5 }}>Reviens un peu plus tard : le prochain quiz n'est pas encore ouvert.</div>
        </div>
      </div>
    )
  }

  const item = s.dailyQuiz[Math.min(s.quizI, total - 1)]
  const answered = !!item.my_answered_at
  const submitting = s.quizSel !== null && !answered

  return (
    <div className="rise" style={flowWrap(isWeb)}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Quitter</button>

      {!s.quizFinished && (
        <div className="stk" style={{ gap: 20 }}>
          <div>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="eyebrow" style={{ color: '#6E3A00' }}>{'Question ' + (s.quizI + 1) + ' / ' + total}</span>
              <span className="tag num" style={{ background: '#FFEBC6', color: '#6E3A00' }}>{'Score ' + s.quizScore + ' / ' + total}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }} aria-hidden="true">
              {s.dailyQuiz.map((_, i) => (
                <span key={i} style={{ flex: 1, height: 8, borderRadius: 99, transition: 'background-color .3s ease', background: i < s.quizI + (answered ? 1 : 0) ? '#A85400' : i === s.quizI ? '#F0C27A' : '#E7E2D6' }} />
              ))}
            </div>
          </div>
          <div className="eyebrow" style={{ color: '#5C617B' }}>{item.theme_label}</div>
          <h1 className="dsp" style={{ margin: 0, fontSize: qSize(isWeb), lineHeight: 1.08, fontWeight: 700 }}>{item.prompt}</h1>
          <div className="stk" style={{ gap: 10 }}>
            {item.choices.map((c, i) => {
              const isCorrectChoice = answered && item.answer !== null && c.label === item.answer
              const picked = item.my_choice_id === c.id
              let bg = '#FFFFFF', bc = '#E7E2D6', markBg = '#EFEBE2', markFg = '#454A66', mark = String.fromCharCode(65 + i)
              if (answered && isCorrectChoice) { bg = '#EAF6EE'; bc = '#8CC9A0'; markBg = '#1F7A3E'; markFg = '#FFFFFF'; mark = '✓' }
              else if (answered && picked) { bg = '#FDEBE7'; bc = '#EFA99C'; markBg = '#C8341C'; markFg = '#FFFFFF'; mark = '✕' }
              else if (answered) { bg = '#FBFAF6' }
              return (
                <button
                  key={c.id} type="button" onClick={actions.answer(c.id)} disabled={submitting || answered}
                  className="row lift" style={{ width: '100%', gap: 14, minHeight: 64, padding: '12px 16px', border: '1.5px solid', borderRadius: 18, background: bg, borderColor: bc }}
                >
                  <span style={{ width: 34, height: 34, borderRadius: 11, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, background: markBg, color: markFg }}>{mark}</span>
                  <span style={{ flex: 1, fontSize: 16.5, fontWeight: 600, letterSpacing: '-.01em', lineHeight: 1.3, textAlign: 'left' }}>{c.label}</span>
                </button>
              )
            })}
          </div>
          {answered && (
            <div className="rise stk" style={{ gap: 14 }}>
              <div className="card" style={{ background: '#FFF4DA', borderColor: '#F2DFAE', boxShadow: 'none' }}>
                <div style={{ fontSize: 15, lineHeight: 1.55, color: '#14162B' }}>
                  {item.explanation || ('Bonne réponse : ' + item.answer)}
                </div>
              </div>
              <button type="button" onClick={actions.next} className="btn" style={{ background: '#A85400' }}>
                {s.quizI >= total - 1 ? 'Voir mon score' : 'Question suivante'}
              </button>
            </div>
          )}
        </div>
      )}

      {s.quizFinished && (
        <div className="stk" style={{ gap: 14 }}>
          <div className="pop" style={{ background: '#171B3C', color: '#fff', borderRadius: 26, padding: '28px 24px', textAlign: 'center' }}>
            <div className="eyebrow" style={{ color: '#A7ADD3' }}>Quiz terminé</div>
            <div className="dsp num" style={{ fontSize: 72, fontWeight: 800, lineHeight: 1, margin: '14px 0 10px', color: '#F0A03C' }}>{s.quizScore + ' / ' + total}</div>
            <span className="tag" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: 13.5, padding: '6px 14px' }}>{'+' + s.quizScore * 10 + ' ◆ crédités'}</span>
          </div>
          <div className="card">
            <div className="row" style={{ gap: 10, marginBottom: 6 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8341C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .3 1.4 1 2 2 2 0-3-1-5 1-8Z" /></svg>
              <span style={{ fontSize: 15.5, fontWeight: 700 }}>Quiz enregistré</span>
            </div>
            <div style={{ fontSize: 14.5, lineHeight: 1.55, color: '#454A66' }}>Une seule tentative : c'est ce qui rend le classement comparable.</div>
          </div>
          <button type="button" onClick={actions.go('quiz')} className="btn" style={{ background: ACCENT }}>Voir le classement</button>
        </div>
      )}
    </div>
  )
}
