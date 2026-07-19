# Classification des fichiers — PR #4 (Phase 7)

État : rebasée sur Codex (`69dc2f4`). Nettoyage UI props-only.

## 1. Shell UI à conserver

| Fichier | Rôle |
|---|---|
| `components/exams/exam-format-panels.tsx` | Panels présentational (props simples, null-safe) |
| `components/exams/exam-page-shell.tsx` | Shell page + mapping Codex → props |
| `components/exams/map-exam-display-to-panels.ts` | Mapper pur (pas de métier) |
| `components/exams/exam-prep-disclaimer.tsx` | Bannière + disclaimer centralisé |
| `components/exams/exam-independence.ts` | Constante disclaimer unique |
| `components/course/LessonCompatibilityShell.tsx` | Shell cours / versions |
| `app/cours/.../page.tsx` | Placement shell leçon |
| `lib/data/lessons/**` | Architecture + pilote FileVault |
| `tests/e2e/v1-scope-integration.spec.ts` | Tests UI shell |
| `docs/content-integration-plan.md` | Plan Claude |
| `docs/integration/routes-and-adapters.md` | Routes / adaptateurs |

## 2. Métadonnées temporaires (minces / à retirer progressivement)

| Fichier | État |
|---|---|
| `lib/exam/exam-metadata.ts` | **Supprimé** (Phase 6) |
| `lib/exam/exam-config.ts` | Re-exports legacy uniquement → `@/lib/exams/exam-config` |

## 3. Terminologie

| Fichier | Changement |
|---|---|
| `lib/data/commercial-certification-paths.ts` | Managed Apple Account |
| `lib/data/quizzes.ts` | Managed Apple Account (chiffres Codex conservés) |
| `lib/data/courses.ts` | Titre leçon Managed Apple Account |

## 4. Hors métier / outillage

| Fichier | Note |
|---|---|
| `package.json` / `package-lock.json` | `@playwright/test` + sync lock |
| `playwright.config.ts` | `PLAYWRIGHT_BASE_URL` |
| `lib/navigation/sidebar-config.ts` | Libellés parcours Apple/Jamf/Intune |
| `next.config.ts` | Redirects `/modules`→`/cours`, `/ressources`→`/resources` |

## Règle

- Cursor : UI, a11y, responsive, tests shell, terminologie, FileVault
- Codex : `lib/exams/*`, timer, scoring, banques, formats
