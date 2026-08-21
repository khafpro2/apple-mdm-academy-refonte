# Guide — Workflow de production de scène

> Pipeline documentaire pour les packs sous `docs/motion-design/production/<slug>/`.
> Statuts : voir `guides/scene-status-lifecycle.md`.
> Templates : `templates/scene-*-template.md`.

---

## Vue d’ensemble

```
idea → pedagogical brief → technical review → storyboard → asset brief
  → visual generation → asset selection → retouch → animation
  → narration → subtitles → integration → QA → approval → publication
```

---

## 1. idea

| | |
|--|--|
| **Responsable** | Product Owner pédagogique / auteur cours |
| **Entrée** | Besoin de cours, lacune visuelle, ticket |
| **Sortie** | Note d’intention (1–3 phrases) + slug provisoire |
| **Critères de passage** | Objectif pédagogique identifiable ; pas de doublon évident |
| **Blocages possibles** | Sujet hors scope V1 ; conflit avec une scène existante |
| **Statut attendu** | `draft` |

## 2. pedagogical brief

| | |
|--|--|
| **Responsable** | Auteur pédagogique |
| **Entrée** | Note d’intention |
| **Sortie** | `production-brief.md` (depuis `scene-production-template.md`) |
| **Critères de passage** | Objectif, public, message principal, risques de confusion renseignés (marqueurs OK) |
| **Blocages possibles** | Message flou ; prérequis non définis |
| **Statut attendu** | `draft` |

## 3. technical review

| | |
|--|--|
| **Responsable** | Référent technique produit (Apple / MDM) |
| **Entrée** | Brief pédagogique |
| **Sortie** | Brief annoté : vérité technique + sources requises + simplifications assumées |
| **Critères de passage** | Aucun fait non sourcé laissé sans `[À VÉRIFIER — SOURCE OFFICIELLE REQUISE]` ; garde-fous listés |
| **Blocages possibles** | Source officielle manquante ; risque de confusion critique |
| **Statut attendu** | `needs-technical-review` → puis `brief-ready` si OK ; sinon `blocked` |

## 4. storyboard

| | |
|--|--|
| **Responsable** | Motion designer / auteur scène |
| **Entrée** | Brief validé techniquement |
| **Sortie** | `shot-list.md` |
| **Critères de passage** | Plans complets (timecodes, objectifs, reduced motion) ; durée totale cohérente |
| **Blocages possibles** | Durée irréaliste ; trop de texte à l’écran |
| **Statut attendu** | `brief-ready` |

## 5. asset brief

| | |
|--|--|
| **Responsable** | Motion designer |
| **Entrée** | Shot list |
| **Sortie** | `asset-manifest.md` + `firefly-prompts.md` |
| **Critères de passage** | IDs 6 segments ; états `missing` ou `brief-ready` ; `path` vide si fichier absent |
| **Blocages possibles** | ID non conforme ; dépendance circulaire |
| **Statut attendu** | `assets-in-production` |

## 6. visual generation

| | |
|--|--|
| **Responsable** | Motion designer / opérateur génération |
| **Entrée** | Prompts Firefly + negative prompt |
| **Sortie** | Candidats générés (hors dépôt tant que non sélectionnés) |
| **Critères de passage** | Interdictions respectées (logos, UI réelle, secrets, texte généré) |
| **Blocages possibles** | Sorties hors style ; texte halluciné dans l’image |
| **Statut attendu** | `assets-in-production` (assets → `generated`) |

## 7. asset selection

| | |
|--|--|
| **Responsable** | Motion designer + validateur pédagogique |
| **Entrée** | Candidats |
| **Sortie** | Assets `selected` dans le manifeste |
| **Critères de passage** | 1 candidat retenu par besoin ; alt text provisoire |
| **Blocages possibles** | Aucun candidat acceptable |
| **Statut attendu** | `assets-in-production` |

## 8. retouch

| | |
|--|--|
| **Responsable** | Motion designer / retoucheur |
| **Entrée** | Assets `selected` ou `retouch-required` |
| **Sortie** | Assets prêts animation (`review` ou `approved` côté asset) |
| **Critères de passage** | Transparence, ratio, cohérence palette ; pas de texte illicite |
| **Blocages possibles** | Artefacts non corrigeables → retour génération |
| **Statut attendu** | `assets-in-production` |

## 9. animation

| | |
|--|--|
| **Responsable** | Motion designer |
| **Entrée** | Assets approuvés + shot list |
| **Sortie** | Composition animée (master) |
| **Critères de passage** | Timing = shot list ; alternative reduced motion documentée |
| **Blocages possibles** | Asset manquant ; timing narration incompatible |
| **Statut attendu** | `animation-in-production` |

## 10. narration

| | |
|--|--|
| **Responsable** | Auteur / voix-off |
| **Entrée** | Shot list + budget mots |
| **Sortie** | `narration.md` (+ éventuel audio) |
| **Critères de passage** | Compte de mots dans tolérance ; chronométrage OK |
| **Blocages possibles** | Script trop long ; termes non validés techniquement |
| **Statut attendu** | `animation-in-production` |

## 11. subtitles

| | |
|--|--|
| **Responsable** | Auteur / intégrateur accessibilité |
| **Entrée** | Narration finale |
| **Sortie** | `subtitles.<lang>.vtt` valide |
| **Critères de passage** | En-tête `WEBVTT` ; timecodes croissants ; ≤ 2 lignes/cue |
| **Blocages possibles** | Désync audio ; cues trop denses |
| **Statut attendu** | `animation-in-production` → prêt `review` |

## 12. integration

| | |
|--|--|
| **Responsable** | Intégrateur technique |
| **Entrée** | Médias exportés + métadonnées |
| **Sortie** | Chemins réels renseignés ; registre TS aligné (hors scope de ce pack doc si Option A) |
| **Critères de passage** | `path` uniquement si fichier existe ; schémas respectés |
| **Blocages possibles** | Fichier manquant ; ID désynchronisé |
| **Statut attendu** | `review` |

## 13. QA

| | |
|--|--|
| **Responsable** | QA + accessibilité |
| **Entrée** | Pack complet + `quality-checklist.md` |
| **Sortie** | Checklist renseignée (PASS/FAIL/…) |
| **Critères de passage** | Aucun FAIL ouvert sur sections critiques |
| **Blocages possibles** | FAIL exactitude / PI / accessibilité |
| **Statut attendu** | `review` |

## 14. approval

| | |
|--|--|
| **Responsable** | Approbateur nommé (pédagogie + technique) |
| **Entrée** | QA PASS |
| **Sortie** | Scène `approved` ; assets `approved` |
| **Critères de passage** | Signature + date dans brief / checklist |
| **Blocages possibles** | Désaccord pédagogique / technique |
| **Statut attendu** | `approved` |

## 15. publication

| | |
|--|--|
| **Responsable** | Release / intégrateur |
| **Entrée** | Scène `approved` + médias livrés |
| **Sortie** | Scène `published` (visible apprenant selon règles produit) |
| **Critères de passage** | Médias présents ; sous-titres ; poster ; pas de chemin fantôme |
| **Blocages possibles** | Médias `missing` ; régression player |
| **Statut attendu** | `published` |

---

## Rappel

- Ne jamais inventer de chemins fichiers.
- Ne jamais citer de documentation produit fictive.
- Les packs sous `docs/motion-design/production/**` ne remplacent pas la source de vérité runtime (voir `guides/source-of-truth.md` si présent).
