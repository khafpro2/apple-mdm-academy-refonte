# Jamf Pro official originals

Assets publics Jamf (`jamf.com`) utilisés dans Apple MDM Academy.

## Fichiers dans ce dossier

| Fichier | Usage cours (ID) | Source |
|---------|------------------|--------|
| `64-dashboard-jamf-official.webp` | Dashboard Jamf (64) | [jamf-for-mac-dashboard](https://media.jamf.com/images/products/jamf-for-mac-dashboard-block-level.webp?q=80&w=1600) |
| `66-mobile-devices-official.webp` | Mobile Devices (66) | [jamf-pro-secure-devices](https://media.jamf.com/images/products/jamf-pro-secure-devices-2x.webp?q=80&w=1600) |
| `74-inventory-official.webp` | Inventory (74) | [jamf-pro-secure-devices](https://media.jamf.com/images/products/jamf-pro-secure-devices-2x.webp?q=80&w=1600) |
| `69-policies-blueprints-official.webp` | Policies / Blueprints (69) | [jamf-pro-everything-management](https://media.jamf.com/images/products/jamf-pro-everything-management-2x.webp?q=80&w=1600) |
| `jamf-pro-ai-assistant-official.webp` | Scripts / Protect (72, 78) | [jamf-pro-ai](https://media.jamf.com/images/products/jamf-pro-harness-the-power-of-ai_copy.webp?q=80&w=1600) |
| `jamf-pro-screenshot-official.png` | Vue produit générique (65–71, 73, 75–77, examens 89–90) | [jamf-pro-screenshot](https://media.jamf.com/images/jamf-pro-screenshot_@2x.png) |

## Intégration plateforme

- Les cours Jamf servent ces fichiers via `lib/data/official-screenshots.ts` (priorité sur les captures générées).
- Badge **Asset officiel Jamf** affiché sur les captures concernées.
- Synchroniser tous les visuels officiels (Apple, Intune, Jamf) :

```bash
npm run sync:official-screenshots
```

## Notes légales

- Assets marketing Jamf publics — pas des captures d'un tenant Jamf Pro privé.
- © 2002–2026 Jamf. Tous droits réservés.
- Jamf ne publie pas de remplacements 1:1 pour tous les écrans (Smart Groups, Packages, etc.) : la vue produit générique ou l'asset le plus proche est utilisé.
