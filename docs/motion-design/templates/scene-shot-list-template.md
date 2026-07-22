# Template — Shot list (plan par plan)

> Copier vers `docs/motion-design/production/<slug>/shot-list.md`.
> Marqueurs : `[À RENSEIGNER]` · `[À VÉRIFIER — SOURCE OFFICIELLE REQUISE]` · `[NON APPLICABLE]`
> Les identifiants d’assets doivent suivre `guides/asset-naming-conventions.md` et rester synchronisés avec `asset-manifest.md`.

---

## En-tête scène

| Champ | Valeur |
|-------|--------|
| Identifiant scène | `[À RENSEIGNER]` |
| Slug | `[À RENSEIGNER]` |
| Durée totale | `[À RENSEIGNER]` |
| Nombre de plans | `[À RENSEIGNER]` |
| Statut | `[À RENSEIGNER]` |

---

## Structure d’un plan (répéter pour chaque plan)

### Plan — `[À RENSEIGNER]` (identifiant, ex. `S01-P01`)

| Champ | Valeur |
|-------|--------|
| Identifiant | `[À RENSEIGNER]` |
| Timecode début | `[À RENSEIGNER]` (`HH:MM:SS.mmm`) |
| Timecode fin | `[À RENSEIGNER]` (`HH:MM:SS.mmm`) |
| Durée | `[À RENSEIGNER]` (secondes) |
| Objectif pédagogique | `[À RENSEIGNER]` |
| Composition | `[À RENSEIGNER]` |
| Asset principal | `[À RENSEIGNER]` (ID 6 segments) |
| Assets secondaires | `[À RENSEIGNER]` ou `[NON APPLICABLE]` |
| Texte affiché | `[À RENSEIGNER]` ou `[NON APPLICABLE]` |
| Narration | `[À RENSEIGNER]` (extrait ou ref. `narration.md`) |
| Animation | `[À RENSEIGNER]` |
| Mouvement caméra | `[À RENSEIGNER]` ou `[NON APPLICABLE]` |
| Transition | `[À RENSEIGNER]` |
| Son | `[À RENSEIGNER]` ou `[NON APPLICABLE]` |
| Alternative reduced motion | `[À RENSEIGNER]` |
| Risque de confusion | `[À RENSEIGNER]` |
| Critère d'acceptation | `[À RENSEIGNER]` |

---

## Exemple générique (sans marque ni produit)

> Exemple pédagogique abstrait — **ne pas** copier tel quel dans une scène produit. Aucune marque, aucune interface réelle.

### Plan — `EX-P01` (transfert de données abstrait)

| Champ | Valeur |
|-------|--------|
| Identifiant | `EX-P01` |
| Timecode début | `00:00:00.000` |
| Timecode fin | `00:00:08.000` |
| Durée | `8` |
| Objectif pédagogique | Montrer qu’un flux de données passe d’un conteneur source à un conteneur cible, sans exposer le contenu. |
| Composition | Conteneur source à gauche, flux abstrait au centre, conteneur cible à droite, fond neutre. |
| Asset principal | `data-storage-blocks-isometric-readable-base-v1` |
| Assets secondaires | `transition-connector-flow-v1` |
| Texte affiché | `[NON APPLICABLE]` — aucun texte généré dans l’image |
| Narration | « Les données quittent le conteneur source et rejoignent le conteneur cible. » |
| Animation | Déplacement latéral du flux, opacité progressive, durée 6 s utiles + 2 s de hold. |
| Mouvement caméra | Léger push-in (5 %) |
| Transition | Cross-dissolve 12 frames vers le plan suivant |
| Son | Whoosh discret synchronisé au départ du flux ; pas de musique dominante |
| Alternative reduced motion | Remplacer le déplacement par un fondu source → cible + flèche statique |
| Risque de confusion | Ne pas laisser croire que les données restent lisibles pendant le transfert |
| Critère d'acceptation | Un spectateur comprend « déplacement de données » sans lire de labels de marque |
