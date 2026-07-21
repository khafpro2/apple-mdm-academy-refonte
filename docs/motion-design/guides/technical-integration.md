# Intégration technique — registre des scènes motion

Guide débutant pour ajouter, auditer et publier une scène motion sans modifier plusieurs composants à la main.

## Où ajouter une scène

1. Créer `lib/motion/data/scenes/<slug>.ts` exportant un objet `MotionScene`.
2. L’ajouter au tableau `motionScenes` dans `lib/motion/data/scenes/index.ts`.
3. Relancer `npm run motion:audit`.

Exemple minimal :

```ts
import type { MotionScene } from "@/lib/motion/types";

export const maScene: MotionScene = {
  id: "scene-ma-scene",
  slug: "ma-scene",
  title: "Titre pédagogique",
  durationSeconds: 300,
  status: "draft",
  version: "1.0.0",
  courseIds: ["apple-fundamentals"],
  objectives: ["Objectif 1"],
  narration: { primaryMessage: "Message principal clair." },
  accessibility: { altText: "Description courte de la scène." },
  assetIds: [],
};
```

La scène de référence est **FileVault** : `lib/motion/data/scenes/filevault.ts`.

## Où ajouter un asset

1. Créer ou étendre `lib/motion/data/assets/<slug>.ts`.
2. L’exporter dans `lib/motion/data/assets/index.ts`.
3. Référencer son `id` dans `scene.assetIds`.
4. Mettre `sceneIds` cohérents sur l’asset.

## Comment nommer les fichiers

- Dossier : `public/media/motion/<slug>/`
- Vidéo : `<slug>.mp4` (et optionnellement `<slug>.webm`)
- Sous-titres : `<slug>.fr-FR.vtt`
- Transcript : `<slug>.fr-FR.transcript.md`
- Poster : `poster.webp` ou réutiliser `/video-assets/thumbnails/<slug>.svg`

**Interdit** comme nom de fichier (stem) : `final`, `final-v2`, `new`, `latest`, `test`, `image1`, `asset1`.

Pas de fichiers temporaires (`.tmp`, `~`, `.DS_Store`).

## Comment lancer l’audit

```bash
npm run motion:audit
npm run motion:audit -- --json
npm run motion:audit -- --json --out=.tmp/motion-audit.json
```

Le code de sortie est **non nul** s’il y a des erreurs bloquantes.

## Comment interpréter les erreurs

| Code typique | Signification | Action |
|--------------|---------------|--------|
| `scene-id-duplicate` / `scene-slug-duplicate` | Doublon | Renommer id/slug |
| `scene-asset-unknown` | Asset non enregistré | Ajouter l’asset au registre |
| `scene-status-invalid` | Statut inconnu | Utiliser un statut de `MOTION_SCENE_STATUSES` |
| `scene-media-vtt-missing` | VTT obligatoire | Ajouter `media.vttPath` + fichier |
| `file-missing` | Fichier absent sur disque | Produire l’asset ou baisser le statut |
| `asset-forbidden-name` | Nom générique | Renommer proprement |
| `scene-media-path-forbidden` | Chemin hors préfixes autorisés | Utiliser `/media/motion/`, `/video-assets/`, etc. |

Les **warnings** (ex. média absent sur `draft`) n’échouent pas l’audit.

## Comment publier une scène

1. Assets `ready` avec chemins valides et fichiers présents.
2. Média : MP4 (ou WebM), VTT, transcript, poster.
3. `media.status` → `ready` puis `published`.
4. `scene.status` → `approved` (preview) puis `published` (cours).
5. Relancer `npm run motion:audit` — doit être vert.

Règles runtime (ne pas les recopier dans les composants) :

- `canDisplayScenePublicly(scene)` → uniquement `published`
- `canPreviewScene(scene)` → `approved` ou `published`

## Comment déprécier une scène

1. Passer `status` à `deprecated`.
2. La scène est masquée (`isSceneHidden`) et n’apparaît plus dans les listes publiques.
3. Ne pas supprimer immédiatement les fichiers (traçabilité).

## Comment éviter les doublons

- Un seul `id` et un seul `slug` par scène.
- Un seul `id` par asset.
- L’audit détecte les doublons et échoue.
- Ne pas créer de second registre manuel : importer `@/lib/motion/registry`.

## Comment ajouter une vidéo

1. Placer le fichier dans `public/media/motion/<slug>/<slug>.mp4`.
2. Déclarer `media.mp4Path` (et optionnellement `webmPath`).
3. Mettre à jour `durationSeconds` si besoin.
4. Auditer.

## Comment ajouter un VTT

1. Fichier `public/media/motion/<slug>/<slug>.fr-FR.vtt`.
2. Déclarer `media.vttPath`.
3. Obligatoire dès `approved` / `published`.

## Comment ajouter un transcript

1. Fichier Markdown ou texte sous `public/media/motion/<slug>/`.
2. Déclarer `media.transcriptPath`.
3. Obligatoire dès `approved` / `published`.

## Source de vérité

Voir [source-of-truth.md](./source-of-truth.md) — Option A, fichiers TypeScript uniquement.

## Build / CI

- Développement : `npm run motion:audit` (recommandé avant PR).
- Ne bloque pas le build Next pour les médias absents sur scènes draft.
- Bloque si : données invalides, doublons, scène `published`/`approved` sans média/VTT/transcript, chemins invalides.
