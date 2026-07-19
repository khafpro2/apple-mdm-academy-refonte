# Routes réelles & adaptateurs Cursor ↔ Codex

## Routes (décision produit)

| Intention | Route réelle | Décision |
|---|---|---|
| Catalogue cours | `/cours` | Canonical |
| Ressources | `/resources` | Canonical (anglais, historique app) |
| Recherche | searchbox header (globale) | **Pas** de route `/recherche` |
| Dashboard | `/dashboard` | Authentifié (redirect si anonyme) |
| Examens | `/examens` | Canonical |
| Modules | `/cours` via redirect | Alias UX |

### Redirections (Phase 7)

| Alias | Cible | Décision |
|---|---|---|
| `/modules` | `/cours` | **Implémentée** (`next.config.ts`, permanent) |
| `/ressources` | `/resources` | **Implémentée** (`next.config.ts`, permanent) |
| `/recherche` | — | **Non créée** — recherche volontairement globale dans le header |

---

## Dépendance : moteur d’examens Codex

PR Codex : [#5](https://github.com/khafpro2/apple-mdm-academy-refonte/pull/5) — **fusionnée** dans `main` (`69dc2f4`).

### API publique (`lib/exams`)

```ts
getExamConfig(examId)
getExamOfficialFormat(examId)
getExamSimulationConfig(examId)
getExamAvailability(examId)
getExamDisplayMetadata(examId, availableCount?)
createExamAttempt(examId, mode)
scoreExamAttempt(attempt)
```

### Architecture UI (Phase 7) — props-only

```text
getExamDisplayMetadata (Codex)
        ↓
mapExamDisplayToPanelProps (Cursor mapper)
        ↓
ExamFormatPanels({ official?, simulation? })  ← props simples, null-safe
```

- **Panels** (`exam-format-panels.tsx`) : aucun import banque / scoring / timer
- **Mapper** (`map-exam-display-to-panels.ts`) : labels + passthrough uniquement
- **Disclaimer** : constante unique `EXAM_INDEPENDENCE_DISCLAIMER` dans `exam-independence.ts`
- **Temporaire** : `lib/exam/exam-config.ts` = re-exports legacy vers `@/lib/exams/exam-config`
  > Temporary integration layer. Replace with lib/exams public API after Codex merge.

### Classification des fichiers

Voir [`pr4-file-classification.md`](./pr4-file-classification.md).

Règle : **Codex = source de vérité examens** · **Cursor = shells UI / pages / tests UI / leçon pilote**.

---

## Lockfile (PR #4)

1. `@playwright/test@^1.52.0` (dev) pour les specs E2E
2. Sync lock avec `package.json` pinné sur `main`
