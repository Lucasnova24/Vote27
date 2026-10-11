import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { CANDS, THEMES, THEME_STYLE } from '../data'
import { PROGRAMMES_2022, KIND_LABEL } from '../programmes2022'
import { backLink, h1Size, flowWrap } from '../styles'
import StatusTag from '../components/StatusTag'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
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
  const hasContent = !!prog && (prog.kind !== 'aucun')

  return (
    <div className="rise stk" style={{ ...flowWrap(isWeb), maxWidth: isWeb ? 820 : undefined }}>
      <button type="button" onClick={actions.backToProgrammes} style={backLink}><ChevronLeft />Programmes</button>

      <div className="row" style={{ gap: 14 }}>
        <span style={{ width: 56, height: 56, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', background: c.color }}>{c.initials}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb) - (isWeb ? 10 : 4), lineHeight: 1.05, fontWeight: 700 }}>{c.name}</h1>
          <div style={{ fontSize: 14.5, color: '#5C617B', marginTop: 2 }}>{c.party}</div>
        </div>
        <StatusTag status={c.status} />
      </div>

      {prog && (
        <div className="card stk" style={{ padding: 16, gap: 10 }}>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <span className="tag" style={{ background: c.soft, color: c.ink }}>{KIND_LABEL[prog.kind]}</span>
            <span style={{ fontSize: 14.5, fontWeight: 700 }}>{prog.programmeLabel}</span>
          </div>
          {prog.note && <div style={{ fontSize: 14, lineHeight: 1.5, color: '#454A66' }}>{prog.note}</div>}
          {prog.pdfs.length > 0 && (
            <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              {prog.pdfs.map((p) => (
                <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="btn" style={{ background: c.color, color: '#fff', textDecoration: 'none' }}>
                  {'Programme (PDF) — ' + p.label}
                </a>
              ))}
            </div>
          )}
          {prog.pdfs.length === 0 && hasContent && (
            <div style={{ fontSize: 13.5, color: '#5C617B', fontStyle: 'italic' }}>Pas de PDF officiel retrouvé pour ce programme : voir les sources ci-dessous.</div>
          )}
        </div>
      )}

      {!prog && (
        <div style={{ fontSize: 15, color: '#5C617B', fontStyle: 'italic' }}>Programme pas encore renseigné dans l'app.</div>
      )}

      {prog && prog.phares.length > 0 && (
        <section className="card stk" style={{ padding: 16, gap: 8 }}>
          <div className="eyebrow">Mesures phares</div>
          <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6, fontSize: 14.5, lineHeight: 1.45 }}>
            {prog.phares.map((m, i) => <li key={i}>{m}</li>)}
          </ol>
        </section>
      )}

      {hasContent && THEMES.map((t) => {
        const th = prog.themes[t]
        const ts = THEME_STYLE[t]
        if (!th || (!th.resume && th.mesures.length === 0)) return null
        return (
          <section key={t} className="card stk" style={{ padding: 16, gap: 10 }}>
            <span className="tag" style={{ alignSelf: 'flex-start', background: ts.soft, color: ts.ink }}>{t}</span>
            {th.resume && <div style={{ fontSize: 14.5, lineHeight: 1.5, fontWeight: 600 }}>{th.resume}</div>}
            {th.mesures.length > 0 && (
              <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6, fontSize: 14.5, lineHeight: 1.45 }}>
                {th.mesures.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            )}
          </section>
        )
      })}

      {hasContent && prog.autres.length > 0 && (
        <section className="card stk" style={{ padding: 16, gap: 10 }}>
          <span className="tag" style={{ alignSelf: 'flex-start', background: '#EFEBE2', color: '#454A66' }}>Autres mesures</span>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6, fontSize: 14.5, lineHeight: 1.45 }}>
            {prog.autres.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </section>
      )}

      {prog && prog.sources.length > 0 && (
        <section className="stk" style={{ gap: 6 }}>
          <div className="eyebrow">Sources</div>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 4, fontSize: 13, lineHeight: 1.4, wordBreak: 'break-word' }}>
            {prog.sources.map((x) => (
              <li key={x.url}><a href={x.url} target="_blank" rel="noreferrer">{x.label}</a></li>
            ))}
          </ul>
        </section>
      )}

      <div style={{ fontSize: 12.5, color: '#5C617B', lineHeight: 1.45 }}>
        Résumé établi à partir du programme 2022 et de sources de presse citées ci-dessus ; ce n'est pas le programme 2027. À vérifier dans le document d'origine.
      </div>
    </div>
  )
}
