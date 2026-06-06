# Vidéos finales — Apple MDM Academy

Déposer les exports montés ici (1080p · H.264 · MP4).

## Nommage

```
/public/videos/{slug}.mp4
```

Exemples :

- `abm-intune.mp4`
- `ade-iphone.mp4`
- `apns.mp4`
- `platform-sso.mp4`
- `jamf-policies.mp4`

## Statuts

Mettre à jour `src/lib/video-publish-status.ts` :

| Statut | Signification |
|--------|---------------|
| `draft` | Brouillon |
| `storyboard-ready` | Storyboard HeyGen prêt |
| `assets-ready` | SVG + checklist prêts |
| `recording-needed` | Captures Screen Studio à produire |
| `editing` | Montage CapCut en cours |
| `published` | MP4 disponible sur le site |

## Workflow

1. Captures → `/public/video-assets/screenshots/*.webp`
2. Narration → HeyGen
3. Montage → CapCut / Screen Studio
4. Export → `/public/videos/{slug}.mp4`
5. Statut → `published` + `videoUrl` dans le registry

Vérifier les captures : `node scripts/check-video-screenshots.mjs`
