# Audit projet — Apple MDM Academy (v2)

**Date :** 21 août 2026  
**Révision :** 2e passe (la v1 du 16 août est entièrement reprise et recoupée)  
**Référence :** `main` @ `a869c15` — **aucun commit produit depuis le 16 août**  
**Méthode :** revue code + scripts `audit:exams`, `audit:quizzes`, pédagogique, LMS, liens internes, `npm test`, `npm audit`, `lint`, `build`

Les scores affichés dans `/admin/final-audit` (`getProjectScores`) restent **hardcodés** : ils ne sont pas utilisés ici.

---

## Delta vs audit du 16 août

| | |
|---|---|
| Code `main` | Inchangé (`a869c15`) |
| Findings P0/P1 du 16/08 | **Tous encore ouverts** |
| Correctifs livrés | Aucun |
| WIP parallèle | 12 PRs ouvertes/draft (vidéo, OAuth Google, motion) **non mergées** |

Cette v2 n’est pas une copie : les banques d’examens, la qualité QCM, le consentement analytics et le partage de certificats ont été mesurés en runtime.

---

## 1. Verdict

La plateforme est un **LMS Next.js large et déjà navigable** (Apple / Jamf / Intune). Elle convient à une **preview / formation gratuite**. Elle n’est **pas** un produit certifiant, ni un SaaS facturé, ni un examen anti-triche.

| Dimension | 16/08 | 21/08 | Commentaire |
|-----------|-------|-------|-------------|
| Architecture | 7/10 | 7/10 | App Router, auth SSR, filtre V1 — inchangé |
| Complétude V1 | 6/10 | 6/10 | Catalogue riche ; 142/197 leçons non « complet » |
| Sécurité | 4/10 | **3/10** | P0 confirmés + CVE Next sur `proxy.ts` + certificats publics cassés |
| Pédagogie | 6/10 | 6/10 | Score interne 89 trompeur ; QCM runtime **63/100** |
| Tests / CI | 2/10 | 2/10 | 11 tests unitaires auth ; **0** GitHub Actions |
| Ops / prod | 4/10 | 4/10 | Build vert ; Stripe / vidéos / assistant stub |
| Marque / légal | 5/10 | 5/10 | Disclaimers OK ; Analytics Vercel hors bandeau cookies |
| **Global production** | **5/10** | **5/10** | Preview OK ; bloquant certificats + billing |

**Recommandation :** geler les nouvelles surfaces. Traiter dans l’ordre : upgrade Next.js, lock des routes démo/webhooks, scoring serveur, puis banques Apple Device Support / Intune Apple.

---

## 2. Identité

| | |
|---|---|
| Produit | Formation FR indépendante Apple MDM, Jamf Pro, Microsoft Intune |
| Repo | [khafpro2/apple-mdm-academy-refonte](https://github.com/khafpro2/apple-mdm-academy-refonte) |
| Prod | https://apple-mdm-academy-refonte.vercel.app |
| Stack | Next.js **16.2.7** (CVE high), React 19.2, Tailwind 4, TypeScript, Supabase Auth, Vercel |
| Auth prod | Email + mot de passe uniquement (Google OAuth = PR #20, pas sur `main`) |

Périmètre V1 (Apple / Jamf / Intune) : les slugs Kandji / Mosyle / Addigy / Workspace ONE renvoient une **404 HTTP réelle** via `proxy.ts`. Bon.

---

## 3. Inventaire mesuré (21/08)

| Zone | Volume | État réel |
|------|--------|-----------|
| Parcours | 14 visibles | Apple 1–5, Jamf 100–400, Intune, Azure |
| Cours | 18 slugs | Structure OK |
| Leçons | **197** | **55 complet / 130 partiel / 12 à améliorer** |
| Labs | **75** | Heuristique interne 98/100 (scénarios souvent générés) |
| Quiz type `quiz` | 74 (LMS) / **86** (qualité QCM, tous types) | Scoring **client** |
| Examens | 12 routes | 9/12 banques « complètes » au sens moteur ; 3 simulations réduites |
| Questions QCM | **1514** runtime | Qualité **63/100** ; 384 distracteurs faibles |
| Ressources | 110 | Score interne 100 |
| Captures | 122 réf. | **24 manquantes** |
| Vidéos | ~76 fiches | **0 MP4** dans `public/videos/` ; HeyGen `{}` |
| Pages App Router | 82 `page.tsx` | Build : 675 routes, quasi toutes dynamiques |
| Admin | 23 pages | Gate `requireAdmin()` réelle |
| API | 15 routes | Plusieurs stubs ou trop ouvertes |
| i18n | `/` + `/en` | Landing EN seulement |

Liens internes : **254** scannés, **0 cassé** (`scripts/check-internal-links.mjs`).

---

## 4. Sécurité — findings re-vérifiés

Tous les IDs S1–S15 du 16/08 sont **toujours présents** dans le code. Nouveaux : S16–S19.

### P0 — exposé si l’app est publique

| ID | Statut 21/08 | Finding | Preuve |
|----|----------------|---------|--------|
| S1 | **Ouvert** | `POST /api/auth/demo/provision` utilise le **service role** sans auth | `app/api/auth/demo/provision/route.ts` — `POST()` public |
| S2 | **Ouvert** | Mot de passe démo dans le git | `DEMO_USER_PASSWORD = "Demo123!"` |
| S3 | **Ouvert** | Cookie démo sans compte → `/dashboard` | `POST /api/auth/demo/session` |
| S4 | **Ouvert** | Webhook Supabase **fail-open** | `if (!WEBHOOK_SECRET) return true` |
| S5 | **Ouvert** | Assistant sans clé, sans user, rate-limit mémoire | fetch Anthropic **sans** `x-api-key` |
| S6 | **Ouvert** | `blockDemoWrite()` jamais importé hors sa définition | grep : uniquement `lib/demo/demo-write-guard.ts` |
| S16 | **Ouvert** | `next@16.2.7` dans la plage CVE **bypass Middleware/Proxy** + DoS Server Actions | `npm audit` ; le projet **utilise** `proxy.ts` + Turbopack |

### P1 — examens, certificats, billing

| ID | Statut | Finding |
|----|--------|---------|
| S7 | **Ouvert** | `insertQuizResult` enregistre `score` / `passed` **tels quels**, sans recalcul, **sans clamp 0–100** |
| S8 | **Ouvert** | `correctIndex` dans le bundle client (`lib/data/quizzes.ts` → Client Components) |
| S9 | **Ouvert** | `/api/certificates/verify/[id]`, `/certificat/verify`, `/share/certificat/[id]` lisent `quiz_results` avec le client user. RLS = own rows. **Un tiers ne peut pas vérifier un certificat.** La page share LinkedIn est donc un 404 pour le public. |
| S10 | **Ouvert** | Stripe checkout/portal = stubs ; webhook HMAC `===` ; pas de colonnes `tier` / `stripe_customer_id` en SQL |
| S17 | **Ouvert** | Banques **présentées official-verified** alors que la simulation est incomplète : Apple Device Support **10/80** |

### P1 — données / admin

| ID | Statut | Finding |
|----|--------|---------|
| S11 | **Ouvert** | Admin = `ADMIN_EMAILS` **ou** `admin_allowlist` (double source) |
| S12 | **Ouvert** | MRR admin inventé : `proUsers = round(totalUsers * 0.12)` |
| S13 | **Ouvert** | Vue `leaderboard_scores` sans `security_invoker` explicite — risque de fuite `full_name` |
| S14 | **Ouvert** | Contact : Resend KO → fallback SQL **no-op** mais `ok: true` |
| S15 | **Ouvert** | `/api/v1/users` public + CORS `*` |
| S18 | **Ouvert** | Middleware ne protège que `/dashboard` et `/admin`. `/account/billing` n’est pas dans `PROTECTED_PREFIXES` (aujourd’hui redirigé par `FREE_PLATFORM_MODE`). |

### P2

| ID | Finding |
|----|---------|
| S19 | `<Analytics />` et `<SpeedInsights />` sont **toujours** montés dans `app/layout.tsx`. Le bandeau cookies ne coupe que `trackEvent()` custom — pas le tracker Vercel. |
| — | Pas de CSP / HSTS applicatif ; `X-XSS-Protection` obsolète |
| — | Rate-limits in-memory (Vercel : une Map par instance) |
| — | URL projet réelle dans `lib/supabase/env-validation.ts` (`uqlhjtgcfbbhkcvjdybs.supabase.co`) |
| — | `getEffectiveTier()` retourne **toujours** `"enterprise"` |

`sanitizeRedirectPath` est correct (tests unitaires OK) : pas d’open-redirect identifié sur le callback.

---

## 5. Examens — mesures runtime

`scripts/audit-exams.ts` : **12 examens**, 0 erreur, **12 warnings**, 24 info. Banques « complètes » moteur : **9/12**.

| Route | Banque unique / cible UI | Format | Simulation full | Risque produit |
|-------|--------------------------|--------|-----------------|----------------|
| `apple-device-support` | **10 / 80** | official-verified | **Non** | Affiche un format Apple officiel avec 10 questions |
| `intune-apple` | **35 / 60** | internal | **Non** | Catalogue trop ambitieux |
| `apple-enterprise-expert` | **65 / 100** | internal | **Non** | Idem |
| `jamf-100` | 100 / 50 (officiel 50) | official-verified | Oui (50) | `examQuestionCounts` dit encore **100** — incohérence |
| `apple-it-professional` | 200 / 200 | internal | Oui | IDs dupliqués en source (copies) |
| `jamf-200` | 200 / 60 | needs-review | Oui | Ne pas vendre comme officiel |
| `jamf-300` | 285 / 75 | needs-review | Oui | IDs `j200-cmp-*` recopiés |
| `jamf-400` | 360 / 90 | needs-review | Oui | Idem copies Jamf 200 |
| `apple-deployment` | 100 / 80 | official-verified | Oui | IDs dupliqués en source |
| `apple-security` | 100 / 100 | internal | Oui | |
| `apple-enterprise-architect` | 200 / 200 | internal | Oui | Nombreux IDs dupliqués |
| `intune-apple-advanced` | 100 / 60 | internal | Oui | |

Le moteur réduit correctement la tentative si la banque est trop petite (warning UI). **Le catalogue ne doit pas laisser croire à une simu 80 questions Apple Device Support.**

Qualité QCM (`audit:quizzes`) :

- Score runtime **63/100** (source brute 56/100)
- 384 distracteurs faibles, 44 questions trop faciles
- Avant shuffle, biais massif sur la position B (1381) — le runtime mélange, mais les items restent reconnaissables (bonne réponse plus longue)

`scripts/test-exam-engine.ts` : **pass**.

---

## 6. Architecture & données

**Solide :** App Router, cookies auth HTTP-only, RLS de base, `requireAdmin` au layout, contenu en code, 404 V1.

**Fragile :**

1. `lib/` vs `src/lib/` (vidéos / ressources)
2. `lib/exam` vs `lib/exams` (deux moteurs)
3. 23 pages admin + studio + HeyGen autour d’un cœur (média, Stripe, scoring) incomplet
4. SQL en 4 fichiers manuels, pas de CLI migrations
5. `FREE_PLATFORM_MODE = true` — paywall mort
6. Progression **Supabase + localStorage** (examens surtout locaux)
7. Google OAuth uniquement sur PR #20 / #19, pas sur `main`

Tables utilisées par le code **absentes** du schéma de base : `tier`, `stripe_customer_id`. Tables migrées mais **non branchées** : `contact_requests`.

---

## 7. Qualité, tests, process

| Check 21/08 | Résultat |
|-------------|----------|
| `npm run lint` | OK, 0 warning |
| `npm run build` | OK, Next 16.2.7 Turbopack, 675 pages ; warning NFT admin vidéo |
| `npm test` | **11/11** pass (auth signup / password / redirect) |
| `npm audit --omit=dev` | **4 high** (next, postcss, nanoid, sharp) |
| Liens internes | 0 cassé |
| E2E | 2 specs ; `audit.spec.ts` hardcode l’URL **prod** |
| GitHub Actions | **Aucun** `.github/` |
| PRs | #22 (cet audit) + 11 draft/open hors main |
| Issues | 0 |

`PROJECT_RULES.md` interdit de committer sur `main` ; l’historique merge quand même directement sur `main`.

---

## 8. SEO, a11y, légal, ops

- SEO : metadata, OG, JSON-LD, sitemap. Canonique encore `*.vercel.app`.
- `robots.ts` disallow `/admin` `/api` `/dashboard` ; `vercel.json` pose `X-Robots-Tag: index, follow` **global** — contradiction potentielle.
- A11y : skip-link, `lang=fr`, focus ; pas d’audit contraste/lecteur d’écran.
- Légal : `/privacy` `/terms` `/legal` ; email `kthiam@harmytech.com`. Consentement cookies **incomplet** (S19).
- Ops : pas de monitoring réel (`/status` placeholder). Bundle admin déjà cassé une fois (>300 MB) — exclusions tracing en place.

---

## 9. Plan d’action (inchangé, re-priorisé)

### Semaine 1 — sécurité preview

1. Upgrader Next.js **hors** 16.3.0-preview.10 (CVE proxy).
2. Supprimer ou verrouiller `POST /api/auth/demo/provision` (CLI `seed:demo` suffit).
3. Webhook Supabase : **fail closed** si secret absent.
4. Assistant : 401 sans session ; 503 sans `ANTHROPIC_API_KEY` ; envoyer la clé serveur.
5. Appeler `blockDemoWrite()` dans toutes les Server Actions d’écriture.
6. Retirer `/api/v1/users`.

### Avant tout mot « certificat » ou tarif

7. Recalculer score + `passed` **serveur** ; clamp 0–100 ; ignorer le `passed` client.
8. Ne plus envoyer `correctIndex` au navigateur pour les examens.
9. Vérification / share certificat via **service role** + payload public minimal (ou table `certificates` dédiée).
10. Masquer ou relabeliser Apple Device Support tant que la banque < 80 uniques.
11. Aligner Jamf 100 sur **50 Q / 60 min / 80 %** partout (`examQuestionCounts` inclus).
12. Stripe réel **ou** retirer checkout/webhook du produit.

### Qualité V1

13. CI : `lint` + `test` + `build` sur chaque PR.
14. Dédupliquer les IDs de banques (ACITP, AEA, jamf-300/400 recopiant jamf-200).
15. Remplacer les 384 distracteurs faibles (audit QCM).
16. Captures lab fictives ; logos Apple décoratifs hors prod.
17. Fermer ou merger les 11 PRs draft (WIP vidéo/OAuth).
18. Conditioner `@vercel/analytics` au consentement.

### Ne pas faire

- Nouvelles pages admin / studio / API
- Promesses Jamf 300/400 ou « certification officielle »
- Dashboard entreprise au-delà de la démo

---

## 10. Outils d’audit déjà dans le repo

Les utiliser, **sans croire le score global admin**.

| Outil | Ce qu’il mesure vraiment |
|-------|--------------------------|
| `/admin/final-audit` | Env + volumes — KPI globaux **biaisés** |
| `runPedagogicalAudit()` | 89 global **malgré** 55/197 leçons complètes |
| `runLmsAudit()` | 91 ; trou `platform-sso-mfa` / `examen-intune-mac` |
| `audit:exams` | Banques vs cibles — **le plus fiable** pour les examens |
| `audit:quizzes` | 63/100 qualité items |
| `audit/media-usage-audit.md` | IP / logos (juin 2026, toujours vrai) |

---

## 11. Synthèse

Rien n’a bougé sur `main` en cinq jours. Le diagnostic du 16 août tient, et la 2e passe l’aggrave sur trois points concrets :

1. **Apple Device Support « official-verified » n’a que 10 questions.**
2. **Les pages de partage / vérification de certificat ne marchent pas pour un tiers** (RLS).
3. **La qualité QCM runtime est à 63/100**, pas au 89 pédagogique.

Traiter S1–S7 et S16 avant d’élargir l’audience. Ensuite seulement : scoring serveur, banques, médias, Stripe ou gratuit assumé pour de bon.

---

## 12. Vérifications de cette passe

| Commande | 21/08/2026 |
|----------|------------|
| `npm run lint` | OK, 0 warning |
| `npm run build` | OK, Next 16.2.7 Turbopack, 675 pages |
| `npm test` | 11 pass / 0 fail |
| `npm audit --omit=dev` | 4 high |
| `tsx scripts/audit-exams.ts` | 12 examens, 9/12 banques complètes, 0 error |
| `tsx scripts/audit-quiz-quality.ts` | 63/100, 1514 questions |
| `runPedagogicalAudit()` | 89 global ; 55/197 leçons complet |
| `runLmsAudit()` | 91 ; 1 module incomplet |
| `scripts/test-exam-engine.ts` | pass |
| `scripts/check-internal-links.mjs` | 0 lien cassé |
