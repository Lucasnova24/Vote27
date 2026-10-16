# iOS — build sans Mac (Codemagic) et publication App Store

Compte Apple Developer **individuel** (99 €/an). Pas de Mac : l'IPA est compilé et signé par Codemagic
(`codemagic.yaml`, plan gratuit ≈ 500 min macOS/mois ; un build ≈ 10–15 min).
Identifiant d'application : `com.novaparticipations.petitvote` (confirmé ; définitif sur le store).

## 1. Apple Developer (developer.apple.com)
1. **Certificates, Identifiers & Profiles → Identifiers → +** : *App IDs* → *App* → Bundle ID **explicite**
   `com.novaparticipations.petitvote`. Cocher la capacité **Sign in with Apple**.
2. **App Store Connect → Utilisateurs et accès → Intégrations → Clés d'API** : créer une clé (rôle **App Manager**
   ou Admin), télécharger le `.p8` (téléchargeable **une seule fois**), noter *Issuer ID* et *Key ID*.
3. (Flux web uniquement) *Identifiers → Services IDs* + *Keys → Sign in with Apple* → fichier `.p8` dédié.

## 2. App Store Connect : créer l'app
*Apps → + → Nouvelle app* : plateforme iOS, nom « Mon Petit Vote 2027 », langue FR, bundle ID ci-dessus, SKU libre.
Noter l'**Apple ID numérique** de l'app (Informations sur l'app) → variable `APP_STORE_APPLE_ID`.

## 3. Codemagic (codemagic.io)
1. Se connecter avec GitHub, ajouter le dépôt `Lucasnova24/Vote27` (détection de `codemagic.yaml`).
2. **Teams → Personal account → Integrations → App Store Connect → Connect** : coller Issuer ID, Key ID et le `.p8`.
   Le **nom** de l'intégration doit être celui de `codemagic.yaml > integrations > app_store_connect` (par défaut `Codemagic`).
3. **Environment variables → groupe `supabase_public`** : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
4. Dans `codemagic.yaml`, remplacer `APP_STORE_APPLE_ID: "0000000000"` par l'ID réel (commit).
5. Lancer **Start new build** → workflow `iOS — TestFlight`. Codemagic crée/récupère certificat et profil de
   distribution tout seul grâce à l'intégration, compile, incrémente le numéro de build et envoie sur TestFlight.
6. Si le build échoue à la signature : vérifier que l'App ID existe et porte la capacité *Sign in with Apple*.

## 4. Sign in with Apple côté Supabase
Authentication → Providers → Apple : activer ; **Client IDs** = `com.novaparticipations.petitvote`
(+ Services ID si flux web, séparés par une virgule). Le *secret* (JWT généré avec Team ID, Key ID, Services ID et
le `.p8`, durée max 6 mois) n'est nécessaire que pour le flux web ; la connexion native iOS n'en a pas besoin.

## 5. Fiche App Store (voir `fiches-stores.md`, `captures-ecran.md`)
- Sous-titre, texte promotionnel, description, mots-clés, catégorie : `fiches-stores.md`.
- Captures iPhone 6,9" (obligatoires), icône 1024 (déjà dans le projet via `resources/`).
- **URL de confidentialité** : `https://[DOMAINE]/confidentialite.html` · **URL d'assistance** : `https://[DOMAINE]`.
- **Confidentialité de l'app (App Privacy)** : données collectées *liées à l'utilisateur* — e-mail, nom, identifiant
  utilisateur, date de naissance, sexe, localisation approximative (ville/région/CP), numéro de téléphone (facultatif),
  « autres données » (réponses de vote/quiz/affinités = opinions politiques), historique d'usage. Finalités : fonctionnalités
  de l'app / gestion de compte. **Pas de suivi (tracking)**, pas de publicité.
- **Classification d'âge** : questionnaire (contenu politique non sensible, pas de violence ni d'achats).
- **Notes pour la review** + accès démo : texte de `fiches-stores.md` (« Continuer sans compte »).
- **Chiffrement** : `ITSAppUsesNonExemptEncryption = false` est déjà dans `Info.plist` (HTTPS standard).
- Suppression de compte : présente dans l'app (Profil) — Apple 5.1.1(v).

## 6. Soumission
TestFlight (test interne : toi-même, sans review) → vérifier connexion Apple/Google/invité, suppression de compte,
haptique, safe-areas → dans App Store Connect, choisir le build, **Ajouter pour vérification**.

## Risques de review à anticiper
- **4.8** Sign in with Apple : présent. **4.2** fonctionnalités natives : haptique, partage, SIWA natif.
- **Contenu politique / élections** : vérifier les exigences éventuelles (compte organisation) avant de payer/soumettre ;
  rester factuel, « indépendante et non officielle » visible (déjà affiché).
- Google OAuth dans l'app iOS passe par le navigateur système (`@capacitor/browser`) : OK pour Apple.
