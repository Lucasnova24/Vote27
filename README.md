# Vote2027 — Supabase edition

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
