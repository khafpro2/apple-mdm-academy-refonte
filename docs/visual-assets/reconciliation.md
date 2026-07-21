# Lot 0 — Réconciliation des assets visuels

> Généré le 2026-07-21 — Apple MDM Academy Refonte

## Ce qui existe déjà

### Registres TypeScript

| Fichier | Rôle | Entrées |
|---------|------|---------|
| `lib/assets/illustration-registry.ts` | Illustrations pédagogiques (flux diagrammes larges) | 12 SVG dans `/illustrations/flows/` |
| `lib/brands/registry.ts` | Marques tierces (Apple, Jamf, Microsoft, Intune, Entra, Microsoft Learn) | 6 marques avec chemins logo, composants React, mentions légales |
| `lib/brands/types.ts` | `BrandLogoVariant`, `BrandAssetPaths`, `brandLogoSrc()` | Utilisé par tous les modules marque |
| `lib/brands/{jamf,intune,microsoft,entra,microsoft-learn}.ts` | Chemins officiels par marque | Variantes light/dark |

### Assets publics existants

| Emplacement | Contenu |
|-------------|---------|
| `public/brand/` | Logo AMA (`apple-mdm-academy-mark.svg`), icônes PWA 192/512 |
| `public/brands/{entra,intune,jamf,microsoft,microsoft-learn}/` | Logos officiels SVG (default/light/dark) |
| `public/logos/` | `apple.svg`, `jamf.svg`, `microsoft.svg`, `intune.svg`, `mdm-academy.svg`, pictogrammes UI (`certificate`, `dashboard`, `lab`, etc.) |
| `public/illustrations/` | Pictogrammes simples + 12 flux pédagogiques |
| `public/video-assets/` | Kit vidéo généré par `scripts/generate-video-assets.mjs` (48×48, style distinct) |

### Pages admin

| Route | Rôle |
|-------|------|
| `app/admin/brand-assets/page.tsx` | Audit logos marques (Jamf, Microsoft, Intune, Entra) — table statut SVG, placeholders, pages concernées |

**Aucune** route `studio-visuel` ni dossier `lib/visual-assets/` n'existait avant cette mission.

---

## Décisions d'architecture

### 1. Registre visual-assets → extension, pas duplication

- **`lib/visual-assets/asset-registry.ts`** s'intègre à l'existant :
  - Référence les logos officiels via `BRAND_REGISTRY` (`lib/brands/registry.ts`) avec `verificationStatus: "official-asset"`.
  - Référence les flux pédagogiques via `illustrationRegistry` (`lib/assets/illustration-registry.ts`) comme type `component`.
  - Enregistre les nouveaux pictogrammes dans `public/visual-assets/`.
- **Pas de** `lib/visual-assets/asset-registry.ts` parallèle à `illustration-registry.ts` — les deux coexistent avec des périmètres distincts (flux cours vs kit icônes Freeform).

### 2. Marques — pas de duplication de fichiers

- **Aucun** dossier `public/visual-assets/brand/` créé.
- Les entrées « brand » du registre pointent vers `public/brands/` et `public/logos/` existants.
- Les pictogrammes originaux (ABM, ADE, Jamf Pro service card, etc.) vont dans `public/visual-assets/icons/` — neutres, sans imiter les logos officiels.

### 3. Logo AMA — propositions séparées

- Logo actuel **inchangé** : `public/brand/apple-mdm-academy-mark.svg`, `public/logos/mdm-academy.svg`.
- Propositions A/B/C dans `public/visual-assets/logo-proposals/` uniquement.

### 4. Page d'aperçu — nouvelle route + composant partagé

| Choix | Justification |
|-------|---------------|
| **Créer** `/studio-visuel/assets` | La page admin existante est un audit légal/compliance des marques, pas une galerie d'icônes. |
| **Factoriser** `components/visual-assets/VisualAssetGallery.tsx` | Réutilisable ; lien depuis `/admin/brand-assets` vers la galerie complète. |
| **Ne pas fusionner** les deux pages | Responsabilités différentes : audit marques vs bibliothèque pictogrammes. |

### 5. Tokens couleur

- **`lib/visual-assets/icon-tokens.ts`** — namespace dédié au système d'icônes (palette enterprise).
- **`lib/brands/`** inchangé — tokens marque existants conservés dans leurs modules respectifs.

### 6. Génération vs hand-crafted

- Script `scripts/generate-visual-assets.mjs` produit les SVG avec conventions uniformes (viewBox 64×64, stroke 2.5).
- Script `scripts/export-visual-assets.mjs` valide, exporte PNG (Sharp), planches Freeform, manifeste JSON.
- Cohérent avec le pattern `generate-video-assets.mjs` existant.

### 7. Relation avec `public/video-assets/`

- **Conservé tel quel** — kit vidéo 48×48 pour production Heygen.
- **Nouveau** `public/visual-assets/` — système enterprise 64×64 + composants Freeform. Pas de migration automatique pour éviter régressions vidéo.

---

## Ce qui est créé (nouveau namespace justifié)

| Namespace | Raison |
|-----------|--------|
| `public/visual-assets/` | Bibliothèque SVG enterprise cohérente (icônes, cartes, connecteurs, planches Freeform) — périmètre absent de l'existant |
| `lib/visual-assets/` | Types, tokens, registre unifié branché sur brands + illustrations |
| `app/studio-visuel/assets/` | Galerie interne de prévisualisation (URL demandée dans le cahier des charges) |
| `components/visual-assets/` | Composant galerie réutilisable |
| `docs/visual-assets/` | Documentation et réconciliation |

---

## Inventaire des extensions (pas de remplacement)

| Structure existante | Extension |
|--------------------|-----------|
| `lib/assets/illustration-registry.ts` | Référencé depuis `asset-registry.ts` ; pas modifié |
| `lib/brands/registry.ts` | Référencé pour assets officiels ; pas modifié |
| `app/admin/brand-assets/page.tsx` | Lien ajouté vers `/studio-visuel/assets` |
| `package.json` | Scripts `generate:visual-assets` et `export:visual-assets` |
