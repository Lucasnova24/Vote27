# Android — build de l'AAB de release et publication

Compte Google Play **organisation** : pas d'obligation de test fermé de 12 testeurs / 14 jours avant la production.
Identifiant d'application : `com.novaparticipations.petitvote` (confirmé ; définitif après le premier envoi).

## 1. Prérequis locaux
JDK 21, Android SDK (Android Studio ou `sdkmanager`), Node 22. Variables Supabase dans `.env.local`
(voir `.env.example`) : elles sont intégrées au bundle web au build.

## 2. Créer le keystore d'envoi (une seule fois)
```bash
keytool -genkeypair -v -keystore upload-keystore.jks -alias upload \
  -keyalg RSA -keysize 2048 -validity 10000
```
- Garde `upload-keystore.jks` et ses mots de passe dans un gestionnaire de mots de passe + une sauvegarde hors ligne.
- **Ne le commite jamais** (`*.jks`, `*.keystore`, `keystore.properties` sont ignorés par git).
- Avec **Play App Signing** (activé par défaut), Google conserve la clé de signature finale ; ce keystore n'est que la
  *clé d'envoi*. En cas de perte, Google peut la réinitialiser (demande dans Play Console > Intégrité de l'appli).

## 3. Signature locale
Copie `android/keystore.properties.example` en `android/keystore.properties` (ignoré par git) et remplis-le :
```properties
storeFile=/chemin/absolu/upload-keystore.jks
storePassword=...
keyAlias=upload
keyPassword=...
```
Alternative : variables d'environnement `ANDROID_KEYSTORE_PATH`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.

## 4. Construire
```bash
npm ci
npm run android:aab                         # AAB signé : android/app/build/outputs/bundle/release/app-release.aab
npm run android:apk-debug                   # APK de debug pour tester sur un appareil/émulateur
cd android && ./gradlew bundleRelease -PversionCode=2 -PversionName=1.0.1   # surcharger la version
```
`versionCode` doit **augmenter à chaque envoi** (défaut 1 dans `android/app/build.gradle`) ; `versionName` est libre.
Sans keystore configuré, `bundleRelease` produit un AAB **non signé** (refusé par Play).

## 5. Build via GitHub Actions (runner Linux)
Workflow manuel : **Actions > Android release (AAB signé) > Run workflow** (saisir versionCode / versionName).
Secrets à créer (Settings > Secrets and variables > Actions) :

| Secret | Valeur |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | `base64 -w0 upload-keystore.jks` |
| `ANDROID_KEYSTORE_PASSWORD` | mot de passe du keystore |
| `ANDROID_KEY_ALIAS` | `upload` |
| `ANDROID_KEY_PASSWORD` | mot de passe de la clé |
| `VITE_SUPABASE_URL` | URL du projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | clé `anon` publique |

L'AAB est publié comme artefact du run (14 jours). (Codemagic ne propose pas de minutes Linux gratuites ; ce workflow s'en passe.)

### Vérification de compilation
Le workflow **Android debug** (`.github/workflows/android-debug.yml`, sans secret) compile l'APK de debug à chaque PR
touchant `android/`, `src/` ou les dépendances, et peut être lancé à la main. **Lance-le une première fois avant
le build de release** : la compilation Android n'a pas pu être vérifiée dans l'environnement de développement initial.

## 6. Tester le retour OAuth sur Android
Dans Supabase > Authentication > URL Configuration > Redirect URLs, ajouter `com.novaparticipations.petitvote://auth-callback`
(schéma = identifiant d'appli). Google refuse OAuth dans une WebView : l'app ouvre le navigateur système puis revient par ce schéma.

## 7. Checklist Play Console (compte organisation)
1. **Créer l'application** : nom, langue FR, « Application », gratuite.
2. **Play App Signing** : accepter ; envoyer le premier AAB signé avec la clé d'envoi.
3. **Fiche Play Store** : textes (`store/fiches-stores.md`), icône 512, image 1024 × 500, captures (`store/captures-ecran.md`).
4. **Politique de confidentialité** : URL `https://[DOMAINE]/confidentialite.html` (champs entre crochets remplacés).
5. **Accès à l'appli** : choisir « Instructions spéciales » → bouton « Continuer sans compte » (texte dans `fiches-stores.md`).
6. **Annonces** : aucune publicité.
7. **Classification du contenu** : questionnaire IARC (contenu politique non sensible, pas de violence, pas d'achats).
8. **Public cible** : adultes / ≥ 15–16 ans ; pas d'enfants.
9. **Sécurité des données (Data safety)** : collecte = e-mail, nom, identifiants utilisateur (pseudo/ID), date de naissance, sexe, adresse approximative (ville/région/pays/CP), téléphone (facultatif), « autres contenus » (réponses de vote/quiz/affinités — **opinions politiques**), activité dans l'appli ; chiffrement en transit : oui ; suppression possible : oui (dans l'appli + URL web) ; partage avec des tiers : non (Supabase = sous-traitant) ; pas de données de localisation précise ni de publicité.
10. **Suppression de compte** : renseigner l'URL `https://[DOMAINE]/suppression-compte.html` (rubrique « Sécurité des données »).
11. **Déclarations « Applications gouvernementales » / contenu politique** : l'app est **indépendante et non officielle** — ne pas la déclarer comme appli gouvernementale ; vérifier les règles Play sur le contenu politique/électoral (neutre, aucune désinformation, aucune consigne de vote) et les exigences de vérification de l'organisation.
12. **Autres déclarations** : ID de publicité = non ; permissions : seule `INTERNET` ; services de santé / finance : non.
13. **Test interne** : créer une piste de test interne (jusqu'à 100 testeurs), envoyer l'AAB, tester l'install, la connexion (e-mail, Google, invité), la suppression de compte, le retour OAuth.
14. **Production** : après validation interne, promouvoir vers la production (déploiement progressif possible) et soumettre à examen.
