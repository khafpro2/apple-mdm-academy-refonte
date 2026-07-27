# Motion Design System — Apple MDM Academy

## Documentation

| Document | Rôle |
| --- | --- |
| [schemas/asset-metadata.md](schemas/asset-metadata.md) | Schéma de métadonnées |
| [guides/asset-naming-conventions.md](guides/asset-naming-conventions.md) | Conventions d’`id` |
| [guides/coexistence-registries.md](guides/coexistence-registries.md) | Coexistence illustration-registry / video-assets / Motion |
| [guides/video-illustration-workflow.md](guides/video-illustration-workflow.md) | Lien HeyGen + Screen Studio (+ CapCut en doc production) |
| [guides/technical-integration.md](guides/technical-integration.md) | Intégration technique et audit |
| [scenes/scene-002-filevault-encryption.md](scenes/scene-002-filevault-encryption.md) | Scène FileVault (illustration seule) |
| [pilots/pilot-a-abm-ade-enrollment.md](pilots/pilot-a-abm-ade-enrollment.md) | Pilote vidéo complet (a) — ABM + ADE |
| [pilots/pilot-b-intune-apns-enrollment.md](pilots/pilot-b-intune-apns-enrollment.md) | Pilote vidéo complet (b) — Intune + APNs |
| [pilots/pilot-c-jamf-smart-groups-filevault-escrow.md](pilots/pilot-c-jamf-smart-groups-filevault-escrow.md) | Pilote vidéo complet (c) — Jamf Smart Groups + FileVault escrow |

## Scènes vs pilotes — ne pas confondre

* **`scenes/*.md`** documente une **illustration Motion** isolée (ex. l'icône FileVault fermée), rattachée au registre `media/motion/registry`.
* **`pilots/*.md`** documente une **vidéo pédagogique complète** (fiche, objectifs, storyboard scène par scène, captures, texte HeyGen, sous-titres, quiz, sources, checklist) — orchestrée via `src/lib/video-*` (scripts, storyboards, pipeline de publication), et référence une ou plusieurs scènes Motion pour ses illustrations (ex. le pilote (c) référence `scene-005-jamf-smart-groups-filevault-escrow-flow`).

Voir [guides/coexistence-registries.md](guides/coexistence-registries.md) pour la répartition complète entre les trois systèmes (illustrations LMS, assets pipeline vidéo, Motion Design).

## Source de vérité (V1)

```text
media/motion/registry/assets.json
media/motion/registry/scenes.json
```

Les exemples YAML dans la documentation ne sont **pas** une seconde source active.

Fichiers physiques (uniquement s’ils existent) :

```text
public/motion/svg/
public/motion/posters/
public/motion/backgrounds/
public/motion/icons/
public/motion/thumbnails/
public/motion/illustrations/
```

Legacy encore accepté : `media/motion/assets/`.

## Galerie interne

```text
/admin/motion-assets
```

Protégée par `requireAdmin` (`app/admin/layout.tsx`) + `robots: noindex`.

## Audit

```bash
npm run audit:motion-assets
npm run test:motion
```

Rapport JSON optionnel (gitignored) :

```bash
npm run audit:motion-assets -- --json
# → reports/motion-assets-audit.json
```

## Code

```text
lib/motion/asset-types.ts
lib/motion/asset-id.ts
lib/motion/validate-assets.ts
lib/motion/registry.ts
components/motion/*
scripts/audit-motion-assets.ts
```
