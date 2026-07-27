# Schéma — Métadonnées d’un asset

Ce document définit les métadonnées obligatoires et facultatives utilisées pour enregistrer un asset du Motion Design System d’Apple MDM Academy.

Chaque champ précise :

* son type ;
* son format ;
* ses valeurs autorisées ;
* un exemple valide ;
* un exemple invalide.

---

## Champs

| Champ | Type | Format ou valeurs autorisées | Exemple valide | Exemple invalide |
| --- | --- | --- | --- | --- |
| `id` | string | Convention normalisée définie dans `asset-naming-conventions.md` | `security-lock-front-closed-cyan-v1` | `lock-final` |
| `category` | enum | `environment`, `device`, `identity`, `network`, `cloud`, `security`, `management`, `application`, `policy`, `compliance`, `certificate`, `data-flow`, `status`, `transition`, `character`, `diagram`, `background` | `security` | `misc` |
| `name` | string | Nom humain court et non vide | `Cadenas fermé — cyan` | `""` |
| `description` | string | Description fonctionnelle non vide | `Cadenas géométrique fermé représentant un état protégé.` | champ absent |
| `status` | enum | `missing`, `brief-ready`, `generated`, `selected`, `retouch-required`, `review`, `approved`, `deprecated` | `missing` | `todo` |
| `format` | enum | `svg`, `png`, `webp`, `jpg`, `lottie` | `svg` | `sketch` |
| `dimensions` | string | `largeurxhauteur`, en pixels | `256x256` | `medium` |
| `aspectRatio` | enum | `1:1`, `16:9`, `9:16`, `4:3`, `custom` | `1:1` | `square` |
| `transparentBackground` | boolean | `true` ou `false` | `true` | `oui` |
| `altText` | string | Description accessible non vide lorsque l’asset transmet une information | `Cadenas fermé représentant la protection des données.` | `""` |
| `decorative` | boolean | `true` ou `false` | `false` | `non` |
| `source` | enum | `firefly`, `vector`, `manual`, `mixed` | `mixed` | champ absent |
| `version` | string | `vN`, où `N` est un entier positif | `v1` | `final` |
| `path` | string ou absent | Chemin interne uniquement lorsque le fichier existe réellement | absent si aucun fichier | `/assets/lock.svg` alors que le fichier n’existe pas |
| `sceneIds` | array\<string\> | Liste d’identifiants complets de scènes | `["scene-002-filevault-encryption"]` | `"scene-002"` |

---

## Champs obligatoires

```text
id
category
name
description
status
format
dimensions
aspectRatio
transparentBackground
decorative
source
version
sceneIds
```

Le champ `altText` est obligatoire lorsque `decorative: false`.

Lorsque l’asset est purement décoratif :

```yaml
decorative: true
altText: ""
```

Le champ `path` est conditionnel.

---

## Règles du champ `path`

Le champ `path` doit rester absent tant qu’aucun fichier physique n’existe.

### Cas valide sans chemin

```yaml
status: missing
```

ou :

```yaml
status: brief-ready
```

### Cas pouvant posséder un chemin

```text
generated
selected
retouch-required
review
approved
deprecated
```

### Règle fondamentale

```text
Un statut ne prouve jamais à lui seul l’existence d’un fichier.
```

Le validateur doit vérifier physiquement le fichier.

---

## Convention d’identifiant

Voir [asset-naming-conventions.md](../guides/asset-naming-conventions.md).

---

## Règles d’accessibilité

### Asset informatif

```yaml
decorative: false
altText: Cadenas fermé représentant la protection des données.
```

### Asset décoratif

```yaml
decorative: true
altText: ""
```

---

## Cohérence entre format et chemin

Lorsque `path` est présent, l’extension doit correspondre à `format`.

Chemins internes autorisés uniquement sous :

```text
/motion/<subdir>/<id>.<ext>

Sous-dossiers autorisés : `svg`, `posters`, `backgrounds`, `icons`, `thumbnails`, `illustrations`.

Exemple : `/motion/svg/security-lock-front-closed-cyan-v1.svg`.

Legacy (V1) encore accepté : `/media/motion/assets/<id>.<ext>`.
```

---

## Cohérence de la source

| `source` | Usage |
| --- | --- |
| `firefly` | Génération Firefly sans transformation structurelle majeure |
| `vector` | Outil vectoriel ou génération SVG contrôlée |
| `manual` | Dessiné / construit manuellement |
| `mixed` | Plusieurs méthodes combinées |

---

## Progression des statuts

```text
missing → brief-ready → generated → selected → review → approved
```

Branches :

```text
generated|selected → retouch-required → review
approved → deprecated
```

---

## Registre machine

Les métadonnées sont stockées dans :

```text
media/motion/registry/assets.json
media/motion/registry/scenes.json
```

(JSON pour le validateur Node sans dépendance YAML ; les exemples de ce document restent en YAML.)

Audit :

```bash
npm run audit:motion-assets
```

---

## Contrôles automatiques attendus

1. présence des champs obligatoires ;
2. valeurs appartenant aux enums ;
3. conformité de l’identifiant ;
4. unicité de l’identifiant ;
5. format de la version ;
6. format des dimensions ;
7. format du ratio ;
8. type des booléens ;
9. présence du texte alternatif pour les assets informatifs ;
10. absence de texte alternatif obligatoire pour les assets décoratifs ;
11. validité des identifiants de scènes ;
12. existence des scènes référencées ;
13. existence physique du fichier lorsque `path` est présent ;
14. cohérence entre extension et format ;
15. absence de chemin externe ;
16. absence de nom de fichier interdit ;
17. absence de doublon de chemin ;
18. cohérence entre statut et disponibilité réelle ;
19. respect des règles de dépréciation ;
20. absence de logo ou de marque tierce non autorisée.
