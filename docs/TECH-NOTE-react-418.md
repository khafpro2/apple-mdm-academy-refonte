# Note technique — Warning console React #418 (hydration)

**Statut** : non bloquant — production stable, ne pas traiter en hotfix.
**Créé** : session d'audit production — corrections SEO/a11y du 2026-06-13.

---

## 1. Description du warning

```
Error: Minified React error #418; visit https://react.dev/errors/418
```

React #418 signifie : *"Hydration failed because the initial UI does not match
what was rendered on the server"* (mismatch de **contenu texte** entre le HTML
généré par le serveur et le premier rendu client).

**Reproduction** : se charge de façon fiable et systématique au premier chargement
de `/examens/jamf-100` (probablement tous les `/examens/[slug]`), même sans
interaction utilisateur.

**Indice clé dans la stack trace** : l'erreur est levée via `MessagePort` →
scheduler React, donc **après** le commit initial d'hydratation — pas pendant.
Cela pointe vers une frontière asynchrone (`next/dynamic` / Suspense) plutôt
qu'un mismatch direct dans le HTML statique de la page.

**Impact observé** : aucun impact fonctionnel constaté. Page rendue correctement,
interactive, examen jouable (vérifié visuellement desktop + mobile 390px).

---

## 2. Fichier(s) probablement concernés

| Fichier | Rôle | Suspicion |
|---|---|---|
| `components/exams/exam-page-shell.tsx` | Définit les `dynamic()` imports avec fallback `loading` | **Principal suspect** |
| `components/quiz/exam-engine.tsx` | Composant chargé dynamiquement (`ssr` par défaut = true) | À tester en second |
| `components/exams/exam-result-page-client.tsx` | Même pattern `dynamic()` + `loading` | À tester en second |

Extrait actuel de `exam-page-shell.tsx` :

```ts
const ExamEngine = dynamic(
  () => import("@/components/quiz/exam-engine").then((m) => m.ExamEngine),
  { loading: () => <p className="text-center text-ink-secondary">Chargement de l&apos;examen…</p> }
);

const ExamResultPageClient = dynamic(
  () => import("@/components/exams/exam-result-page-client").then((m) => m.ExamResultPageClient),
  { loading: () => <p className="text-center text-ink-secondary">Chargement du résultat…</p> }
);
```

**Hypothèse** : `dynamic()` sans `ssr: false` est SSR par défaut. Le HTML serveur
contient le rendu complet de `ExamEngine`/`ExamResultPageClient`. Au premier
rendu client (avant que le chunk JS soit exécuté), React peut transitoirement
afficher le fallback `<p>Chargement…</p>` — dont le **texte et la structure
DOM diffèrent** du HTML serveur → mismatch texte détecté de façon asynchrone
par le scheduler (cohérent avec la stack `MessagePort`).

---

## 3. Niveau de risque

🟡 **Faible / Cosmétique**

- Aucune régression visuelle ou fonctionnelle détectée.
- N'affecte pas le scoring, la soumission, la persistance de session d'examen.
- N'apparaît que dans la console développeur (les utilisateurs finaux ne le voient pas).
- Risque principal = **risque de correction** : `ExamEngine` et
  `ExamResultPageClient` sont le cœur du moteur d'examen (timer, scoring,
  reprise de session, soumission). Toute modification de leur stratégie de
  chargement (`dynamic`/`ssr`/`Suspense`) doit être testée intégralement
  avant merge.

➡️ **Ne pas corriger en hotfix sur `main`. Traiter en session dédiée avec
branche isolée + `next dev`.**

---

## 4. Méthode de correction recommandée (session dédiée, `next dev`)

### Étape A — Obtenir le message d'erreur complet
```bash
cd /home/claude/refonte
npm run dev   # ou: npx next dev
```
Ouvrir `http://localhost:3000/examens/jamf-100` dans un navigateur, ouvrir la
console. En mode dev, React affiche le **diff exact** (texte serveur vs texte
client) au lieu du code minifié `#418`. Noter précisément :
- quel nœud DOM diffère
- quel texte est attendu vs reçu

### Étape B — Confirmer l'hypothèse `next/dynamic`
Si le diff pointe vers le conteneur de `ExamEngine`/`ExamResultPageClient` :

**Option 1 (recommandée, risque minimal)** — aligner le fallback sur la
structure racine du composant réel (même wrapper, même classes), pour qu'il
n'y ait pas de différence de texte/structure pendant la fenêtre d'hydratation :

```ts
const ExamEngine = dynamic(
  () => import("@/components/quiz/exam-engine").then((m) => m.ExamEngine),
  {
    loading: () => (
      <div className="mx-auto max-w-4xl">
        {/* squelette structurellement identique au composant final */}
      </div>
    ),
  }
);
```

**Option 2 (si Option 1 insuffisante)** — désactiver le SSR pour ces deux
composants 100% interactifs (timer, localStorage, état client) :

```ts
const ExamEngine = dynamic(
  () => import("@/components/quiz/exam-engine").then((m) => m.ExamEngine),
  { ssr: false, loading: () => (/* squelette */) }
);
```
⚠️ Option 2 retire le contenu de l'examen du HTML SSR : vérifier l'impact SEO
(le JSON-LD `examJsonLd` reste côté serveur dans `exam-page-shell.tsx`, donc
le SEO structuré n'est pas affecté — seul le contenu visible de l'examen
devient client-only, ce qui est cohérent puisqu'il est déjà
`SubscriptionGate`-protégé et personnalisé par session).

### Étape C — Si le diff ne pointe PAS vers `next/dynamic`
Chercher dans `exam-engine.tsx` / `exam-result-page-client.tsx` :
- tout rendu de texte dépendant de `Date.now()`, `Math.random()`, `toLocaleString`
  **en dehors** d'un `useEffect` ou d'un `useState` initialisé après mount
- tout `useSyncExternalStore` dont `getServerSnapshot` (3ᵉ argument) retourne
  une valeur différente du rendu initial réel

---

## 5. Procédure de test avant merge

1. **Branche isolée** : `git checkout -b fix/react-418-exam-hydration`
2. **Dev local** :
   - `npx next dev` → vérifier que le warning #418 a disparu sur
     `/examens/jamf-100`, `/examens/jamf-200`, `/examens/apple-deployment`
     (au moins 3 examens différents)
   - Vérifier `/examens/[slug]/result` (viewMode `"result"`)
3. **Build de production** :
   ```bash
   npx tsc --noEmit
   npx eslint app/ components/ lib/ --ext .ts,.tsx --max-warnings 0
   npx next build
   ```
4. **Test fonctionnel complet du moteur d'examen** (manuel, navigateur) :
   - [ ] Démarrer un examen → timer démarre correctement
   - [ ] Naviguer entre questions (libre + via navigateur de questions)
   - [ ] Marquer une question pour révision
   - [ ] Quitter la page en cours d'examen → revenir → reprise de session OK
   - [ ] Soumettre l'examen → page résultat correcte (score, correction détaillée)
   - [ ] Vérifier en mobile (390px) : pas de régression de layout
5. **Vérification SEO** (si Option 2 retenue) :
   - `view-source` sur `/examens/jamf-100` en prod-like (`next build && next start`)
   - Confirmer que le JSON-LD `Exam` est toujours présent dans le `<head>`/`<script>`
6. **Merge uniquement si** : 0 warning #418 sur les 3 examens testés, build
   propre, checklist fonctionnelle 100% validée.

---

## Annexe — Commande de repro rapide
```bash
npx next dev
# puis dans le navigateur, console ouverte :
#   http://localhost:3000/examens/jamf-100
# recharger 2-3 fois pour confirmer la reproductibilité
```
