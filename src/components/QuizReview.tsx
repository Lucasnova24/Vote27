import type { DailyQuizRow } from '../lib/dbTypes'

// Read-only recap of a quiz day: each question with the user's pick, the
// right answer and the explanation (get_daily_quiz only sends answer and
// explanation for questions the user has answered).
export default function QuizReview({ items }: { items: DailyQuizRow[] }) {
  return (
    <div className="stk" style={{ gap: 14 }}>
      {items.map((item, n) => {
        const answered = !!item.my_answered_at
        return (
          <section key={item.question_id} className="card stk" style={{ gap: 12 }} aria-label={'Question ' + (n + 1)}>
            <div className="row" style={{ justifyContent: 'space-between', gap: 10 }}>
              <span className="eyebrow" style={{ color: '#6E3A00' }}>{'Question ' + (n + 1)}</span>
              <span className="tag" style={answered
                ? { background: item.my_is_correct ? '#DDF3E3' : '#FFDFD8', color: item.my_is_correct ? '#14532D' : '#8A1F0E' }
                : { background: '#EFEBE2', color: '#454A66' }}>
                {answered ? (item.my_is_correct ? 'Bonne réponse' : 'Mauvaise réponse') : 'Sans réponse'}
              </span>
            </div>
            <div>
              <span className="tag" style={{ background: '#EFEBE2', color: '#454A66' }}>{item.theme_label}</span>
              <div className="dsp" style={{ marginTop: 8, fontSize: 20, lineHeight: 1.2, fontWeight: 700 }}>{item.prompt}</div>
            </div>
            <div className="stk" style={{ gap: 8 }}>
              {item.choices.map((c) => {
                const isCorrect = item.answer !== null && c.label === item.answer
                const picked = item.my_choice_id === c.id
                let bg = '#FBFAF6', bc = '#E7E2D6', mark = ''
                if (isCorrect) { bg = '#EAF6EE'; bc = '#8CC9A0'; mark = '✓' }
                else if (picked) { bg = '#FDEBE7'; bc = '#EFA99C'; mark = '✕' }
                return (
                  <div key={c.id} className="row" style={{ gap: 12, minHeight: 48, padding: '8px 14px', border: '1.5px solid ' + bc, borderRadius: 14, background: bg }}>
                    <span style={{ flex: 1, fontSize: 15.5, fontWeight: isCorrect || picked ? 700 : 500, lineHeight: 1.3 }}>{c.label}</span>
                    {picked && <span className="tag" style={{ background: 'rgba(255,255,255,.7)', color: '#454A66' }}>Votre réponse</span>}
                    {mark && <span aria-hidden="true" style={{ fontWeight: 800, color: isCorrect ? '#1F7A3E' : '#C8341C' }}>{mark}</span>}
                  </div>
                )
              })}
              {item.mode === 'libre' && item.answer && <div style={{ fontSize: 15, fontWeight: 700 }}>{'Réponse : ' + item.answer}</div>}
            </div>
            {item.explanation && (
              <div style={{ fontSize: 14.5, lineHeight: 1.55, padding: '12px 14px', borderRadius: 14, background: '#FFF4DA', color: '#14162B' }}>{item.explanation}</div>
            )}
          </section>
        )
      })}
    </div>
  )
}
