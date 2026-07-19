# Routes réelles & adaptateurs Cursor ↔ Codex

## Routes (décision produit)

| Intention | Route réelle | Décision |
|---|---|---|
| Catalogue cours | `/cours` | Canonical |
| Ressources | `/resources` | Canonical (anglais, historique app) |
| Recherche | searchbox header (globale) | **Pas** de route `/recherche` |
| Dashboard | `/dashboard` | Authentifié (redirect si anonyme) |
| Examens | `/examens` | Canonical |
| Modules | n/a | Contenu via `/cours` |

### Redirections évaluées (non implémentées dans cette PR)

| Alias | Cible | Décision |
|---|---|---|
| `/ressources` | `/resources` | **Reportée** — utile UX, mais non urgente ; créer via `next.config` redirects si produit valide |
| `/modules` | `/cours` | **Reportée** — même motif |
| `/recherche` | — | **Non créée** — recherche volontairement globale dans le header |

Ne pas ajouter d’alias uniquement pour masquer des 404 sans décision produit.

---

## Dépendance : moteur d’examens Codex

PR Codex : [#5](https://github.com/khafpro2/apple-mdm-academy-refonte/pull/5) — **fusionnée** dans `main` (`69dc2f4`, squash de `05b5031`).

### API publique attendue (`lib/exams`)

```ts
getExamConfig(examId)
getExamOfficialFormat(examId)
getExamSimulationConfig(examId)
getExamAvailability(examId)
getExamDisplayMetadata(examId)  // ← shell Cursor
createExamAttempt(examId, mode)
scoreExamAttempt(attempt)
```

`getExamDisplayMetadata` expose notamment :

- `officialPanel` / `simulationPanel` / `disclaimer`
- `official.verificationStatus`: `official-verified` | `official-partial` | `needs-review` | `internal`
- banques incomplètes via `simulation.bankStatus` + `warning`

### Adaptateur UI (post-rebase)

- **Supprimé** : `lib/exam/exam-metadata.ts` (plus de seconde source de vérité)
- **Utilisé** : `getExamDisplayMetadata` depuis `@/lib/exams/ui-metadata-adapter`
- `lib/exam/exam-config.ts` = re-exports compat uniquement vers `@/lib/exams/exam-config`
- Shells Cursor : layout / a11y / responsive — pas de recalcul métier

### Conflits connus (test Codex)

- `components/exams/exam-format-panels.tsx`
- `components/exams/exam-page-shell.tsx`
- `lib/data/quizzes.ts`
- `lib/exam/exam-config.ts`

Règle : **Codex = source de vérité examens** · **Cursor = shells UI / pages / tests UI / leçon pilote**.

---

## Lockfile (PR #4)

Changement documenté :

1. Ajout **`@playwright/test@^1.52.0`** (dev) — requis par `import { test } from "@playwright/test"` dans les specs E2E ; `playwright` seul ne fournit pas ce package.
2. Resynchronisation du lock avec `package.json` déjà pinné sur `main` (`@types/node@^22`, etc.) — corrige l’échec `npm ci` (lock avait encore `@types/node@25`).

Aucune dépendance runtime ajoutée.
