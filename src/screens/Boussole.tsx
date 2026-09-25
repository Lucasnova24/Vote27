import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { AFFINITE_THEME_STYLE, BOUSSOLE_SCALE, CANDS } from '../data'
import { useAffiniteBank, useAffiniteScores } from '../lib/useAffinites'
import { backLink, flowWrap, h1Size, qSize } from '../styles'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

function scaleFor(v: number) {
  return BOUSSOLE_SCALE.find((o) => o.v === Math.round(v)) ?? BOUSSOLE_SCALE[2]
}

function candidateStyle(name: string) {
  const c = CANDS.find((x) => x.name === name)
  if (c) return { color: c.color, initials: c.initials }
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return { color: '#5C617B', initials: initials || '?' }
}

export default function Boussole({ state: s, actions, isWeb }: Props) {
  const bank = useAffiniteBank()
  const bIntro = !s.bMode && !s.bDone
  const bRunning = !!s.bMode && !s.bDone

  const activeList = bank ? bank.questions.filter((q) => (s.bMode === 'court' ? q.dans_quiz_20 : true)) : []
  const bq = activeList[Math.min(s.bI, activeList.length - 1)] ?? null
  const themeLabel = bq ? bank?.themes.find((t) => t.code === bq.theme_code)?.label ?? bq.theme_code : ''
  const bts = bq ? AFFINITE_THEME_STYLE[bq.theme_code] ?? AFFINITE_THEME_STYLE.INST : AFFINITE_THEME_STYLE.INST
  const progressPct = activeList.length ? Math.round((s.bI / activeList.length) * 100) : 0

  const scores = useAffiniteScores(s.bDone)

  // "Ton profil" — the user's own average position per theme, from every
  // affinite_questions answered so far (court quiz alone, or the full one).
  const byTheme = new Map<string, { sum: number; n: number; label: string }>()
  if (bank) {
    bank.questions.forEach((q) => {
      const v = s.bAnswers[q.id]
      if (v === undefined) return
      const themeInfo = bank.themes.find((t) => t.code === q.theme_code)
      const entry = byTheme.get(q.theme_code) ?? { sum: 0, n: 0, label: themeInfo?.label ?? q.theme_code }
      entry.sum += v
      entry.n += 1
      byTheme.set(q.theme_code, entry)
    })
  }
  const themeProfile = (bank?.themes ?? [])
    .filter((t) => byTheme.has(t.code))
    .map((t) => {
      const e = byTheme.get(t.code)!
      return { code: t.code, label: t.label, avg: e.sum / e.n, n: e.n, style: AFFINITE_THEME_STYLE[t.code] }
    })

  return (
    <div className="rise" style={flowWrap(isWeb)}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>

      {bIntro && (
        <div className="stk" style={{ gap: 16 }}>
          <div className="stk" style={{ gap: 8 }}>
            <div className="eyebrow" style={{ color: '#3F238F' }}>Mes affinités</div>
            <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.02, fontWeight: 700 }}>Où vous situez-vous ?</h1>
            <div style={{ fontSize: 15, color: '#454A66' }}>Vos réponses sont enregistrées sur votre compte et ne sont jamais publiées.</div>
          </div>
          <div style={{ background: '#E8E0FF', borderRadius: 20, padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#2E1A70', marginBottom: 6 }}>Comment ça marche</div>
            <div style={{ fontSize: 14.5, lineHeight: 1.55, color: '#3F238F' }}>
              Vous répondez à des affirmations sur dix thèmes. Chaque réponse est comparée à la position sourcée des
              candidats sur cette même affirmation, pour estimer un taux de compatibilité — ce n'est pas une
              recommandation de vote.
            </div>
          </div>

          <button
            type="button" onClick={actions.bStart('court')} disabled={!bank} className="lift"
            style={{ display: 'block', width: '100%', background: '#fff', border: '1.5px solid #D3C6FA', borderRadius: 22, padding: 18, textAlign: 'left', opacity: bank ? 1 : 0.6 }}
          >
            <span className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="dsp" style={{ fontSize: 23, fontWeight: 700 }}>Version rapide</span>
              <span className="tag num" style={{ background: '#E8E0FF', color: '#3F238F' }}>20 affirmations</span>
            </span>
            <span style={{ display: 'block', fontSize: 14.5, color: '#454A66', marginTop: 6 }}>Environ 2 minutes. Deux affirmations par thème.</span>
          </button>

          <button
            type="button" onClick={actions.bStart('complet')} disabled={!bank} className="lift"
            style={{ display: 'block', width: '100%', background: '#fff', border: '1.5px solid #DDD7C9', borderRadius: 22, padding: 18, textAlign: 'left', opacity: bank ? 1 : 0.6 }}
          >
            <span className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="dsp" style={{ fontSize: 23, fontWeight: 700 }}>Version complète</span>
              <span className="tag num" style={{ background: '#EFEBE2', color: '#14162B' }}>100 affirmations</span>
            </span>
            <span style={{ display: 'block', fontSize: 14.5, color: '#454A66', marginTop: 6 }}>Environ 10 minutes. Dix affirmations par thème, pour un résultat plus précis.</span>
          </button>

          {!bank && <div style={{ fontSize: 13.5, color: '#5C617B' }}>Chargement des questions…</div>}

          <div style={{ background: '#EFEBE2', borderRadius: 20, padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Limites</div>
            <div style={{ fontSize: 14.5, lineHeight: 1.55, color: '#454A66' }}>
              Un programme ne se résume pas à des affirmations binaires, et toutes les positions des candidats ne sont
              pas encore sourcées : le taux de compatibilité affiché précise toujours sur combien d'affirmations
              communes il repose.
            </div>
          </div>
        </div>
      )}

      {bRunning && bq && (
        <div className="stk" style={{ gap: 20 }}>
          <div>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="tag num" style={{ background: '#EFEBE2', color: '#14162B' }}>{(Math.min(s.bI, activeList.length - 1) + 1) + ' / ' + activeList.length}</span>
              <span className="tag" style={{ background: bts.soft, color: bts.ink }}>{themeLabel}</span>
            </div>
            <div className="bar"><i style={{ width: progressPct + '%', background: bts.solid }} /></div>
          </div>
          <h1 className="dsp" style={{ margin: 0, fontSize: qSize(isWeb), lineHeight: 1.1, fontWeight: 700 }}>{bq.enonce}</h1>
          <div className="stk" style={{ gap: 10 }}>
            {BOUSSOLE_SCALE.map((opt) => (
              <button key={opt.label} type="button" onClick={actions.bAnswer(bq.id, opt.v, activeList.length)} className="lift row" style={{ width: '100%', gap: 14, minHeight: 58, padding: '0 18px', background: '#fff', border: '1.5px solid #E7E2D6', borderRadius: 18, fontSize: 16, fontWeight: 600 }}>
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
            <div style={{ fontSize: 14.5, color: '#454A66', lineHeight: 1.5 }}>Ta position par thème, et les candidats les plus proches de tes réponses.</div>
          </div>

          <div className="card pop stk" style={{ gap: 16 }}>
            {themeProfile.map((r) => {
              const sc = scaleFor(r.avg)
              return (
                <div key={r.code} className="row" style={{ gap: 12, alignItems: 'center' }}>
                  <span style={{ width: 40, height: 40, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: r.style.soft, color: r.style.ink }} aria-hidden="true">
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: sc.color }} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{r.label}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: sc.color }}>{sc.label}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#5C617B' }}>{r.n + (r.n > 1 ? ' affirmations répondues' : ' affirmation répondue')}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="stk" style={{ gap: 10 }}>
            <h2 className="dsp" style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Candidats les plus proches</h2>

            {scores === null && <div style={{ fontSize: 13.5, color: '#5C617B' }}>Calcul en cours…</div>}

            {scores !== null && scores.length === 0 && (
              <div style={{ background: '#EFEBE2', borderRadius: 20, padding: 16, fontSize: 14, lineHeight: 1.55, color: '#454A66' }}>
                Aucun candidat n'a pour l'instant assez de positions sourcées sur tes réponses pour être comparé. Les
                positions des candidats sont ajoutées au fur et à mesure de leur vérification — reviens plus tard
                pour voir apparaître ton classement.
              </div>
            )}

            {scores !== null && scores.length > 0 && (
              <div className="card pop stk" style={{ gap: 14 }}>
                {scores.map((row) => {
                  const cs = candidateStyle(row.candidate_name)
                  const pct = Math.max(0, Math.min(100, row.score ?? 0))
                  return (
                    <div key={row.candidate_id} className="stk" style={{ gap: 6 }}>
                      <div className="row" style={{ gap: 10, alignItems: 'center' }}>
                        <span style={{ width: 34, height: 34, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', background: cs.color }}>{cs.initials}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.candidate_name}</div>
                          <div style={{ fontSize: 12.5, color: '#5C617B' }}>{row.party}</div>
                        </div>
                        <span className="dsp num" style={{ fontSize: 18, fontWeight: 800 }}>{pct.toFixed(0) + ' %'}</span>
                      </div>
                      <div className="bar"><i style={{ width: pct + '%', background: cs.color }} /></div>
                      <div style={{ fontSize: 12, color: '#5C617B' }}>{'sur ' + row.nb_questions_communes + ' affirmations comparables'}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div style={{ background: '#E8E0FF', borderRadius: 20, padding: '14px 16px', fontSize: 14.5, lineHeight: 1.55, color: '#3F238F' }}>
            Ce classement ne repose que sur les affirmations où la position du candidat est sourcée : plus tu réponds
            à d'affirmations (version complète) et plus les candidats ont de positions sourcées, plus il devient
            précis. Refais le test quand tu veux : tes réponses restent privées.
          </div>
          <button type="button" onClick={actions.bRestart} className="btn" style={{ background: '#fff', color: '#14162B', border: '1.5px solid #DDD7C9' }}>Refaire le test</button>
        </div>
      )}
    </div>
  )
}
