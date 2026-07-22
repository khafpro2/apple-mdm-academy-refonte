# Guide — Conventions de nommage des assets

> Convention **stable** à 6 segments. Toute évolution doit être documentée ici avant application.

---

## Forme canonique (6 segments)

```
category-subject-view-state-variant-version
```

| Segment | Rôle | Exemples |
|---------|------|----------|
| `category` | Famille sémantique | `device`, `security`, `identity`, `data`, `diagram`, `status`, `transition`, `background` |
| `subject` | Sujet (composé autorisé s’il reste **un** segment) | `laptop`, `storage-blocks`, `recovery-key`, `summary-card` |
| `view` | Angle / cadrage | `isometric`, `front`, `full` |
| `state` | État métier ou visuel | `neutral`, `closed`, `readable`, `encrypted`, `authorized` |
| `variant` | Variante de style / déclinaison | `base` (défaut), `cyan`, `token`, `enterprise`, `standard`, `filevault` |
| `version` | Révision de **forme** | `v1`, `v2`, … |

### Exemples valides

- `device-laptop-isometric-neutral-base-v1`
- `security-lock-front-closed-cyan-v1`
- `identity-user-front-authorized-standard-v1`
- `data-storage-blocks-isometric-encrypted-base-v1`
- `diagram-summary-card-full-neutral-filevault-v1`

---

## Règles générales

1. **Minuscules** uniquement (`a-z`, `0-9`).
2. Segments séparés par des **tirets** `-`.
3. Un **sujet composé** (ex. `storage-blocks`) compte comme le segment `subject` : ne pas le confondre avec un ajout de segments hors convention.
4. **`variant` par défaut = `base`** si aucune déclinaison.
5. **`version = vN`** : incrémentée **uniquement** quand la forme visuelle change (traits, silhouette, composition). Un re-export identique ne bump **pas** la version.
6. Pas d’underscore `_`, pas d’espace, pas de camelCase.

---

## Versions

| Règle | Détail |
|-------|--------|
| Format | `v` + entier ≥ 1 |
| Incrément | Changement de forme / redraw |
| Non-incrément | Compression, rename de fichier seul, retouche couleur mineure documentée comme nouvelle `variant` si besoin |
| Coexistence | `…-v1` et `…-v2` peuvent coexister ; les scènes pinent une version |

## Variantes (`variant`)

| Règle | Détail |
|-------|--------|
| Défaut | `base` |
| Usage | Couleur (`cyan`), contexte (`enterprise`), rôle (`token`), scène (`filevault`) |
| Interdit | Utiliser `variant` pour encoder un nouvel `state` métier |

## États (`state`)

| Règle | Détail |
|-------|--------|
| Sens | État visible ou métier (ouvert/fermé, chiffré, autorisé, neutre) |
| Accessibilité | L’état ne doit jamais reposer sur la couleur seule (voir template accessibilité) |

## Formats de fichiers

| Type | Pattern de fichier |
|------|--------------------|
| Asset image | `{id}.{ext}` avec `ext` ∈ `png`, `svg`, `webp`, `jpg` |
| Export master | `{slug}-{ratio}-v{N}.mp4` (ex. `filevault-16x9-v1.mp4`) |
| WebM | `{slug}-{ratio}-v{N}.webm` |
| Thumbnail / poster | `{slug}-poster-v{N}.webp` ou `{id}-thumb.webp` |
| Sous-titres | `{slug}.<lang>.vtt` (ex. `filevault.fr.vtt`, `filevault.fr-FR.vtt`) |
| Transcript | `{slug}.<lang>.transcript.md` |
| Vidéo scène | Préférer `mp4` + `webm` ; chemins uniquement si fichiers existants |

## Noms INTERDITS

Ne jamais utiliser :

- `final`, `final-v2`, `new`, `test`, `latest`
- `asset1`, `image2`, `img`, `temp`
- tout nom **sans** catégorie, état et version

---

## Exceptions — catégories `status` / `transition` / `background`

Ces catégories n’ont souvent **pas** de `view` / `variant` naturels. Une **forme courte** est autorisée **provisoirement** :

| Exemple court | Statut convention |
|---------------|-------------------|
| `status-encrypted-v1` | **À VALIDER PAR UN HUMAIN** |
| `transition-connector-flow-v1` | **À VALIDER PAR UN HUMAIN** |
| `background-navy-grid-neutral-v1` | **À VALIDER PAR UN HUMAIN** |

> Ne pas généraliser d’autres formes courtes. Toute nouvelle exception doit être ajoutée ici après décision humaine.

Proposition de normalisation (non appliquée sans validation) :

| Court | Proposition 6 segments |
|-------|-------------------------|
| `status-encrypted-v1` | `status-badge-front-encrypted-base-v1` |
| `transition-connector-flow-v1` | `transition-connector-side-flow-base-v1` |
| `background-navy-grid-neutral-v1` | `background-grid-full-neutral-navy-v1` |

---

## Formes ambiguës

Tout ID qui ne mappe pas clairement aux 6 segments (ex. `data-flow-encryption-transition-active-v1`) doit :

1. rester inchangé **ou** être proposé en ID conforme ;
2. être marqué **`[À VALIDER PAR UN HUMAIN]`** ;
3. ne pas être propagé à de nouvelles scènes tant que non tranché.
