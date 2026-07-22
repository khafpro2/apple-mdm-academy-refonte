# Authentification — Apple MDM Academy

## Fournisseur

**Supabase Auth** (email + mot de passe + Google OAuth) via `@supabase/ssr` et Next.js App Router.

- Inscription / connexion email : Server Actions (`app/actions/auth.ts`)
- Google OAuth : `supabase.auth.signInWithOAuth({ provider: 'google' })` (client)
- Session : cookies HTTP-only gérés par `@supabase/ssr`
- Middleware : `proxy.ts` → `lib/supabase/middleware.ts` (ne pas renommer en `middleware.ts` sous Next 16)

## Variables d'environnement

Copier `.env.example` vers `.env.local` en local. **Ne jamais committer de secrets.** Documenter les **noms** uniquement — jamais les valeurs.

### Vercel (Project Settings → Environment Variables)

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Oui | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Oui | Clé anon publique |
| `NEXT_PUBLIC_SITE_URL` | Oui (prod) | URL publique du site (prod / preview) |
| `SUPABASE_SERVICE_ROLE_KEY` | Non | Admin / démo uniquement côté serveur |
| `ADMIN_EMAILS` | Non | Emails autorisés sur `/admin` |

> **Important Vercel** : les variables `NEXT_PUBLIC_*` sont injectées **au build**. Après modification dans Vercel, **redéployer**. Configurer Production **et** Preview.

### Supabase (Dashboard)

1. **Authentication → Providers → Email** : signups activés.
2. **SMTP** configuré pour les emails de confirmation (ou confirmation email **OFF** le temps des tests locaux).
3. **Authentication → URL Configuration** :
   - **Site URL** : valeur de `NEXT_PUBLIC_SITE_URL`
   - **Redirect URLs** : inclure `<SITE_URL>/auth/callback` (et variantes localhost / preview si besoin)
4. Appliquer `supabase/schema.sql` (trigger `handle_new_user` + policies `profiles`).

### Google Cloud (OAuth — via Supabase uniquement)

1. **Consent screen** : scopes `openid`, `email`, `profile`.
2. **OAuth Client** de type **Web application**.
3. **Authorized redirect URI** (callback Supabase, pas l'app) :
   - `https://<project-ref>.supabase.co/auth/v1/callback`
4. **Authorized JavaScript origins** :
   - URL de l'application (prod)
   - URL du projet Supabase
   - `http://localhost:3000` (dev)
5. Dans **Supabase → Authentication → Providers → Google** : renseigner Client ID et Client Secret Google.

Aucun second fournisseur OAuth n'est prévu dans l'application.

## Configuration locale

```bash
cp .env.example .env.local
# Renseigner NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SITE_URL
npm install
npm run dev
```

Exécuter aussi les schémas SQL dans l'ordre :

1. `supabase/schema.sql`
2. `supabase/schema-admin.sql`
3. `supabase/schema-phase2.sql` (progression, badges)

## Confirmation email et création de profil

| Cas | Comportement |
|-----|--------------|
| Confirmation **activée** (prod) | `signUp` renvoie `user` **sans** `session` → redirection `/auth/check-email`. Le profil est créé par le trigger SQL `handle_new_user` (security definer). `ensureUserProfile` n'est **pas** appelé à l'inscription sans session (RLS refuserait l'insert). |
| Confirmation **désactivée** (dev) | Session immédiate → `ensureUserProfile` puis redirection `/dashboard`. |
| Lien email / Google OAuth | `/auth/callback` échange le code (PKCE) → session → `ensureUserProfile`. |

Le nom Google est lu via `coalesce(full_name, name)` dans `handle_new_user`.

## Routes auth

| Route | Rôle |
|-------|------|
| `/auth/signup` | Inscription (email + Google) |
| `/auth/login` | Connexion (email + Google) |
| `/auth/check-email` | Post-inscription (confirmation email) |
| `/auth/callback` | Échange code OAuth / confirmation email |
| `/auth/forgot-password` | Demande reset |
| `/auth/reset-password` | Nouveau mot de passe |
| `/auth/signout` | Déconnexion (POST) |
| `/dashboard` | Espace apprenant (protégé) |

## Procédure de test manuelle

1. **Nouvel utilisateur (confirmation ON)** : `/auth/signup` → formulaire → `/auth/check-email` **sans** message « Impossible de créer le compte ».
2. **Email existant** : message d'erreur explicite, formulaire réutilisable.
3. **Mot de passe faible** : validation avant soumission.
4. **Google** : bouton « Continuer avec Google » → consentement → `/auth/callback` → dashboard.
5. **Consentement Google refusé** : message d'annulation (pas d'échec générique).
6. **Non connecté + `/dashboard`** : redirection `307` vers `/auth/login?redirect=/dashboard`.
7. **Déconnexion / reconnexion** : header → session supprimée → login à nouveau.

## Erreurs fréquentes

| Symptôme | Cause probable | Action |
|----------|----------------|--------|
| « Configuration Supabase requise » | Variables absentes ou placeholders | Configurer `.env.local` / Vercel + redéployer |
| « Impossible de créer le compte » juste après signup | Ancien bug : `ensureUserProfile` sans session | Corrigé — profil via trigger + callback |
| Lien email invalide | Redirect URL non autorisée dans Supabase | Ajouter `<SITE_URL>/auth/callback` |
| Google redirect_uri_mismatch | Mauvaise URI dans Google Cloud | Utiliser `https://<project-ref>.supabase.co/auth/v1/callback` |
| Session absente après confirmation | Callback ou cookies bloqués | Vérifier `/auth/callback`, domaine, HTTPS |

## Observabilité

Les échecs auth serveur journalisent des codes sans données sensibles :

```
AUTH_SIGNUP_FAILED { provider: 'supabase', errorCode: '...' }
AUTH_LOGIN_FAILED { provider: 'supabase', errorCode: '...' }
AUTH_CALLBACK_FAILED { provider: 'supabase', errorCode: '...' }
AUTH_SIGNUP_PROFILE_SYNC_FAILED { provider: 'supabase', errorCode: 'profile_sync_failed' }
PROFILE_ENSURE_READ_FAILED { errorCode: '...' }
PROFILE_ENSURE_INSERT_FAILED { errorCode: '...' }
```

Références utilisateur (sans secret) : `(réf. SIGNUP-AUTH)`, `(réf. PROFILE-READ)`, `(réf. PROFILE-INSERT)`.

Ne jamais logger : mot de passe, tokens, cookies complets, emails, user ids.
