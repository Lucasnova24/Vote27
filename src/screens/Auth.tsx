import type { CSSProperties } from 'react'
import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT } from '../data'
import { serif } from '../styles'

interface Props {
  state: AppState
  actions: AppActions
}

const inputStyle: CSSProperties = {
  width: '100%',
  height: 42,
  padding: '0 12px',
  border: '1px solid #d9dfee',
  borderRadius: 11,
  fontFamily: "'IBM Plex Sans',sans-serif",
  fontSize: 13.5,
  color: '#10162e',
  background: '#fbfcfe',
  outline: 'none',
}

const fieldLabel: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#6b7392',
  marginBottom: 5,
}

export default function Auth({ state: s, actions }: Props) {
  const isSignup = s.authView === 'signup'
  const busy = s.authBusy

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: '#eef0f7', overflowY: 'auto', display: 'flex' }}>
      <div className="rise-in" style={{ margin: 'auto', width: '100%', maxWidth: 400, padding: '44px 22px 34px', display: 'flex', flexDirection: 'column', gap: 16, opacity: busy ? 0.7 : 1, pointerEvents: busy ? 'none' : 'auto' }}>
        <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 700, letterSpacing: '-.02em' }}>
          Vote<span style={{ color: ACCENT }}>2027</span>
        </div>

        <div>
          <h1 style={{ margin: '0 0 6px', fontFamily: serif, fontSize: 30, lineHeight: 1.1, fontWeight: 600, letterSpacing: '-.02em' }}>
            {isSignup ? 'Crée ton compte' : 'Bon retour'}
          </h1>
          <div style={{ fontSize: 13, color: '#6b7392', lineHeight: 1.45 }}>
            {isSignup
              ? 'Un compte pour retrouver tes votes, ta boussole et ta progression sur tous tes appareils.'
              : 'Connecte-toi pour retrouver ta progression et tes votes enregistrés.'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <div
            onClick={actions.authApple}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, height: 48, borderRadius: 13, background: '#10162e', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}
          >
            <svg width="15" height="17" viewBox="0 0 15 17" fill="none">
              <path d="M10.4 8.9c0-2 1.6-3 1.7-3.1-.9-1.4-2.4-1.5-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.5-.4 6.1 1 8.1.7 1 1.5 2.1 2.5 2 1-.1 1.4-.6 2.6-.6s1.5.6 2.6.6c1.1 0 1.8-1 2.4-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.1-.8-2.1-3.1Z" fill="currentColor" />
              <path d="M8.9 2.9c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.2 1.2-.5.6-.9 1.5-.8 2.3.9.1 1.7-.5 2.2-1.1Z" fill="currentColor" />
            </svg>
            Continuer avec Apple
          </div>
          <div
            onClick={actions.authGoogle}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, height: 48, borderRadius: 13, background: '#fff', border: '1px solid #d9dfee', color: '#10162e', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}
          >
            <svg width="16" height="16" viewBox="0 0 18 18">
              <path d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5Z" fill="#4285F4" />
              <path d="M9 18c2.4 0 4.5-.8 6-2.3l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.5-1.6-5.2-3.8H.8v2.3A9 9 0 0 0 9 18Z" fill="#34A853" />
              <path d="M3.8 10.6a5.4 5.4 0 0 1 0-3.4V4.9H.8a9 9 0 0 0 0 8.1l3-2.4Z" fill="#FBBC05" />
              <path d="M9 3.6c1.3 0 2.5.5 3.4 1.4l2.6-2.6A9 9 0 0 0 .8 4.9l3 2.3C4.5 5 6.6 3.6 9 3.6Z" fill="#EA4335" />
            </svg>
            Continuer avec Google Play
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#aab2cc', fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase' }}>
          <div style={{ flex: 1, height: 1, background: '#dfe3f0' }} />ou<div style={{ flex: 1, height: 1, background: '#dfe3f0' }} />
        </div>

        <div style={{ background: '#fff', border: '1px solid #e3e7f3', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {isSignup && (
            <>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={fieldLabel}>Prénom</div>
                  <input value={s.authFirst} onChange={actions.setAuthFirst} placeholder="Léa" style={inputStyle} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={fieldLabel}>Nom</div>
                  <input value={s.authLast} onChange={actions.setAuthLast} placeholder="Martin" style={inputStyle} />
                </div>
              </div>
              <div>
                <div style={fieldLabel}>Pseudo</div>
                <input value={s.authPseudo} onChange={actions.setAuthPseudo} placeholder="lea_m" style={inputStyle} />
              </div>
            </>
          )}
          <div>
            <div style={fieldLabel}>Adresse e-mail</div>
            <input value={s.authEmail} onChange={actions.setAuthEmail} placeholder="lea.martin@mail.fr" style={inputStyle} />
          </div>
          <div>
            <div style={fieldLabel}>Mot de passe</div>
            <input type="password" value={s.authPass} onChange={actions.setAuthPass} placeholder="8 caractères minimum" style={inputStyle} />
          </div>
          {s.authError && <div style={{ fontSize: 11.5, color: '#b03a4a', fontWeight: 500 }}>{s.authError}</div>}
          <div onClick={actions.submitAuth} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 46, borderRadius: 12, fontSize: 13.5, fontWeight: 600, color: '#fff', cursor: 'pointer', marginTop: 2, background: ACCENT }}>
            {busy ? '…' : isSignup ? 'Créer mon compte' : 'Se connecter'}
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: 12.5, color: '#6b7392' }}>
          {isSignup ? 'Tu as déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <span onClick={actions.toggleAuthView} style={{ fontWeight: 600, color: ACCENT, cursor: 'pointer' }}>
            {isSignup ? 'Se connecter' : "S'inscrire"}
          </span>
        </div>
        <div onClick={actions.authGuest} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#6b7392', cursor: 'pointer', padding: 2 }}>
          Continuer sans compte
        </div>
        <div style={{ fontSize: 11, color: '#8189a8', lineHeight: 1.5, textAlign: 'center', padding: '0 6px' }}>
          En continuant, tu acceptes les conditions d'utilisation et la politique de confidentialité. Tes données sont stockées de façon sécurisée via Supabase.
        </div>
      </div>
    </div>
  )
}
