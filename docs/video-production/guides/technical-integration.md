# Integration technique des videos

## Enregistrer une video

1. Ajouter une entree dans `lib/video/data/**`.
2. Exporter l'entree via `lib/video/data/video-production-registry.ts`.
3. Garder la documentation narrative dans `docs/video-production/**`.
4. Lancer `npm run video:audit`.

## Declarer les captures

Chaque capture doit indiquer :

* `id` ;
* chapitre ;
* objectif ;
* statut ;
* zone Jamf/Apple/Microsoft ;
* action ;
* resultat attendu ;
* placeholders sensibles ;
* masquage requis ;
* `sourceMediaPath` uniquement si le fichier existe.

## Declarer les medias

Les noms attendus peuvent etre prepares, mais les chemins restent absents tant que les fichiers n'existent pas.

Chemins acceptes :

```text
/public/videos/
/public/video-assets/
/public/media/video-production/
```

## Passer a approved

Avant `approved` :

* toutes les captures requises sont approuvees ;
* la revue technique est approuvee ;
* la revue securite est approuvee ;
* aucun point critique n'est `pending-verification` ;
* MP4, VTT, poster et transcript existent physiquement ;
* `lastValidatedAt` est renseigne au format `YYYY-MM-DD`.

## Passer a published

`published` demande les memes garanties que `approved`, plus une integration reelle dans un cours public.

## Scinder une video parent

Utiliser :

* `parentVideoId` sur les futures videos enfants ;
* `chapterIds` pour garder la structure actuelle ;
* `relatedVideoIds` pour relier les futurs slugs ;
* `splitCandidate` et `splitRecommendation` pour documenter la decision.

Ne pas creer deux videos publiques tant que la decision editoriale n'est pas validee.

## Donnees sensibles

Placeholders autorises :

```text
[CLÉ MASQUÉE]
[COMPTE DE LABORATOIRE]
[TENANT DE DÉMONSTRATION]
[URL MASQUÉE]
[NUMÉRO DE SÉRIE FICTIF]
[APPAREIL DE TEST]
```

Ne jamais stocker de cle FileVault, token Jamf, URL privee, mot de passe, numero de serie reel ou email personnel.

## Mise a jour apres changement Jamf ou macOS

1. Remettre les claims concernes en `pending-verification`.
2. Mettre a jour les captures attendues.
3. Relancer `npm run video:audit`.
4. Ne repasser a `approved` qu'apres revue technique et securite.
