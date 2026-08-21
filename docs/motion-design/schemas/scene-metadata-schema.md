# Schéma — Métadonnées de scène

> Contrat documentaire pour les packs `docs/motion-design/production/<slug>/` et alignement avec le registre runtime.
> Les champs **obligatoires minimum** sont listés ci-dessous. Les autres sont facultatifs.

---

## Champs obligatoires (minimum)

| Champ | Type | Format / valeurs | Exemple valide | Exemple invalide |
|-------|------|------------------|----------------|------------------|
| `id` | `string` | Préfixe recommandé `scene-` + slug kebab ; unique | `scene-filevault` | `FileVault`, `scene filevault` |
| `slug` | `string` | kebab-case `[a-z0-9-]+` | `filevault` | `FileVault`, `file vault` |
| `title` | `string` | Titre humain non vide | `Sécuriser macOS avec FileVault` | `""` |
| `version` | `string` | Semver documentaire `MAJOR.MINOR.PATCH` (+ suffixe optionnel) | `1.0.0`, `1.0.0-pilot` | `v1`, `latest` |
| `status` | `enum` | `draft` \| `needs-technical-review` \| `brief-ready` \| `assets-in-production` \| `animation-in-production` \| `review` \| `approved` \| `published` \| `deprecated` \| `blocked` | `brief-ready` | `wip`, `final` |
| `durationSeconds` | `number` | Entier > 0 | `45` | `0`, `-1`, `"45s"` |
| `objective` | `string` \| `string[]` | Au moins un objectif non vide | `"Expliquer le chiffrement au repos"` | `[]`, `""` |
| `mainMessage` | `string` | Message principal unique | `"Le volume est chiffré au repos."` | `""` |
| `courseIds` | `string[]` | ≥ 1 slug cours | `["apple-it-professional"]` | `[]`, `["Apple IT"]` |
| `assetIds` | `string[]` | IDs assets (convention naming) ; peut être `[]` uniquement si statut ≤ `brief-ready` et justifié | `["device-laptop-isometric-neutral-base-v1"]` | `["final"]`, `["asset1"]` |
| `accessibilityStatus` | `enum` | `draft` \| `reviewed` \| `pass` \| `fail` \| `not-started` | `draft` | `ok`, `done` |
| `technicalReviewStatus` | `enum` | `not-started` \| `pending` \| `pass` \| `fail` \| `blocked` | `pending` | `todo` |
| `mediaStatus` | `enum` | `planned` \| `recording` \| `editing` \| `ready` \| `published` \| `missing` \| `deprecated` | `missing` | `final`, `almost` |

---

## Champs facultatifs

| Champ | Type | Format / valeurs | Exemple valide | Exemple invalide |
|-------|------|------------------|----------------|------------------|
| `module` | `string` | Texte libre court | `FileVault` | — |
| `level` | `string` | `Débutant` \| `Intermédiaire` \| `Avancé` (ou équivalent documenté) | `Avancé` | — |
| `labSlug` | `string` | kebab-case | `macos-security` | `MacOS Security` |
| `quizSlug` | `string` | kebab-case | `examen-apple-it-pro` | — |
| `author` | `string` | Nom ou handle | `kthiam` | — |
| `createdAt` | `string` | ISO-8601 date `YYYY-MM-DD` | `2026-07-21` | `21/07/2026` |
| `validatedAt` | `string` \| `null` | ISO-8601 ou absent | `2026-07-30` | `soon` |
| `formats` | `string[]` | Ratios | `["16:9","9:16"]` | `["widescreen"]` |
| `exportFormats` | `string[]` | `mp4`, `webm`, `webp`, `vtt`, … | `["mp4","webm","vtt"]` | `["final-cut"]` |
| `prerequisites` | `string[]` | Liste libre | `["Comprendre MDM"]` | — |
| `simplifications` | `string[]` | Liste documentée | `["Ommettre le détail XTS-AES"]` | — |
| `confusionRisks` | `string[]` | Liste | `["Confondre mot de passe et clé"]` | — |
| `requiredSources` | `string[]` | URLs / refs **réelles** uniquement | `[À VÉRIFIER — SOURCE OFFICIELLE REQUISE]` si inconnu | URL inventée |
| `notes` | `string` | Libre | `Scène pilote` | — |
| `narrationLocale` | `string` | BCP-47 | `fr-FR` | `french` |
| `posterPath` | `string` | Chemin public commençant par `/` **uniquement si fichier existant** | `/media/motion/filevault/poster.webp` | chemin inventé |
| `mp4Path` | `string` | Idem | — | chemin si fichier absent |
| `vttPath` | `string` | Idem ; pattern `*.<lang>.vtt` | `/media/motion/filevault/filevault.fr.vtt` | `subtitles.vtt` sans langue |

---

## Règles transverses

1. Aucun champ obligatoire ne peut être une chaîne vide : utiliser un marqueur documentaire dans le pack MD si la valeur n’est pas encore connue.
2. `status: published` implique `mediaStatus` ∈ {`ready`,`published`} et chemins médias réels.
3. `approved` ≠ `published` (voir `guides/scene-status-lifecycle.md`).
4. Ne jamais inventer de sources officielles.
