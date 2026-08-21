# Template — Checklist qualité de scène

> Copier vers `docs/motion-design/production/<slug>/quality-checklist.md`.
> Marqueurs : `[À RENSEIGNER]` · `[À VÉRIFIER — SOURCE OFFICIELLE REQUISE]` · `[NON APPLICABLE]`
> Chaque critère : **PASS** | **FAIL** | **NOT TESTED** | **NOT APPLICABLE**

---

## En-tête

| Champ | Valeur |
|-------|--------|
| Identifiant scène | `[À RENSEIGNER]` |
| Version testée | `[À RENSEIGNER]` |
| Testeur | `[À RENSEIGNER]` |
| Date | `[À RENSEIGNER]` |

Légende statut critère : `PASS` · `FAIL` · `NOT TESTED` · `NOT APPLICABLE`

---

## 1. Exactitude technique

| # | Critère | Statut | Notes |
|---|---------|--------|-------|
| 1.1 | Faits techniques sourcés / vérifiés | `NOT TESTED` | `[À VÉRIFIER — SOURCE OFFICIELLE REQUISE]` |
| 1.2 | Aucune citation fictive | `NOT TESTED` | `[À RENSEIGNER]` |
| 1.3 | Simplifications documentées dans le brief | `NOT TESTED` | `[À RENSEIGNER]` |
| 1.4 | Risques de confusion traités | `NOT TESTED` | `[À RENSEIGNER]` |

## 2. Cohérence pédagogique

| # | Critère | Statut | Notes |
|---|---------|--------|-------|
| 2.1 | Objectif pédagogique atteint | `NOT TESTED` | `[À RENSEIGNER]` |
| 2.2 | Message principal unique et clair | `NOT TESTED` | `[À RENSEIGNER]` |
| 2.3 | Alignement cours / leçons / lab | `NOT TESTED` | `[À RENSEIGNER]` |
| 2.4 | Prérequis respectés | `NOT TESTED` | `[À RENSEIGNER]` ou `NOT APPLICABLE` |

## 3. Cohérence visuelle

| # | Critère | Statut | Notes |
|---|---------|--------|-------|
| 3.1 | Palette / tokens respectés | `NOT TESTED` | `[À RENSEIGNER]` |
| 3.2 | Style d’illustration cohérent inter-plans | `NOT TESTED` | `[À RENSEIGNER]` |
| 3.3 | Nommage assets conforme (6 segments) | `NOT TESTED` | `[À RENSEIGNER]` |
| 3.4 | Manifeste synchronisé avec shot-list | `NOT TESTED` | `[À RENSEIGNER]` |

## 4. Marques et propriété intellectuelle

| # | Critère | Statut | Notes |
|---|---------|--------|-------|
| 4.1 | Aucun logo non autorisé | `NOT TESTED` | `[À RENSEIGNER]` |
| 4.2 | Aucune interface réelle non autorisée | `NOT TESTED` | `[À RENSEIGNER]` |
| 4.3 | Mentions légales si marques officielles | `NOT TESTED` | `[À RENSEIGNER]` ou `NOT APPLICABLE` |
| 4.4 | Prompts Firefly sans texte / secrets générés | `NOT TESTED` | `[À RENSEIGNER]` |

## 5. Animation

| # | Critère | Statut | Notes |
|---|---------|--------|-------|
| 5.1 | Timing aligné shot-list | `NOT TESTED` | `[À RENSEIGNER]` |
| 5.2 | Transitions lisibles | `NOT TESTED` | `[À RENSEIGNER]` |
| 5.3 | Alternative reduced motion définie | `NOT TESTED` | `[À RENSEIGNER]` |
| 5.4 | Pas de flash > 3/s | `NOT TESTED` | `[À RENSEIGNER]` |

## 6. Audio

| # | Critère | Statut | Notes |
|---|---------|--------|-------|
| 6.1 | Narration tient dans la durée | `NOT TESTED` | `[À RENSEIGNER]` |
| 6.2 | Niveau / clarté acceptables | `NOT TESTED` | `[À RENSEIGNER]` |
| 6.3 | Prononciations respectées | `NOT TESTED` | `[À RENSEIGNER]` ou `NOT APPLICABLE` |
| 6.4 | Pas de conflit musique / voix | `NOT TESTED` | `[À RENSEIGNER]` ou `NOT APPLICABLE` |

## 7. Sous-titres

| # | Critère | Statut | Notes |
|---|---------|--------|-------|
| 7.1 | Fichier WebVTT valide (`WEBVTT`) | `NOT TESTED` | `[À RENSEIGNER]` |
| 7.2 | Timecodes `HH:MM:SS.mmm` croissants | `NOT TESTED` | `[À RENSEIGNER]` |
| 7.3 | ≤ 2 lignes par cue | `NOT TESTED` | `[À RENSEIGNER]` |
| 7.4 | Alignement narration | `NOT TESTED` | `[À RENSEIGNER]` |

## 8. Accessibilité

| # | Critère | Statut | Notes |
|---|---------|--------|-------|
| 8.1 | Alt texts présents | `NOT TESTED` | `[À RENSEIGNER]` |
| 8.2 | Description longue | `NOT TESTED` | `[À RENSEIGNER]` |
| 8.3 | Contraste WCAG AA | `NOT TESTED` | `[À RENSEIGNER]` |
| 8.4 | État ≠ couleur seule | `NOT TESTED` | `[À RENSEIGNER]` |
| 8.5 | Lecture sans son possible | `NOT TESTED` | `[À RENSEIGNER]` |

## 9. Performance

| # | Critère | Statut | Notes |
|---|---------|--------|-------|
| 9.1 | Poids média acceptable | `NOT TESTED` | `[À RENSEIGNER]` |
| 9.2 | Poster / vignette présents | `NOT TESTED` | `[À RENSEIGNER]` |
| 9.3 | Formats d’export conformes | `NOT TESTED` | `[À RENSEIGNER]` |

## 10. Intégration

| # | Critère | Statut | Notes |
|---|---------|--------|-------|
| 10.1 | Métadonnées scène alignées schéma | `NOT TESTED` | `[À RENSEIGNER]` |
| 10.2 | `courseIds` / `assetIds` cohérents | `NOT TESTED` | `[À RENSEIGNER]` |
| 10.3 | Chemins médias réels (pas inventés) | `NOT TESTED` | `[À RENSEIGNER]` |
| 10.4 | Player / page démo OK | `NOT TESTED` | `[À RENSEIGNER]` ou `NOT APPLICABLE` |

## 11. Validation finale

| # | Critère | Statut | Notes |
|---|---------|--------|-------|
| 11.1 | Toutes sections critiques PASS | `NOT TESTED` | `[À RENSEIGNER]` |
| 11.2 | Aucun FAIL ouvert | `NOT TESTED` | `[À RENSEIGNER]` |
| 11.3 | Statut scène prêt pour `approved` | `NOT TESTED` | `[À RENSEIGNER]` |
| 11.4 | Approbateur nommé | `NOT TESTED` | `[À RENSEIGNER]` |

## Décision

| Champ | Valeur |
|-------|--------|
| Décision | `[À RENSEIGNER]` (`GO` / `NO-GO` / `GO WITH CONDITIONS`) |
| Conditions | `[À RENSEIGNER]` ou `[NON APPLICABLE]` |
| Signature | `[À RENSEIGNER]` |
