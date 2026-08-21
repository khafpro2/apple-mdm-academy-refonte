# Catalogue vidéo (contenu futur)

Ce dossier accueillera les métadonnées et manifests vidéo produits par l'équipe de production.

Structure prévue :

```
content/videos/
  manifests/     # JSON/TS par série ou cours
  transcripts/   # Transcriptions brutes
  subtitles/     # Fichiers VTT
```

Les composants consomment ces fichiers via `lib/motion/videos.ts` et `lib/video/`.
