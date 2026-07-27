# Pilote vidéo (a) — Apple Business Manager + Automated Device Enrollment

```text
id: video-abm-ade-enrollment-v1
slug: abm-ade-enrollment
statut: script-ready
version: v1
scène motion associée: scene-003-abm-ade-enrollment-flow
```

Ce dossier consolide un storyboard déjà écrit (branche `cursor/studio-visuel-cours-4353`, jamais fusionnée) et l'aligne sur le format de production attendu pour la relance du chantier vidéos. Le storyboard et les 8 visuels statiques associés existent réellement ; **aucun MP4, aucune narration enregistrée et aucun sous-titre réel n'existent encore.**

## 1. Fiche pédagogique

| Champ | Valeur |
| --- | --- |
| Titre | Comprendre Apple Business Manager et Automated Device Enrollment |
| Niveau | Débutant → Intermédiaire |
| Durée cible | 90–110 s (script actuel : 94 s / 8 scènes) |
| Cours associé | `apple-it-professional`, `intune-mac` |
| Labs associés | `abm-intune`, `ade-iphone`, `ade-mac` |
| Quiz de fin | `quiz-abm-certification`, `quiz-ade-certification` (existants — pas de nouveau quiz nécessaire) |
| Prérequis | Aucun — vidéo d'introduction au parcours Apple IT Professional |
| Date de dernière vérification des sources | 2026-07-27 — voir §12/§13 (sources tierces cohérentes ; pages Apple primaires non consultées en direct) |

## 2. Objectifs d'apprentissage

1. Expliquer pourquoi le déploiement manuel ne passe pas à l'échelle.
2. Définir Automated Device Enrollment en trois fonctions : rattachement à l'organisation, attribution au serveur MDM, inscription pendant l'assistant de configuration.
3. Identifier les acteurs du flux : canal d'achat, Apple Business Manager, serveur MDM (Jamf Pro **ou** Microsoft Intune), appareil, utilisateur.
4. Distinguer l'ancien vocabulaire **DEP** (Device Enrollment Program, retiré) du vocabulaire actuel **ADE** (Automated Device Enrollment) intégré à Apple Business Manager.
5. Décrire ce qui est déployé automatiquement après inscription (Wi-Fi, certificats, FileVault, apps, restrictions, politiques).

## 3. Schéma de flux

```text
Revendeur ou Apple
        ↓
Apple Business Manager
        ↓
Affectation au serveur MDM
        ↓
Activation de l'appareil
        ↓
Automated Device Enrollment
        ↓
Supervision et configuration
```

Représentation détaillée (acteurs et connecteurs) : `scene-003-abm-ade-enrollment-flow` dans `media/motion/registry/scenes.json`, et diagramme de référence déjà généré : `public/visual-studio/exports/ade-enrollment-ade-main-architecture.svg`.

## 4. Storyboard scène par scène

| # | Durée | Narration | Visuel prévu | Animation | Texte affiché | Transition | Point de vigilance |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| S1 — Le problème | 8 s | « Imaginez cinq cents Mac qui arrivent demain. Les configurer un par un ralentit l'entreprise et multiplie les erreurs. » | Technicien + pile de Mac / étapes manuelles / entreprise en attente | Entrée pile de Mac à gauche ; étapes manuelles en fondu successif ; indicateurs temps/risque en overlay | « Comment préparer 500 Mac sans les configurer manuellement ? » | Fondu vers définition | Aucun logo Apple dans l'illustration |
| S2 — La définition | 10 s | « Automated Device Enrollment rattache automatiquement l'appareil à l'organisation, l'attribue à un serveur MDM, et lance l'inscription pendant l'assistant de configuration. » | 3 cartes d'information | Apparition séquentielle gauche→droite | « Rattachement automatique », « Attribution MDM », « Inscription pendant Setup Assistant » | Zoom vers diagramme composants | Formulation alignée sur le vocabulaire Apple actuel (pas « DEP ») |
| S3 — Les composants | 12 s | « Le flux relie le canal d'achat, Apple Business Manager, le serveur MDM — Jamf Pro ou Microsoft Intune — les appareils Apple, et enfin l'utilisateur. » | Diagramme horizontal (`scene-003`) | Apparition séquentielle des nœuds, connecteurs allumés progressivement | Libellés des acteurs | Fondu vers attribution ABM | Jamf et Intune présentés comme alternatives, pas hiérarchisés |
| S4 — Attribution dans ABM | 12 s | « Dans Apple Business Manager, l'appareil apparaît dans l'inventaire. L'administrateur le sélectionne, l'attribue au serveur MDM, et l'état passe à attribué. » | **Capture Screen Studio réelle requise** : ABM → Inventaire appareil → Attribution MDM | 4 étapes séquentielles | « 1. Apparaît dans l'inventaire… » | Fondu vers premier démarrage | Capture à réaliser dans un tenant ABM de démonstration, aucune donnée organisationnelle réelle |
| S5 — Premier démarrage | 15 s | « Au premier démarrage, le Mac contacte les services d'activation Apple. Apple identifie l'organisation, renvoie les informations du serveur MDM, et l'inscription commence. » | **Capture Screen Studio réelle requise** : Setup Assistant, écran de supervision | Séquence de démarrage | « Allumage → Activation → Identification org. → Redirection MDM » | Fondu vers configuration automatique | Ne pas montrer d'identifiant Apple réel dans le Setup Assistant |
| S6 — Configuration automatique | 15 s | « Une fois inscrit, le MDM déploie progressivement le Wi-Fi, les certificats, FileVault, les applications, les restrictions, la configuration de compte et les politiques de sécurité. » | Cascade de cartes (config-cascade) | Apparition en cascade | Liste des éléments déployés | Fondu vers bonne pratique | Vérifier que la liste correspond à la configuration réellement démontrée en capture |
| S7 — Bonne pratique | 12 s | « L'inscription manuelle dépend du technicien, risque l'oubli et produit des configurations incohérentes. ADE est automatique, reproductible, supervisé, et adapté au déploiement à grande échelle. » | Comparaison deux colonnes | Mise en évidence progressive | « Manuel » vs « ADE » | Fondu vers résumé | Ton factuel, pas promotionnel |
| S8 — Résumé | 10 s | « Achat, Apple Business Manager, attribution MDM, activation, inscription, configuration, utilisateur. » | Flux récapitulatif | Ligne du temps complète | Flux complet en une ligne | Fondu de sortie | Question de rétention affichée à l'écran, pas seulement en narration |

Source du storyboard détaillé (acteurs, connecteurs, instructions Firefly/Canva complètes) : contenu historique de la branche `cursor/studio-visuel-cours-4353` (`lib/visual-studio/course-storyboards.ts`), non fusionné dans `main`. Les 8 visuels statiques déjà générés (Playwright) sont portés dans `public/visual-studio/exports/ade-enrollment-scene-01.png` à `-08.png` — **ce sont des diagrammes d'architecture, pas des rendus vidéo finaux.**

## 5. Captures Screen Studio requises

| ID | Zone | Statut |
| --- | --- | --- |
| ABM-01 | Apple Business Manager → Appareils → sélection d'un appareil | À produire (tenant de démonstration) |
| ABM-02 | Apple Business Manager → Attribution au serveur MDM | À produire |
| ADE-01 | Setup Assistant — écran de supervision / gestion à distance | À produire |
| ADE-02 | Confirmation d'inscription réussie côté MDM (Jamf Pro ou Intune) | À produire |

Résolution 1920×1080, export `.webp`, suivre `app/resources/guide-captures-video`. Flouter tout identifiant Apple, numéro de série ou nom d'organisation réel.

## 6. Illustrations motion design

Voir `scene-003-abm-ade-enrollment-flow` (5 assets : portail ABM, serveur MDM générique, iPhone supervisé, administrateur autorisé, badge « enrôlement terminé »). Statuts actuels : `brief-ready` — aucun SVG final généré. Diagramme de référence déjà disponible en SVG : `ade-enrollment-ade-main-architecture.svg` (à ne pas confondre avec le registre Motion, qui reste la seule source de vérité pour les assets — voir `docs/motion-design/guides/coexistence-registries.md`).

## 7. Texte HeyGen (narration complète, à valider avant enregistrement)

> Imaginez cinq cents Mac qui arrivent demain. Les configurer un par un ralentit l'entreprise et multiplie les erreurs. Automated Device Enrollment existe pour supprimer cette étape manuelle.
>
> Automated Device Enrollment rattache automatiquement l'appareil à l'organisation, l'attribue à un serveur MDM, et lance l'inscription pendant l'assistant de configuration.
>
> Le flux relie le canal d'achat, Apple Business Manager, le serveur MDM — Jamf Pro ou Microsoft Intune — les appareils Apple, et enfin l'utilisateur.
>
> Dans Apple Business Manager, l'appareil apparaît dans l'inventaire. L'administrateur le sélectionne, l'attribue au serveur MDM, et l'état passe à attribué.
>
> Au premier démarrage, le Mac contacte les services d'activation Apple. Apple identifie l'organisation, renvoie les informations du serveur MDM, et l'inscription commence.
>
> Une fois inscrit, le MDM déploie progressivement le Wi-Fi, les certificats, FileVault, les applications, les restrictions, la configuration de compte et les politiques de sécurité.
>
> L'inscription manuelle dépend du technicien, risque l'oubli et produit des configurations incohérentes. Automated Device Enrollment est automatique, reproductible, supervisé, et adapté au déploiement à grande échelle.
>
> Achat, Apple Business Manager, attribution MDM, activation, inscription, configuration, utilisateur. Quel élément relie l'appareil à l'organisation avant même son premier démarrage ?

Ton : professionnel, calme, pédagogique. Avatar HeyGen secondaire — l'écran reste dominé par le diagramme/la capture, pas par l'avatar en continu (voir §5 du brief).

## 8. Indications de montage

* Respecter le découpage 8 scènes / 94 s ci-dessus comme trame de montage.
* Scènes 1–3, 6–8 : motion design natif (schémas). Scènes 4–5 : capture Screen Studio réelle avec zoom/curseur.
* Aucun avatar plein écran pendant les scènes de capture (S4, S5).
* Musique de fond optionnelle, volume bas, pas de son sur les captures d'écran elles-mêmes.

## 9. Sous-titres français

Aucun fichier `.vtt` statique n'existe. Une fois la narration ci-dessus enregistrée et le montage figé, déposer `public/videos/captions/abm-ade-enrollment.fr.vtt`. En l'absence de fichier statique, `/api/videos/abm-ade-enrollment/captions` générera des sous-titres provisoires depuis le transcript texte si celui-ci est ajouté à `src/lib/video-transcripts.ts` — **à faire avant publication**, ce mécanisme ne doit pas rester la solution finale.

## 10. Transcription

Le texte de narration (§7) sert de transcription source. À reformater en transcript scène-par-scène dans `src/lib/video-transcripts.ts` (structure `VideoTranscript.scenes[]`) une fois le montage final validé, pour alimenter `VideoTranscriptPanel` et la génération automatique de sous-titres.

## 11. Quiz de fin

Réutiliser les quiz existants `quiz-abm-certification` et `quiz-ade-certification` (couverture déjà présente dans le contenu de cours). Pas de nouveau quiz à créer pour ce pilote.

## 12. Affirmations techniques — statut après vérification du 2026-07-27

| Affirmation | Statut |
| --- | --- |
| Le terme officiel actuel est **Automated Device Enrollment (ADE)** ; l'ancien terme **DEP** (Device Enrollment Program) n'apparaît plus dans la documentation Apple actuelle. | **Confirmé par source Apple primaire** — [Apple Support, *Automated Device Enrollment and device management*](https://support.apple.com/guide/deployment/automated-device-enrollment-management-dep73069dd57/web) : la page ne mentionne "DEP" nulle part, seul "Automated Device Enrollment" est utilisé. |
| ADE est réservé aux appareils **appartenant à l'organisation** et permet une gestion dès la sortie de la boîte. | **Confirmé** — même source Apple. |
| L'attribution d'un appareil à un serveur MDM se fait dans Apple Business Manager (Devices → sélection → attribution), et repose sur un **jeton serveur** téléchargé depuis ABM et importé dans le serveur MDM. | **Confirmé** — [Microsoft Learn / n-able, *Assign devices to an MDM server*](https://documentation.n-able.com/remote-management/userguide/Content/dma/assign_devices_mdm_abm.htm) |
| Le jeton serveur ABM est **valide un an** et doit être renouvelé et re-téléversé annuellement — cycle **distinct** du certificat APNs du pilote (b). | **Confirmé** — même source que ci-dessus. |
| Les appareils doivent être neufs ou effacés pour bénéficier de l'auto-enrollment ADE. | **Confirmé** — même source. |
| Au premier démarrage (Setup Assistant), le MDM peut sauter des écrans, verrouiller l'appareil pendant la configuration, charger une URL de configuration personnalisée, et (macOS 14+) **imposer FileVault** dès l'inscription. | **Confirmé par source Apple primaire** — même page Apple ci-dessus. Détail non présent dans le storyboard actuel (§4, scène S6) : à ajouter, c'est un point pédagogique fort (lien direct avec le pilote (c) FileVault). |

## 13. Sources officielles consultées

* [Apple Support — Automated Device Enrollment and device management](https://support.apple.com/guide/deployment/automated-device-enrollment-management-dep73069dd57/web) (source Apple primaire, consultée directement le 2026-07-27)
* [n-able, *Assign devices to an MDM server - Apple Business Manager*](https://documentation.n-able.com/remote-management/userguide/Content/dma/assign_devices_mdm_abm.htm) (consulté le 2026-07-27)
* [Microsoft Learn — Tutorial: Use Apple Business to enroll iOS/iPadOS devices in Intune](https://learn.microsoft.com/en-us/intune/device-enrollment/apple/tutorial-automated-ios) (consulté le 2026-07-27)
* Encore à recouper avant script final mot à mot : Apple Business Manager User Guide, section attribution précise (le mécanisme de jeton serveur ci-dessus vient d'une source tierce, pas encore confirmé mot pour mot sur une page Apple primaire).

**Date de dernière vérification : 2026-07-27.** Le flux général (§3) et la terminologie ADE sont désormais confirmés par une source Apple primaire. Reste à recouper : le détail exact du mécanisme de jeton serveur ABM directement sur une page Apple (actuellement confirmé par une source tierce cohérente uniquement). **Nouveau point à intégrer au storyboard** : possibilité d'imposer FileVault dès l'ADE sur macOS 14+ (voir ligne ci-dessus) — à ajouter à la scène S6 avant script final.

## 14. Checklist de validation technique avant production

- [x] Vocabulaire « ADE » confirmé comme terme actuel (pas « DEP ») — sources tierces cohérentes, à recouper avec une page Apple directe avant script final.
- [x] Rôle du jeton serveur ABM (attribution + renouvellement annuel) confirmé (§12).
- [ ] Liste des éléments « déployés automatiquement » (S6) vérifiée par rapport à une inscription réelle.
- [ ] Captures ABM-01, ABM-02, ADE-01, ADE-02 réalisées dans un environnement de démonstration, sans identifiant réel.
- [ ] Relecture éditoriale de la narration complète (§7).
- [ ] Revue sécurité : aucune donnée d'organisation réelle visible dans les captures.

## 15. Miniature

Nommage : `abm-ade-enrollment-v1-poster.webp` (16:9, 1920×1080). Non produite — dépend du montage final. Utiliser un cadrage reprenant le schéma de flux (§3), cohérent avec l'identité Apple MDM Academy, sans logo Apple officiel.

## 16. Métadonnées d'intégration

```text
slug: abm-ade-enrollment
courseSlug: apple-it-professional | intune-mac
labSlug: abm-intune | ade-iphone | ade-mac
quizSlug: quiz-abm-certification | quiz-ade-certification
mp4 attendu: /public/videos/abm-ade-enrollment-v1-fr.mp4
captions attendues: /public/videos/captions/abm-ade-enrollment.fr.vtt
poster attendu: /public/videos/abm-ade-enrollment-v1-poster.webp
scène motion design: scene-003-abm-ade-enrollment-flow
statut pipeline actuel: script-ready (storyboard écrit, aucune capture ni narration enregistrée, aucun montage)
```
