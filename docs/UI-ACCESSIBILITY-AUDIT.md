# Audit UI, responsive et accessibilité (V1)

Document de référence pour la branche `audit-ui-accessibility`.

## Objectif

Améliorer l’interface, le responsive, l’accessibilité et la navigation **sans** modifier les banques QCM, les examens, ni les landing pages gérées en parallèle.

## Breakpoints vérifiés

| Largeur | Usage |
|---------|--------|
| 320 px | iPhone SE / petits écrans |
| 375 px | iPhone standard |
| 768 px | Tablette |
| 1024 px | Laptop / sidebar desktop |
| 1440 px | Desktop large |

## Pages prioritaires

| Route demandée | Route réelle |
|----------------|--------------|
| `/` | `/` |
| `/parcours` | `/parcours` |
| `/dashboard` | `/dashboard` |
| `/examens` | `/examens` |
| `/modules` | **n’existe pas** → `/cours` |
| `/ressources` | **n’existe pas** → `/resources` |
| `/certifications` | `/certifications` |

## Corrections appliquées (cette branche)

- Overflow horizontal global (`html` / `body` + shell)
- Skip-link unique (layout racine uniquement)
- Header mobile : zone tactile 44×44, aria open/close, raccourci recherche
- Sidebar : cibles tactiles, focus visible
- Footer : liens Examens / Cours / Certifications, disclaimer non-affiliation
- Breadcrumb : `aria-label`, `aria-current`, liste ordonnée
- Boutons / liens : `min-h-11`, focus visible sur `ButtonLink`
- EmptyState / 404 : titre sémantique `h1` possible
- Sidebar : Apple Security → `/examens/apple-security` ; entrées Tarifs / Support

## Non corrigé ici (fichiers interdits ou hors scope)

- Landing (`components/landing/*`)
- Banques examens (`lib/exam/`, quizzes, tracks)
- Page catalogue `/parcours` (`app/parcours/page.tsx`)
- Contenu pédagogique Apple Fundamentals / Jamf 100

## Accessibilité — checklist rapide

- [x] Skip link « Aller au contenu principal »
- [x] `lang="fr"` sur `<html>`
- [x] Focus visible global (`:focus-visible`)
- [x] Menu mobile Escape + overlay
- [x] Labels sr-only sur recherche header
- [ ] Audit contraste WCAG AA exhaustif (à poursuivre)
- [ ] Audit lecteurs d’écran VoiceOver/NVDA (manuel)

## Navigation

Scripts utiles :

```bash
node scripts/check-internal-links.mjs
```

Aucun crawler supplémentaire n’a été ajouté.
