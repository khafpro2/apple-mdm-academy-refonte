# Routes réelles & adaptateurs Cursor ↔ Codex

## Routes

| Intention | Route | Décision |
|---|---|---|
| Cours | `/cours` | Canonical |
| Ressources | `/resources` | Canonical |
| Examens | `/examens` | Canonical |
| Recherche | header searchbox | Pas de `/recherche` |
| Dashboard | `/dashboard` | Protégé |

### Redirects

| Alias | Cible |
|---|---|
| `/modules` | `/cours` |
| `/ressources` | `/resources` |

---

## Intégration moteur Codex (Phase 8)

PR Codex [#5](https://github.com/khafpro2/apple-mdm-academy-refonte/pull/5) fusionnée (`69dc2f4`).

### Source de vérité

`lib/exams/*`

### API consommée par le shell

```ts
getExamAvailability(examId)
getExamDisplayMetadata(examId, availableCount?)
// → metadata.officialPanel
// → metadata.simulationPanel
// → metadata.disclaimer
```

### Shell Cursor

- `ExamPageShell` → `getExamDisplayMetadata`
- `ExamFormatPanels` → types Codex `ExamCursorOfficialPanel` / `ExamCursorSimulationPanel`
- Pas de registre `lib/exam/exam-metadata.ts`
- Pas de `lib/exam/exam-config.ts` (supprimé) — imports → `@/lib/exams/exam-config`
- Tiers de score UI : `components/exams/score-tiers.ts` (présentation uniquement)

### Responsabilités

| Cursor | Codex |
|---|---|
| UI, a11y, responsive, shells, FileVault, tests UI | moteur, timer, scoring, formats, audits, banques |
