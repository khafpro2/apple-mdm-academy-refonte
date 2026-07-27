# Pilote vidéo (b) — Microsoft Intune, certificat APNs et inscription Apple

```text
id: video-intune-apns-enrollment-v1
slug: intune-apns-enrollment
statut: brief
version: v1
scène motion associée: scene-004-intune-apns-enrollment-flow
```

**Aucun contenu préexistant trouvé pour ce pilote sur aucune branche du dépôt** (audit complet effectué avant rédaction — voir rapport d'audit initial). Ce dossier est donc écrit entièrement à partir de zéro. Il formalise le pilote sans produire de vidéo, sans inventer de capture, et sans présenter de terminologie non vérifiée comme définitive.

## 1. Fiche pédagogique

| Champ | Valeur |
| --- | --- |
| Titre | Microsoft Intune, le certificat APNs et l'inscription des appareils Apple |
| Niveau | Intermédiaire |
| Durée cible | 90–120 s |
| Cours associé | `intune-mac` |
| Quiz de fin | Réutiliser `quiz-abm-certification` (couvre déjà APNs — cf. `lib/data/quizzes.ts`) |
| Prérequis | Avoir vu le pilote (a) Apple Business Manager + ADE |

## 2. Objectifs d'apprentissage

1. Expliquer le rôle du certificat APNs (Apple Push Notification service) entre Microsoft Intune et les appareils Apple.
2. Décrire la nature du trafic de gestion : APNs ne transporte pas les commandes MDM elles-mêmes, il notifie l'appareil de se connecter à Intune.
3. Identifier la règle de renouvellement critique : renouveler le certificat **avec le même identifiant Apple** que celui utilisé à sa création.
4. Anticiper l'impact d'un certificat expiré ou renouvelé avec un mauvais identifiant Apple.
5. Situer le certificat APNs par rapport aux autres jetons (jeton d'inscription Apple Business Manager, profils d'inscription) — ce ne sont pas le même mécanisme.

## 3. Schéma de flux

```text
Administrateur
      ↓
Microsoft Intune
      ↓
Certificat APNs
      ↓
Service Push Apple
      ↓
Appareil Apple
```

**Point de vigilance narratif explicite (à ne pas simplifier)** : le trafic de gestion n'est pas « envoyé directement » par Intune à l'appareil. Le modèle à expliquer est : (1) Intune demande à Apple, via APNs, de notifier l'appareil ; (2) l'appareil reçoit une notification silencieuse, sans contenu de gestion ; (3) l'appareil se connecte ensuite directement à Intune en HTTPS pour récupérer les commandes réelles. **Cette formulation reste à confirmer mot pour mot avec la documentation Microsoft Learn avant script final** (voir §9, claim technique correspondante).

Représentation détaillée : `scene-004-intune-apns-enrollment-flow` dans `media/motion/registry/scenes.json` (certificat APNs, service push, console Intune, Mac géré, administrateur, badge « certificat expirant »).

## 4. Storyboard scène par scène (proposition, 6 plans — à ajuster après validation des claims)

| Plan | Durée | Objectif | Visuel prévu | Texte affiché | Point de vigilance |
| --- | ---: | --- | --- | --- | --- |
| B1 — Le problème | 12 s | Poser la question : comment Intune gère-t-il des appareils Apple qu'il ne contrôle pas nativement ? | Administrateur + icône Intune + icône Apple, point d'interrogation entre les deux | « Comment gérer un Mac depuis Intune ? » | Ne pas laisser croire qu'Intune est un outil Apple natif |
| B2 — Le rôle d'APNs | 15 s | Définir APNs comme prérequis Apple pour **tout** MDM, pas une spécificité Intune | Schéma §3, service push Apple mis en évidence | « APNs : prérequis Apple pour tout MDM » | Vérifier formulation exacte auprès de la doc Apple Platform Deployment |
| B3 — Création du certificat | 20 s | **Capture requise** : Intune admin center → certificat APNs → Apple Push Certificates Portal | Capture Screen Studio réelle (tenant de démonstration) | « Identifiant Apple dédié recommandé » | Ne jamais afficher un identifiant Apple réel ni un tenant réel |
| B4 — Le flux de notification | 20 s | Expliquer notification silencieuse → connexion directe HTTPS Intune | Animation flux (§3) | « Notification silencieuse », « Connexion directe HTTPS » | Formulation à valider avant narration finale (§9) |
| B5 — Le renouvellement | 20 s | Expliquer la règle du même identifiant Apple à chaque renouvellement | Badge « certificat expirant » + rappel identifiant | « Même identifiant Apple à chaque renouvellement » | Affirmation critique — sourcer avant tournage |
| B6 — Résumé | 15 s | Récapituler et relier au pilote (a) | Flux complet | « ABM assigne, APNs autorise le dialogue, Intune gère » | Cohérence avec le vocabulaire du pilote (a) |

## 5. Captures Screen Studio requises

| ID | Zone | Statut |
| --- | --- | --- |
| INT-01 | Microsoft Intune admin center → Appareils → Inscription Apple → Jeton du certificat MDM push | À produire (tenant de démonstration) |
| INT-02 | Apple Push Certificates Portal → certificat associé à l'identifiant Apple organisationnel | À produire — **masquer l'identifiant Apple et l'organisation** |
| INT-03 | Écran de confirmation / date d'expiration du certificat | À produire |

Résolution 1920×1080, `.webp`. Aucun tenant Microsoft ni identifiant Apple réel visible.

## 6. Illustrations motion design

Voir `scene-004-intune-apns-enrollment-flow` (6 assets : certificat APNs valide, service push Apple, console Intune, Mac géré, administrateur autorisé — réutilisé du pilote a —, badge « certificat expirant »).

## 7. Texte HeyGen (structure narrative — wording final soumis à validation des sources)

| Section | Contenu (outline, pas mot à mot) |
| --- | --- |
| Accroche | Poser la question du lien entre Intune et un appareil Apple. |
| Définition APNs | Présenter APNs comme le canal obligatoire imposé par Apple à tout éditeur MDM, pas une fonctionnalité Intune. |
| Création du certificat | Expliquer où et pourquoi ce certificat se crée (Apple Push Certificates Portal, lié à un identifiant Apple). |
| Flux de notification | Expliquer que la notification APNs ne transporte pas la commande de gestion elle-même. |
| Renouvellement | Insister sur la règle du même identifiant Apple, et la conséquence d'un mauvais renouvellement. |
| Résumé | Relier au pilote ABM/ADE : affectation (ABM) ≠ autorisation du dialogue (APNs) ≠ gestion (Intune). |

Ton : professionnel, factuel, insister sur le risque opérationnel du renouvellement plutôt que sur un ton alarmiste.

## 8. Indications de montage

* B3 (création du certificat) : capture réelle avec zoom sur les boutons, pas d'avatar en plein cadre.
* B4 (flux de notification) : motion design uniquement, aucune capture — c'est un mécanisme interne, pas une interface.
* Ne pas fusionner B4 et B5 malgré leur proximité : ce sont deux erreurs fréquentes différentes (mauvaise compréhension du flux vs mauvais renouvellement).

## 9. Sous-titres et transcription

Aucun `.vtt` ni transcript n'existe. À produire une fois la narration validée, selon la même mécanique que les pilotes (a) et (c) (`public/videos/captions/intune-apns-enrollment.fr.vtt`, entrée dans `src/lib/video-transcripts.ts`).

## 10. Quiz de fin

Réutiliser `quiz-abm-certification`, qui couvre déjà APNs (13 occurrences confirmées dans `lib/data/quizzes.ts`). Vérifier la couverture spécifique du renouvellement de certificat avant publication ; sinon ajouter 1 question ciblée plutôt qu'un nouveau quiz.

## 11. Affirmations techniques à valider avant tournage (aucune validée à ce stade)

| ID | Affirmation | Statut |
| --- | --- | --- |
| claim-apns-required-all-mdm | APNs est requis par Apple pour que **tout** MDM (pas seulement Intune) gère des appareils Apple. | À vérifier — Apple Platform Deployment |
| claim-apns-not-management-payload | La notification APNs ne transporte pas la commande de gestion ; elle indique à l'appareil de contacter le serveur MDM. | À vérifier — Microsoft Learn + Apple Developer |
| claim-same-apple-id-renewal | Le certificat APNs doit être renouvelé avec le même identifiant Apple qu'à sa création, sous peine de devoir ré-inscrire tous les appareils. | À vérifier — Microsoft Learn (documentation Intune) |
| claim-apns-distinct-from-abm-token | Le certificat APNs et le jeton Apple Business Manager (ADE) sont deux mécanismes distincts avec des rôles différents. | À vérifier |

**Aucune de ces affirmations ne doit être scriptée mot pour mot avant validation par une source officielle datée (§12).**

## 12. Sources officielles à consulter

* Microsoft Learn — documentation Microsoft Intune, inscription des appareils Apple
* Microsoft Learn — certificat de notification push Apple (APNs) pour Intune
* Apple Platform Deployment Guide — chapitre notifications push (APNs)
* Apple Developer — documentation Apple Push Notification service

**Date de dernière vérification : non faite.** Ce pilote ne doit pas être considéré comme techniquement validé avant cette revue — c'est le pilote le moins mature des trois (aucun contenu préexistant, aucune capture, wording non finalisé).

## 13. Checklist de validation technique avant production

- [ ] Les 4 affirmations techniques (§11) vérifiées auprès de sources officielles datées.
- [ ] Wording exact du flux de notification (§3/§7) validé avant script final.
- [ ] Captures INT-01 à INT-03 réalisées dans un tenant Intune de démonstration.
- [ ] Aucun identifiant Apple ni tenant Microsoft réel visible dans les captures.
- [ ] Cohérence terminologique avec le pilote (a) (ABM, ADE) vérifiée.

## 14. Miniature

Nommage : `intune-apns-enrollment-v1-poster.webp` (16:9). Non produite.

## 15. Métadonnées d'intégration

```text
slug: intune-apns-enrollment
courseSlug: intune-mac
quizSlug: quiz-abm-certification
mp4 attendu: /public/videos/intune-apns-enrollment-v1-fr.mp4
captions attendues: /public/videos/captions/intune-apns-enrollment.fr.vtt
poster attendu: /public/videos/intune-apns-enrollment-v1-poster.webp
scène motion design: scene-004-intune-apns-enrollment-flow
statut pipeline actuel: brief (aucun contenu préexistant — le moins avancé des 3 pilotes)
```
