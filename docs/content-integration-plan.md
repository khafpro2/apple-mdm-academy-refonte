# Plan d’intégration des brouillons Claude → catalogue V1

## État au 2026-07-19

Le dossier `docs/content-drafts/**` **n’est pas présent** dans ce dépôt au moment de la Phase 4. Aucune migration massive n’a donc été effectuée. Les Markdown Claude doivent rester la source éditoriale tant qu’ils n’ont pas été revus.

## Architecture cible (déjà amorcée)

```text
lib/data/lessons/
  types.ts                 # métadonnées + statut éditorial
  registry.ts              # export central getModularLesson()
  apple/
    index.ts
    macos-filevault.ts     # leçon pilote
  jamf/
    index.ts               # vide — prêt pour imports Claude
  intune/
    index.ts               # vide — prêt pour imports Claude
```

Chaque leçon (ou petit groupe cohérent) expose :

| Champ | Rôle |
|---|---|
| `meta.slug` | slug stable (URL) |
| `meta.courseSlug` | rattachement catalogue |
| `meta.family` | `apple` \| `jamf` \| `intune` |
| `meta.editorialStatus` | `draft` → `pilot` → `reviewed` → `published` |
| `meta.platforms` / versions / sources | compatibilité (affichage conditionnel) |
| `content` | `LessonContent` (objectifs, théorie, étapes, quiz local optionnel) |
| `meta.draftSourcePath` | pointeur vers le Markdown Claude (ne pas supprimer) |

`getLessonContent()` consulte d’abord `getModularLesson()` puis retombe sur le générateur existant.

## Ordre d’intégration recommandé

1. **Inventaire** des 34 brouillons → mapping `draft → courseSlug/lessonSlug`.
2. **Terminologie** fichier par fichier (Managed Apple Account, Entra ID, Automated Device Enrollment ; **pas** de rename global « Apple Business »).
3. **Lots de 3–5 leçons** par PR, famille Apple d’abord.
4. **Leçons pilotes suivantes** après FileVault : `architecture-ios`, `shared-ipad-deploy`.
5. **Sources officielles** uniquement avec `checkedAt` réel.
6. **Quiz locaux** après validation éditoriale — ne pas écraser les pools d’examens Codex.

## Ce qui n’est pas dans ce chantier

- Moteur d’examens / chronomètre / scoring / modes entraînement-simulation (Codex).
- `platform-versions` avancé / `audit:versions` enrichi (Codex).
- Copie des 34 brouillons dans les fichiers centraux.

## Leçon pilote livrée

- Slug : `filevault-chiffrement`
- Cours : `apple-fundamentals`
- Fichier : `lib/data/lessons/apple/macos-filevault.ts`
- UI : `LessonCompatibilityShell` sous le titre (null-safe)

## Ordre d’intégration post-Codex

1. Fusion PR Codex #5 (moteur examens) — par le responsable, pas Cursor.
2. Rebase PR Cursor #4 → brancher shells sur `getExamDisplayMetadata`.
3. Fusion PR #4.
4. **Lot Claude suivant** : pilote FileVault (comparer brouillon Claude vs `macos-filevault.ts`), max 5–10 leçons / PR.

Voir aussi : `docs/integration/routes-and-adapters.md`.
