# Apple MDM Academy — Refonte

Plateforme professionnelle de formation **Apple MDM, Jamf Pro et Microsoft Intune** en français.

## Stack

- **Next.js** (App Router)
- **Tailwind CSS v4**
- **TypeScript**
- **Supabase Auth** (sessions, profils, progression)
- **Vercel** (déploiement)

## Configuration Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Copiez `.env.example` → `.env.local`
3. Renseignez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Settings → API)
4. Exécutez `supabase/schema.sql` puis `supabase/schema-admin.sql` dans le SQL Editor
5. Auth → URL Configuration : ajoutez `http://localhost:3000/auth/callback` (et votre URL Vercel en prod)

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Accueil premium |
| `/parcours` | Liste des 7 parcours |
| `/parcours/[slug]` | Détail parcours |
| `/cours/[slug]` | Cours avec modules et leçons |
| `/cours/[slug]/[lessonSlug]` | Leçon individuelle |
| `/quiz` | Quiz & examens blancs |
| `/quiz/[slug]` | Quiz interactif avec score |
| `/labs` | Labs pratiques |
| `/labs/[slug]` | Détail lab |
| `/auth/login` | Connexion |
| `/auth/signup` | Inscription |
| `/dashboard` | Dashboard (protégé si Supabase configuré) |
| `/tarifs` | Plans tarifaires |
| `/admin` | Tableau de bord admin (stats apprenants) |

## Parcours

- Apple Fundamentals
- Apple Device Support
- Apple IT Professional
- Jamf 100 / 170 / 200
- Microsoft Intune pour Mac

## Structure

```
app/           → Pages Next.js
components/    → UI, layout, cards, quiz engine
lib/data/      → Données TypeScript (tracks, courses, quizzes, labs, pricing)
lib/types.ts   → Types partagés
```

## Fonctionnalités

- Quiz fonctionnel avec score automatique et corrections
- **Sauvegarde Supabase** : résultats quiz, progression par parcours, badges
- **Certificats PDF** téléchargeables après réussite d'un quiz
- **Espace admin** : stats apprenants, résultats quiz, progression
- Labs pratiques guidés
- Design premium style Apple

## Déploiement Vercel

```bash
# Lier le projet (première fois)
npx vercel link

# Ajouter les variables d'environnement sur Vercel
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add NEXT_PUBLIC_SITE_URL

# Déployer
npm run build
npx vercel --prod
```

Dans Supabase Auth → URL Configuration, ajoutez :
- `https://votre-domaine.vercel.app/auth/callback`

## Prochaines étapes

- [x] Supabase Auth
- [x] Sauvegarde progression quiz en base
- [x] Certificats PDF
- [x] Espace admin
