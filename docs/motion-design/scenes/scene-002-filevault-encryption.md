# Scène — FileVault encryption

```text
id: scene-002-filevault-encryption
```

## Intention pédagogique

Illustrer l’état **protégé** d’un volume macOS chiffré avec FileVault : le contenu est inaccessible tant que le volume n’est pas déverrouillé.

## Lien cours

* Leçon pilote : `/cours/apple-fundamentals/filevault-chiffrement`
* Contenu : `lib/data/lessons/apple/macos-filevault.ts`
* Vidéo pilote associée (catalogue) : slug `filevault` si présente dans `data/video-pilot-mp4.json`

## Timing suggéré

| Segment | Durée | Contenu |
| --- | --- | --- |
| Intro concept | 8–12 s | Asset cadenas + titre FileVault |
| Capture macOS | 20–40 s | Screen Studio — Réglages > Confidentialité et sécurité / FileVault |
| Récap | 5–8 s | Asset cadenas + message « volume chiffré » |

## Assets Motion requis

| Asset id | Statut attendu (phase 1) | Rôle |
| --- | --- | --- |
| `device-laptop-isometric-neutral-base-v1` | `brief-ready` | Appareil macOS a proteger |
| `data-flow-storage-blocks-isometric-readable-base-v1` | `brief-ready` | Donnees lisibles avant chiffrement |
| `data-flow-storage-blocks-isometric-encrypted-base-v1` | `brief-ready` | Donnees chiffrees apres activation |
| `security-lock-front-closed-cyan-v1` | `brief-ready` | Icone d'etat protege |
| `security-recovery-key-front-neutral-base-v1` | `brief-ready` | Cle de recuperation |
| `security-vault-front-closed-enterprise-v1` | `brief-ready` | Conservation enterprise securisee |
| `identity-user-front-authorized-standard-v1` | `brief-ready` | Utilisateur autorise |
| `data-flow-encryption-transition-neutral-v1` | `brief-ready` | Transition animee lisible vers chiffre |

## Captures Screen Studio (hors registre Motion)

* Réglages Système — FileVault (état activé)
* Dialogue de déverrouillage (flouter comptes / emails)

Résolution : 1920×1080 · exporter `.webp` selon le guide captures vidéo.

## Notes production

* Ne pas présenter l’illustration comme un écran Apple officiel.
* Disclaimer d’indépendance plateforme inchangé côté examens / LMS.
* Après génération SVG : passer `status` à `generated` puis `review` / `approved` et renseigner `path` uniquement si le fichier existe.
