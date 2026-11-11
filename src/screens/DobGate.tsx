import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT } from '../data'
import Brand from '../components/Brand'
import { maxDobIso } from '../lib/age'

interface Props {
  state: AppState
  actions: AppActions
}

// Écran bloquant affiché aux comptes Google/Apple tant que la date de naissance n'est pas renseignée.
export default function DobGate({ state: s, actions }: Props) {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100dvh - env(safe-area-inset-top, 0px))', background: '#F6F4EE', color: '#14162B', fontFamily: "'Hanken Grotesk',system-ui,sans-serif" }}>
      <div className="rise" style={{ margin: 'auto', width: '100%', maxWidth: 420, padding: '32px 20px 28px', display: 'flex', flexDirection: 'column', gap: 18, opacity: s.authBusy ? 0.7 : 1, pointerEvents: s.authBusy ? 'none' : 'auto' }}>
        <Brand size={48} />
        <div className="stk" style={{ gap: 8 }}>
          <h1 className="dsp" style={{ margin: 0, fontSize: 32, lineHeight: 1.05, fontWeight: 700 }}>Une dernière étape</h1>
          <div style={{ fontSize: 15, lineHeight: 1.5, color: '#454A66' }}>
            Indique ta date de naissance pour finaliser ton inscription. L'application est réservée aux personnes de 15 ans et plus.
          </div>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
          <div>
            <label className="lbl" htmlFor="dg-dob">Date de naissance</label>
            <input id="dg-dob" className="inp" type="date" autoComplete="bday" max={maxDobIso()} value={s.authDob} onChange={actions.setAuthDob} />
          </div>
          {s.authError && (
            <div role="alert" style={{ fontSize: 13, fontWeight: 600, color: '#8A1F0E', background: '#FFDFD8', borderRadius: 12, padding: '10px 12px' }}>{s.authError}</div>
          )}
          <button type="button" onClick={actions.submitDobGate} className="btn" style={{ background: ACCENT }}>
            {s.authBusy ? '…' : 'Continuer'}
          </button>
        </div>
        <button type="button" onClick={actions.logout} style={{ fontSize: 14, fontWeight: 700, color: ACCENT, minHeight: 44, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
