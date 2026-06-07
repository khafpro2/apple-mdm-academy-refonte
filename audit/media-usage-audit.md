# Audit assets medias et originaux

Date: 2026-06-08
Branche: `codex/media-assets-cleanup`

## Perimetre

Zones auditees:

- `public/video-assets/`
- `public/images/`
- `public/videos/`
- dossiers `public/images/courses/*-originals/`
- manifests et mappings: `public/images/courses/generation-manifest.json`, `data/video-screenshot-catalog.json`, `data/video-pilot-mp4.json`, `lib/data/official-screenshots.ts`

Hors perimetre: suppression de fichiers, UI, auth Supabase, examens, dashboard, contenus pedagogiques.

## Resume executif

Inventaire versionne dans les zones auditees:

| Zone | Total medias | Statut |
| --- | ---: | --- |
| `public/images/` | 106 | Captures cours et originaux publics |
| `public/video-assets/` | 67 | SVG de production video, thumbnails, screenshots video |
| `public/videos/` | 0 | Aucun MP4 publie, seulement `.gitkeep` et `README.md` |
| `public/images/courses/*-originals/` | 16 | Originaux Apple/Microsoft/Jamf publics |
| Total images/SVG/MP4 audites | 173 | Aucun fichier supprime |

Constats principaux:

- Les 90 captures pedagogiques de cours sont declarees dans `public/images/courses/generation-manifest.json`.
- 10 originaux officiels sont mappes par `lib/data/official-screenshots.ts`.
- 29 captures video sont attendues par `data/video-screenshot-catalog.json`; 7 sont presentes, 22 restent a produire.
- 12 MP4 pilotes sont attendus par `data/video-pilot-mp4.json`; 12 restent a produire.
- 5 screenshots Jamf sont presents dans `public/video-assets/screenshots/` mais non catalogues pour le pipeline video actuel.
- Les dossiers `*-originals/` ne montrent pas, a l'inspection visuelle, de donnees privees evidentes comme email personnel, tenant ID prive, serial number reel ou token. Ils restent toutefois publics et contiennent des assets tiers/officiels: a conserver seulement avec source et usage documentes.

## Assets utilises

### Captures cours generees

Source de verite: `public/images/courses/generation-manifest.json`.

Ces fichiers sont utilises dynamiquement par `lib/data/screenshot-library.ts` et `lib/data/lesson-screenshots.ts`, via les chemins `/images/courses/{category}/{filename}`. Ils ne doivent pas etre marques comme inutilises simplement parce que leur chemin n'apparait pas en dur dans les composants.

Fichiers utilises par categorie:

- `public/images/courses/apple-business-manager/`: `01-connexion-abm.webp`, `02-tableau-de-bord-abm.webp`, `03-gestion-des-appareils.webp`, `04-ajouter-serveur-mdm.webp`, `05-telechargement-token-serveur.webp`, `06-attribution-appareil.webp`, `07-recherche-numero-serie.webp`, `08-apps-and-books.webp`, `09-gestion-utilisateurs.webp`, `10-managed-apple-ids.webp`, `11-federation-entra-id.webp`, `12-validation-domaine.webp`, `13-parametres-abm.webp`, `14-emplacements.webp`, `15-roles-administratifs.webp`
- `public/images/courses/ade/`: `16-affectation-ade.webp`, `17-liste-appareils-ade.webp`, `18-profil-enrolement.webp`, `19-synchronisation-ade.webp`, `20-ecran-activation-iphone.webp`, `21-appareil-est-gere.webp`, `22-remote-management.webp`, `23-deploiement-mac-ade.webp`, `24-configuration-assistant.webp`, `25-supervision-automatique.webp`
- `public/images/courses/intune/`: `26-intune-admin-center.webp`, `27-devices.webp`, `28-apple-enrollment.webp`, `29-apns-configuration.webp`, `30-enrollment-program-tokens.webp`, `31-import-token-abm.webp`, `32-configuration-profiles.webp`, `33-applications-ios.webp`, `34-applications-macos.webp`, `35-compliance-policies.webp`, `36-conditional-access.webp`, `37-platform-sso.webp`, `38-managed-devices.webp`, `39-device-configuration.webp`, `40-device-compliance.webp`
- `public/images/courses/apns/`: `41-push-certificates-portal.webp`, `42-upload-csr.webp`, `43-download-certificate.webp`, `44-import-apns-intune.webp`, `45-expiration-apns.webp`, `46-renouvellement-apns.webp`
- `public/images/courses/apps-books/`: `47-recherche-application.webp`, `48-achat-licences.webp`, `49-inventaire-licences.webp`, `50-attribution-applications.webp`, `51-synchronisation-apps-books.webp`, `52-deploiement-teams.webp`, `53-deploiement-outlook.webp`
- `public/images/courses/managed-apple-id/`: `54-creation-utilisateur.webp`, `55-federation-entra-id.webp`, `56-synchronisation-utilisateurs.webp`, `57-verification-domaine.webp`, `58-gestion-des-comptes.webp`
- `public/images/courses/platform-sso/`: `59-configuration-platform-sso.webp`, `60-profil-intune-platform-sso.webp`, `61-connexion-utilisateur.webp`, `62-synchronisation-mot-de-passe.webp`, `63-mfa-microsoft.webp`
- `public/images/courses/jamf/`: `64-dashboard-jamf.webp`, `65-computers.webp`, `66-mobile-devices.webp`, `67-smart-groups.webp`, `68-static-groups.webp`, `69-policies.webp`, `70-configuration-profiles.webp`, `71-packages.webp`, `72-scripts.webp`, `73-patch-management.webp`, `74-inventory.webp`, `75-enrollment.webp`, `76-prestage-enrollment.webp`, `77-self-service.webp`, `78-jamf-protect.webp`
- `public/images/courses/filevault/`: `79-filevault-active.webp`, `80-cle-recuperation.webp`
- `public/images/courses/security/`: `81-gatekeeper.webp`, `82-xprotect.webp`, `83-sip.webp`, `84-activation-lock.webp`, `85-privacy-preferences.webp`, `86-system-extensions.webp`
- `public/images/courses/exams/`: `87-simulation-apple-it-pro.webp`, `88-resultats-examen.webp`, `89-simulation-jamf-100.webp`, `90-simulation-jamf-200.webp`

Decision: garder. Ces images alimentent les cours, quizzes et captures pedagogiques via le manifest.

### Originaux officiels mappes

Source de verite: `lib/data/official-screenshots.ts`.

Utilises comme remplacement officiel pour certains IDs de captures:

- Apple: `public/images/courses/apple-originals/apple-business-devices-apps-books-official.png`
- Apple: `public/images/courses/apple-originals/apple-business-federated-authentication-official.png`
- Microsoft: `public/images/courses/intune-originals/29-apns-certificate-intune-official.png`
- Microsoft: `public/images/courses/intune-originals/30-ios-ade-token-intune-official.png`
- Microsoft: `public/images/courses/intune-originals/37-platform-sso-device-profile-intune-official.png`
- Microsoft: `public/images/courses/intune-originals/39-applicability-rules-intune-official.png`
- Microsoft: `public/images/courses/intune-originals/60-platform-sso-settings-picker-intune-official.png`
- Jamf: `public/images/courses/jamf-originals/64-dashboard-jamf-official.webp`
- Jamf: `public/images/courses/jamf-originals/66-mobile-devices-official.webp`
- Jamf: `public/images/courses/jamf-originals/74-inventory-official.webp`

Decision: garder si l'usage public est valide et source dans `SOURCES.md` maintenue. Aucune donnee privee evidente observee visuellement, mais ces assets sont des contenus tiers: ne pas les modifier ni les presenter comme une affiliation.

### Originaux conserves mais non injectes directement

Documentes dans les `SOURCES.md`, mais non mappes comme asset officiel actif:

- `public/images/courses/intune-originals/32-devices-overview-intune-official.png`
- `public/images/courses/intune-originals/37-macos-account-settings-intune-official.png`
- `public/images/courses/intune-originals/61-platform-sso-registration-required-official.png`
- `public/images/courses/jamf-originals/69-policies-blueprints-official.webp`
- `public/images/courses/jamf-originals/jamf-pro-ai-assistant-official.webp`
- `public/images/courses/jamf-originals/jamf-pro-screenshot-official.png`

Decision: deplacer hors `public/` vers un dossier interne comme `audit/source-originals/` ou `media-sources/` si ces fichiers servent uniquement de reference. Ne pas supprimer sans validation humaine.

### Assets de production video utilises

Source de verite: `src/lib/video-assets.ts` et composants video.

Backgrounds:

- `public/video-assets/backgrounds/apple-light.svg`
- `public/video-assets/backgrounds/certification.svg`
- `public/video-assets/backgrounds/jamf-training.svg`
- `public/video-assets/backgrounds/macos-security.svg`
- `public/video-assets/backgrounds/microsoft-learn.svg`

Diagrammes:

- `public/video-assets/diagrams/abm-intune-apns-device.svg`
- `public/video-assets/diagrams/abm-jamf-apns-device.svg`
- `public/video-assets/diagrams/ade-workflow.svg`
- `public/video-assets/diagrams/apns-workflow.svg`
- `public/video-assets/diagrams/apps-books-workflow.svg`
- `public/video-assets/diagrams/filevault-key-escrow.svg`
- `public/video-assets/diagrams/jamf-policy-workflow.svg`
- `public/video-assets/diagrams/platform-sso-workflow.svg`

Icones:

- `public/video-assets/icons/abm.svg`
- `public/video-assets/icons/ade.svg`
- `public/video-assets/icons/admin.svg`
- `public/video-assets/icons/apns.svg`
- `public/video-assets/icons/apps-books.svg`
- `public/video-assets/icons/certificate.svg`
- `public/video-assets/icons/cloud.svg`
- `public/video-assets/icons/filevault.svg`
- `public/video-assets/icons/gatekeeper.svg`
- `public/video-assets/icons/intune.svg`
- `public/video-assets/icons/ipad.svg`
- `public/video-assets/icons/iphone.svg`
- `public/video-assets/icons/jamf.svg`
- `public/video-assets/icons/mac.svg`
- `public/video-assets/icons/managed-apple-id.svg`
- `public/video-assets/icons/platform-sso.svg`
- `public/video-assets/icons/security-shield.svg`
- `public/video-assets/icons/sip.svg`
- `public/video-assets/icons/user.svg`
- `public/video-assets/icons/xprotect.svg`

Lower thirds:

- `public/video-assets/lower-thirds/module.svg`
- `public/video-assets/lower-thirds/objective.svg`
- `public/video-assets/lower-thirds/recap.svg`
- `public/video-assets/lower-thirds/step.svg`

Thumbnails:

- `public/video-assets/thumbnails/abm-intune.svg`
- `public/video-assets/thumbnails/ade-iphone.svg`
- `public/video-assets/thumbnails/ade-mac.svg`
- `public/video-assets/thumbnails/apns.svg`
- `public/video-assets/thumbnails/apple-business-manager.svg`
- `public/video-assets/thumbnails/apps-books.svg`
- `public/video-assets/thumbnails/filevault.svg`
- `public/video-assets/thumbnails/gatekeeper-xprotect-sip.svg`
- `public/video-assets/thumbnails/ios-ipados-profiles.svg`
- `public/video-assets/thumbnails/jamf-patch-management.svg`
- `public/video-assets/thumbnails/jamf-policies.svg`
- `public/video-assets/thumbnails/jamf-pro-fundamentals.svg`
- `public/video-assets/thumbnails/jamf-protect.svg`
- `public/video-assets/thumbnails/jamf-scripts.svg`
- `public/video-assets/thumbnails/jamf-smart-groups.svg`
- `public/video-assets/thumbnails/macos-profiles.svg`
- `public/video-assets/thumbnails/managed-apple-ids.svg`
- `public/video-assets/thumbnails/platform-sso.svg`

Decision: garder. Ces SVG sont des templates/illustrations de pipeline video et des fallbacks de thumbnail.

### Captures video presentes et cataloguees

Ces captures existent et sont referencees par `data/video-screenshot-catalog.json`:

- `public/video-assets/screenshots/jamf-dashboard.webp`
- `public/video-assets/screenshots/jamf-computers.webp`
- `public/video-assets/screenshots/jamf-smart-groups.webp`
- `public/video-assets/screenshots/jamf-policies.webp`
- `public/video-assets/screenshots/jamf-scripts.webp`
- `public/video-assets/screenshots/jamf-patch-management.webp`
- `public/video-assets/screenshots/jamf-self-service.webp`

Decision: garder. Verifier anonymisation avant production finale; ces captures sont actuellement le seul lot video partiellement disponible.

## Assets non utilises ou non catalogues

Ces fichiers sont presents dans `public/video-assets/screenshots/`, mais ne sont pas references par `data/video-screenshot-catalog.json` et ne sont pas requis par `videoScreenshotMap`:

- `public/video-assets/screenshots/jamf-configuration-profiles.webp`
- `public/video-assets/screenshots/jamf-mobile-devices.webp`
- `public/video-assets/screenshots/jamf-packages.webp`
- `public/video-assets/screenshots/jamf-reporting.webp`
- `public/video-assets/screenshots/jamf-static-groups.webp`

Decision recommandee:

- Option A: les garder et les ajouter au catalogue si de futures videos Jamf les utilisent.
- Option B: les deplacer vers un dossier interne `public/video-assets/screenshots/_reserve/` apres validation humaine.
- Option C: les supprimer uniquement apres confirmation qu'aucune video Jamf avancee ne les utilisera.

Aucune suppression effectuee.

## Placeholders et templates

Placeholders techniques:

- `public/videos/.gitkeep`
- `public/video-assets/screenshots/.gitkeep`
- `public/video-assets/screenshots/raw/.gitkeep`

Documentation/placeholders de workflow:

- `public/videos/README.md`
- `public/video-assets/screenshots/CHECKLIST.md`

Templates de production, a ne pas supprimer:

- `public/video-assets/backgrounds/*.svg`
- `public/video-assets/lower-thirds/*.svg`
- `public/video-assets/thumbnails/*.svg`
- `public/video-assets/icons/*.svg`
- `public/video-assets/diagrams/*.svg`

Placeholders fonctionnels:

- Aucun MP4 final dans `public/videos/`; le site doit rester en mode demo/video en production tant que les MP4 sont absents.
- Les thumbnails SVG servent de fallback visuel pendant la production video.

## Captures manquantes

Source de verite: `data/video-screenshot-catalog.json`.

Attendu: 29 captures `.webp`, 1920x1080, max 500 KB.
Present: 7.
Manquant: 22.

Liste des captures a produire:

- `public/video-assets/screenshots/abm-dashboard.webp`
- `public/video-assets/screenshots/abm-devices.webp`
- `public/video-assets/screenshots/abm-mdm-servers.webp`
- `public/video-assets/screenshots/abm-apps-books.webp`
- `public/video-assets/screenshots/abm-users.webp`
- `public/video-assets/screenshots/abm-managed-apple-ids.webp`
- `public/video-assets/screenshots/abm-federation-entra.webp`
- `public/video-assets/screenshots/intune-devices.webp`
- `public/video-assets/screenshots/intune-apple-enrollment.webp`
- `public/video-assets/screenshots/intune-apns.webp`
- `public/video-assets/screenshots/intune-enrollment-program-tokens.webp`
- `public/video-assets/screenshots/intune-configuration-profiles.webp`
- `public/video-assets/screenshots/intune-compliance-policies.webp`
- `public/video-assets/screenshots/intune-platform-sso.webp`
- `public/video-assets/screenshots/jamf-protect.webp`
- `public/video-assets/screenshots/macos-system-settings.webp`
- `public/video-assets/screenshots/macos-filevault.webp`
- `public/video-assets/screenshots/macos-privacy-security.webp`
- `public/video-assets/screenshots/macos-profiles.webp`
- `public/video-assets/screenshots/macos-terminal.webp`
- `public/video-assets/screenshots/macos-gatekeeper.webp`
- `public/video-assets/screenshots/macos-activation-lock.webp`

Decision: produire manuellement dans des tenants/labs de demonstration, sans emails reels, noms reels, serial numbers reels, tenant IDs, domaines internes ou tokens.

## MP4 manquants

Source de verite: `data/video-pilot-mp4.json`.

Attendu: 12 MP4.
Present: 0.
Manquant: 12.

Liste des MP4 a produire:

- `public/videos/apple-business-manager.mp4`
- `public/videos/abm-intune.mp4`
- `public/videos/automated-device-enrollment-iphone.mp4`
- `public/videos/automated-device-enrollment-mac.mp4`
- `public/videos/enrollment-program-token.mp4`
- `public/videos/apns-intune.mp4`
- `public/videos/managed-apple-ids.mp4`
- `public/videos/platform-sso.mp4`
- `public/videos/defender-macos-intune.mp4`
- `public/videos/conditional-access-apple.mp4`
- `public/videos/jamf-pro-fundamentals.mp4`
- `public/videos/filevault.mp4`

Decision: produire/exporter en 1080p H.264, puis relancer `npm run check:mp4`.

## Verification des originaux sensibles

Dossiers verifies:

- `public/images/courses/apple-originals/`
- `public/images/courses/intune-originals/`
- `public/images/courses/jamf-originals/`

Resultat:

- Aucun email personnel evident observe.
- Aucun token ou secret evident observe.
- Aucun serial number prive evident observe.
- Aucun tenant ID prive evident observe.
- Les fichiers sont des originaux publics documentes dans `SOURCES.md` ou des assets marketing/documentation publics.

Risques:

- `public/images/courses/apple-originals/apple-business-devices-apps-books-official.png` contient un visuel Apple tres marque; ce n'est pas un secret, mais c'est un risque de marque/IP si utilise hors conditions.
- Les originaux Apple/Microsoft/Jamf sont servis publiquement parce qu'ils sont dans `public/`. S'ils ne sont pas necessaires a l'execution, les deplacer hors `public/` reduirait l'exposition.
- OCR automatique non disponible dans l'environnement courant; la verification sensible est basee sur inspection visuelle et recherche textuelle/binaire.

## Recommandations

Garder:

- Les 90 captures declarees dans `generation-manifest.json`.
- Les assets video SVG (`icons`, `backgrounds`, `diagrams`, `lower-thirds`, `thumbnails`).
- Les 7 captures video Jamf cataloguees.
- Les fichiers `.gitkeep` et README/CHECKLIST tant que les dossiers servent au workflow.

Produire:

- Les 22 captures video manquantes.
- Les 12 MP4 pilotes manquants.

Deplacer apres validation humaine:

- Originaux non injectes: `32-devices-overview-intune-official.png`, `37-macos-account-settings-intune-official.png`, `61-platform-sso-registration-required-official.png`, `69-policies-blueprints-official.webp`, `jamf-pro-ai-assistant-official.webp`, `jamf-pro-screenshot-official.png`.
- Les 5 screenshots Jamf non catalogues si aucune video prevue ne les consomme.

Supprimer apres validation humaine seulement:

- Aucun fichier recommande pour suppression immediate.
- Suppression possible plus tard pour les 5 screenshots Jamf non catalogues si le plan video confirme qu'ils ne seront jamais utilises.

Nettoyage futur recommande:

- Ajouter un champ `usageStatus` ou `catalogStatus` pour les originaux: `active`, `reference-only`, `candidate`, `deprecated`.
- Ajouter un dossier non public pour les sources/reference-only: `audit/source-originals/` ou `media-sources/`.
- Ajouter une convention d'anonymisation obligatoire avant tout ajout sous `public/video-assets/screenshots/`.
- Relancer apres production: `npm run check:screenshots`, `npm run check:mp4`, `npm run lint`, `npm run build`.

## Bloquants

Aucun bloquant technique detecte pour le build.

Bloquants media avant publication complete:

- 12 MP4 manquants.
- 22 captures video manquantes.
- Decision humaine requise avant suppression ou deplacement des originaux/reference-only.
