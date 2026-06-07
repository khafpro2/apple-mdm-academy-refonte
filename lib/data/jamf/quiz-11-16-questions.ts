import type { Question } from "@/lib/types";

function q(
  id: string,
  text: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string
): Question {
  return { id, text, options: [...options], correctIndex: correct, explanation };
}

/** Questions alignées Jamf Pro 11.16 — scénarios, dépannage, architecture */
export const jamf116ExamQuestions: Question[] = [
  q(
    "j116-01",
    "Jamf Pro 11.16 recommande d'utiliser les Smart Groups principalement pour :",
    ["Remplacer tous les rapports Advanced Search", "Scope, déploiement et actions", "Stocker les packages uniquement", "Gérer les certificats APNs"],
    1,
    "La doc 11.16 distingue Smart Groups (scope/déploiement) et Advanced Search (reporting)."
  ),
  q(
    "j116-02",
    "Deux Smart Groups qui dépendent mutuellement de l'appartenance l'une de l'autre peuvent :",
    ["Améliorer les performances", "Provoquer des recalculs circulaires et impacter le serveur", "Remplacer les Static Groups", "Désactiver APNs"],
    1,
    "Jamf 11.16 met en garde contre les critères circulaires entre Smart Groups."
  ),
  q(
    "j116-03",
    "Retirer un Mac du scope d'une policy après exécution :",
    ["Annule automatiquement tous les réglages appliqués", "Ne supprime pas les réglages déjà appliqués par la policy", "Supprime le package installé", "Révoque FileVault"],
    1,
    "Documentation Policies 11.16 : retrait du scope ≠ rollback des changements déjà appliqués."
  ),
  q(
    "j116-04",
    "Pour déployer un package en Jamf Pro 11.16, l'ordre correct est :",
    [
      "Policy → Package sans Distribution Point",
      "Package sur Distribution Point → Jamf Pro → policy payload Packages",
      "Self Service uniquement sans policy",
      "Configuration Profile payload Packages",
    ],
    1,
    "Workflow Packages 11.16 : DP + enregistrement Jamf + policy Packages."
  ),
  q(
    "j116-05",
    "Dans une patch policy Jamf 11.16, les ordinateurs « eligible » sont :",
    ["Toujours tous les Mac du site", "Générés selon version cible et critères General (dont Patch Unknown Versions)", "Uniquement les Mac avec FileVault off", "Choisis manuellement sans preview"],
    1,
    "Creating a Patch Policy 11.16 : liste eligible auto-générée, preview avant scope."
  ),
  q(
    "j116-06",
    "Les patch policies dans Self Service 11.16 :",
    ["Apparaissent dans la recherche Self Service", "Peuvent être disponibles mais n'apparaissent pas dans la recherche", "Ne peuvent jamais être en Self Service", "Remplacent les policies scripts"],
    1,
    "Doc 11.16 : patch policies non incluses dans les résultats de recherche Self Service."
  ),
  q(
    "j116-07",
    "Scénario : policy Recurring Check-in s'exécute trop souvent. Action prioritaire :",
    ["Supprimer APNs", "Revoir execution frequency et trigger dans General payload", "Désinstaller Self Service", "Effacer l'inventaire"],
    1,
    "Frequency + trigger contrôlent la cadence d'exécution des policies."
  ),
  q(
    "j116-08",
    "Un script Jamf retourne exit 0 mais n'effectue pas l'action. Meilleure pratique 11.16 :",
    ["Ignorer les logs", "Valider via fichier témoin, logs locaux et Policy Logs Jamf", "Désactiver les Extension Attributes", "Passer en enrollment manuel"],
    1,
    "Scripts doivent prouver l'effet réel via logs et validation post-exécution."
  ),
  q(
    "j116-09",
    "Package action « Cache » dans une policy sert à :",
    ["Désinstaller l'app", "Mettre le package en cache sur le Mac sans installation immédiate (selon config)", "Renouveler APNs", "Créer un Smart Group"],
    1,
    "Actions Packages : Install, Cache, Uninstall selon scénario de déploiement."
  ),
  q(
    "j116-10",
    "Pour rendre une policy exécutable par l'utilisateur final (Jamf 11.16) :",
    ["Uniquement trigger Login", "Onglet Self Service de la policy + app Self Service sur le Mac", "Patch Management dashboard", "Advanced Search"],
    1,
    "Policies peuvent être exposées via Self Service tab."
  ),
  q(
    "j116-11",
    "Scénario : Mac ajouté au scope patch policy mais non eligible. Conséquence :",
    ["Patch immédiat", "Pas de patch jusqu'à satisfaction des conditions General/eligible", "Désenrollment ADE", "Suppression inventaire"],
    1,
    "Doc 11.16 : machine hors eligible list n'est patchée qu'après conformité critères."
  ),
  q(
    "j116-12",
    "Extension Attributes servent surtout à :",
    ["Remplacer les packages", "Enrichir l'inventaire pour critères Smart Groups et reporting", "Héberger Jamf Cloud", "Signer les profils MDM"],
    1,
    "EA = champs custom alimentant Smart Groups et Advanced Search."
  ),
  q(
    "j116-13",
    "Trigger « Enrollment Complete » convient le mieux pour :",
    ["Patch Chrome mensuel", "Actions au premier enrollment Mac (PreStage, packages de base)", "Rapport annuel", "Renouvellement APNs"],
    1,
    "Enrollment Complete = première configuration post-ADE/PreStage."
  ),
  q(
    "j116-14",
    "Architecture push MDM Jamf :",
    ["Jamf → email → appareil", "Jamf → APNs → check-in appareil → commandes MDM", "Appareil → FTP → Jamf", "ABM → push direct sans Jamf"],
    1,
    "Chaîne standard Apple MDM via APNs."
  ),
  q(
    "j116-15",
    "Dépannage : policy package échoue sur Mac distant. Vérifier en premier :",
    ["Couleur du logo Self Service", "Distribution Point accessible, espace disque, Policy Logs", "Token ABM uniquement", "Smart Group circulaire"],
    1,
    "Échecs package : réseau vers DP, espace disque, logs policy."
  ),
];

export const jamf116ModuleQuizExtras: Record<string, Question[]> = {
  "quiz-module-13-smart-groups": [
    q(
      "m13-j116-1",
      "Preview membership d'un Smart Group sert à :",
      ["Supprimer le groupe", "Valider les Mac inclus avant scope production", "Renouveler APNs", "Créer un package"],
      1,
      "Preview obligatoire avant utilisation en scope selon bonnes pratiques 11.16."
    ),
    q(
      "m13-j116-2",
      "Pour un rapport ad hoc sur l'inventaire, Jamf 11.16 recommande :",
      ["Smart Group uniquement", "Advanced Search", "Policy Recurring Check-in", "Patch policy"],
      1,
      "Advanced Search pour reporting ; Smart Groups pour scope."
    ),
  ],
  "quiz-module-14-policies": [
    q(
      "m14-j116-1",
      "Onglet User Interaction d'une policy permet :",
      ["Configurer Wi-Fi", "Messages, deferrals et deadlines utilisateur", "Créer token ABM", "Patch Unknown Versions"],
      1,
      "User Interaction = UX lors de l'exécution policy."
    ),
    q(
      "m14-j116-2",
      "Payload Packages dans une policy requiert préalablement :",
      ["Smart Group circulaire", "Package sur Distribution Point enregistré dans Jamf", "Jamf Protect plan", "Static Group vide"],
      1,
      "Deploying a Package Using a Policy 11.16."
    ),
  ],
  "quiz-module-16-patch": [
    q(
      "m16-j116-1",
      "Patch Unknown Versions permet :",
      ["Ignorer les Mac", "Inclure Mac avec version inconnue du software title", "Désactiver Self Service", "Supprimer Software Titles"],
      1,
      "Option General patch policy 11.16."
    ),
  ],
};
