# Motion Design — fichiers publics

Arborescence définitive des médias Motion servis par Next.js (`public/` → URL racine).

| Dossier | URL publique | Usage |
|---|---|---|
| `svg/` | `/motion/svg/` | Illustrations vectorielles |
| `posters/` | `/motion/posters/` | Posters / frames clés (souvent WebP) |
| `backgrounds/` | `/motion/backgrounds/` | Fonds de scène |
| `icons/` | `/motion/icons/` | Icônes (souvent PNG/SVG) |
| `thumbnails/` | `/motion/thumbnails/` | Miniatures de galerie |
| `illustrations/` | `/motion/illustrations/` | Illustrations raster |

## Règles

1. Le registre JSON (`media/motion/registry/assets.json`) reste la source de vérité.
2. Ne déclarer `path` que lorsque le fichier existe physiquement ici.
3. Nom de fichier = `<asset-id>.<ext>` (ex. `security-lock-front-closed-cyan-v1.svg`).
4. Exemple de `path` registre : `/motion/svg/security-lock-front-closed-cyan-v1.svg`.
5. Ne pas inventer de SVG/PNG/WebP fictifs.

Les dossiers vides sont conservés via `.gitkeep`.
