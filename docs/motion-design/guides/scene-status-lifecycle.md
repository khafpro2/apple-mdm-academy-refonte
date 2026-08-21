# Guide — Cycle de vie des statuts de scène

> Statuts documentaires et runtime alignés sur le pipeline motion.
> Transitions autorisées uniquement si les prérequis sont remplis.

---

## Statuts

| Statut | Signification |
|--------|----------------|
| `draft` | Intention / brief en rédaction |
| `needs-technical-review` | Brief pédagogique prêt ; revue exactitude technique requise |
| `brief-ready` | Brief + garde-fous techniques OK ; storyboard / assets peuvent démarrer |
| `assets-in-production` | Génération / sélection / retouche assets en cours |
| `animation-in-production` | Animation, narration, sous-titres en cours |
| `review` | Pack intégré ; QA en cours |
| `approved` | Validé qualitativement ; **pas encore** exposé en production apprenant |
| `published` | Publié / consommable selon règles produit |
| `deprecated` | Remplacé ou retiré ; conservation archivistique |
| `blocked` | Impossible d’avancer sans décision / déblocage externe |

---

## Qui peut changer le statut

| Transition / statut cible | Rôles autorisés |
|---------------------------|-----------------|
| → `draft` | Auteur pédagogique |
| → `needs-technical-review` | Auteur pédagogique |
| → `brief-ready` | Référent technique (après revue) |
| → `assets-in-production` | Motion designer (brief-ready requis) |
| → `animation-in-production` | Motion designer |
| → `review` | Intégrateur ou motion lead |
| → `approved` | Approbateurs nommés (pédagogie **et** technique) |
| → `published` | Release / intégrateur (après `approved`) |
| → `deprecated` | Product Owner + approbateur technique |
| → `blocked` | Tout rôle pipeline ; motif obligatoire |
| Sortie de `blocked` | Responsable du motif + référent concerné |

---

## Prérequis de transition

| De | Vers | Prérequis |
|----|------|-----------|
| `draft` | `needs-technical-review` | `production-brief.md` avec objectif + message + sources marquées |
| `needs-technical-review` | `brief-ready` | Revue technique signée ; aucun FAIL critique |
| `needs-technical-review` | `blocked` | Motif + owner du déblocage |
| `brief-ready` | `assets-in-production` | `shot-list.md` + `asset-manifest.md` initiés |
| `assets-in-production` | `animation-in-production` | Assets critiques `selected` ou mieux ; prompts OK |
| `animation-in-production` | `review` | Narration + VTT + export master + accessibilité draft |
| `review` | `approved` | Checklist qualité sans FAIL ouvert |
| `approved` | `published` | Médias réels présents ; chemins non vides ; smoke player |
| `*` | `deprecated` | Remplaçant identifié **ou** décision de retrait documentée |
| `*` | `blocked` | Motif, owner, date |

## Régressions possibles

| De | Vers | Quand |
|----|------|-------|
| `brief-ready` | `needs-technical-review` | Nouveau fait technique / source invalidée |
| `assets-in-production` | `brief-ready` | Storyboard invalidé |
| `animation-in-production` | `assets-in-production` | Asset critique rejeté |
| `review` | `animation-in-production` | FAIL QA animation / audio / VTT |
| `review` | `needs-technical-review` | FAIL exactitude technique |
| `approved` | `review` | Régression découverte avant publication |
| `published` | `approved` | Retrait temporaire sans dépréciation |
| `published` | `deprecated` | Remplacement version |
| `blocked` | statut précédent documenté | Déblocage |

---

## `approved` vs `published`

| | `approved` | `published` |
|--|------------|-------------|
| Qualité | Validée | Validée |
| Médias | Peuvent encore être en staging interne | Doivent être livrés et adressables |
| Visibilité apprenant | Non (ou preview interne seulement) | Oui selon règles produit |
| Chemin `path` | Peut rester absent si media pas livré | Obligatoire pour médias référencés |

## `blocked` vs `needs-technical-review`

| | `needs-technical-review` | `blocked` |
|--|--------------------------|-----------|
| Nature | Étape **normale** du workflow | Exception / incident |
| Attente | Revue technique planifiée | Décision externe, source manquante, PI, bug bloquant |
| Sortie typique | `brief-ready` ou `blocked` | Retour au statut précédent + reprise |
| SLA | Revue dans le flux standard | Escalade owner obligatoire |

---

## Diagramme d’états (texte)

```
                    ┌──────────────┐
                    │    draft     │
                    └──────┬───────┘
                           │
                           v
              ┌────────────────────────┐
              │ needs-technical-review │◄────┐
              └────────────┬───────────┘     │
                     ┌─────┴──────┐          │
                     v            v          │
              brief-ready      blocked ──────┘ (déblocage)
                     │            ^
                     v            │
           assets-in-production ──┤ (régression / motif)
                     │            │
                     v            │
         animation-in-production ─┤
                     │            │
                     v            │
                  review ─────────┘
                     │
                     v
                 approved
                     │
                     v
                published
                     │
                     v
                deprecated

  (depuis presque tout état ──► blocked, avec motif)
  (depuis published/approved ──► deprecated)
```
