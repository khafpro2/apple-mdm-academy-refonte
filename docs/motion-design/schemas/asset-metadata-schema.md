# Schéma — Métadonnées d’asset

> Contrat pour `asset-manifest.md` et alignement registre assets.
> Convention d’ID : `guides/asset-naming-conventions.md`.

---

## Champs

| Champ | Obligatoire | Type | Format / valeurs autorisées | Exemple valide | Exemple invalide |
|-------|-------------|------|-----------------------------|----------------|------------------|
| `id` | **oui** | `string` | 6 segments `category-subject-view-state-variant-version` (sauf exceptions status/transition/background **À VALIDER**) | `security-lock-front-closed-cyan-v1` | `security-lock-closed-cyan-v1`, `final`, `asset1` |
| `category` | **oui** | `string` | `device` \| `security` \| `identity` \| `data` \| `diagram` \| `status` \| `transition` \| `background` \| `icon` \| `illustration` \| `thumbnail` \| `poster` \| `screenshot` \| `other` | `security` | `misc`, `Final` |
| `name` | **oui** | `string` | Titre humain non vide | `Cadenas fermé cyan` | `""` |
| `description` | **oui** | `string` | Description fonctionnelle | `Cadenas fermé, vue face, accent cyan` | `""` |
| `status` | **oui** | `enum` | `missing` \| `brief-ready` \| `generated` \| `selected` \| `retouch-required` \| `review` \| `approved` \| `deprecated` | `brief-ready` | `ready`, `wip`, `final` |
| `format` | **oui** | `string` | `svg` \| `png` \| `webp` \| `jpg` \| `jpeg` \| `mp4` \| `webm` \| `vtt` \| `txt` \| `md` \| `json` | `png` | `psd`, `final` |
| `dimensions` | **oui** | `string` | `{width}x{height}` pixels | `1920x1080` | `HD`, `1920` |
| `aspectRatio` | **oui** | `string` | `16:9` \| `9:16` \| `1:1` \| `4:3` \| autre ratio documenté `W:H` | `16:9` | `widescreen` |
| `transparentBackground` | **oui** | `boolean` | `true` \| `false` | `true` | `"yes"` |
| `altText` | **oui** | `string` | Texte alternatif ; `""` seulement si décoratif explicite | `Cadenas fermé symbolisant le chiffrement` | _(absent)_ |
| `source` | **oui** | `string` | Origine (`firefly`, `hand-drawn`, `stock-licensed`, `internal`) + ref | `firefly` | URL de doc produit inventée |
| `version` | **oui** | `string` | `vN` aligné sur le segment version de `id` | `v1` | `latest`, `final-v2` |
| `path` | **conditionnel** | `string` \| absent | Chemin public `/…` **uniquement si le fichier existe** ; sinon **vide ou absent** | `/media/motion/assets/security-lock-front-closed-cyan-v1.png` | chemin inventé alors que `status=missing` |
| `sceneIds` | **oui** | `string[]` | ≥ 1 id de scène référençant l’asset (ou scène principale prévue) | `["scene-filevault"]` | `[]` sans justification |

---

## Champs documentaires additionnels (manifeste)

Facultatifs dans le schéma runtime, **recommandés** dans le pack production :

| Champ | Type | Notes |
|-------|------|-------|
| `function` | `string` | Rôle dans la scène |
| `variants` | `string[]` | Autres `id` liés |
| `animationPossible` | `boolean` \| `string` | Indique si l’asset peut être animé |
| `dependencies` | `string[]` | Autres asset ids |
| `approval` | `object` | `{ state, by, at }` — `pending` \| `approved` \| `rejected` |
| `primaryScene` | `string` | Scène principale |

---

## Règle `path`

```
SI fichier_absent ALORS path = absent OU path = ""
SINON path = chemin_public_réel
```

- Interdit : inventer un chemin « pour plus tard ».
- Interdit : `path` non vide avec `status=missing`.
- Recommandé : quand `path` est renseigné, `status` ∈ {`selected`,`retouch-required`,`review`,`approved`}.

---

## États — mapping notes

Le pack production utilise les états listés ci-dessus (`brief-ready`, `generated`, …).

Si le registre TypeScript runtime expose un sous-ensemble différent (`planned`, `in-production`, `ready`, …), documenter le mapping à l’intégration — **ne pas** écraser silencieusement les statuts production.
