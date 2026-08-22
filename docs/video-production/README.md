# Video Production

Ce dossier documente les pilotes video internes d'Apple MDM Academy.

## Source technique

Les metadonnees importables par l'application vivent dans :

```text
lib/video/data/video-production-registry.ts
lib/video/data/jamf-video-pilot.ts
```

La documentation narrative reste dans :

```text
docs/video-production/**
```

## Pilote Jamf

Le pilote actuel est :

```text
video-jamf-smart-groups-filevault-escrow-v1
```

Page interne :

```text
/video-production/jamf-smart-groups-filevault-escrow
```

## Audit

```bash
npm run video:audit
npm run video:audit -- --json
```

Le rapport JSON est ecrit dans le dossier temporaire du systeme et ne doit pas etre committe.

## Regle principale

Ne jamais declarer un chemin media tant que le fichier physique n'existe pas.

Une video `approved` exige :

* revue technique approuvee ;
* revue securite approuvee ;
* MP4 present ;
* WebVTT present ;
* poster WebP present ;
* transcript present ;
* `lastValidatedAt` renseigne ;
* aucune affirmation critique en attente.
