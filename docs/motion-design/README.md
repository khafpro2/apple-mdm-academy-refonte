# Motion Design System — Apple MDM Academy

## Documentation

| Document | Rôle |
| --- | --- |
| [schemas/asset-metadata.md](schemas/asset-metadata.md) | Schéma de métadonnées |
| [guides/asset-naming-conventions.md](guides/asset-naming-conventions.md) | Conventions d’`id` |
| [guides/coexistence-registries.md](guides/coexistence-registries.md) | Coexistence illustration-registry / video-assets / Motion |
| [guides/video-illustration-workflow.md](guides/video-illustration-workflow.md) | Lien HeyGen + Screen Studio (+ CapCut en doc production) |
| [guides/technical-integration.md](guides/technical-integration.md) | Intégration technique et audit |
| [scenes/scene-002-filevault-encryption.md](scenes/scene-002-filevault-encryption.md) | Pilote FileVault |

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
