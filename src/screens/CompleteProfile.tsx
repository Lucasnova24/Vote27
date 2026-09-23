import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT } from '../data'
import { backLink, flowWrap, h1Size } from '../styles'
import { ChevronLeft } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function CompleteProfile({ state: s, actions, isWeb }: Props) {
  return (
    <div className="rise" style={flowWrap(isWeb)}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>
      <div className="stk" style={{ gap: 8 }}>
        <div className="eyebrow">Profil</div>
        <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.02, fontWeight: 700 }}>Compléter mon profil</h1>
        <div style={{ fontSize: 15, color: '#454A66', lineHeight: 1.5 }}>Ces informations restent privées et servent à personnaliser ton expérience.</div>
      </div>
      <div className="card stk" style={{ gap: 14 }}>
        <div>
          <label className="lbl" htmlFor="pf-ville">Ville</label>
          <input id="pf-ville" className="inp" value={s.profileVille} onChange={actions.setProfileVille} placeholder="Lyon" />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label className="lbl" htmlFor="pf-region">Région</label>
            <input id="pf-region" className="inp" value={s.profileRegion} onChange={actions.setProfileRegion} placeholder="Auvergne-Rhône-Alpes" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label className="lbl" htmlFor="pf-pays">Pays</label>
            <input id="pf-pays" className="inp" value={s.profilePays} onChange={actions.setProfilePays} placeholder="France" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label className="lbl" htmlFor="pf-cp">Code postal</label>
            <input id="pf-cp" className="inp" value={s.profileCP} onChange={actions.setProfileCP} placeholder="69003" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label className="lbl" htmlFor="pf-tel">Numéro de téléphone</label>
            <input id="pf-tel" className="inp" type="tel" value={s.profileTel} onChange={actions.setProfileTel} placeholder="06 12 34 56 78" />
          </div>
        </div>
        <div>
          <label className="lbl" htmlFor="pf-interets">Centres d'intérêt</label>
          <input id="pf-interets" className="inp" value={s.profileInterets} onChange={actions.setProfileInterets} placeholder="Écologie, économie, Europe…" />
        </div>
      </div>
      <button type="button" onClick={actions.saveProfileExtra} className="btn" style={{ background: ACCENT }}>Enregistrer</button>
    </div>
  )
}
