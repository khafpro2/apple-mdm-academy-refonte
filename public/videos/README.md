# Vidéos finales — Apple MDM Academy

Déposer les exports montés ici (1080p · H.264 · MP4).

## Nommage

Deux conventions acceptées :

```
/public/videos/{slug}.mp4
/public/videos/{alias}.mp4
```

## 8 vidéos officielles prioritaires

| Fichier alias | Slug LMS |
|---------------|----------|
| `abm.mp4` | apple-business-manager |
| `abm-intune.mp4` | abm-intune |
| `ade.mp4` | ade-iphone |
| `apns.mp4` | apns |
| `managed-apple-id.mp4` | managed-apple-ids |
| `platform-sso.mp4` | platform-sso |
| `jamf-pro.mp4` | jamf-pro-fundamentals |
| `filevault.mp4` | filevault |

Le lecteur résout automatiquement le premier fichier MP4 trouvé (`resolveMp4Url`).

## Pipeline publication

1. Storyboards → `/videos/[slug]`
2. Captures → `/public/video-assets/screenshots/*.webp`
3. Narration → HeyGen
4. Montage → CapCut / Screen Studio
5. Export → `/public/videos/{alias}.mp4`
6. Validation → `/admin/video-pipeline`
7. Publication automatique dès que le MP4 est détecté

## Admin

- `/admin/video-pipeline` — suivi des 8 vidéos officielles
- `/admin/video-library` — bibliothèque complète + qualité
- `/transcripts` — transcripts publics

Vérifier les captures : `node scripts/check-video-screenshots.mjs`
