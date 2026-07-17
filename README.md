# Apple MDM Academy — Refonte

Plateforme de formation **indépendante** en français sur Apple MDM, Jamf Pro et Microsoft Intune.

> Cette plateforme n’est **pas** officielle et n’est **pas** affiliée à Apple, Jamf ou Microsoft.

## Stack

- Next.js (App Router)
- Tailwind CSS v4
- TypeScript
- Supabase Auth (sessions, profils, progression)
- Vercel (déploiement)

## Périmètre V1

### Contenus couverts

- Apple MDM / Apple Business Manager / ADE / APNs
- Jamf Pro (parcours 100 / 200 et modules associés)
- Microsoft Intune pour Apple (macOS / iOS)
- Labs pratiques, quiz, examens blancs, dashboard apprenant

### Hors périmètre (masqués ou secondaires)

- Certaines routes admin / pipeline vidéo / outils internes
- Contenus encore en préparation (fallback « Contenu en préparation »)
- Sync progression serveur si schéma Supabase incomplet (fallback localStorage)

Les contenus hors scope sont **conservés** dans le dépôt ; ils ne sont simplement pas mis en avant dans la navigation principale.

## Structure des parcours

| Zone | Route |
|------|--------|
| Accueil | `/` |
| Catalogue parcours | `/parcours` |
| Cours / leçons | `/cours`, `/cours/[slug]`, `/cours/[slug]/[lessonSlug]` |
| Examens blancs | `/examens`, `/examens/[slug]` |
| Quiz | `/quiz`, `/quiz/[slug]` |
| Labs | `/labs`, `/labs/[slug]` |
| Certifications | `/certifications` |
| Ressources | `/resources` |
| Vidéos | `/videos` |
| Dashboard | `/dashboard` |
| Tarifs | `/pricing` (alias `/tarifs`) |

> Note : il n’existe pas de routes `/modules` ni `/ressources` (FR) — utiliser `/cours` et `/resources`.

## Logo et assets

- Logo / icônes UI : `components/ui/logo-icon.tsx`, `public/logos/`
- Wordmark sidebar : `components/ui/site-wordmark.tsx`
- Open Graph : `/opengraph-image`
- Mentions légales marques : `components/brands/BrandLegalNotices.tsx`

## Configuration Supabase

1. Exécuter dans l’ordre : `supabase/schema.sql`, puis `supabase/schema-admin.sql`
2. Auth → URL Configuration :
   - Site URL : URL publique du site
   - Redirect : `{SITE_URL}/auth/callback` et `http://localhost:3000/auth/callback`
3. Variables (voir `.env.example`) :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `ADMIN_EMAILS` (optionnel)

## Commandes locales

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build
node scripts/check-internal-links.mjs   # audit liens internes (si présent)
```

Compte démo (si provisionné) : voir `lib/demo/constants.ts` et bouton « Connexion démo » sur `/auth/login`.

## Vérification locale (checklist)

1. `npm run lint` → 0 erreur
2. `npx tsc --noEmit` → OK
3. `npm run build` → OK
4. Smoke manuel : `/`, `/parcours`, `/dashboard`, `/examens`, `/cours`, `/resources`, `/certifications`
5. Mobile ~375 px : menu hamburger, pas de scroll horizontal, CTA visibles
6. Clavier : Tab + focus visible + Escape ferme la sidebar mobile

## Checklist avant déploiement

- [ ] Variables d’environnement Vercel à jour
- [ ] Redirect Auth Supabase alignés sur le domaine prod
- [ ] `npm run build` vert
- [ ] Pas de secrets dans le commit (`.env`, clés service role)
- [ ] Mentions « non affilié » présentes (footer / docs)
- [ ] Liens sidebar / footer vérifiés

## Limites connues V1

- Progression peut rester en localStorage si Supabase n’est pas synchronisé
- Certaines vidéos / captures peuvent être en mode préparation
- Pages admin protégées (`requireAdmin`)
- Bundle admin lourd — exclusions tracing Vercel déjà en place sur `main`

## Déploiement

```bash
npx vercel link   # première fois
npm run build
# Déploiement via CI / Vercel Git integration recommandé
```

Ne jamais committer `.env`, `.env.local`, ni clés API.
