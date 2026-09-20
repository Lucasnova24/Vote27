import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT, CANDS, DAYS_LEFT, LIVE_DEBATE, VOTE_RESULTS } from '../data'
import { card, infoBox, mono, screenWrap, sectionLabel, serif } from '../styles'

interface Props {
  state: AppState
  actions: AppActions
}

export default function Accueil({ state: s, actions }: Props) {
  const voteDone = s.voteChoice !== null

  const todos = [
    { key: 'vote', title: 'Vote du jour', sub: 'Le vote obligatoire · 1 min', done: voteDone, onClick: actions.openRoute('vote') },
    { key: 'quiz', title: 'Quiz du jour', sub: '5 questions · 2 min', done: s.quizDoneToday, onClick: actions.openRoute('quiz') },
    { key: 'estimation', title: 'Estimation du 1er tour', sub: 'Clôture dimanche 8h', done: s.estSent, onClick: actions.openRoute('estimation') },
    { key: 'boussole', title: 'Ta boussole', sub: '20 ou 24 questions', done: s.bDone, onClick: actions.openRoute('boussole') },
  ]
  const doneCount = todos.filter((t) => t.done).length

  return (
    <div style={screenWrap}>
      <div>
        <div style={sectionLabel}>Accueil — Jeudi 15 avril · {'J-' + DAYS_LEFT}</div>
        <h1 style={{ margin: '6px 0 0', fontFamily: serif, fontSize: 32, lineHeight: 1.08, fontWeight: 600, letterSpacing: '-.02em' }}>
          Le bulletin du jour
        </h1>
      </div>

      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.02em' }}>À faire aujourd'hui</div>
          <div style={{ fontFamily: mono, fontSize: 12, color: '#6b7392' }}>{doneCount + ' / 4'}</div>
        </div>
        <div style={{ height: 4, borderRadius: 9, background: '#e8ebf5', overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ height: '100%', borderRadius: 9, transition: 'width .4s ease', width: (doneCount / 4 * 100) + '%', background: ACCENT }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {todos.map((t) => (
            <div key={t.key} onClick={t.onClick} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: 10, border: '1px solid #e8ebf5', borderRadius: 12, cursor: 'pointer', background: '#fbfcfe' }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flex: 'none', background: t.done ? '#e7f0e8' : '#eef0f7', color: t.done ? '#2f6b3c' : ACCENT }}>
                {t.done ? '✓' : '◆'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-.01em' }}>{t.title}</div>
                <div style={{ fontSize: 11.5, color: '#6b7392', marginTop: 1 }}>{t.sub}</div>
              </div>
              <div style={{ fontSize: 11.5, color: '#6b7392', whiteSpace: 'nowrap' }}>{t.done ? 'Fait' : 'Y aller'} ›</div>
            </div>
          ))}
        </div>
      </div>

      <div onClick={actions.openRoute('programmes')} style={{ background: '#1b2a63', color: '#fff', borderRadius: 16, padding: 16, cursor: 'pointer' }}>
        <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 600, letterSpacing: '-.01em' }}>Les programmes, côte à côte</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.45, color: '#c3cbe8', marginTop: 6 }}>
          Six thèmes, cinq candidats, une source vérifiable pour chaque position.
        </div>
        <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 9, padding: '8px 12px', fontSize: 12.5, fontWeight: 600 }}>
          Lire les programmes ›
        </div>
      </div>

      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={sectionLabel}>Vote du jour · +15 ◆</div>
          <div style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: '#e7f0e8', color: '#2f6b3c' }}>
            {voteDone ? 'voté' : 'ouvert'}
          </div>
        </div>
        <h2 style={{ margin: '10px 0 14px', fontFamily: serif, fontSize: 22, lineHeight: 1.2, fontWeight: 600, letterSpacing: '-.015em' }}>
          Le vote devrait-il être obligatoire ?
        </h2>
        {!voteDone && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div onClick={actions.vote('oui')} style={{ flex: 1, textAlign: 'center', padding: 13, border: '1px solid #d3d9ec', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', background: '#f7f9fd' }}>Oui</div>
            <div onClick={actions.vote('non')} style={{ flex: 1, textAlign: 'center', padding: 13, border: '1px solid #d3d9ec', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', background: '#f7f9fd' }}>Non</div>
          </div>
        )}
        {voteDone && (
          <div className="rise-in" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {VOTE_RESULTS(ACCENT).map((r) => (
              <div key={r.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>
                  <span>{r.label}</span>
                  <span style={{ fontFamily: mono }}>{r.pct}</span>
                </div>
                <div style={{ height: 8, borderRadius: 9, background: '#eef0f7', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 9, transition: 'width .6s cubic-bezier(.2,.8,.2,1)', width: r.pct, background: r.color }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize: 11.5, color: '#6b7392' }}>
              Ton choix : <strong style={{ color: '#10162e' }}>{s.voteChoice === 'oui' ? 'Oui' : 'Non'}</strong> · +15 ◆ crédités. Résultat définitif à 20h.
            </div>
          </div>
        )}
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #eef0f7', fontSize: 11.5, color: '#6b7392', fontFamily: mono }}>
          12 480 citoyens ont glissé leur bulletin
        </div>
      </div>

      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 600 }}>Sondage national</div>
          <div style={{ fontSize: 11, color: '#6b7392' }}>Avril 2027</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CANDS.map((c) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 600, color: '#fff', background: c.color }}>
                {c.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                  <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 600 }}>{c.pct + '%'}</div>
                </div>
                <div style={{ fontSize: 11, color: '#6b7392', marginBottom: 5 }}>{c.party}</div>
                <div style={{ height: 6, borderRadius: 9, background: '#eef0f7', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 9, width: c.pct + '%', background: c.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {LIVE_DEBATE && (
        <div onClick={actions.openRoute('debat')} style={{ background: '#fff', border: '1px solid #e3e7f3', borderLeft: '3px solid #c02742', borderRadius: 16, padding: 16, cursor: 'pointer', boxShadow: '0 1px 2px rgba(16,22,46,.04)' }}>
          <div style={sectionLabel}>Prochain débat</div>
          <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 600, marginTop: 6 }}>Débat télévisé — France 2</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#6b7392', marginTop: 5 }}>
            <span>Jeudi 15 avril · 21:00 ·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#c02742', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c02742', display: 'inline-block', animation: 'pulseLive 1.6s infinite' }} />En direct
            </span>
          </div>
          <div style={{ marginTop: 12, fontSize: 12.5, fontWeight: 600, color: ACCENT }}>Ouvrir la session live ›</div>
        </div>
      )}

      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={sectionLabel}>Quiz du jour</div>
          <div style={{ fontFamily: mono, fontSize: 11.5, color: '#6b7392' }}>+20 ◆ / bonne réponse</div>
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.5, marginTop: 8, color: '#3c4460' }}>
          Cinq questions sur les institutions, une seule tentative par jour.
        </div>
        <div onClick={() => actions.openRoute('quiz')()} style={{ marginTop: 12, textAlign: 'center', padding: 12, borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', background: ACCENT }}>
          Répondre
        </div>
      </div>

      <div style={infoBox}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: '#4d5680', fontWeight: 500 }}>Notifications</div>
          <div style={{ fontSize: 11, color: '#4d5680' }}>{s.notifRead ? 'à jour' : '2 nouvelles'}</div>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 8, color: '#333c5e' }}>
          Le vote du jour ferme à 20h. Ton estimation du 1er tour sera comparée dimanche soir.
        </div>
        <div onClick={actions.markRead} style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: '#4d5680', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          Marquer comme lues
        </div>
      </div>
    </div>
  )
}
