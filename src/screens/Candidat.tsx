import { useState } from 'react'
import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { CANDS, THEMES, THEME_STYLE } from '../data'
import { PROGRAMMES_2022, KIND_LABEL } from '../programmes2022'
import type { ProgrammeTheme } from '../programmes2022'
import { backLink, h1Size, flowWrap } from '../styles'
import StatusTag from '../components/StatusTag'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

const PREVIEW = 4

function ThemeSection({ theme, th }: { theme: string; th: ProgrammeTheme }) {
  const [open, setOpen] = useState(false)
  const ts = THEME_STYLE[theme] ?? { solid: '#5C617B', soft: '#EFEBE2', ink: '#454A66' }
  const shown = open ? th.mesures : th.mesures.slice(0, PREVIEW)
  const hidden = th.mesures.length - shown.length
  return (
    <section id={'theme-' + theme} className="card" style={{ padding: 0, overflow: 'hidden', scrollMarginTop: 12 }}>
      <div className="row" style={{ gap: 10, padding: '12px 16px', background: ts.soft, color: ts.ink }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: ts.solid, flex: 'none' }} />
        <h2 className="dsp" style={{ margin: 0, flex: 1, fontSize: 19, fontWeight: 700 }}>{theme}</h2>
        {th.mesures.length > 0 && <span className="tag" style={{ background: '#fff', color: ts.ink }}>{th.mesures.length + (th.mesures.length > 1 ? ' mesures' : ' mesure')}</span>}
      </div>
      <div className="stk" style={{ padding: '14px 16px 16px', gap: 12 }}>
        {th.resume && <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, fontWeight: 600, color: '#14162B' }}>{th.resume}</p>}
        {shown.length > 0 && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {shown.map((m, i) => (
              <li key={i} className="row sep" style={{ alignItems: 'flex-start', gap: 12, padding: '10px 0', fontSize: 14.5, lineHeight: 1.5, color: '#2A2E4A' }}>
                <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: ts.solid, flex: 'none', marginTop: 8 }} />
                <span style={{ flex: 1, minWidth: 0 }}>{m}</span>
              </li>
            ))}
          </ul>
        )}
        {th.mesures.length > PREVIEW && (
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="btn" style={{ minHeight: 44, background: ts.soft, color: ts.ink, fontSize: 14 }}>
            {open ? 'Réduire' : hidden === 1 ? 'Voir l\'autre mesure' : 'Voir les ' + hidden + ' autres mesures'}
          </button>
        )}
      </div>
    </section>
  )
}

export default function Candidat({ state: s, actions, isWeb }: Props) {
  const c = CANDS.find((x) => x.name === s.candidateName)
  if (!c) {
    return (
      <div className="rise stk" style={flowWrap(isWeb)}>
        <button type="button" onClick={actions.backToProgrammes} style={backLink}><ChevronLeft />Programmes</button>
        <div style={{ fontSize: 15, color: '#454A66' }}>Candidat introuvable.</div>
      </div>
    )
  }
  const prog = PROGRAMMES_2022[c.name]
  const hasContent = !!prog && prog.kind !== 'aucun'
  const themed = prog ? THEMES.filter((t) => prog.themes[t] && (prog.themes[t].resume || prog.themes[t].mesures.length > 0)) : []
  const total = prog ? THEMES.reduce((n, t) => n + (prog.themes[t]?.mesures.length ?? 0), 0) + prog.autres.length : 0

  const jump = (t: string) => () => document.getElementById('theme-' + t)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="rise stk" style={{ ...flowWrap(isWeb), maxWidth: isWeb ? 820 : undefined }}>
      <button type="button" onClick={actions.backToProgrammes} style={backLink}><ChevronLeft />Programmes</button>

      {/* Header */}
      <section className="card stk" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="row" style={{ gap: 14, padding: isWeb ? '22px 24px' : '18px 16px', background: c.soft, color: c.ink, alignItems: 'center' }}>
          <span style={{ width: 64, height: 64, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 800, color: '#fff', background: c.color }}>{c.initials}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb) - (isWeb ? 12 : 6), lineHeight: 1.05, fontWeight: 700, color: '#14162B' }}>{c.name}</h1>
            <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 4 }}>{c.party}</div>
          </div>
          <StatusTag status={c.status} />
        </div>
        <div className="stk" style={{ padding: isWeb ? '16px 24px 20px' : '14px 16px 16px', gap: 12 }}>
          {prog ? (
            <>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                <span className="tag" style={{ background: c.soft, color: c.ink }}>{KIND_LABEL[prog.kind]}</span>
                <span style={{ fontSize: 14.5, fontWeight: 700 }}>{prog.programmeLabel}</span>
              </div>
              {hasContent && total > 0 && (
                <div className="row" style={{ gap: 16, fontSize: 13.5, color: '#454A66' }}>
                  <span><b className="dsp" style={{ fontSize: 22, color: c.ink }}>{total}</b> mesures</span>
                  <span><b className="dsp" style={{ fontSize: 22, color: c.ink }}>{themed.length}</b> thèmes</span>
                  <span><b className="dsp" style={{ fontSize: 22, color: c.ink }}>{prog.pdfs.length}</b> PDF</span>
                </div>
              )}
              {prog.note && (
                <div style={{ fontSize: 13.5, lineHeight: 1.5, color: '#454A66', background: '#F6F4EE', borderRadius: 12, padding: '10px 12px' }}>{prog.note}</div>
              )}
              {prog.pdfs.length > 0 ? (
                <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                  {prog.pdfs.map((p) => (
                    <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="btn press" style={{ background: c.color, color: '#fff', minHeight: 46, fontSize: 14, textDecoration: 'none', flex: isWeb ? 'none' : '1 1 100%' }}>
                      {'Lire le programme (PDF) · ' + p.label}
                    </a>
                  ))}
                </div>
              ) : hasContent ? (
                <div style={{ fontSize: 13.5, color: '#5C617B', fontStyle: 'italic' }}>Pas de PDF officiel retrouvé pour ce programme : voir les sources en bas de page.</div>
              ) : null}
            </>
          ) : (
            <div style={{ fontSize: 15, color: '#5C617B', fontStyle: 'italic' }}>Programme pas encore renseigné dans l'app.</div>
          )}
        </div>
      </section>

      {/* Mesures phares */}
      {prog && prog.phares.length > 0 && (
        <section className="stk" style={{ gap: 12 }} aria-label="Mesures phares">
          <div className="stk" style={{ gap: 2 }}>
            <div className="eyebrow" style={{ color: c.ink }}>À retenir</div>
            <h2 className="dsp" style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>Mesures phares</h2>
          </div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10, gridTemplateColumns: isWeb ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)' }}>
            {prog.phares.map((m, i) => (
              <li key={i} className="card row" style={{ alignItems: 'flex-start', gap: 12, padding: '14px 14px 14px 12px', borderLeft: '5px solid ' + c.color, gridColumn: isWeb && i === 0 ? '1 / -1' : undefined, background: i === 0 ? c.soft : '#fff' }}>
                <span className="dsp" aria-hidden="true" style={{ flex: 'none', minWidth: 30, textAlign: 'center', fontSize: i === 0 ? 34 : 26, lineHeight: 1, fontWeight: 800, color: c.color }}>{i + 1}</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: i === 0 ? 16.5 : 15, lineHeight: 1.45, fontWeight: i < 3 ? 700 : 600, color: '#14162B' }}>{m}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Theme navigation */}
      {hasContent && themed.length > 1 && (
        <div role="group" aria-label="Aller à un thème" style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: isWeb ? 0 : '0 -16px', padding: isWeb ? 0 : '0 16px' }}>
          {themed.map((t) => (
            <button key={t} type="button" onClick={jump(t)} className="chip" style={{ background: THEME_STYLE[t].soft, color: THEME_STYLE[t].ink, borderColor: THEME_STYLE[t].soft }}>
              {t}
            </button>
          ))}
        </div>
      )}

      {/* All measures by theme */}
      {hasContent && (
        <div className="stk" style={{ gap: 14 }}>
          <h2 className="dsp" style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 700 }}>Toutes les mesures</h2>
          {themed.map((t) => <ThemeSection key={t} theme={t} th={prog.themes[t]} />)}
          {prog.autres.length > 0 && (
            <ThemeSection theme="Autres" th={{ resume: '', mesures: prog.autres }} />
          )}
        </div>
      )}

      {/* Sources */}
      {prog && prog.sources.length > 0 && (
        <details className="card" style={{ padding: '14px 16px' }}>
          <summary style={{ cursor: 'pointer', fontSize: 14.5, fontWeight: 700 }}>{'Sources (' + prog.sources.length + ')'}</summary>
          <ul style={{ margin: '10px 0 0', paddingLeft: 18, display: 'grid', gap: 6, fontSize: 13, lineHeight: 1.4, wordBreak: 'break-word' }}>
            {prog.sources.map((x) => (
              <li key={x.url}><a href={x.url} target="_blank" rel="noreferrer">{x.label}</a></li>
            ))}
          </ul>
        </details>
      )}

      <div style={{ fontSize: 12.5, color: '#5C617B', lineHeight: 1.45 }}>
        Résumé établi à partir du programme 2022 et de sources de presse ; ce n'est pas le programme 2027. À vérifier dans le document d'origine.
      </div>
    </div>
  )
}
