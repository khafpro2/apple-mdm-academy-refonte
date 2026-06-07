# PROJECT_RULES.md

## Rôles

Cursor gère :
- UI / UX
- pages Next.js
- composants React
- dashboard
- admin
- cours
- labs
- quiz
- ressources
- navigation
- responsive

Codex gère :
- scripts
- tests
- TypeScript
- lint/build fixes
- validation MP4
- validation captures
- refactoring technique ciblé
- sécurité
- performances

## Branches

Cursor travaille sur :
cursor/<nom-tache>

Codex travaille sur :
codex/<nom-tache>

Ne jamais travailler directement sur main sauf merge validé.

## Fichiers sensibles interdits

Ne jamais committer :
- .env
- .env.local
- clés API
- tokens
- service role keys
- captures avec emails, noms, serial numbers, tenant IDs non floutés

## Commandes obligatoires avant commit

npm run lint
npm run build

Pour vidéo :

npm run check:screenshots
npm run check:mp4

## Règles commit

Chaque tâche doit finir par :

git status
git add .
git commit -m "message clair"
git push origin <branche>

## Merge dans main

Avant merge :
- pull main
- résoudre conflits
- npm run lint
- npm run build
- tester les pages concernées

## Médias

Les MP4 et captures sont produits manuellement.
Ne pas bloquer le site public si les médias sont absents.
Afficher le mode démo vidéo.
