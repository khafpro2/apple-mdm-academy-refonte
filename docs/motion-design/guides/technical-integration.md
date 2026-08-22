# Integration technique — Motion Design System

Ce guide explique comment ajouter ou faire evoluer un asset Motion Design sans inventer de fichier media.

## Source de verite

La source de verite applicative est :

```text
media/motion/registry/assets.json
media/motion/registry/scenes.json
```

La documentation narrative reste dans :

```text
docs/motion-design/**
```

Les fichiers physiques ne sont ajoutes que lorsqu'ils existent vraiment :

```text
public/motion/svg/
public/motion/posters/
public/motion/backgrounds/
public/motion/icons/
public/motion/thumbnails/
public/motion/illustrations/
```

Legacy (V1, encore accepte par le validateur) :

```text
media/motion/assets/
```

## Ajouter un asset

1. Choisir une categorie autorisee : `environment`, `device`, `identity`, `network`, `cloud`, `security`, `management`, `application`, `policy`, `compliance`, `certificate`, `data-flow`, `status`, `transition`, `character`, `diagram`, `background`.
2. Creer un `id` en kebab-case, commencant par la categorie et finissant par `vN`.
3. Renseigner les champs obligatoires dans `media/motion/registry/assets.json`.
4. Ajouter l'identifiant de scene dans `sceneIds`.
5. Laisser `path` absent tant que le fichier n'existe pas.

Exemple sans fichier :

```json
{
  "id": "security-lock-front-closed-cyan-v1",
  "category": "security",
  "status": "brief-ready",
  "format": "svg",
  "path": null
}
```

Dans le registre final, ne pas mettre `path: null` : supprimer simplement le champ `path`.

## Ajouter un fichier physique

Quand le fichier existe reellement :

1. le placer sous le sous-dossier adapte de `public/motion/` (ex. `svg/`, `icons/`, `illustrations/`) ;
2. verifier que son nom correspond a `<id>.<extension>` ;
3. renseigner `path` sous la forme `/motion/<sous-dossier>/<id>.<extension>`
   (ex. `/motion/svg/security-lock-front-closed-cyan-v1.svg`) ;
4. passer le statut a `generated`, `selected`, `retouch-required`, `review` ou `approved`.

Un asset `approved` doit declarer un chemin existant.

## Accessibilite

Asset informatif :

```json
{
  "decorative": false,
  "altText": "Cadenas ferme representant la protection des donnees."
}
```

Asset decoratif :

```json
{
  "decorative": true,
  "altText": ""
}
```

## Relier un asset a une scene

La relation est bidirectionnelle :

* l'asset reference la scene dans `sceneIds` ;
* la scene reference l'asset dans `assetIds`.

L'audit signale une erreur si un seul cote de la relation est renseigne.

## Deprecier un asset

1. Passer `status` a `deprecated`.
2. Conserver le `path` si le fichier existe encore.
3. Retirer l'asset des scenes actives ou accepter l'avertissement temporaire.
4. Ajouter une note dans la documentation de scene si la migration est en cours.

## Preparer une future video

Les scenes peuvent prevoir plus tard :

* illustration SVG ;
* capture Screen Studio ;
* poster WebP ;
* video MP4 ;
* sous-titres WebVTT ;
* transcript ;
* payload HeyGen.

Ne renseigner ces chemins que lorsque les fichiers existent.

## Lancer l'audit

```bash
npm run audit:motion-assets
```

Rapport JSON (gitignored) :

```bash
npm run audit:motion-assets -- --json
# → reports/motion-assets-audit.json
```

## Comprendre les erreurs

* `required-field` : champ obligatoire absent.
* `id-convention` : identifiant hors convention.
* `scene-asset-missing` : une scene reference un asset absent du registre.
* `scene-asset-backref` : l'asset ne reference pas la scene en retour.
* `path-missing-file` : le chemin declare ne correspond a aucun fichier physique.
* `approved-path-required` : un asset approuve n'a pas de fichier valide.

La regle principale reste simple : un statut ne prouve jamais l'existence d'un fichier.
