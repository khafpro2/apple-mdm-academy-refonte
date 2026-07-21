# Workflow — Illustrations Motion Design ↔ vidéos de cours

## Décision produit

Les vidéos de cours restent **hybrides** :

| Couche | Outil | Rôle |
| --- | --- | --- |
| Voix / présentateur | HeyGen | Narration fr-FR |
| Captures produit | Screen Studio | ABM, Jamf, Intune, macOS réels |
| Illustrations | Motion Design System | SVG / Lottie réutilisables (cadenas, flux, statuts…) |
| Montage | CapCut | Assemblage final → MP4 |

Le registre Motion Design est la **source de vérité des assets graphiques**. Les storyboards vidéo référencent des `sceneIds` et des `asset.id` ; ils ne dupliquent pas les métadonnées.

## Flux

```text
Brief scène
  → assets status: missing → brief-ready
  → génération / vectorisation → generated → selected
  → (retouch-required) → review → approved (+ path réel)
  → export pack production
  → CapCut (HeyGen + Screen Studio + assets approved)
  → /public/videos/<slug>.mp4
  → checks pipeline existants
```

## Pipeline vidéo existant

Guide rapide : [`/resources/heygen-screen-studio-workflow`](/resources/heygen-screen-studio-workflow)

Packs admin : `/admin/video-pipeline/production-packs`

Vérifications :

```bash
node scripts/check-video-screenshots.mjs
npm run audit:motion-assets
```

## Règles

1. Ne pas monter un asset `deprecated` dans une nouvelle scène.
2. Ne pas inventer un chemin `path` tant que le fichier n’existe pas sous `media/motion/assets/`.
3. Les captures Screen Studio restent obligatoires pour les démos MDM ; les assets Motion ne les remplacent pas.
4. Marques hors Apple / Jamf / Microsoft interdites dans les assets (aligné V1).

## Pilote

Scène : [`scene-002-filevault-encryption`](../scenes/scene-002-filevault-encryption.md)

Asset seed : `security-lock-front-closed-cyan-v1` (`status: missing`, sans `path`).

## CapCut (doc production uniquement)

CapCut n’est **pas** une dépendance npm ni un composant du dépôt. C’est uniquement l’outil de montage manuel cité dans le workflow production (VO HeyGen + captures Screen Studio + assets Motion `approved`).
