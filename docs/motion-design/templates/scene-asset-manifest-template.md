# Template — Manifeste d’assets de scène

> Copier vers `docs/motion-design/production/<slug>/asset-manifest.md`.
> Marqueurs : `[À RENSEIGNER]` · `[À VÉRIFIER — SOURCE OFFICIELLE REQUISE]` · `[NON APPLICABLE]`
> Convention de nommage : `category-subject-view-state-variant-version` — voir `guides/asset-naming-conventions.md`.
> Alignement schéma : `schemas/asset-metadata-schema.md`.

---

## En-tête

| Champ | Valeur |
|-------|--------|
| Identifiant scène | `[À RENSEIGNER]` |
| Slug | `[À RENSEIGNER]` |
| Version manifeste | `[À RENSEIGNER]` |
| Date | `[À RENSEIGNER]` |

## États autorisés

`missing` | `brief-ready` | `generated` | `selected` | `retouch-required` | `review` | `approved` | `deprecated`

> **Règle chemin final** : le champ `chemin final` / `path` reste **vide ou absent** tant que le fichier n’existe pas sur disque. Ne jamais inventer un chemin.

---

## Fiche asset (répéter pour chaque asset)

### Asset — `[À RENSEIGNER]`

| Champ | Valeur |
|-------|--------|
| Identifiant | `[À RENSEIGNER]` (`category-subject-view-state-variant-version`) |
| Catégorie | `[À RENSEIGNER]` |
| Fonction | `[À RENSEIGNER]` |
| Description | `[À RENSEIGNER]` |
| État | `[À RENSEIGNER]` (état autorisé ci-dessus) |
| Format attendu | `[À RENSEIGNER]` (ex. `png`, `svg`, `webp`) |
| Dimensions | `[À RENSEIGNER]` (ex. `1920×1080`) |
| Ratio | `[À RENSEIGNER]` (ex. `16:9`, `1:1`) |
| Transparence | `[À RENSEIGNER]` (`oui` / `non`) |
| Variantes | `[À RENSEIGNER]` ou `[NON APPLICABLE]` |
| Animation possible | `[À RENSEIGNER]` (`oui` / `non` + précision) |
| Texte alternatif | `[À RENSEIGNER]` |
| Scène principale | `[À RENSEIGNER]` (`sceneIds[0]` ou slug) |
| Scènes réutilisables | `[À RENSEIGNER]` ou `[NON APPLICABLE]` → `sceneIds` |
| Dépendances | `[À RENSEIGNER]` ou `[NON APPLICABLE]` |
| Chemin final | _(laisser vide si fichier absent)_ |
| Version | `[À RENSEIGNER]` (ex. `v1`) |
| Approbation | `[À RENSEIGNER]` (`pending` / `approved` / `rejected` + date + approbateur) |
| Source | `[À RENSEIGNER]` ou `[À VÉRIFIER — SOURCE OFFICIELLE REQUISE]` |

---

## Inventaire rapide

| ID | Catégorie | État | Ratio | Chemin final | Approbation |
|----|-----------|------|-------|--------------|-------------|
| `[À RENSEIGNER]` | `[À RENSEIGNER]` | `[À RENSEIGNER]` | `[À RENSEIGNER]` | _(vide si fichier absent)_ | `[À RENSEIGNER]` |
