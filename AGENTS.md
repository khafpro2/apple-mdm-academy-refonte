# Agents — Cursor + Codex

Protocole de coordination : `.cursor/rules/cursor-codex-coordination.mdc`

## Branches en cours

| Branche | Agent | Statut | Objectif |
|---------|-------|--------|----------|
| `cursor/video-production-ux` | Cursor | Pushée (`9f9f928`) | UX vidéos en production — en attente merge |
| `cursor/feature-lms-ui` | Cursor | Pushée | UX LMS — en attente merge |
| `codex/video-pipeline-audit` | Codex | Locale | Audit pipeline — à finaliser |
| `codex/video-pipeline-hardening` | Codex | **À créer** | Sécurisation pipeline vidéo |
| `cursor/course-learning-experience` | Cursor | **À créer** | Expérience lecture cours |

## Prochaine action recommandée

1. **Codex** : créer `codex/video-pipeline-hardening` depuis `main`, exécuter tâche pipeline
2. **Cursor** : créer `cursor/course-learning-experience` depuis `main`, améliorer lecture cours
3. **Humain** : merger les branches validées (lint + build + test visuel)

## Bloquant connu

- **Auth Supabase** : `.env.local` contient encore des placeholders → connexion impossible tant que les clés ne sont pas configurées (local + Vercel).
