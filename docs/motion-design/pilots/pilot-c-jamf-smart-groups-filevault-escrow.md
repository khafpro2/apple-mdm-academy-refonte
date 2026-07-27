# Pilote vidéo (c) — Jamf Pro : Smart Groups et séquestre de la clé FileVault

```text
id: video-jamf-smart-groups-filevault-escrow-v1
slug: jamf-smart-groups-filevault-escrow
statut: script-ready
version: v1
scène motion associée: scene-005-jamf-smart-groups-filevault-escrow-flow
```

Ce dossier consolide le travail déjà réalisé sur la branche `codex/jamf-video-pilot` (jamais fusionnée, `lib/video/data/jamf-video-pilot.ts` + `docs/video-production/pilots/jamf-smart-groups-filevault-escrow.md`) et l'aligne sur le format de production retenu pour cette relance. **C'est le pilote le plus avancé des trois** : storyboard complet de 10 minutes, 21 captures identifiées avec garde-fous de sécurité. Aucune capture, aucune narration enregistrée, aucun montage n'existe encore.

## 1. Fiche pédagogique

| Champ | Valeur |
| --- | --- |
| Titre | Smart Groups et séquestre des clés FileVault dans Jamf Pro |
| Niveau | Intermédiaire |
| Durée cible | 10–12 minutes (storyboard actuel : 600 s exactement) |
| Cours associés | `jamf-100`, `jamf-200`, `apple-security` |
| Quiz de fin | Réutiliser la couverture Smart Groups / FileVault déjà présente dans les quiz Jamf existants (`lib/data/jamf/*`) |
| Recommandation de découpage | Conserver temporairement une vidéo parent à 2 chapitres pour valider le pipeline ; scinder en 2 vidéos (Smart Groups / FileVault escrow) avant tournage si la revue éditoriale confirme deux objectifs distincts |

## 2. Objectifs d'apprentissage

1. Expliquer le rôle des Smart Computer Groups dans le ciblage dynamique Jamf Pro.
2. Distinguer le chiffrement FileVault (macOS) de la gestion d'escrow par Jamf Pro (Jamf ne chiffre pas à la place de FileVault).
3. Identifier les contrôles de sécurité à respecter avant de filmer une instance Jamf réelle.

**Résultats attendus** : un administrateur sait préparer une capture de Smart Group sans donnée sensible ; sait expliquer l'escrow d'une clé FileVault sans afficher de clé réelle ; l'équipe production sait quels médias restent manquants avant montage.

## 3. Schéma de flux

```text
Inventaire Mac
      ↓
Smart Group
      ↓
Détection de non-conformité
      ↓
Politique FileVault
      ↓
Activation
      ↓
Clé de récupération
      ↓
Séquestre Jamf Pro
      ↓
Contrôle de conformité
```

Représentation détaillée : `scene-005-jamf-smart-groups-filevault-escrow-flow` dans `media/motion/registry/scenes.json` (réutilise les 5 assets FileVault déjà briefés en `scene-002-filevault-encryption`, plus 2 nouveaux : Smart Group, contrôle de conformité).

## 4. Affirmations techniques — statut après vérification du 2026-07-27

| ID | Affirmation | Statut |
| --- | --- | --- |
| claim-filevault-encrypts-data | FileVault est la technologie macOS qui chiffre les données. | **Confirmé** — fait de base macOS, cohérent sur toutes les sources consultées. |
| claim-jamf-does-not-encrypt | Jamf ne chiffre pas les données à la place de FileVault ; il configure et surveille FileVault. | **Confirmé** — [Jamf, *Enabling FileVault Disk Encryption Using a Configuration Profile*](https://learn.jamf.com/en-US/bundle/jamf-pro-documentation-current/page/Activating_FileVault_Disk_Encryption_using_a_Configuration_Profile_.html) |
| claim-jamf-configures-and-escrows | Jamf configure FileVault via un profil de configuration, collecte son état et gère l'escrow de la clé de récupération personnelle (PRK). | **Confirmé, mécanisme précis** — [Jamf, *FileVault Configuration Profile Certificate in Jamf Pro*](https://support.jamf.com/en/articles/11016691-filevault-configuration-profile-certificate-in-jamf-pro) : le profil utilise la clé publique d'un certificat pour chiffrer la PRK avant envoi à Jamf Pro, qui détient la clé privée pour la déchiffrer. |
| claim-password-is-not-recovery-key | Le mot de passe utilisateur n'est pas la clé de récupération. | **Confirmé** — distinction FileVault standard (mot de passe de session vs clé de récupération personnelle générée séparément). |
| claim-escrow-is-key-not-backup | L'escrow concerne la clé (PRK chiffrée), pas une sauvegarde des données du disque. | **Confirmé** — cohérent avec le mécanisme de chiffrement/déchiffrement de la PRK décrit ci-dessus. |
| claim-no-real-recovery-key-in-media | Une clé de récupération réelle ne doit jamais apparaître dans les médias, les tests ou les fixtures. | Règle de production — non négociable, ne dépend pas d'une source externe. |
| claim-prk-recommended-over-irk | Il existe deux types de clé de récupération FileVault : **institutionnelle (IRK)** et **personnelle (PRK)**. Apple recommande désormais la **PRK**, l'IRK n'étant plus adaptée (inaccessible depuis recoveryOS et target disk mode supprimé sur Apple Silicon). | **Nouveau, confirmé par source Apple primaire** — [Apple Support, *Manage FileVault with device management*](https://support.apple.com/guide/deployment/manage-filevault-with-device-management-dep0a2cb7686/web). **Absent du storyboard actuel (§5, §6)** — à ajouter : le pilote doit préciser qu'il s'agit de la PRK, pas de l'IRK. |
| claim-escrow-mechanism-precise | Le Mac chiffre la PRK de façon asymétrique (format CMS) avec la clé publique d'un certificat fourni par le MDM, puis la retourne via une requête de sécurité ; le MDM la déchiffre ensuite côté serveur. | **Confirmé par source Apple primaire** — même page Apple ci-dessus, cohérent avec le mécanisme décrit côté Jamf (ligne claim-jamf-configures-and-escrows). |

**Date de dernière vérification : 2026-07-27.** Les 6 affirmations initiales sont confirmées par la documentation officielle Jamf, et 2 affirmations supplémentaires par une source Apple primaire (`support.apple.com/guide/deployment`). **Correction à apporter au storyboard avant script final** : préciser explicitement que la vidéo traite de la clé de récupération **personnelle (PRK)**, pas institutionnelle (IRK) — l'IRK n'est plus recommandée par Apple, particulièrement sur Apple Silicon. Point restant à recouper : le comportement exact si un Mac était déjà chiffré avant l'inscription (Jamf ne peut alors pas escrow la clé rétroactivement — mentionné dans la documentation Jamf, à intégrer si pertinent au storyboard).

## 5. Storyboard scène par scène (8 plans, 600 s)

| Plan | Timecode | Durée | Objectif | Captures | Texte affiché | Point de vigilance |
| --- | --- | ---: | --- | --- | --- | --- |
| P01 | 00:00–00:15 | 15 s | Accroche : cibler les bons Mac et vérifier FileVault | — | « Smart Groups », « FileVault escrow », « Lab uniquement » | Aucune interface Jamf inventée |
| P02 | 00:15–00:45 | 30 s | Cadrer Jamf Pro, inventaire, groupes dynamiques | SG-01, SG-02, SG-03 | « Inventaire », « Critères », « Membership dynamique » | Flouter URL et compte |
| P03 | 00:45–03:30 | 165 s | Créer un Smart Group de laboratoire | SG-04 à SG-10 | « Nom clair », « Critère stable », « Preview obligatoire » | Uniquement des valeurs fictives, aucun numéro de série réel |
| P04 | 03:30–04:30 | 60 s | Montrer le membership et la mise à jour dynamique | SG-11, SG-12 | « Membership », « Inventaire », « Mise à jour » | Flouter identifiants appareils |
| P05 | 04:30–05:15 | 45 s | Transition vers FileVault et l'escrow | FV-03 (visuel abstrait uniquement) | « FileVault chiffre », « Jamf gère la configuration », « Escrow de clé » | **Ne jamais afficher de clé réelle** |
| P06 | 05:15–08:00 | 165 s | Configuration FileVault et inventaire | FV-01, FV-02, FV-04 à FV-07 | « Configuration », « État du chiffrement », « Escrow confirmé » | Revue technique Jamf **et** revue sécurité requises avant tournage |
| P07 | 08:00–09:30 | 90 s | Relier escrow et conformité via Smart Group | FV-08, FV-09 | « Conformité », « Remédiation », « Pilotage » | Critère de conformité à valider selon version Jamf |
| P08 | 09:30–10:00 | 30 s | Résumer les limites et prochaines actions | — | « Ciblage », « Chiffrement », « Escrow », « Sécurité » | Résumé cohérent avec les claims techniques validées |

## 6. Captures Screen Studio requises (21)

### Smart Computer Groups

| ID | Objectif | Action | Résultat attendu |
| --- | --- | --- | --- |
| SG-01 | Connexion à Jamf Pro | Ouvrir la console de laboratoire | Session laboratoire ouverte |
| SG-02 | Liste des ordinateurs | Naviguer vers Computers | Liste des ordinateurs de test visible |
| SG-03 | Smart Computer Groups | Ouvrir Smart Computer Groups | Section visible |
| SG-04 | Création du groupe | Démarrer un nouveau Smart Group | Formulaire affiché |
| SG-05 | Nom du groupe | Renseigner un nom de laboratoire | Nom non sensible saisi |
| SG-06 | Choix du critère | Sélectionner un critère d'inventaire | Critère de laboratoire sélectionné |
| SG-07 | Opérateur | Choisir l'opérateur | Opérateur visible et compréhensible |
| SG-08 | Valeur | Renseigner une valeur fictive | Valeur de démonstration appliquée |
| SG-09 | Aperçu | Afficher le preview | Population attendue visible sans donnée sensible |
| SG-10 | Enregistrement | Sauvegarder le groupe | Smart Group enregistré |
| SG-11 | Liste des membres | Afficher les membres | Appareils de test listés |
| SG-12 | Mise à jour dynamique | Montrer le changement de membership | Membership dynamique expliqué |

### FileVault / escrow

| ID | Objectif | Action | Résultat attendu |
| --- | --- | --- | --- |
| FV-01 | Profil ou politique | Ouvrir la politique de laboratoire | Configuration FileVault de test visible |
| FV-02 | Configuration FileVault | Afficher les options pertinentes | Options vérifiables sans secret |
| FV-03 | Explication abstraite de la clé | Utiliser un visuel abstrait (motion design, pas une capture) | **Aucune clé réelle affichée** |
| FV-04 | Inventaire du Mac | Ouvrir l'inventaire d'un appareil de test | Inventaire de test visible |
| FV-05 | État du chiffrement | Afficher l'état FileVault | État lisible |
| FV-06 | État de la clé | Afficher le statut de clé | Statut montré sans révéler la clé |
| FV-07 | Confirmation de l'escrow | Montrer la confirmation | Escrow confirmé sans secret |
| FV-08 | Smart Group de conformité | Ouvrir le groupe de conformité | Critère de conformité visible |
| FV-09 | État conforme / non conforme | Afficher un résultat de conformité | État expliqué |

Résolution 1920×1080, export `.webp`. Toutes les captures **doivent** provenir d'une instance Jamf Pro de laboratoire dédiée — jamais d'un tenant de production.

## 7. Interdictions de sécurité (bloquantes)

| Donnée | Remplacement obligatoire |
| --- | --- |
| Clé de récupération réelle | `[CLÉ MASQUÉE]` |
| Mot de passe utilisateur | `[COMPTE DE LABORATOIRE]` |
| Token Jamf / clé API | `[CLÉ MASQUÉE]` |
| URL privée identifiable | `[URL MASQUÉE]` |
| Nom réel d'entreprise | `[TENANT DE DÉMONSTRATION]` |
| Numéro de série réel | `[NUMÉRO DE SÉRIE FICTIF]` |
| Email personnel / compte admin réel | `[COMPTE DE LABORATOIRE]` |
| Code MFA / certificat / secret | `[CLÉ MASQUÉE]` |
| Identifiant de tenant réel | `[TENANT DE DÉMONSTRATION]` |

**Aucune de ces données ne doit apparaître, même floutée par erreur de cadrage — le plan doit être re-capturé.**

## 8. Illustrations motion design

Voir `scene-005-jamf-smart-groups-filevault-escrow-flow` : réutilise 5 assets déjà briefés pour FileVault (`device-laptop-isometric-neutral-base-v1`, `security-lock-front-closed-cyan-v1`, `security-recovery-key-front-neutral-base-v1`, `security-vault-front-closed-enterprise-v1`, `identity-user-front-authorized-standard-v1`) et introduit 2 nouveaux assets (`management-smart-group-isometric-neutral-v1`, `compliance-filevault-check-front-standard-v1`). Utilisé principalement au plan P05 (transition abstraite, aucune capture).

## 9. Texte HeyGen (narration en plan, à rédiger mot à mot avant enregistrement)

| Section | Contenu |
| --- | --- |
| Accroche | Comment cibler les bons Mac et vérifier l'escrow FileVault sans exposer de secret ? |
| Introduction | Présenter la console de laboratoire et les limites du pilote. |
| Chapitre Smart Groups | Expliquer la logique de Smart Computer Groups et la validation du membership. |
| Transition | Relier le ciblage dynamique à la sécurité macOS. |
| Chapitre FileVault | Expliquer FileVault, l'état de chiffrement et l'escrow sans montrer de clé. |
| Conclusion | Rappeler les contrôles techniques et sécurité avant production. |
| Résumé final | Smart Groups ciblent, FileVault chiffre, Jamf gère la configuration et l'escrow selon les prérequis. |

Ton : professionnel, calme, précis. Rythme modéré. Prononciations à fournir à HeyGen : Jamf → « djamf », FileVault → « faïl-volt », escrow → « es-crow ». Statut narration : **outline seulement**, script mot à mot restant à rédiger après validation des claims techniques (§4).

## 10. Indications de montage

* Découpage en 2 chapitres internes (`chapter-smart-groups` 0–315 s, `chapter-filevault-escrow` 315–600 s) même si publié comme une seule vidéo dans un premier temps.
* P05 : transition motion design pure, pas de capture Jamf — insister sur l'absence de clé visible.
* P03 et P06 (parties les plus longues) : zoom Screen Studio sur les champs saisis, pas d'avatar en plein cadre.
* Conserver la structure `chapterIds` / candidat au split pour permettre une scission ultérieure en 2 vidéos sans retravailler le montage depuis zéro.

## 11. Sous-titres français

Aucun fichier `.vtt` statique. Prévoir `public/videos/captions/jamf-smart-groups-filevault-escrow.fr.vtt` une fois la narration enregistrée. En transitoire, `/api/videos/jamf-smart-groups-filevault-escrow/captions` peut générer un WebVTT provisoire dès qu'un transcript est ajouté à `src/lib/video-transcripts.ts`.

## 12. Transcription

À produire à partir du texte HeyGen validé (§9), structurée par plan (P01–P08) dans `src/lib/video-transcripts.ts`.

## 13. Quiz de fin

Réutiliser la couverture Smart Groups / FileVault déjà présente dans les quiz Jamf 100/200 existants (`lib/data/jamf/jamf-training-quiz-definitions.ts`, `quiz-11-16-questions.ts`). Vérifier que les questions couvrent bien la distinction Jamf/FileVault mise en avant dans ce pilote avant de le publier ; sinon, ajouter 1–2 questions ciblées plutôt que créer un nouveau quiz.

## 14. Sources officielles consultées

* [Apple Support — Manage FileVault with device management](https://support.apple.com/guide/deployment/manage-filevault-with-device-management-dep0a2cb7686/web) (source Apple primaire, consultée directement le 2026-07-27)
* [Jamf — Enabling FileVault Disk Encryption Using a Configuration Profile](https://learn.jamf.com/en-US/bundle/jamf-pro-documentation-current/page/Activating_FileVault_Disk_Encryption_using_a_Configuration_Profile_.html) (consulté le 2026-07-27)
* [Jamf Support — FileVault Configuration Profile Certificate in Jamf Pro](https://support.jamf.com/en/articles/11016691-filevault-configuration-profile-certificate-in-jamf-pro) (consulté le 2026-07-27)
* [Jamf — Smart Computer Groups (Administrator's Guide)](https://docs.jamf.com/10.4.0/jamf-pro/administrator-guide/Smart_Computer_Groups.html) (consulté le 2026-07-27 — version 10.4.0, à reconfirmer sur la version du tenant de tournage)

**Date de dernière vérification : 2026-07-27.** Les 6 affirmations techniques initiales du §4 sont confirmées par la documentation officielle Jamf, 2 affirmations supplémentaires (PRK vs IRK, mécanisme d'escrow précis) par une source Apple primaire, et les libellés génériques Smart Computer Groups par la doc Jamf (§15). Reste à vérifier avant tournage : la version macOS ciblée, et la reconfirmation des libellés sur la version Jamf Pro exacte du tenant de tournage (la source citée date de la version 10.4.0).

## 15. Checklist de validation technique avant production

- [x] Les 6 affirmations techniques (§4) validées par une source officielle citée (2026-07-27).
- [x] Libellés génériques des Smart Computer Groups confirmés par [Jamf, *Smart Computer Groups*](https://docs.jamf.com/10.4.0/jamf-pro/administrator-guide/Smart_Computer_Groups.html) : `Computers` → `Smart Computer Groups` → `New` → onglet `Criteria` → `Add`/`Choose` → menu `Operator` → champ `Value` → groupements et/ou et parenthèses pour logique complexe → `Show Advanced Criteria` pour voir plus que les 30 critères les plus fréquents. **À reconfirmer sur la version exacte du tenant de tournage** avant capture (les libellés sont stables historiquement mais non re-vérifiés sur la toute dernière version Jamf Pro).
- [x] Procédure exacte de configuration FileVault vérifiée (profil + certificat + chiffrement PRK, voir §4).
- [x] Types de clés concernés et modalités d'escrow confirmés — **PRK (personnelle), pas IRK (institutionnelle)**, cf. §4. Le script final doit nommer explicitement « clé de récupération personnelle ».
- [ ] Version(s) macOS et rôle Jamf nécessaire précisés.
- [ ] Les 21 captures réalisées dans une instance Jamf Pro de laboratoire, aucune donnée réelle.
- [ ] Revue sécurité : aucune clé de récupération réelle dans les médias, tests ou fixtures.
- [x] Storyboard sans trou ni chevauchement de timecode (recalculé : 15+30+165+60+45+165+90+30 = 600 s exactement, 8 plans contigus).

## 16. Miniature

Nommage : `jamf-smart-groups-filevault-escrow-v1-poster.webp` (16:9). Non produite.

## 17. Métadonnées d'intégration

```text
slug: jamf-smart-groups-filevault-escrow
courseIds: jamf-100 | jamf-200 | apple-security
mp4 attendu: /public/videos/jamf-smart-groups-filevault-escrow-v1-fr.mp4
captions attendues: /public/videos/captions/jamf-smart-groups-filevault-escrow.fr.vtt
poster attendu: /public/videos/jamf-smart-groups-filevault-escrow-v1-poster.webp
scène motion design: scene-005-jamf-smart-groups-filevault-escrow-flow
statut pipeline actuel: script-ready (storyboard complet, captures/narration/montage à produire)
candidat au découpage: oui — voir §1 recommandation
```
