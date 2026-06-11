import type { Question } from "@/lib/types";
import { buildQuestion, resetQuestionPositionCounter } from "@/lib/quiz/question-builder";
import { shuffleArray } from "@/lib/quiz/seeded-random";
import { variantQuestion } from "@/lib/quiz/normalize-questions";
import { enrichQuestionWithModule } from "@/lib/data/exams/question-modules";
import type { AcitpExamDomain } from "@/lib/data/acitp/domains";
import { acitpExtensionPool } from "@/lib/data/acitp/exam-pool-extension";
import { ACITP_DOMAIN_COUNTS } from "@/lib/data/acitp/domains";

type QInput = {
  id: string;
  domain: AcitpExamDomain;
  text: string;
  correct: string;
  distractors: [string, string, string];
  explanation: string;
};

function q(input: QInput): Question {
  return buildQuestion({
    id: input.id,
    text: input.text,
    correct: input.correct,
    distractors: input.distractors,
    explanation: input.explanation,
    moduleLabel: input.domain,
  });
}

/** Questions base ACITP — scénarios enterprise, diagnostic, architecture */
const ACITP_BASE_INPUTS: QInput[] = [
  // —— macOS (40) ——
  { id: "acitp-m01", domain: "macos", text: "Un utilisateur ne voit pas ses fichiers après migration vers un Mac M4. Console indique « permission denied » sur ~/Documents. Quelle action IT en premier ?", correct: "Vérifier propriété ACL et compte local/Entra sur le profil utilisateur", distractors: ["Réinstaller macOS sans sauvegarde", "Désactiver SIP globalement", "Supprimer le keychain système"], explanation: "Les problèmes post-migration sont souvent liés au propriétaire du home directory ou aux ACL, pas au hardware." },
  { id: "acitp-m02", domain: "macos", text: "Finder n'affiche pas les extensions de fichiers pour les comptes standard. Quel réglage macOS contrôle cela ?", correct: "Finder > Réglages > Avancé > Afficher toutes les extensions", distractors: ["Réglages Système > Confidentialité > Fichiers", "Terminal defaults write com.apple.finder HideExtensions", "Gatekeeper > Autoriser apps App Store"], explanation: "L'option « Afficher toutes les extensions » est dans les préférences Finder Avancé." },
  { id: "acitp-m03", domain: "macos", text: "Le Dock disparaît en plein écran sur les Mac du marketing. Politique : Dock toujours visible. Quelle payload MDM cible le Dock ?", correct: "Restrictions macOS ou profil com.apple.dock via MDM", distractors: ["Payload Wi-Fi enterprise", "Certificat APNs", "Profil Exchange ActiveSync"], explanation: "Le comportement Dock se configure via restrictions ou defaults MDM sur com.apple.dock." },
  { id: "acitp-m04", domain: "macos", text: "Spotlight ne retourne aucun résultat mail sur 20 Mac. Quelle cause est la plus probable en environnement MDM ?", correct: "Privacy TCC — accès disque complet ou Mail non autorisé pour mds", distractors: ["Certificat APNs expiré", "FileVault désactivé", "ADE non configuré"], explanation: "Spotlight indexe via mds ; TCC peut bloquer l'indexation Mail/Documents." },
  { id: "acitp-m05", domain: "macos", text: "Safari bloque un portail interne HTTPS avec certificat interne. Déploiement 500 Mac — quelle approche scale ?", correct: "Déployer certificat racine PKI via profil MDM Trust + SSO si applicable", distractors: ["Demander à chaque user d'accepter une fois", "Désactiver HTTPS", "Installer certificat manuellement sur 500 Mac"], explanation: "La confiance PKI enterprise se déploie via payload Certificates/Trust MDM." },
  { id: "acitp-m06", domain: "macos", text: "Mail Exchange ne synchronise pas après changement mot de passe Entra. Où vérifier en premier sur le Mac ?", correct: "Comptes Internet > compte Exchange > re-auth ou profil MDM Exchange", distractors: ["Réglages > Spotlight", "Console > kernel.log uniquement", "App Store updates"], explanation: "Mail utilise les credentials du compte configuré ; re-auth ou profil MDM Exchange." },
  { id: "acitp-m07", domain: "macos", text: "Notes iCloud désactivées par policy mais utilisateur a besoin notes locales. Quelle restriction MDM ?", correct: "Autoriser Notes local tout en bloquant iCloud Documents via restrictions", distractors: ["Supprimer app Notes", "Activer jailbreak", "Désactiver FileVault"], explanation: "Restrictions iCloud et apps peuvent être granulaires via MDM." },
  { id: "acitp-m08", domain: "macos", text: "Calendar du CEO ne affiche pas les salles Exchange. Les autres Mac OK. Diagnostic ?", correct: "Vérifier délégués calendrier, autodiscover et profil compte sur ce Mac", distractors: ["Changer serial ABM", "Renouveler token VPP", "Reset NVRAM seul"], explanation: "Problème compte-spécifique : autodiscover, delegates, cache Calendar." },
  { id: "acitp-m09", domain: "macos", text: "Messages ne synchronise pas iMessage corporate (Managed Apple ID). Prérequis ?", correct: "Managed Apple ID activé et services Messages autorisés par ABM/MDM", distractors: ["Apple ID personnel obligatoire", "Jailbreak", "Certificat APNs utilisateur"], explanation: "Messages org utilise Managed Apple ID et policies IT." },
  { id: "acitp-m10", domain: "macos", text: "FaceTime désactivé flotte finance (compliance). Quel mécanisme applique cela à l'échelle ?", correct: "Restriction MDM com.apple.facetime ou blacklist app via supervised", distractors: ["Modifier hosts file", "Désactiver caméra hardware", "Gatekeeper seul"], explanation: "Restrictions MDM sur app/system prefs désactivent FaceTime." },
  { id: "acitp-m11", domain: "macos", text: "VoiceOver requis pour 3 utilisateurs accessibilité. Meilleur déploiement ?", correct: "Activer via Réglages Accessibilité ou script MDM ciblant groupe AD", distractors: ["Policy FileVault", "Token ABM", "Profil APNs"], explanation: "Accessibilité se configure par utilisateur ou automation ciblée." },
  { id: "acitp-m12", domain: "macos", text: "Réglages > Général > Stockage montre « Système » anormalement élevé après upgrade macOS. Première étape support ?", correct: "Analyser avec Storage Management, snapshots Time Machine locaux, logs", distractors: ["Effacer disque immédiatement", "Downgrade macOS", "Désactiver XProtect"], explanation: "Snapshots TM, caches OS et logs peuvent gonfler « Système » post-upgrade." },
  { id: "acitp-m13", domain: "macos", text: "Quel utilitaire affiche les crash reports et freeze logs utilisateur ?", correct: "Console.app — Rapports > Crash Reports / Spin Reports", distractors: ["Disk Utility uniquement", "Activity Monitor seul", "Keychain Access"], explanation: "Console centralise crash, spin et logs unified logging." },
  { id: "acitp-m14", domain: "macos", text: "Time Machine sur Mac managé : backup vers serveur NAS requis. Contrainte MDM fréquente ?", correct: "Exclure dossiers sensibles + escrow clé FileVault avant backup réseau", distractors: ["Interdire Time Machine toujours", "Utiliser iCloud Backup", "Désactiver encryption"], explanation: "TM enterprise : chiffrement, exclusions policy, destination contrôlée." },
  { id: "acitp-m15", domain: "macos", text: "macOS Safe Mode : quel effet sur extensions tierces au boot ?", correct: "Charge minimal — extensions non essentielles désactivées pour diagnostic", distractors: ["Active root", "Désactive FileVault permanent", "Efface keychain"], explanation: "Safe Mode charge kernel/extensions minimaux pour isoler panne." },

  // —— ABM (40) ——
  { id: "acitp-a01", domain: "abm", text: "GlobalTech 5 pays — où segmenter achats et admins régionaux ABM ?", correct: "Emplacements (Locations) par entité juridique", distractors: ["Un seul compte iCloud admin", "Smart Groups Jamf", "Certificat APNs par pays"], explanation: "Locations ABM alignent achats, inventaire et rôles régionaux." },
  { id: "acitp-a02", domain: "abm", text: "Rôle minimum pour assigner 500 serials au serveur MDM sans accès Apps & Books ?", correct: "Device Enrollment Manager", distractors: ["Content Manager", "People Manager seul", "Support AppleCare"], explanation: "Device Enrollment Manager gère ADE/assignations MDM." },
  { id: "acitp-a03", domain: "abm", text: "Token server_token.p7m expiré. Symptôme typique dans Intune ?", correct: "Nouveaux appareils ADE absents après sync ABM", distractors: ["FileVault désactivé", "Safari crash", "Gatekeeper off"], explanation: "Token expiré rompt sync inventaire ABM ↔ MDM." },
  { id: "acitp-a04", domain: "abm", text: "Fédération Entra vers Managed Apple ID échoue. Vérification DNS ?", correct: "Enregistrement TXT domaine vérifié dans ABM Settings", distractors: ["MX record mail", "CNAME www", "SRV LDAP"], explanation: "Apple exige TXT DNS pour prouver propriété domaine." },
  { id: "acitp-a05", domain: "abm", text: "Appareil acheté Apple Store retail n'apparaît pas ABM. Pourquoi ?", correct: "Canal non agréé ABM — pas d'auto-assignation org", distractors: ["Serial invalide toujours", "FileVault actif", "APNs manquant"], explanation: "Seuls revendeurs agréés / Apple Business Direct alimentent ABM." },
  { id: "acitp-a06", domain: "abm", text: "Release device from ABM avant revente : conséquence ?", correct: "Serial libéré pour enregistrement autre organisation", distractors: ["Efface automatiquement user data", "Désactive iCloud perso", "Supprime MDM profile seul"], explanation: "Release retire l'appareil de l'inventaire org ABM." },
  { id: "acitp-a07", domain: "abm", text: "People Manager peut :", correct: "Gérer Managed Apple IDs et comptes utilisateurs ABM", distractors: ["Créer certificats push", "Modifier kernel macOS", "Installer apps sans VPP"], explanation: "People Manager administre identités organisationnelles." },
  { id: "acitp-a08", domain: "abm", text: "Content Manager responsabilité principale ?", correct: "Apps & Books — achat et assignation licences VPP", distractors: ["ADE serial assignment", "Renouvellement APNs", "Patch Management"], explanation: "Content Manager = contenu VPP, pas enrollment." },
  { id: "acitp-a09", domain: "abm", text: "Audit SOX : quelle documentation ABM est obligatoire ?", correct: "Matrice rôles, dates tokens MDM, procédure release device", distractors: ["Wallpapers standard", "Liste apps App Store perso", "Codes couleur UI"], explanation: "Gouvernance ABM : qui peut acheter, assigner, release." },
  { id: "acitp-a10", domain: "abm", text: "Managed Apple ID vs Apple ID personnel en enterprise ?", correct: "MAID créé/géré org — distinct des achats perso App Store", distractors: ["Identiques", "MAID requis pour APNs", "Apple ID perso obligatoire MDM"], explanation: "MAID = identité org contrôlée IT." },
  { id: "acitp-a11", domain: "abm", text: "Apps & Books licence user-based suit :", correct: "Managed Apple ID utilisateur", distractors: ["Numéro série Mac", "Apple ID perso", "Adresse IP"], explanation: "User-based VPP lie licence au MAID." },
  { id: "acitp-a12", domain: "abm", text: "Apps & Books licence device-based suit :", correct: "Serial ou UDID appareil assigné", distractors: ["Email RH", "Nom compte local", "Certificat SSL web"], explanation: "Device-based VPP lie licence au device." },
  { id: "acitp-a13", domain: "abm", text: "Staging vs Production MDM server ABM — bonne pratique ?", correct: "Environnements séparés — tester profils ADE avant prod", distractors: ["Un seul serveur obligatoire", "Staging remplace APNs", "Production sans token"], explanation: "Séparer staging/prod limite risques rollout ADE." },
  { id: "acitp-a14", domain: "abm", text: "D-U-N-S requis ABM sert à :", correct: "Associer org à entité légale vérifiée", distractors: ["Chiffrer FileVault", "Signer apps", "Config Wi-Fi"], explanation: "D-U-N-S identifie l'organisation légalement." },
  { id: "acitp-a15", domain: "abm", text: "Domain Capture avec fédération Google/Entra :", correct: "Convertit comptes @domaine existants vers MAID", distractors: ["Supprime comptes Google", "Active jailbreak", "Remplace MDM"], explanation: "Domain Capture map identités IdP vers MAID." },

  // —— Security (30) ——
  { id: "acitp-s01", domain: "security", text: "FileVault escrow clé recovery vers MDM : prérequis macOS récent ?", correct: "Secure Token / Bootstrap Token sur compte admin MDM", distractors: ["Apple ID perso", "Certificat email", "APNs user"], explanation: "Bootstrap Token permet escrow clé FileVault vers MDM." },
  { id: "acitp-s02", domain: "security", text: "Gatekeeper bloque app métier signée mais non notarisée. Solution temporaire enterprise ?", correct: "Autoriser Team ID via profil MDM System Policy Control", distractors: ["Désactiver SIP", "Autoriser any app", "Jailbreak"], explanation: "Team ID allow list pour apps legacy en migration notarisation." },
  { id: "acitp-s03", domain: "security", text: "XProtect met à jour :", correct: "Signatures malware via mises à jour système silencieuses", distractors: ["Uniquement via App Store manuel", "Antivirus tiers obligatoire", "Certificat APNs"], explanation: "XProtect = anti-malware intégré Apple, defs via OS updates." },
  { id: "acitp-s04", domain: "security", text: "SIP protège principalement :", correct: "Fichiers système et processus Apple — modification restreinte", distractors: ["Photos iCloud", "Mail utilisateur", "Downloads user"], explanation: "SIP empêche altération composants système même root." },
  { id: "acitp-s05", domain: "security", text: "Activation Lock org sur iPhone supervisé — déblocage IT ?", correct: "Bypass code ABM ou effacement supervisé via MDM", distractors: ["Reset Apple ID perso seul", "Jailbreak", "Recovery mode sans MDM"], explanation: "ABM fournit bypass Activation Lock pour appareils org." },
  { id: "acitp-s06", domain: "security", text: "PPPC profile sert à :", correct: "Pré-approuver accès TCC (disque, caméra, micro) apps gérées", distractors: ["Configurer Wi-Fi", "Renouveler APNs", "Assigner VPP"], explanation: "Privacy Preferences Policy Control évite prompts TCC." },
  { id: "acitp-s07", domain: "security", text: "Secure Enclave stocke :", correct: "Clés biométriques et opérations crypto isolées", distractors: ["Documents utilisateur", "Profils MDM", "Tokens ABM"], explanation: "Secure Enclave = coprocesseur sécurité matérielle." },
  { id: "acitp-s08", domain: "security", text: "Compliance CA M365 + FileVault : architecture ?", correct: "Intune compliance FileVault ON → Conditional Access Entra", distractors: ["Jamf seul sans Entra", "Apple ID perso", "Gatekeeper off"], explanation: "Stack Microsoft : compliance device gate accès cloud." },
  { id: "acitp-s09", domain: "security", text: "Notarisation Apple garantit :", correct: "Scan malware par Apple avant distribution hors App Store", distractors: ["App gratuite", "Chiffrement disque", "Supervision ADE"], explanation: "Notarization requise apps macOS distribuées outside App Store." },
  { id: "acitp-s10", domain: "security", text: "System Extensions vs Kernel Extensions : direction Apple ?", correct: "Extensions système remplacent kexts dépréciés", distractors: ["kexts obligatoires", "Extensions interdites MDM", "Identiques"], explanation: "Apple migre vers System Extensions user-space." },

  // —— Deployment (30) ——
  { id: "acitp-d01", domain: "deployment", text: "500 MacBook zero-touch : assignation serials se fait :", correct: "ABM Devices → MDM server avant livraison utilisateurs", distractors: ["Post-setup manuel", "Email PDF", "Apple Configurator chaque Mac"], explanation: "ADE requiert assignation ABM pré-unboxing." },
  { id: "acitp-d02", domain: "deployment", text: "Await Device Configured sur profil ADE :", correct: "Retarde accès bureau jusqu'à fin policies MDM", distractors: ["Accélère Wi-Fi", "Désactive supervision", "Force FileVault off"], explanation: "Blocage bureau jusqu'à configuration MDM terminée." },
  { id: "acitp-d03", domain: "deployment", text: "Remote Management au Setup Assistant indique :", correct: "Profil MDM ADE téléchargé depuis Apple", distractors: ["Mode Recovery", "Échec hardware", "Compte iCloud requis"], explanation: "Remote Management = succès liaison Apple → MDM." },
  { id: "acitp-d04", domain: "deployment", text: "Mac enrollé manuellement sans ADE : supervision ?", correct: "Généralement non — supervision requiert ADE ou Configurator", distractors: ["Toujours supervisé", "Automatique après 24h", "Via Apple ID"], explanation: "Supervision ADE/Configurator, pas user enrollment standard." },
  { id: "acitp-d05", domain: "deployment", text: "Return to Service macOS 14+ :", correct: "Efface et ré-enroll ADE automatiquement", distractors: ["Efface sans MDM", "Supprime ABM", "Désactive FileVault seul"], explanation: "RTS modernise offboarding avec re-enrollment." },
  { id: "acitp-d06", domain: "deployment", text: "Profil configuration MDM contient :", correct: "Un ou plusieurs payloads (Wi-Fi, restrictions, certs)", distractors: ["Scripts bash uniquement", "Logs APNs", "Inventaire ABM"], explanation: "Configuration profiles agrègent payloads." },
  { id: "acitp-d07", domain: "deployment", text: "Apple Configurator 2 ajoute appareils ABM via :", correct: "Apple Configurator enrollment (USB) avec Apple ID admin", distractors: ["Achat App Store", "Token VPP seul", "DNS TXT"], explanation: "Configurator enregistre devices non agréés dans ABM." },
  { id: "acitp-d08", domain: "deployment", text: "Locked enrollment empêche :", correct: "Utilisateur de retirer MDM sans effacement admin", distractors: ["FileVault", "Mises à jour OS", "Wi-Fi"], explanation: "Locked enrollment = MDM non removable par user." },
  { id: "acitp-d09", domain: "deployment", text: "Platform SSO macOS minimum OS :", correct: "macOS 14 Sonoma", distractors: ["macOS 10.14", "macOS 11", "macOS 12"], explanation: "Platform SSO requiert macOS 14+ et IdP compatible." },
  { id: "acitp-d10", domain: "deployment", text: "Declarative Device Management vs impératif :", correct: "Declarations + status reports — appareil rapporte état", distractors: ["Identique push only", "Pas de MDM", "Requiert jailbreak"], explanation: "DDM = modèle déclaratif avec status channel." },

  // —— Network (20) ——
  { id: "acitp-n01", domain: "network", text: "Wi-Fi enterprise WPA2-Enterprise sur Mac : auth typique ?", correct: "802.1X avec certificat utilisateur ou EAP-TLS", distractors: ["WEP shared key", "Mot de passe affiché seul", "Bluetooth pairing"], explanation: "Enterprise Wi-Fi utilise 802.1X/EAP avec certs ou credentials." },
  { id: "acitp-n02", domain: "network", text: "Profil Wi-Fi MDM avec certificat SCEP : avantage ?", correct: "Renouvellement automatique certificats client Wi-Fi/VPN", distractors: ["Plus rapide que Ethernet", "Remplace APNs", "Désactive firewall"], explanation: "SCEP automatise lifecycle certificats device." },
  { id: "acitp-n03", domain: "network", text: "Mac ne résout pas DNS interne après VPN. Diagnostic ?", correct: "Ordre DNS, split tunnel, search domains profil VPN", distractors: ["Changer serial ABM", "Reset Touch ID", "Désactiver Gatekeeper"], explanation: "DNS/VPN split tunnel cause fréquente accès interne." },
  { id: "acitp-n04", domain: "network", text: "Proxy PAC autoconfig macOS se déploie via :", correct: "Profil MDM Network ou script managed preferences", distractors: ["APNs", "FileVault", "VPP token"], explanation: "Proxy auto-config via network payload MDM." },
  { id: "acitp-n05", domain: "network", text: "Bonjour/mDNS bloqué VLAN — impact AirPrint enterprise ?", correct: "Impression réseau local indisponible sans relay/reflector", distractors: ["FileVault échoue", "ADE impossible", "Mail sync off"], explanation: "AirPrint utilise Bonjour — nécessite mDNS gateway/reflector." },

  // —— Productivity (20) ——
  { id: "acitp-p01", domain: "productivity", text: "Microsoft 365 apps macOS en enterprise : déploiement scale ?", correct: "VPP/ABM assignation MDM Required + MAID/device license", distractors: ["App Store perso chaque user", "Email .dmg", "TestFlight"], explanation: "Apps M365 enterprise via VPP pipeline MDM." },
  { id: "acitp-p02", domain: "productivity", text: "Keychain entreprise + SSO : problème fréquent post-migration ?", correct: "Clés SSO anciennes invalides — reset keychain ciblé", distractors: ["SIP off", "APNs expiré", "Serial ABM"], explanation: "Migration profil casse parfois keychain SSO tokens." },
  { id: "acitp-p03", domain: "productivity", text: "Handoff/Continuity désactivé policy flotte. Payload ?", correct: "Restrictions MDM Handoff/Universal Clipboard", distractors: ["FileVault", "Wi-Fi off", "APNs"], explanation: "Continuity contrôlable via restrictions macOS/iOS." },
  { id: "acitp-p04", domain: "productivity", text: "Safari profiles séparés pro/perso macOS récent : usage enterprise ?", correct: "Profils Safari MDM ou managed login sépare données", distractors: ["Deux Mac obligatoires", "Jailbreak", "Désactiver HTTPS"], explanation: "Safari profiles / managed browser policies séparent contextes." },
  { id: "acitp-p05", domain: "productivity", text: "iCloud Drive bloqué mais iCloud Photos autorisé — possible via :", correct: "Restrictions granulaires iCloud services MDM", distractors: ["Impossible", "Apple ID root", "Gatekeeper"], explanation: "MDM peut restreindre services iCloud individuellement." },

  // —— Troubleshooting (20) ——
  { id: "acitp-t01", domain: "troubleshooting", text: "Mac ADE bloqué « Configuring your Mac » 2h. Action ?", correct: "Vérifier réseau, MDM reachable, logs device enrollment Intune/Jamf", distractors: ["Attendre 48h sans check", "Remplacer hardware", "Désactiver APNs"], explanation: "Blocage await config = MDM/policies/réseau à diagnostiquer." },
  { id: "acitp-t02", domain: "troubleshooting", text: "Certificat APNs renouvelé mauvais Apple ID — symptôme ?", correct: "Aucune commande MDM push reçue flotte entière", distractors: ["FileVault seul off", "Mail seul", "Spotlight"], explanation: "APNs lié Apple ID créateur — mauvais ID = push mort." },
  { id: "acitp-t03", domain: "troubleshooting", text: "Kernel panic répétés post-patch — première étape ?", correct: "Boot Safe Mode, isoler extension/kext, check crash log", distractors: ["Release ABM", "Acheter VPP", "Changer domaine DNS"], explanation: "Safe Mode + crash logs isolent extension fautive." },
  { id: "acitp-t04", domain: "troubleshooting", text: "Profile MDM conflict — deux Wi-Fi profiles. Diagnostic appareil ?", correct: "System Settings > VPN & Network > profiles installés", distractors: ["App Store", "ABM inventory", "iCloud.com"], explanation: "Vue profils système montre payloads actifs et conflits." },
  { id: "acitp-t05", domain: "troubleshooting", text: "Intune Mac non compliant FileVault alors que activé : cause ?", correct: "Escrow clé non remontée ou delay inventory check-in", distractors: ["Gatekeeper", "Apple ID", "Serial ABM"], explanation: "Compliance FileVault exige ON + parfois escrow confirmé." },
];

function expandDomainPool(questions: Question[], target: number): Question[] {
  const pool = [...questions];
  let v = 0;
  while (pool.length < target) {
    for (const base of questions) {
      if (pool.length >= target) break;
      pool.push(variantQuestion(base, v));
    }
    v++;
  }
  return pool.slice(0, target);
}

function buildDomainPools(): Record<AcitpExamDomain, Question[]> {
  resetQuestionPositionCounter();
  const byDomain = {} as Record<AcitpExamDomain, Question[]>;
  // Base inputs
  for (const input of ACITP_BASE_INPUTS) {
    const question = q(input);
    if (!byDomain[input.domain]) byDomain[input.domain] = [];
    byDomain[input.domain]!.push(question);
  }
  // Extension questions pool
  for (const extQ of acitpExtensionPool) {
    const id = extQ.id;
    const dom: AcitpExamDomain = id.includes("-m") ? "macos" : id.includes("-a") ? "abm" :
      id.includes("-s") ? "security" : id.includes("-d") ? "deployment" :
      id.includes("-n") ? "network" : id.includes("-prod") ? "productivity" :
      "troubleshooting";
    if (!byDomain[dom]) byDomain[dom] = [];
    byDomain[dom].push(extQ);
  }
  const result = {} as Record<AcitpExamDomain, Question[]>;
  for (const [domain, count] of Object.entries(ACITP_DOMAIN_COUNTS) as [AcitpExamDomain, number][]) {
    const base = byDomain[domain] ?? [];
    result[domain] = expandDomainPool(base, count);
  }
  return result;
}

/** Pool complet 200 questions — répartition domaines respectée */
export function buildAcitpExamPool200(): Question[] {
  const pools = buildDomainPools();
  return (Object.keys(pools) as AcitpExamDomain[]).flatMap((d) => pools[d]);
}

export const acitpExamPool200 = buildAcitpExamPool200();

/** Sélection examen avec répartition domaines + seed session */
export function pickAcitpExamQuestions(sessionSeed: string): Question[] {
  const pools = buildDomainPools();
  const picked: Question[] = [];
  for (const [domain, count] of Object.entries(ACITP_DOMAIN_COUNTS) as [AcitpExamDomain, number][]) {
    const shuffled = shuffleArray(pools[domain] ?? [], `${sessionSeed}-${domain}`);
    picked.push(...shuffled.slice(0, count));
  }
  const final = shuffleArray(picked, sessionSeed);
  return final.map((question, i) =>
    enrichQuestionWithModule({
      ...question,
      id: `acitp-exam-${sessionSeed.slice(0, 8)}-${i}-${question.id}`,
    })
  );
}

export function getAcitpBaseQuestionCount(): number {
  return ACITP_BASE_INPUTS.length;
}
