# Audit médias — Apple / Jamf Pro / Microsoft Intune

Date: 2026-06-07

## Résumé

Inventaire public audité:

- 182 médias dans `public/`: 95 `.webp`, 76 `.svg`, 11 `.png`.
- Aucun vrai fichier vidéo publié dans `public/videos/` au moment de l'audit (`.gitkeep` et `README.md` uniquement).
- Aucun screenshot de production vidéo publié dans `public/video-assets/screenshots/` au moment de l'audit.
- 90 captures pédagogiques générées référencées dans `public/images/courses/generation-manifest.json`.
- 16 fichiers "originaux officiels" conservés dans `public/images/courses/*-originals/`.

Conclusion courte:

- OK pour utiliser des captures produites dans nos propres tenants/labs, avec données fictives et sans informations client.
- OK pour utiliser les captures Microsoft dans un contexte documentaire/tutoriel si elles respectent les conditions Microsoft: pas d'altération sauf redimensionnement, pas de contenu tiers, pas d'individu identifiable.
- Prudence élevée sur Apple: utiliser plutôt liens officiels, captures de notre propre lab ABM, ou visuels pédagogiques originaux non présentés comme officiels.
- Prudence élevée sur Jamf: ne jamais utiliser de contenus issus des formations Jamf. Préférer captures de notre propre instance lab ou ressources marketing publiques avec attribution et usage limité.

## Sources consultées

- Apple Intellectual Property: https://www.apple.com/legal/intellectual-property/
- Apple Training Resources: https://training.apple.com/resources
- Jamf Training Policies: https://www.jamf.com/trust-center/legal/jamf-training-policies/
- Jamf Product Documentation: https://www.jamf.com/resources/product-documentation/
- Jamf Brand Style Guide for Partners: https://resources.jamf.com/documents/services/Jamf_Brand_Style_Guide_for_Partners.pdf
- Microsoft Intune documentation: https://learn.microsoft.com/en-us/mem/intune/
- Microsoft copyrighted content permissions: https://www.microsoft.com/en-us/legal/intellectualproperty/copyright/permissions

## Décision par type d'asset

| Zone | Statut | Décision |
| --- | --- | --- |
| `public/images/courses/intune-originals/*` | Utilisable sous conditions | Conserver si source Microsoft Learn documentée, pas modifié sauf redimensionnement, pas de données tierces/personnelles. |
| `public/images/courses/apple-originals/*` | Risque moyen/élevé | Ne pas injecter largement. Garder comme référence interne ou remplacer par captures lab ABM propres. |
| `public/images/courses/jamf-originals/*` | Risque moyen | Utiliser seulement si asset marketing public Jamf, jamais depuis training materials. Préférer captures de lab Jamf Pro. |
| `public/images/courses/*/*.webp` générés | Utilisable avec correction de wording | OK comme illustrations pédagogiques, mais ne pas les appeler "official", "real interface" ou "capture officielle". |
| `public/logos/apple.svg` | Risque élevé | Remplacer par un symbole générique "Apple platform" ou utiliser uniquement du texte, sauf autorisation explicite Apple. |
| `public/logos/jamf.svg` | Risque faible/moyen | Le fichier actuel est un pictogramme générique, pas un logo officiel Jamf; éviter de le présenter comme marque Jamf. |
| `public/logos/microsoft.svg` | Risque moyen | Le pictogramme reprend fortement la forme Microsoft; préférer texte "Microsoft" ou icône générique carrés/cloud. |
| `public/video-assets/*` | Généralement OK | SVG créés localement; attention aux noms "apple-light", "microsoft-learn", "jamf-training" qui peuvent suggérer une affiliation officielle. |
| `public/videos/` | OK | Aucun MP4 publié. Les vidéos futures doivent être produites maison, sans extraction de vidéos Apple/Jamf/Microsoft. |
| `apple-official-originals.zip`, `jamf-pro-official-originals.zip`, `intune-official-originals.zip` à la racine | Risque repo | Ces archives ne sont pas servies publiquement, mais ne devraient pas être distribuées si elles contiennent des assets tiers non nécessaires. |

## Assets officiels actuellement servis par le code

Définis dans `lib/data/official-screenshots.ts`:

- Microsoft: IDs `29`, `30`, `37`, `39`, `60`.
- Jamf: IDs `64`, `66`, `74`.
- Apple: IDs `abm-apps`, `abm-federation`.

Recommandation:

- Microsoft: acceptable en documentation/tutoriel si conditions respectées.
- Jamf: acceptable seulement si asset public marketing/documentation, pas extrait de formation; ajouter attribution visible si possible.
- Apple: éviter de servir ces assets en production sans vérification stricte des droits; remplacer par captures de notre lab ABM ou par schémas originaux.

## Risques identifiés

### 1. Prompts de génération trop ambigus

Les 90 entrées de `public/images/courses/generation-manifest.json` contiennent des formulations comme:

- `Apple Training official`
- `real interface`
- `Jamf Training Catalog style`
- `Microsoft Learn style`

Risque: ces libellés peuvent faire croire que les images générées sont des captures officielles ou affiliées.

Action recommandée:

- Remplacer les styles par: `original educational UI mockup`, `vendor-neutral training illustration`, `no official logos`.
- Dans l'UI, afficher "Illustration pédagogique" au lieu de "Asset officiel" pour tout asset généré.

### 2. Logos Apple / Microsoft

`public/logos/apple.svg` reproduit la silhouette Apple. Apple encadre strictement l'usage de ses marques, images et symboles.

Action recommandée:

- Remplacer `apple.svg` par un pictogramme générique d'appareil ou bouclier.
- Remplacer `microsoft.svg` par une icône générique "cloud/identity" si l'usage est décoratif.
- Garder les noms de produits dans le texte descriptif, pas en logo décoratif.

### 3. Jamf training materials

Jamf interdit la copie, publication ou reproduction des matériels de formation Jamf, et interdit les enregistrements de sessions de training.

Action recommandée:

- Ne jamais utiliser de screenshots ou vidéos issus de Jamf 100/200/300/400 training officiel.
- Utiliser seulement notre instance lab Jamf Pro, des captures anonymisées, ou des liens vers la documentation Jamf.

### 4. Archives racine

Les dossiers/zips racine suivants ne sont pas dans `public/`, mais peuvent être embarqués dans un dépôt distribué:

- `apple-official-originals/`
- `apple-official-originals.zip`
- `intune-official-originals/`
- `intune-official-originals.zip`
- `jamf-pro-captures/`
- `jamf-pro-captures.zip`
- `jamf-pro-official-originals/`
- `jamf-pro-official-originals.zip`

Action recommandée:

- Conserver uniquement si nécessaires au workflow interne.
- Ajouter dans `.gitignore` si ce sont des sources brutes non redistribuables.
- Ne pas les publier dans une release ou un package.

## Règles pratiques pour les prochaines vidéos

Autorisé / recommandé:

- Captures de notre propre tenant Intune/Entra avec utilisateurs fictifs.
- Captures de notre ABM de lab si aucun compte réel, domaine réel sensible ou numéro de série réel n'apparaît.
- Captures de notre instance Jamf Pro lab avec données fictives.
- Schémas originaux SVG/HTML créés pour expliquer architecture, flux APNs, ADE, Platform SSO, Conditional Access.
- Liens vers pages Apple/Jamf/Microsoft au lieu de recopier leurs contenus.

À éviter:

- Vidéos Apple Training, Jamf Training, Microsoft Learn téléchargées ou réutilisées.
- Logos officiels Apple/Jamf/Microsoft comme éléments décoratifs ou preuve d'affiliation.
- Badges Apple/Jamf/Microsoft officiels sauf obtention réelle et usage conforme.
- Screenshots contenant noms de personnes, emails réels, serial numbers, tenant IDs, domaines internes, device IDs.
- Captures de documents PDF/cours propriétaires Jamf.

## Priorités

1. Remplacer `public/logos/apple.svg` par une icône générique.
2. Nettoyer les prompts `generation-manifest.json` et les labels "official" pour les images générées.
3. Décider si les deux assets Apple servis (`abm-apps`, `abm-federation`) restent en production ou deviennent références internes.
4. Créer un dossier `public/images/courses/lab-captures/` pour les captures réellement produites dans les labs.
5. Ajouter une convention: chaque asset externe doit avoir `sourceUrl`, `licenseNote`, `allowedUse`, `lastReviewedAt`.
