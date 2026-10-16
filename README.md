# Mon Petit Vote 2027 — Supabase edition

Same app as the local [Vote27](../Vote27) prototype, but with a real backend: Supabase
Auth for accounts and Postgres (via Supabase) for every piece of durable state that used
to live in `localStorage`.

## What changed vs. the local version

- **Auth**: real accounts via Supabase Auth — email/password sign-up & login, plus
  anonymous ("guest") sign-in. Apple and Google buttons are wired to
  `supabase.auth.signInWithOAuth(...)`, but **those providers must be enabled and
  configured in your Supabase project** before they'll work (see below) — this repo
  can't do that part for you.
- **Data**: votes, quiz results, boussole answers, estimation submissions, and debate
  predictions are stored in Postgres tables (`supabase/schema.sql`), scoped to each user
  with row-level security. Reloading the page, or logging in from another device, brings
  your progress back.
- **Points/leveling**: replaced the local version's hardcoded demo numbers ("Niveau 12",
  fake "jours de série", a fabricated vote history) with values actually derived from
  your data: points earned from real actions, a simple 100-points-per-level curve, and a
  real global leaderboard (top 10 by points) via the `get_leaderboard` RPC.
- **Simplifications** (documented trade-offs, not bugs): each table holds *current*
  state, not a history log — there's one votes row per user, not one per day, so voting
  again just overwrites your last answer, matching how the underlying screens work.
  Likewise there's no streak/friends-league system (that part of the original was purely
  decorative demo data).

## 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a project, then open
**Project Settings → API** and copy the Project URL and `anon public` key.

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 2. Run the schema

Open the Supabase SQL editor for your project and run the contents of
[`supabase/schema.sql`](supabase/schema.sql). It creates the tables, row-level security
policies, the profile-on-signup trigger, and the `increment_points` /
`reset_progress` / `get_leaderboard` RPCs. It's idempotent — safe to re-run.

## 3. Enable anonymous sign-ins (for the "Continuer sans compte" button)

**Authentication → Providers → Anonymous Sign-ins** → toggle it on.

## 4. (Optional) Enable Apple / Google sign-in

Under **Authentication → Providers**, enable Apple and/or Google and fill in the client
ID/secret from your Apple Developer / Google Cloud Console projects, and add your app's
URL under **Authentication → URL Configuration → Redirect URLs** (e.g.
`http://localhost:5173` for local dev). Until you do this, tapping those buttons will
show a "ce fournisseur n'est pas activé" error — the code path is correct and ready, it
just needs credentials this repo has no way to obtain on your behalf.

## 4 bis. Suppression de compte (obligatoire pour les stores)

Exécuter [`supabase/account_deletion.sql`](supabase/account_deletion.sql) dans le SQL editor
(idempotent, à lancer après `schema.sql`). Il crée la RPC `delete_my_account()` (SECURITY DEFINER,
accessible aux utilisateurs connectés, invités compris) qui supprime l'utilisateur dans `auth.users` ;
toutes les tables du schéma référencent `profiles`/`auth.users` en `ON DELETE CASCADE`, et les tables
hors dépôt portant un `user_id` sont nettoyées explicitement. Le bouton « Supprimer mon compte »
(Profil, avec confirmation) appelle cette RPC. **Ce script n'est appliqué sur aucun projet distant
automatiquement : à lancer toi-même.**

## 5. Install and run

```bash
npm install
npm run dev
```

## Structure

```
supabase/schema.sql         tables, RLS policies, triggers, RPCs — run once per project
src/lib/supabaseClient.ts   the typed Supabase client
src/lib/database.types.ts   hand-written types matching schema.sql
src/lib/displayName.ts      derives the shown name/initials from auth state
src/lib/leveling.ts         points -> level/progress curve
src/useAppState.ts          Supabase-backed state + actions (auth, reads, writes)
src/App.tsx                 shell: loading gate, auth gate, nav, header, routing
src/screens/                same screen-per-route structure as the local version
```

## Applications mobiles (Capacitor : Android + iOS)

L'app web est empaquetée avec [Capacitor](https://capacitorjs.com) (`capacitor.config.ts`, projets `android/` et `ios/`).

```bash
npm run cap:sync      # build web + copie vers android/ et ios/
npm run cap:android   # ouvre Android Studio
npm run cap:ios       # ouvre Xcode (macOS ; sinon compilation via Codemagic)
npm run assets        # régénère icônes/splash depuis resources/
```

- **Identifiant d'application** : défini **uniquement** dans `app.config.json` (provisoire :
  `com.novaparticipations.petitvote`, **à confirmer avant publication, définitif sur les stores**).
  Après modification : `npm run app:set-id` (met à jour Gradle, manifest, Info.plist, projet Xcode, package Java).
  Le schéma d'URL d'authentification en est dérivé.
- **Service worker (notifications push web)** : `public/sw.js` n'est enregistré que sur le web ; en natif (`Capacitor.isNativePlatform()`), `registerServiceWorker()` ne fait rien, la carte de notifications est masquée et les tuto d'installation PWA ne s'affichent pas.
- **Android** : voir [`store/ANDROID.md`](store/ANDROID.md) (keystore, AAB, workflow GitHub Actions, Play Console).
- **Fiches stores, captures, politique de confidentialité** : voir [`store/`](store/README.md).

### Connexion OAuth en natif (Google, Apple navigateur)

Google interdit OAuth dans une WebView : en natif, l'app ouvre le navigateur système (`@capacitor/browser`)
avec un schéma d'URL personnalisé, puis récupère le retour (`@capacitor/app` → `appUrlOpen`) et appelle
`exchangeCodeForSession` (PKCE, activé uniquement en natif dans `src/lib/supabaseClient.ts`). Sur le web,
comportement inchangé.

**À faire dans Supabase** — Authentication → URL Configuration → Redirect URLs, ajouter :

```
com.novaparticipations.petitvote://auth-callback
```
(= `<appId>://auth-callback`, voir `OAUTH_REDIRECT_URL` dans `src/lib/native.ts`).

### Sign in with Apple

- **iOS natif** : feuille système via `@capacitor-community/apple-sign-in`, puis
  `supabase.auth.signInWithIdToken({ provider: 'apple', token, nonce })` (nonce brut → Supabase, son SHA-256 → Apple).
  L'entitlement est déjà dans `ios/App/App/App.entitlements`.
- **Web / autres** : flux navigateur `signInWithOAuth({ provider: 'apple' })`. Le bouton est masqué sur Android natif.
- **Configuration requise (manuelle)** :
  1. Apple Developer : activer la capacité *Sign in with Apple* sur l'App ID (= bundle ID) ; pour le flux web, créer un *Services ID* et une clé privée `.p8`.
  2. Supabase → Authentication → Providers → Apple : activer et renseigner **Client IDs** = bundle ID (et Services ID si web ; liste séparée par des virgules), secret généré à partir de la clé `.p8` (expire tous les 6 mois max).
  3. Redirect URL Apple (web) : `https://<projet>.supabase.co/auth/v1/callback`.

### Éléments natifs / mobile

- Haptique (`@capacitor/haptics`) sur navigation, vote, quiz, pronostics ; partage natif (`@capacitor/share`) dans Profil.
- Zones sûres (`env(safe-area-inset-*)`), StatusBar et SplashScreen (`src/lib/nativeInit.ts`).
- Sheep3D (Three.js) retombe sur l'image statique si WebGL est indisponible ou si le contexte est perdu.

## Notifications push (mobile)

L'app envoie des notifications push (Web Push / PWA). Les messages se rédigent dans une
table Supabase éditable comme un tableur : **`notifications_planning`**.

### Écrire / planifier une notification

Supabase Studio → **Table Editor → `notifications_planning`** → *Insert row*, ou
*Import data from CSV* avec [`supabase/notifications_planning_modele.csv`](supabase/notifications_planning_modele.csv)
(tu peux le remplir dans Excel et l'enregistrer en CSV UTF-8).

| Colonne | Rôle |
|---|---|
| `categorie` | `question_du_jour`, `evenements`, `vote_semaine` ou `autre` |
| `titre` / `message` | texte affiché sur le téléphone |
| `lien` | laisser `/` |
| `date_envoi` / `heure_envoi` | quand l'envoyer, **heure de Paris** (ex. `2026-10-12` / `08:30`) |
| `actif` | décocher pour suspendre sans supprimer |
| `envoye_le`, `nb_envois` | remplis automatiquement à l'envoi |

Une ligne est envoyée à tous les appareils abonnés dans la minute qui suit son heure. Une
ligne dont l'heure est dépassée de plus de 6 h n'est jamais envoyée.

### Mise en place (une seule fois)

1. **Clés VAPID** : `npx web-push generate-vapid-keys`. Garde la clé privée secrète.
2. **App** : ajoute `VITE_VAPID_PUBLIC_KEY=<clé publique>` à `.env.local` (et aux variables
   de ton hébergeur), puis redéploie l'app.
3. **SQL** : exécute [`supabase/notifications_schema.sql`](supabase/notifications_schema.sql).
4. **Edge Function** :
   ```bash
   supabase functions deploy send-notifications --no-verify-jwt
   supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... \
     VAPID_SUBJECT=mailto:toi@exemple.fr
   ```
5. **Déclencheur chaque minute** : suis la section « pg_cron » en bas de
   `notifications_schema.sql` (extensions `pg_cron` + `pg_net`, secret généré dans le Vault).

### Côté utilisateur

Profil → carte **Notifications** → *Activer*. Sur iPhone/iPad, les notifications ne
fonctionnent que si l'app a d'abord été ajoutée à l'écran d'accueil (la carte l'explique).
