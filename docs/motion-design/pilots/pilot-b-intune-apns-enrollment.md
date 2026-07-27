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

## 11. Affirmations techniques — statut après vérification du 2026-07-27

| ID | Affirmation | Statut |
| --- | --- | --- |
| claim-apns-required-all-mdm | Un certificat de push MDM (APNs) est requis pour gérer des appareils iOS/iPadOS/macOS avec Intune, et le mécanisme est imposé par Apple (pas spécifique à Intune — confirmé par la présence du même besoin chez tous les éditeurs MDM tiers). | **Confirmé** — [Microsoft Learn, *Get an Apple MDM Push certificate for Intune*](https://learn.microsoft.com/en-us/intune/device-enrollment/apple/create-mdm-push-certificate) |
| claim-apns-not-management-payload | La notification APNs est un signal de réveil ; elle ne transporte aucune donnée de configuration. L'appareil se connecte ensuite séparément et en direct au serveur MDM pour récupérer les commandes. | **Confirmé** — [Fleet, *Apple Push Notification Service: How APNs Works in MDM*](https://fleetdm.com/articles/apple-push-notification-service-apns-mdm) |
| claim-same-apple-id-renewal | Le certificat doit être **renouvelé** (pas recréé) avec le même identifiant Apple. Un changement d'identifiant est possible via une procédure dédiée, mais créer un **nouveau** certificat au lieu de renouveler l'existant force la ré-inscription de tous les appareils (UID/topic différent). | **Confirmé, avec nuance** — [Microsoft Learn, *Get an Apple MDM Push certificate for Intune*](https://learn.microsoft.com/en-us/intune/device-enrollment/apple/create-mdm-push-certificate) : « Renew the MDM push certificate with the same Apple account you used to create it. » + grâce de 30 jours après expiration. |
| claim-apns-distinct-from-abm-token | Le certificat APNs (push) et le jeton serveur Apple Business Manager (ADE, valide 1 an, renouvelé séparément) sont deux mécanismes distincts. | **Confirmé** — le jeton serveur ABM est documenté séparément du certificat MDM push (voir pilote (a), §12) ; les deux ont des cycles de renouvellement annuels indépendants. |

**Correction apportée après vérification** : ma première rédaction disait qu'un changement d'identifiant Apple force systématiquement une ré-inscription — c'est inexact. Microsoft documente une procédure supportée pour changer l'identifiant Apple associé. Le vrai risque opérationnel est de **créer un nouveau certificat au lieu de renouveler l'existant**, ce qui, lui, force bien la ré-inscription de tous les appareils.

## 12. Sources officielles consultées

* [Microsoft Learn — Get an Apple MDM Push certificate for Intune](https://learn.microsoft.com/en-us/intune/device-enrollment/apple/create-mdm-push-certificate) (source Microsoft primaire, consultée directement le 2026-07-27, page mise à jour 2026-07-01)
* [Fleet — Apple Push Notification Service: How APNs Works in MDM](https://fleetdm.com/articles/apple-push-notification-service-apns-mdm) (consulté le 2026-07-27 — source tierce technique, pas Apple officielle)
* **Tentative faite, non concluante** : localisé le lien officiel Apple Developer du *MDM Protocol Reference* ([developer.apple.com/go/?id=mdm-protocol-reference](https://developer.apple.com/go/?id=mdm-protocol-reference)), mais la page n'a pas pu être chargée avec un contenu exploitable cette session (redirection vers une doc dont le rendu n'a renvoyé aucun texte extractible — limitation technique, pas un contenu vérifié). À consulter manuellement (probablement un PDF) avant script final mot à mot — ne pas s'appuyer sur un résumé générique non sourcé de ce mécanisme.

**Date de dernière vérification : 2026-07-27.** Les 4 affirmations sont confirmées par une source Microsoft primaire + une source technique tierce cohérente. Le wording narratif final (§7) reste à rédiger mot à mot — ce qui précède valide le **fond**, pas la formulation finale du script. C'est le seul des 3 pilotes sans aucune confirmation par une source **Apple** primaire (seulement Microsoft + tiers) — point à combler en priorité avant tournage.

## 13. Checklist de validation technique avant production

- [x] Les 4 affirmations techniques (§11) vérifiées auprès de sources datées (2026-07-27).
- [ ] Wording exact du flux de notification (§3/§7) rédigé mot à mot et relu à partir des sources (le fond est validé, pas encore la formulation finale).
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
