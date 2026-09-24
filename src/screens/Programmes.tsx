import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { backLink, h1Size, wideWidth } from '../styles'
import ProgrammesGrid from '../components/ProgrammesGrid'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function Programmes({ state: s, actions, isWeb }: Props) {
  return (
    <div className="rise stk" style={{ gap: 18, width: '100%', margin: '0 auto', maxWidth: wideWidth(isWeb) }}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>
      <div className="stk" style={{ gap: 8 }}>
        <div className="eyebrow">Programmes</div>
        <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.02, fontWeight: 700 }}>Côte à côte</h1>
        <div style={{ fontSize: 15, color: '#454A66', lineHeight: 1.5 }}>Six thèmes, tous les candidats. Les positions sourcées seront ajoutées au fur et à mesure de la publication des programmes officiels.</div>
      </div>
      <ProgrammesGrid state={s} actions={actions} isWeb={isWeb} />
    </div>
  )
}
