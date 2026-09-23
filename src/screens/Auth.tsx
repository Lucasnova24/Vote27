import type { AppActions } from '../useAppState'
import type { AppState } from '../types'
import { ACCENT } from '../data'
import { AppleLogo, GoogleLogo, LogoDiamond } from '../components/Icons'

interface Props {
  state: AppState
  actions: AppActions
  isWeb: boolean
}

export default function Auth({ state: s, actions, isWeb }: Props) {
  const isSignup = s.authView === 'signup'
  const busy = s.authBusy
  const title = isSignup ? 'Crée ton compte' : 'Bon retour'
  const sub = isSignup
    ? 'Un compte pour retrouver tes votes, tes affinités et ta progression sur tous tes appareils.'
    : 'Connecte-toi pour retrouver ta progression et tes votes enregistrés.'

  return (
    <div style={{ position: 'relative', display: 'flex', minHeight: '100dvh', background: '#F6F4EE', color: '#14162B', fontFamily: "'Hanken Grotesk',system-ui,sans-serif", overflow: 'hidden' }}>
      {isWeb && (
        <div style={{ flex: 1, minWidth: 0, background: '#171B3C', color: '#fff', padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="row" style={{ gap: 10 }}>
            <span style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ACCENT }}>
              <LogoDiamond size={18} />
            </span>
            <span className="dsp" style={{ fontSize: 24, fontWeight: 800 }}>Vote<span style={{ color: '#B8C0F5' }}>2027</span></span>
          </div>
          <div className="stk" style={{ gap: 32 }}>
            <div className="dsp" style={{ fontSize: 50, lineHeight: 1.04, fontWeight: 700, maxWidth: 520 }}>
              Six thèmes, tous les candidats déclarés, une source vérifiable pour chaque position.
            </div>
            <div style={{ display: 'flex', gap: 6, height: 16, maxWidth: 520 }} aria-hidden="true">
              <div style={{ flex: 26, borderRadius: 99, background: '#5B6DF0' }} />
              <div style={{ flex: 23, borderRadius: 99, background: '#2FB39F' }} />
              <div style={{ flex: 19, borderRadius: 99, background: '#F0A03C' }} />
              <div style={{ flex: 17, borderRadius: 99, background: '#9A78F2' }} />
              <div style={{ flex: 15, borderRadius: 99, background: '#EF7C97' }} />
            </div>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.55, color: '#A7ADD3', maxWidth: 460 }}>
            Vote 2027 est une application civique indépendante et non officielle. Les candidats affichés sont réels (déclarés ou pressentis) ; les votes, quiz et pronostics de l'app n'ont aucune valeur de sondage officiel.
          </div>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', display: 'flex' }}>
        <div className="rise" style={{ margin: 'auto', width: '100%', maxWidth: 420, padding: '32px 20px 28px', display: 'flex', flexDirection: 'column', gap: 18, opacity: busy ? 0.7 : 1, pointerEvents: busy ? 'none' : 'auto' }}>

          {!isWeb && (
            <div className="stk" style={{ gap: 16 }}>
              <div className="row" style={{ gap: 10 }}>
                <span style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ACCENT }}>
                  <LogoDiamond size={18} />
                </span>
                <span className="dsp" style={{ fontSize: 24, fontWeight: 800 }}>Vote<span style={{ color: ACCENT }}>2027</span></span>
              </div>
              <div style={{ display: 'flex', gap: 5, height: 8 }} aria-hidden="true">
                <div style={{ flex: 26, borderRadius: 99, background: '#3B4FD8' }} />
                <div style={{ flex: 23, borderRadius: 99, background: '#0E7A6B' }} />
                <div style={{ flex: 19, borderRadius: 99, background: '#A85400' }} />
                <div style={{ flex: 17, borderRadius: 99, background: '#6B45D9' }} />
                <div style={{ flex: 15, borderRadius: 99, background: '#C2385A' }} />
              </div>
            </div>
          )}

          <div className="stk" style={{ gap: 8 }}>
            <h1 className="dsp" style={{ margin: 0, fontSize: 36, lineHeight: 1.02, fontWeight: 700 }}>{title}</h1>
            <div style={{ fontSize: 15, lineHeight: 1.5, color: '#454A66' }}>{sub}</div>
          </div>

          <div className="stk" style={{ gap: 10 }}>
            <button type="button" onClick={actions.authApple} className="btn" style={{ background: '#14162B' }}>
              <AppleLogo size={16} />Continuer avec Apple
            </button>
            <button type="button" onClick={actions.authGoogle} className="btn" style={{ background: '#fff', color: '#14162B', border: '1.5px solid #DDD7C9' }}>
              <GoogleLogo size={17} />Continuer avec Google Play
            </button>
          </div>

          <div className="row" style={{ gap: 12, color: '#5C617B', fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>
            <span style={{ flex: 1, height: 1, background: '#DDD7C9' }} />ou<span style={{ flex: 1, height: 1, background: '#DDD7C9' }} />
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
            {isSignup && (
              <>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label className="lbl" htmlFor="au-first">Prénom</label>
                    <input id="au-first" className="inp" autoComplete="given-name" value={s.authFirst} onChange={actions.setAuthFirst} placeholder="Léa" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label className="lbl" htmlFor="au-last">Nom</label>
                    <input id="au-last" className="inp" autoComplete="family-name" value={s.authLast} onChange={actions.setAuthLast} placeholder="Martin" />
                  </div>
                </div>
                <div>
                  <label className="lbl" htmlFor="au-pseudo">Pseudo</label>
                  <input id="au-pseudo" className="inp" autoComplete="nickname" value={s.authPseudo} onChange={actions.setAuthPseudo} placeholder="lea_m" />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label className="lbl" htmlFor="au-dob">Date de naissance</label>
                    <input id="au-dob" className="inp" type="date" autoComplete="bday" value={s.authDob} onChange={actions.setAuthDob} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label className="lbl" htmlFor="au-sex">Sexe</label>
                    <select id="au-sex" className="inp" value={s.authSex} onChange={actions.setAuthSex}>
                      <option value="">Choisir</option>
                      <option value="femme">Femme</option>
                      <option value="homme">Homme</option>
                      <option value="autre">Autres / Ne souhaite pas s'exprimer</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="lbl" htmlFor="au-email">Adresse e-mail</label>
              <input id="au-email" className="inp" type="email" autoComplete="email" value={s.authEmail} onChange={actions.setAuthEmail} placeholder="lea.martin@mail.fr" />
            </div>
            <div>
              <label className="lbl" htmlFor="au-pass">Mot de passe</label>
              <input id="au-pass" className="inp" type="password" autoComplete="current-password" value={s.authPass} onChange={actions.setAuthPass} placeholder="8 caractères minimum" />
            </div>
            {s.authError && (
              <div role="alert" style={{ fontSize: 13, fontWeight: 600, color: '#8A1F0E', background: '#FFDFD8', borderRadius: 12, padding: '10px 12px' }}>{s.authError}</div>
            )}
            <button type="button" onClick={actions.submitAuth} className="btn" style={{ background: ACCENT }}>
              {busy ? '…' : isSignup ? 'Créer mon compte' : 'Se connecter'}
            </button>
          </div>

          <div className="stk" style={{ alignItems: 'center', gap: 2 }}>
            <div style={{ fontSize: 14, color: '#454A66' }}>
              {isSignup ? 'Tu as déjà un compte ?' : 'Pas encore de compte ?'}{' '}
              <button type="button" onClick={actions.toggleAuthView} style={{ fontWeight: 700, color: ACCENT, minHeight: 44, padding: '0 4px', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                {isSignup ? 'Se connecter' : "S'inscrire"}
              </button>
            </div>
            <button type="button" onClick={actions.authGuest} style={{ minHeight: 44, padding: '0 16px', fontSize: 14, fontWeight: 700, color: '#454A66' }}>
              Continuer sans compte
            </button>
          </div>
          <div style={{ fontSize: 12, color: '#5C617B', lineHeight: 1.55, textAlign: 'center' }}>
            En continuant, tu acceptes les conditions d'utilisation et la politique de confidentialité. Tes données sont stockées de façon sécurisée via Supabase.
          </div>
        </div>
      </div>
    </div>
  )
}
