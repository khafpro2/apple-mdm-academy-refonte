# Conventions de nommage des assets Motion Design

## Format général

```text
category-subject-view-state-variant-version
```

Exemple :

```text
security-lock-front-closed-cyan-v1
```

| Segment | Valeur |
| --- | --- |
| category | `security` |
| subject | `lock` |
| view | `front` |
| state | `closed` |
| variant | `cyan` |
| version | `v1` |

## Règles globales

Les valeurs doivent :

* être en minuscules ;
* utiliser uniquement des lettres, chiffres et tirets ;
* commencer par une catégorie autorisée ;
* terminer par une version au format `vN` (entier positif) ;
* ne contenir aucun espace ;
* ne contenir aucun caractère accentué ;
* ne contenir aucun mot interdit.

### Mots interdits

```text
final
latest
new
test
temp
draft-file
asset1
image1
version-final
```

### Catégories autorisées

```text
environment
device
identity
network
cloud
security
management
application
policy
compliance
certificate
data-flow
status
transition
character
diagram
background
```

Le validateur ne compte pas seulement les segments séparés par des tirets : il vérifie la catégorie, la version finale et la convention par catégorie.

## Conventions par catégorie

### Standard (sujet + vue + état + variante)

Appliqué à : `environment`, `device`, `identity`, `network`, `cloud`, `security`, `management`, `application`, `policy`, `compliance`, `certificate`, `data-flow`, `character`, `diagram`.

Minimum recommandé : **6 segments** (`category` … `vN`).

### `status` et `transition`

La vue ou l’état peut être omis lorsqu’ils n’ont pas de sens.

Format accepté :

```text
status-<label>-<variant>-vN
transition-<label>-<variant>-vN
```

Minimum : **4 segments**.

### `background`

```text
background-<motif>-<view|front>-<variant>-vN
```

Exemple :

```text
background-grid-front-neutral-dark-v1
```

Ici `neutral-dark` est la variante (segments reliés avant `vN`). Le validateur exige au moins **5 segments** et une catégorie `background`.

## Chemins de fichiers

Lorsque le fichier existe :

```text
/media/motion/assets/<id>.<ext>
```

L’extension doit correspondre au champ `format` (`svg`, `png`, `webp`, `jpg`, `lottie`).

Pour `lottie`, l’extension attendue est `.json`.

## Exceptions

Toute exception de naming doit être documentée dans ce fichier avant d’être acceptée par le validateur.
