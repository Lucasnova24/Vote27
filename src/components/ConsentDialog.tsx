import type { AppActions } from '../useAppState'
import { ACCENT } from '../data'

// Consentement explicite (RGPD art. 9) avant la première réponse pouvant révéler une opinion politique.
export default function ConsentDialog({ actions }: { actions: Pick<AppActions, 'acceptConsent' | 'refuseConsent'> }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(20,22,43,.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 'env(safe-area-inset-top, 0px) 12px calc(12px + env(safe-area-inset-bottom, 0px))' }}>
      <div role="dialog" aria-modal="true" aria-labelledby="consent-title" className="card stk" style={{ width: '100%', maxWidth: 460, gap: 12, padding: 20, background: '#fff', maxHeight: '90dvh', overflowY: 'auto' }}>
        <h2 id="consent-title" className="dsp" style={{ margin: 0, fontSize: 24, lineHeight: 1.1, fontWeight: 700 }}>Tes réponses, ton choix</h2>
        <div style={{ fontSize: 14.5, lineHeight: 1.55, color: '#454A66' }}>
          Tes votes, tes réponses à « Mes affinités » et tes pronostics peuvent révéler des opinions politiques, une catégorie de données particulièrement protégée.
        </div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.55, color: '#454A66' }}>
          <li>Elles sont enregistrées sur ton compte pour faire fonctionner l'app (résultats, affinités, classements).</li>
          <li>« Mes affinités » reste privé ; le vote du jour n'est publié que sous forme agrégée.</li>
          <li>Tu peux retirer ton consentement à tout moment dans Profil : tes réponses sont alors effacées.</li>
        </ul>
        <div style={{ fontSize: 13, color: '#5C617B' }}>
          Détails : <a href="/confidentialite.html" target="_blank" rel="noopener noreferrer">politique de confidentialité</a>.
        </div>
        <div className="stk" style={{ gap: 8 }}>
          <button type="button" onClick={actions.acceptConsent} className="btn" style={{ background: ACCENT }}>J'accepte</button>
          <button type="button" onClick={actions.refuseConsent} className="btn" style={{ background: '#EFEBE2', color: '#14162B' }}>Pas maintenant</button>
        </div>
      </div>
    </div>
  )
}
