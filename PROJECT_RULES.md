# PROJECT_RULES — Apple MDM Academy

Règles de travail pour Cursor, Codex et validation humaine.

## Branches

| Agent | Préfixe | Merge |
|-------|---------|-------|
| Cursor | `cursor/<tache>` | Après validation humaine |
| Codex | `codex/<tache>` | Après validation humaine |
| Main | — | Version validée uniquement |

**Aucun agent ne commit directement sur `main`.**

## Cursor — périmètre autorisé

- `app/`, `components/`, contenu pédagogique
- UI, UX, dashboard, admin, LMS, responsive
- `src/lib/content/`, `src/lib/courses/`, `src/lib/resources/`
- `src/lib/video-lessons.ts`, `src/lib/video-storyboards.ts`

## Cursor — interdit

- `scripts/`, pipeline vidéo, validations MP4
- `src/lib/video-display-status.ts`, `video-publish-status.ts`, `video-production.ts`
- `supabase/`, SQL, `.env*`, `lib/env.ts`

## Codex — périmètre autorisé

- `scripts/`, tests, lint, build, refactoring ciblé
- `src/lib/video-display-status.ts`, `video-publish-status.ts`, `video-production.ts`

## Livraison obligatoire

```bash
npm run lint
npm run build
git push origin <branche>
```

Ne pas merger si lint ou build échoue.

## Priorités actuelles

1. Stabiliser pipeline vidéo (Codex)
2. Améliorer cours existants (Cursor)
3. Vidéo pilote ABM (humain)
4. Valider publication MP4
5. Répéter sur les 7 vidéos restantes

Voir aussi : `.cursor/rules/cursor-codex-coordination.mdc`
