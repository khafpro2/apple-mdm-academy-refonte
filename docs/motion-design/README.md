# Motion design

Pipeline d’intégration des scènes motion (métadonnées, assets, audit).

- **Source de vérité** : [guides/source-of-truth.md](./guides/source-of-truth.md) (Option A — TypeScript)
- **Guide d’intégration** : [guides/technical-integration.md](./guides/technical-integration.md)
- **Code** : `lib/motion/**`
- **Médias dédiés** : `public/media/motion/`
- **Audit** : `npm run motion:audit`

Les dossiers `templates/`, `schemas/` et `production/` accueilleront la documentation narrative et les packs de production Claude ; ils ne constituent **pas** la source de vérité runtime.
