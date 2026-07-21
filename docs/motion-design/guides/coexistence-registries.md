# Coexistence des registres d’illustrations

Trois systèmes coexistent volontairement. **Ne pas les fusionner** en V1.

## 1. Illustrations web LMS

| Élément | Chemin |
|---|---|
| Registre | [`lib/assets/illustration-registry.ts`](../../../lib/assets/illustration-registry.ts) |
| Fichiers | [`public/illustrations/`](../../../public/illustrations/) |
| Usage | Pages cours, composants `AnimatedLesson` / diagrammes pédagogiques |

Métadonnées légères (`alt`, `license`, `usedIn`). Hors schéma Motion Design.

## 2. Assets pipeline vidéo (captures / packs)

| Élément | Chemin |
|---|---|
| Dossier | `public/video-assets/` |
| Orchestration | `src/lib/video-*`, admin `/admin/video-pipeline` |

Icônes, thumbnails, diagrams et captures Screen Studio pour le montage. **Pas** le registre Motion.

## 3. Motion Design System (ce registre)

| Élément | Chemin |
|---|---|
| SoT machine | `media/motion/registry/assets.json` + `scenes.json` |
| Fichiers physiques | `media/motion/assets/` (uniquement s’ils existent) |
| Code | `lib/motion/*` |
| Galerie interne | `/admin/motion-assets` (admin + `noindex`) |

Schéma strict (catégories, statuts, `altText`, `path` conditionnel, `sceneIds`).

## Règles

1. JSON Motion = **seule** source de vérité pour les assets Motion.
2. Les exemples YAML dans `docs/motion-design/` sont documentation, pas un second registre.
3. Ne pas copier les logos de `public/brands/` ou `public/logos/` dans Motion sans autorisation.
4. Ne pas déclarer un `path` Motion qui pointe vers `public/illustrations/` pour « remplir » un asset.
5. CapCut / HeyGen / Screen Studio : outils de production documentés, **pas** des dépendances npm.

## Quand utiliser quoi

| Besoin | Système |
|---|---|
| Schéma pédagogique dans une leçon web | `illustration-registry` |
| Capture d’écran réelle pour une vidéo | `public/video-assets/screenshots` + Screen Studio |
| Illustration vectorielle / Lottie pour une scène vidéo Motion | `media/motion/registry` |
