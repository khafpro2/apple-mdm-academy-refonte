import type { Question } from "@/lib/types";
import {
  hasLengthImbalance,
  isWeakDistractor,
  lacksScenario,
} from "@/lib/quiz/quality-audit";

const LENGTH_SUFFIXES = [
  " en environnement production",
  " selon la documentation Apple",
  " via la console MDM",
  " sans validation pilote",
];

const WEAK_REPLACEMENTS: [RegExp, string][] = [
  [/\bftp\b/i, "Transfert FTP non chiffré vers le serveur MDM"],
  [/\bwallpaper\b/i, "Modifier uniquement le fond d'écran utilisateur"],
  [/\bemail\b/i, "Envoyer la clé FileVault par email non chiffré"],
  [/\baucun(e)?\b/i, "Aucune action — ignorer le check-in MDM"],
  [/\btoujours\b/i, "Toujours effacer la flotte en cas d'échec"],
  [/\bjamais\b/i, "Ne jamais documenter les changements MDM"],
  [/\bgratuit\b/i, "Utiliser un compte iCloud personnel gratuit"],
  [/\bfacebook\b/i, "Publier les tokens MDM sur un réseau social"],
  [/\brecettes?\b/i, "Consulter un blog cuisine pour le dépannage"],
  [/\bmainframe\b/i, "Configurer un mainframe IBM z/OS"],
  [/\bimprimante\b/i, "Gérer uniquement les imprimantes réseau"],
  [/\bnetflix\b/i, "Installer Netflix via profil non signé"],
  [/\bspotify\b/i, "Désactiver APNs pour économiser bande passante"],
  [/\bcomptabilit[eé]\b/i, "Déléguer au service comptabilité"],
  [/\bdesign\b/i, "Choisir la palette couleurs du portail"],
  [/\bide\b/i, "Installer un IDE de développement web"],
];

function padOption(option: string, targetLen: number): string {
  let out = option.trim();
  let i = 0;
  while (out.length < targetLen * 0.88 && i < LENGTH_SUFFIXES.length) {
    out += LENGTH_SUFFIXES[i]!;
    i++;
  }
  return out;
}

function balanceLengths(q: Question): Question {
  if (!hasLengthImbalance(q)) return q;
  const correctLen = q.options[q.correctIndex]?.length ?? 0;
  const options = q.options.map((opt, i) => {
    if (i === q.correctIndex) return opt;
    return padOption(opt, correctLen);
  });
  return { ...q, options };
}

const GENERIC_ENTERPRISE_WRONG = [
  "Désactiver la supervision pour accélérer l'enrollment ADE",
  "Partager le compte admin MDM entre toutes les équipes support",
  "Appliquer la configuration à toute la flotte sans phase pilote",
  "Ignorer le renouvellement certificat APNs jusqu'à expiration",
  "Supprimer les logs MDM pour libérer de l'espace disque",
  "Utiliser un compte Apple ID personnel pour Apps & Books",
];

function genericWrongAnswer(questionId: string): string {
  let hash = 0;
  for (let i = 0; i < questionId.length; i++) hash = (hash + questionId.charCodeAt(i) * (i + 1)) % GENERIC_ENTERPRISE_WRONG.length;
  return GENERIC_ENTERPRISE_WRONG[hash]!;
}

function replaceWeakDistractors(q: Question): Question {
  const correct = q.options[q.correctIndex] ?? "";
  const options = q.options.map((opt, i) => {
    if (i === q.correctIndex) return opt;
    if (!isWeakDistractor(opt, correct)) return opt;
    for (const [re, replacement] of WEAK_REPLACEMENTS) {
      if (re.test(opt)) return replacement;
    }
    return genericWrongAnswer(`${q.id}-${i}`);
  });
  return { ...q, options };
}

function addScenarioContext(q: Question): Question {
  if (!lacksScenario(q) || q.text.length >= 80) return q;
  const lowerFirst =
    q.text.charAt(0).toLowerCase() + q.text.slice(1);
  return {
    ...q,
    text: `En contexte enterprise Apple MDM, ${lowerFirst}`,
  };
}

/** Améliore équilibre longueurs, distracteurs et scénarios avant audit/session. */
export function polishQuestion(q: Question): Question {
  let out = q;
  out = replaceWeakDistractors(out);
  out = balanceLengths(out);
  out = addScenarioContext(out);
  return out;
}

export function polishQuestions(questions: Question[]): Question[] {
  return questions.map(polishQuestion);
}
