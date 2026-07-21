# Motion Design System — Apple MDM Academy

## Documentation

| Document | Rôle |
| --- | --- |
| [schemas/asset-metadata.md](schemas/asset-metadata.md) | Schéma de métadonnées |
| [guides/asset-naming-conventions.md](guides/asset-naming-conventions.md) | Conventions d’`id` |
| [guides/video-illustration-workflow.md](guides/video-illustration-workflow.md) | Lien HeyGen + Screen Studio + CapCut |
| [guides/technical-integration.md](guides/technical-integration.md) | Integration technique et audit |
| [scenes/scene-002-filevault-encryption.md](scenes/scene-002-filevault-encryption.md) | Pilote FileVault |

## Registre

```text
media/motion/registry/assets.json
media/motion/registry/scenes.json
media/motion/assets/                 # fichiers physiques uniquement s’ils existent
```

## Audit

```bash
npm run motion:audit
npm run audit:motion-assets
```

## Code

```text
lib/motion/asset-types.ts
lib/motion/asset-id.ts
lib/motion/validate-assets.ts
scripts/audit-motion-assets.ts
```
