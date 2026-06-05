import type { Question, Quiz } from "@/lib/types";
import type { AdvancedModuleDef } from "@/lib/data/advanced-tracks/module-definitions";
import { getModuleQuizBank } from "@/lib/data/advanced-tracks/quiz-banks";

function q(
  id: string,
  text: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string
): Question {
  return { id, text, options: [...options], correctIndex: correct, explanation };
}

/** Génère N questions — banque manuelle si disponible, sinon template pédagogique */
function questionsForModule(mod: AdvancedModuleDef): Question[] {
  const bank = getModuleQuizBank(mod.slug);
  if (bank && bank.length > 0) {
    const target = mod.quizCount;
    const result: Question[] = [];
    for (let i = 0; i < target; i++) {
      const base = bank[i % bank.length];
      result.push({
        ...base,
        id: `${mod.quizSlug}-${String(i + 1).padStart(2, "0")}`,
        text: i < bank.length ? base.text : `[Cas ${i + 1}] ${base.text}`,
      });
    }
    return result;
  }

  const p = mod.slug.split("-")[0];
  const bases: Question[] = [
    q(`${p}-01`, `Quel est l'objectif principal du module « ${mod.title} » ?`, [
      "Réduire la sécurité",
      `Maîtriser ${mod.title} en contexte entreprise`,
      "Désactiver les mises à jour",
      "Supprimer l'inventaire MDM",
    ], 1, `${mod.title} vise une mise en production fiable et documentée.`),
    q(`${p}-02`, `Dans « ${mod.title} », quelle pratique est recommandée avant déploiement ?`, [
      "Production directe sans test",
      "Environnement de test / pilot group",
      "Désactiver les logs",
      "Ignorer les prérequis",
    ], 1, "Toujours valider en pilot avant déploiement à grande échelle."),
    q(`${p}-03`, `Quel indicateur mesure la réussite de « ${mod.title} » ?`, [
      "Nombre d'emails envoyés",
      "Conformité, check-in MDM et résultat attendu validé",
      "Couleur du wallpaper",
      "Taille du disque uniquement",
    ], 1, "KPIs : conformité, inventaire à jour, objectifs métier atteints."),
    q(`${p}-04`, `En cas d'échec sur « ${mod.title} », quelle action est prioritaire ?`, [
      "Wipe massif immédiat",
      "Analyser logs MDM, policy scope et prérequis",
      "Supprimer ABM",
      "Révoquer tous les certificats Apple",
    ], 1, "Diagnostic méthodique : scope, logs, prérequis, check-in."),
    q(`${p}-05`, `Quel rôle IT est typiquement responsable de « ${mod.title} » ?`, [
      "Marketing",
      "Administrateur MDM / Ingénieur endpoint",
      "Comptabilité",
      "Design",
    ], 1, "Administrateurs Jamf, Intune ou Apple platform engineers."),
    q(`${p}-06`, `« ${mod.title} » s'intègre avec :`, [
      "Aucun autre système",
      "ABM, IdP, SIEM et outils MDM existants",
      "Uniquement des feuilles Excel",
      "FTP anonyme",
    ], 1, "L'écosystème Apple entreprise est interconnecté (ABM, SSO, sécurité)."),
    q(`${p}-07`, `Documentation essentielle pour « ${mod.title} » :`, [
      "Aucune",
      "Runbook, checklist validation et rollback plan",
      "Posts réseaux sociaux",
      "Captures d'écran personnelles non datées",
    ], 1, "Runbooks et checklists garantissent reproductibilité et audit."),
    q(`${p}-08`, `Sécurité dans « ${mod.title} » :`, [
      "Partager tokens en clair",
      "Principe du moindre privilège et rotation secrets",
      "Mot de passe admin unique global",
      "Désactiver le chiffrement",
    ], 1, "Moindre privilège, secrets vault, rotation certificats."),
  ];

  const trackSpecific: Question[] = [];
  if (mod.trackSlug.startsWith("jamf")) {
    trackSpecific.push(
      q(`${p}-09`, "Jamf Pro check-in interval impacte :", ["Rien", "Fréquence inventaire et exécution policies", "Couleur écran", "DNS public"], 1, "Check-in détermine la fraîcheur inventaire et policies."),
      q(`${p}-10`, "Smart Group scope pour policies Jamf :", ["Optionnel toujours", "Critique pour ciblage dynamique", "Interdit", "Remplace ABM"], 1, "Scope Smart Groups = cœur de l'automation Jamf.")
    );
  } else if (mod.trackSlug === "apple-enterprise-expert") {
    trackSpecific.push(
      q(`${p}-09`, "Declarative Management Apple utilise :", ["FTP", "Declarations MDM status/channel", "Email", "Bonjour"], 1, "DDM = modèle déclaratif avec status reports."),
      q(`${p}-10`, "Managed Device Attestation vérifie :", ["Wallpaper", "Intégrité device via attestations cryptographiques", "Langue", "iCloud photo"], 1, "MDA = confiance device pour accès Zero Trust.")
    );
  } else {
    trackSpecific.push(
      q(`${p}-09`, "Intune compliance pour Apple vérifie :", ["Wallpaper", "OS, FileVault, jailbreak, Defender", "Nom iCloud", "Modèle écran"], 1, "Compliance = état sécurité device."),
      q(`${p}-10`, "Conditional Access avec Intune Apple :", ["Ignore device state", "Bloque accès si non conforme", "Ouvre tout", "Désactive MFA"], 1, "CA exige conformité device avant accès ressources.")
    );
  }

  const pool = [...bases, ...trackSpecific];
  const target = mod.quizCount;
  const result: Question[] = [];
  for (let i = 0; i < target; i++) {
    const base = pool[i % pool.length];
    result.push({
      ...base,
      id: `${mod.quizSlug}-${String(i + 1).padStart(2, "0")}`,
      text: i < pool.length ? base.text : `[Scénario ${i + 1}] ${base.text}`,
    });
  }
  return result;
}

export function createModuleQuiz(mod: AdvancedModuleDef): Quiz {
  return {
    slug: mod.quizSlug,
    trackSlug: mod.trackSlug,
    title: `Quiz — ${mod.title}`,
    type: "quiz",
    description: `${mod.quizCount} questions — ${mod.title} (${mod.trackSlug}).`,
    duration: mod.quizCount === 25 ? "40 min" : "30 min",
    passingScore: 75,
    questions: questionsForModule(mod),
  };
}

export function createAllModuleQuizzes(modules: AdvancedModuleDef[]): Quiz[] {
  return modules.map(createModuleQuiz);
}
