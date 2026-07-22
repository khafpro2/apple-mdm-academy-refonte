# Authentification — Apple MDM Academy

## Fournisseur

**Supabase Auth** (email + mot de passe + Google OAuth) via `@supabase/ssr` et Next.js App Router.

- Inscription / connexion email : Server Actions (`app/actions/auth.ts`)
- Google OAuth : client (`components/auth/google-auth-button.tsx` → `signInWithOAuth`)
- Session : cookies HTTP-only gérés par `@supabase/ssr` (PKCE)
- Middleware : `proxy.ts` → `lib/supabase/middleware.ts` (**ne pas renommer** `proxy.ts`)

## Variables d'environnement

Copier `.env.example` vers `.env.local` pour le développement local. **Ne jamais committer de secrets.**

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Oui | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Oui | Clé anon publique |
| `NEXT_PUBLIC_SITE_URL` | Oui (prod / preview) | URL publique du site (callbacks email + OAuth) |
| `SUPABASE_SERVICE_ROLE_KEY` | Non | Admin / seed uniquement côté serveur — **jamais** côté client |
| `ADMIN_EMAILS` | Non | Emails autorisés sur `/admin` |
| `DEMO_SESSION_SECRET` | Non | Si défini (≥ 16 car.), signe le cookie démo `ama_demo_session` |

> **Important Vercel** : les variables `NEXT_PUBLIC_*` sont injectées **au build**. Après modification dans Vercel, **redéployer**. Les variables doivent être présentes pour **Production** et **Preview** (Development local utilise `.env.local`).

### Checklist config (bloquant inscription)

**Vercel**

- [ ] `NEXT_PUBLIC_SUPABASE_URL` présente (Production + Preview)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` présente (Production + Preview)
- [ ] `NEXT_PUBLIC_SITE_URL` = URL canonique (ex. domaine prod), sans slash final
- [ ] Redéploiement effectué après tout changement `NEXT_PUBLIC_*`
- [ ] Vérifier `/status`, `/admin/runtime-env-check`, `/admin/supabase-diagnostics`

**Supabase → Authentication**

- [ ] Email provider activé, **Allow new users to sign up** = ON
- [ ] Politique de mot de passe (min. 8 caractères recommandé, alignée UX)
- [ ] Confirmation email : SMTP configuré **ou** confirmation désactivée temporairement pour valider le parcours
- [ ] `supabase/schema.sql` appliqué (+ migration `supabase/migrations/20260722_handle_new_user_google_name.sql`)
- [ ] Redirect URLs incluent :
  - `http://localhost:3000/auth/callback**`
  - `<NEXT_PUBLIC_SITE_URL>/auth/callback**`
  - `https://*.vercel.app/auth/callback**` (previews)

## Google OAuth (via Supabase — pas de second fournisseur)

### 1. Google Cloud Console

1. Créer / sélectionner un projet.
2. **APIs & Services → OAuth consent screen** : scopes `openid`, `email`, `profile`.
3. **Credentials → OAuth client ID** (type **Web application**).
4. **Authorized JavaScript origins** :
   - `http://localhost:3000`
   - `https://<project-ref>.supabase.co`
   - URL de l’app (prod / preview)
5. **Authorized redirect URIs** (important) :
   - `https://<project-ref>.supabase.co/auth/v1/callback`
   - *(pas l’URL Next `/auth/callback` — Supabase fait le relais)*

### 2. Supabase Dashboard

1. **Authentication → Providers → Google** : Enable.
2. Coller **Client ID** et **Client Secret** Google.
3. S’assurer que les Redirect URLs (section URL Configuration) contiennent le callback app :
   - `<NEXT_PUBLIC_SITE_URL>/auth/callback`

### 3. Application

Le bouton **Continuer avec Google** appelle :

```ts
supabase.auth.signInWithOAuth({
  provider: "google",
  options: { redirectTo: getAuthCallbackUrl(redirect) },
});
```

Le code OAuth est échangé par la route existante `app/auth/callback/route.ts` (PKCE). Aucune nouvelle route n’est nécessaire.

Le trigger `handle_new_user` peuplere `full_name` via :

```sql
coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name')
```

## Configuration locale

```bash
cp .env.example .env.local
# Renseigner NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SITE_URL
npm install
npm run dev
```

Schémas SQL (ordre) :

1. `supabase/schema.sql`
2. `supabase/migrations/20260722_handle_new_user_google_name.sql` (si schéma déjà déployé)
3. `supabase/schema-admin.sql`
4. `supabase/schema-phase2.sql`

## Routes auth

| Route | Rôle |
|-------|------|
| `/auth/signup` | Inscription |
| `/auth/login` | Connexion |
| `/auth/check-email` | Post-inscription (confirmation email) |
| `/auth/callback` | Échange code (email confirm + OAuth Google) |
| `/auth/forgot-password` | Demande reset |
| `/auth/reset-password` | Nouveau mot de passe |
| `/auth/signout` | Déconnexion (POST) |
| `/dashboard` | Espace apprenant (protégé) |

## Messages d’erreur (UI)

`lib/auth/errors.ts` mappe les codes / messages Supabase fréquents en français :

- email déjà utilisé
- confirmation email requise
- envoi email échoué (SMTP)
- inscriptions désactivées
- mot de passe faible / rate limit

Les logs serveur n’incluent **jamais** de token, mot de passe ou cookie.

## Tests

```bash
npm run test          # Vitest — unitaires + intégration
npm run test:e2e      # Playwright
npm run test:e2e:auth # Parcours auth uniquement
```

Parcours live (optionnel) : définir `E2E_AUTH_EMAIL` et `E2E_AUTH_PASSWORD` (compte de test dédié).

Proxy : `curl -sI http://localhost:3000/dashboard` → `307` vers `/auth/login` si non authentifié.

## Erreurs fréquentes

| Symptôme | Cause probable | Action |
|----------|----------------|--------|
| « Configuration Supabase requise » | Variables absentes ou placeholders | Configurer `.env.local` / Vercel + redéployer |
| « Impossible de créer le compte » après succès Auth | Ancien bug `ensureUserProfile` sans session | Corrigé — profil via trigger + callback |
| Lien email / Google invalide | Redirect URL non autorisée | Ajouter `/auth/callback**` |
| Google : provider disabled | Provider non activé dans Supabase | Activer Google + credentials |
| `/status` auth dégradé après env | Build stale | Redéployer sur Vercel |

## Observabilité

```
AUTH_SIGNUP_FAILED { provider: 'supabase', errorCode: '...' }
AUTH_LOGIN_FAILED { provider: 'supabase', errorCode: '...' }
AUTH_CALLBACK_FAILED { provider: 'supabase', errorCode: '...' }
AUTH_SIGNUP_PENDING_CONFIRMATION { provider: 'supabase' }
```
