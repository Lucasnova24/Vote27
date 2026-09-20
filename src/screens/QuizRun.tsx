import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT, QUIZ } from '../data'
import { backLink, card, mono, primaryButton, screenWrap, serif } from '../styles'

interface Props {
  state: AppState
  actions: AppActions
}

export default function QuizRun({ state: s, actions }: Props) {
  const q = QUIZ[Math.min(s.quizI, QUIZ.length - 1)]
  const answered = s.quizSel !== null

  return (
    <div className="rise-in" style={screenWrap}>
      <div onClick={actions.back} style={backLink}>‹ Quitter</div>

      {!s.quizFinished && (
        <>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7392', marginBottom: 8, fontFamily: mono }}>
              <span>{'Question ' + (s.quizI + 1) + ' / 5'}</span>
              <span>{s.quizScore + ' / 5'}</span>
            </div>
            <div style={{ height: 4, borderRadius: 9, background: '#e1e5f1', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 9, transition: 'width .35s ease', width: ((s.quizI + (answered ? 1 : 0)) / 5 * 100) + '%', background: ACCENT }} />
            </div>
            <h1 style={{ margin: '18px 0 0', fontFamily: serif, fontSize: 25, lineHeight: 1.2, fontWeight: 600, letterSpacing: '-.015em' }}>{q.q}</h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {q.o.map((label, i) => {
              const correct = i === q.a
              const picked = s.quizSel === i
              let bg = '#fff', bc = '#e3e7f3', markBg = '#eef0f7', markFg = '#6b7392', mark = String.fromCharCode(65 + i)
              if (answered && correct) { bg = '#eef6ef'; bc = '#a9c9ae'; markBg = '#2f6b3c'; markFg = '#fff'; mark = '✓' }
              else if (answered && picked) { bg = '#fbeef0'; bc = '#e0a9b2'; markBg = '#b03a4a'; markFg = '#fff'; mark = '✕' }
              else if (answered) { bg = '#fafbfe' }
              return (
                <div key={i} onClick={actions.answer(i)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: 15, border: '1.5px solid', borderRadius: 14, cursor: 'pointer', transition: 'all .2s ease', background: bg, borderColor: bc }}>
                  <div style={{ width: 22, height: 22, borderRadius: 7, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, background: markBg, color: markFg }}>{mark}</div>
                  <div style={{ fontSize: 14.5, fontWeight: 500, letterSpacing: '-.01em' }}>{label}</div>
                </div>
              )
            })}
          </div>

          {answered && (
            <div className="rise-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={card}>
                <div style={{ fontSize: 12.5, lineHeight: 1.55, color: '#3c4460' }}>{q.e}</div>
                <div style={{ fontSize: 11, color: '#6b7392', marginTop: 8, fontFamily: mono }}>Source · {q.s}</div>
              </div>
              <div onClick={actions.next} style={primaryButton(ACCENT)}>
                {s.quizI >= QUIZ.length - 1 ? 'Voir mon score' : 'Question suivante'}
              </div>
            </div>
          )}
        </>
      )}

      {s.quizFinished && (
        <div className="rise-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#1b2a63', color: '#fff', borderRadius: 18, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a8b3d8' }}>Quiz terminé</div>
            <div style={{ fontFamily: serif, fontSize: 44, fontWeight: 600, margin: '8px 0 2px', letterSpacing: '-.02em' }}>{s.quizScore + ' / 5'}</div>
            <div style={{ fontSize: 13, color: '#c3cbe8' }}>{'+' + s.quizScore * 20 + ' ◆ crédités'}</div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Prochaine tentative demain à 00h00</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.55, color: '#6b7392' }}>
              Une seule tentative par jour : c'est ce qui rend le classement comparable. Ta série passe à 8 jours.
            </div>
          </div>
          <div onClick={actions.go('quiz')} style={primaryButton(ACCENT)}>Voir le classement</div>
        </div>
      )}
    </div>
  )
}
