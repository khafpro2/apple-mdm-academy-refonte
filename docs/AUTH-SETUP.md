# Authentification — Apple MDM Academy

## Fournisseur

**Supabase Auth** (email + mot de passe) via `@supabase/ssr` et Next.js App Router.

- Inscription / connexion : Server Actions (`app/actions/auth.ts`)
- Session : cookies HTTP-only gérés par `@supabase/ssr`
- Middleware : `proxy.ts` → `lib/supabase/middleware.ts`

## Variables d'environnement

Copier `.env.example` vers `.env.local` en local. **Ne jamais committer de secrets.**

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Oui | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Oui | Clé anon publique |
| `NEXT_PUBLIC_SITE_URL` | Recommandé | URL publique du site (prod / preview) |
| `SUPABASE_SERVICE_ROLE_KEY` | Non | Admin / démo uniquement côté serveur |
| `ADMIN_EMAILS` | Non | Emails autorisés sur `/admin` |

> **Important Vercel** : les variables `NEXT_PUBLIC_*` sont injectées **au build**. Après modification dans Vercel, **redéployer**.

## URLs de redirection Supabase

Dans **Supabase → Authentication → URL Configuration** :

1. **Site URL** : `https://votre-domaine.vercel.app` (ou domaine custom)
2. **Redirect URLs** (ajouter toutes les variantes utilisées) :
   - `http://localhost:3000/auth/callback**`
   - `https://votre-domaine.vercel.app/auth/callback**`
   - `https://*.vercel.app/auth/callback**` (previews)

Le callback applicatif est toujours `/auth/callback` (avec paramètre `redirect` optionnel).

## Configuration locale

```bash
cp .env.example .env.local
# Renseigner NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

Exécuter aussi les schémas SQL dans l'ordre :

1. `supabase/schema.sql`
2. `supabase/schema-admin.sql`
3. `supabase/schema-phase2.sql` (progression, badges)

## Configuration Vercel

1. **Project Settings → Environment Variables** : ajouter les variables pour Production **et** Preview.
2. Redéployer après toute modification de `NEXT_PUBLIC_*`.
3. Vérifier `/status` (auth « Opérationnel ») et `/admin/supabase-diagnostics` (admins).

### Confirmation email

- **Activée** (recommandé prod) : après inscription → `/auth/check-email`, l'utilisateur clique le lien → `/auth/callback` → dashboard.
- **Désactivée** (dev) : session immédiate → redirection directe vers `/dashboard`.

## Routes auth

| Route | Rôle |
|-------|------|
| `/auth/signup` | Inscription |
| `/auth/login` | Connexion |
| `/auth/check-email` | Post-inscription (confirmation email) |
| `/auth/callback` | Échange code OAuth / confirmation email |
| `/auth/forgot-password` | Demande reset |
| `/auth/reset-password` | Nouveau mot de passe |
| `/auth/signout` | Déconnexion (POST) |
| `/dashboard` | Espace apprenant (protégé) |

## Procédure de test manuelle

1. **Nouvel utilisateur** : `/auth/signup` → remplir le formulaire → compte créé → dashboard ou page check-email.
2. **Email existant** : message d'erreur explicite, formulaire réutilisable.
3. **Mot de passe faible** : validation avant soumission.
4. **Non connecté + `/dashboard`** : redirection vers `/auth/login?redirect=/dashboard`.
5. **Connecté + `/auth/signup`** : redirection vers dashboard.
6. **Déconnexion** : bouton header → session supprimée → dashboard inaccessible.

## Erreurs fréquentes

| Symptôme | Cause probable | Action |
|----------|----------------|--------|
| « Configuration Supabase requise » | Variables absentes ou placeholders | Configurer `.env.local` / Vercel + redéployer |
| Inscription sans erreur mais pas de compte | Email déjà utilisé (identities vides) | Corrigé — message explicite |
| Lien email invalide | Redirect URL non autorisée dans Supabase | Ajouter `/auth/callback**` |
| Session absente après confirmation | Callback ou cookies bloqués | Vérifier `/auth/callback`, domaine, HTTPS |
| `/status` auth dégradé après changement env | Build stale | Redéployer sur Vercel |

## Observabilité

Les échecs auth serveur journalisent des codes sans données sensibles :

```
AUTH_SIGNUP_FAILED { provider: 'supabase', errorCode: '...' }
AUTH_LOGIN_FAILED { provider: 'supabase', errorCode: '...' }
AUTH_CALLBACK_FAILED { provider: 'supabase', errorCode: '...' }
```

Ne jamais logger : mot de passe, tokens, cookies complets.
