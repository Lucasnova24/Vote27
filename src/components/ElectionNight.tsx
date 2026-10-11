// Encart « soirée de vote » : résultat du 1er tour de la primaire (scrutin du 9 au 11 octobre 2026).
// Pourcentages calculés sur les suffrages exprimés.
const RESULTS = [
  { name: 'Raphaël Glucksmann', party: 'Place publique', votes: 79613, color: '#E8456B' },
  { name: 'Olivier Faure', party: 'PS', votes: 17398, color: '#D9558A' },
  { name: 'Ségolène Royal', party: 'PS', votes: 9165, color: '#C86FB0' },
  { name: 'Emmanuel Maurel', party: 'GRS', votes: 7119, color: '#B37FD0' },
  { name: 'Jérôme Guedj', party: 'PS', votes: 7012, color: '#8F8FE0' },
]
const EXPRIMES = RESULTS.reduce((n, r) => n + r.votes, 0)
const fmt = (n: number) => n.toLocaleString('fr-FR')
const pct = (v: number) => ((v / EXPRIMES) * 100).toFixed(2).replace('.', ',') + ' %'

export default function ElectionNight() {
  const [winner, ...others] = RESULTS
  return (
    <section className="card stk" style={{ gap: 14, background: '#171B3C', borderColor: '#171B3C', color: '#fff' }} aria-label="Soirée de vote : résultat de la primaire socialiste">
      <div className="row" style={{ gap: 8 }}>
        <span className="live" aria-hidden="true" />
        <span className="eyebrow" style={{ color: '#FFB4A6' }}>Soirée de vote · Primaire socialiste</span>
      </div>

      <div>
        <div style={{ fontSize: 13, color: '#B9BEDD' }}>Désigné dès le 1er tour</div>
        <div className="dsp" style={{ fontSize: 30, lineHeight: 1.05, fontWeight: 700, marginTop: 4 }}>{winner.name}</div>
        <div className="num" style={{ fontSize: 15, color: '#B9BEDD', marginTop: 4 }}>
          <strong style={{ color: '#fff', fontSize: 22 }}>{pct(winner.votes)}</strong>{' · ' + fmt(winner.votes) + ' voix'}
        </div>
        <div style={{ height: 10, borderRadius: 6, background: '#2A2F58', marginTop: 12, overflow: 'hidden' }} aria-hidden="true">
          <div style={{ width: (winner.votes / EXPRIMES) * 100 + '%', height: '100%', background: winner.color }} />
        </div>
      </div>

      <div className="stk" style={{ gap: 10 }}>
        {others.map((r) => (
          <div key={r.name}>
            <div className="row" style={{ justifyContent: 'space-between', gap: 8, fontSize: 14 }}>
              <span style={{ minWidth: 0 }}><strong>{r.name}</strong><span style={{ color: '#B9BEDD' }}>{' · ' + r.party}</span></span>
              <span className="num" style={{ fontWeight: 700 }}>{pct(r.votes)}</span>
            </div>
            <div style={{ height: 6, borderRadius: 4, background: '#2A2F58', marginTop: 5, overflow: 'hidden' }} aria-hidden="true">
              <div style={{ width: (r.votes / EXPRIMES) * 100 + '%', height: '100%', background: r.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="num" style={{ fontSize: 12.5, lineHeight: 1.5, color: '#B9BEDD' }}>
        {'Participation ' + '85,96 %' + ' · ' + fmt(120587) + ' votants sur ' + fmt(140282) + ' inscrits · ' + fmt(EXPRIMES) + ' suffrages exprimés'}
      </div>
    </section>
  )
}
