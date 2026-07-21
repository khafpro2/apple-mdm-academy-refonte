# Motion design — source de vérité

## Choix : Option A (TypeScript dans `lib/motion/data/**`)

| Option | Décision |
|--------|----------|
| **A — TS dans `lib/motion/data/**`** | **Retenue** |
| B — JSON/YAML dans `content/motion/**` | Rejetée : pas de dossier `content/`, JSON réservé aux inventaires fichiers (`data/video-*.json`) |
| C — MDX + frontmatter | Rejetée : aucun MDX dans le dépôt |

### Pourquoi A

- Les registres existants (`lib/data/**`, `src/lib/video-*`) sont déjà typés en TypeScript.
- Validation compile-time + import direct sans générateur dupliqué.
- Une seule source : pas de fichier généré à synchroniser.

### Contenu autorisé dans la source de vérité

Uniquement des **métadonnées structurées** (`MotionScene`, `MotionAsset`, `MotionMedia`…).

La documentation narrative (briefs Claude, guides pédagogiques longs) reste dans `docs/motion-design/**` et n’est **pas** importée par le runtime.

### Points d’entrée

| Besoin | Module |
|--------|--------|
| Ajouter une scène | `lib/motion/data/scenes/<slug>.ts` + export dans `scenes/index.ts` |
| Ajouter un asset | `lib/motion/data/assets/<slug>.ts` + export dans `assets/index.ts` |
| Consommer le registre | `@/lib/motion` ou `@/lib/motion/registry` |
| Auditer | `npm run motion:audit` |
