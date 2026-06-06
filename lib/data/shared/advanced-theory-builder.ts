import type { AdvancedModuleDef } from "@/lib/data/advanced-tracks/module-definitions";

export type TheoryBlock = {
  overview: string[];
  concepts: string[];
  enterprise: string[];
};

function jamfDomain(trackSlug: string): string {
  return trackSlug.startsWith("jamf") ? "Jamf Pro" : "Jamf";
}

function intuneDomain(): string {
  return "Microsoft Intune";
}

function appleDomain(): string {
  return "Apple Platform Deployment";
}

/** Théorie contextualisée par titre de module — évite les templates « Module expert » */
export function buildAdvancedTheory(mod: AdvancedModuleDef): TheoryBlock {
  const title = mod.title;
  const lower = title.toLowerCase();
  const track = mod.trackSlug;

  if (lower.includes("architecture") && track.startsWith("jamf")) {
    return {
      overview: [
        `${title} couvre la topologie Jamf Pro en production : sites, distribution points, LDAP/SSO, réplication PostgreSQL et dimensionnement Tomcat.`,
        "Une architecture Jamf mal dimensionnée se traduit par des check-in lents, des policies en retard et des déploiements packages bloqués sur le WAN.",
        "Cas réel : une ETI de 3 000 Mac répartis sur 4 sites doit isoler les policies régionales tout en centralisant l'inventaire et les certificats.",
      ],
      concepts: [
        "Sites Jamf isolent ressources, policies et Smart Groups par région ou business unit.",
        "Distribution Points cachent packages et DMG pour réduire la bande passante inter-sites.",
        "Load balancer + cluster Jamf Pro pour haute disponibilité (RPO/RTO documentés).",
        "LDAP/SSO relie groupes IdP aux scopes Jamf sans dupliquer les comptes admin.",
      ],
      enterprise: [
        "Documenter capacité : 1 instance Jamf Pro supporte ~10 000–15 000 appareils selon policies et check-in.",
        "Séparer DEV / STAGING / PROD par instance ou site avec tokens ABM distincts.",
        "Runbook failover : bascule DNS, restauration PostgreSQL, validation check-in post-incident.",
      ],
    };
  }

  if (lower.includes("smart group")) {
    return {
      overview: [
        `${title} approfondit les critères dynamiques Jamf : inventaire, Extension Attributes, OS, apps installées et appartenance LDAP.`,
        "Les Smart Groups sont le moteur de l'automation Jamf — une erreur de critère peut déployer une policy sur toute la flotte.",
        "Cas réel : isoler les Mac sans FileVault actif avant d'appliquer une restriction réseau stricte.",
      ],
      concepts: [
        "Critères AND/OR avec groupes statiques et Extension Attributes personnalisées.",
        "Smart Group Computer vs Mobile Device selon la plateforme ciblée.",
        "Membership dynamique recalculée à chaque check-in — pas de délai batch.",
        "Nested Smart Groups pour modéliser personas (dev, exec, contractor).",
      ],
      enterprise: [
        "Nommer les groupes avec convention : SG-{env}-{persona}-{critère}.",
        "Tester membership sur 5 Mac pilotes avant de lier une policy critique.",
        "Auditer mensuellement les groupes orphelins et critères obsolètes (OS EOL).",
      ],
    };
  }

  if (lower.includes("extension attribute")) {
    return {
      overview: [
        `${title} permet d'enrichir l'inventaire Jamf avec des attributs calculés via scripts, regex ou données LDAP.`,
        "Les Extension Attributes alimentent Smart Groups, policies conditionnelles et reporting SIEM.",
        "Cas réel : remonter la version d'une app métier (SAP, Adobe) pour cibler les mises à jour.",
      ],
      concepts: [
        "Types : String, Integer, Date — script bash/zsh exécuté au check-in.",
        "Extension Attribute Inventory vs Extension Attribute — portée et fréquence différentes.",
        "Limite de taille et timeout script : optimiser pour check-in < 60 s.",
        "Données sensibles : ne jamais stocker mots de passe en clair dans un EA.",
      ],
      enterprise: [
        "Versionner les scripts EA dans Git avec revue pair avant déploiement.",
        "Monitorer les échecs script via logs Jamf Pro et alerte SIEM.",
        "Documenter dépendances réseau (proxy, DNS) pour scripts appelant API internes.",
      ],
    };
  }

  if (lower.includes("script")) {
    return {
      overview: [
        `${title} traite l'exécution de scripts bash/zsh via policies Jamf : paramètres, fréquence, logs et idempotence.`,
        "Les scripts Jamf remplacent souvent les GPO Windows pour configuration Mac, remediation et collecte.",
        "Cas réel : déployer Rosetta 2, installer un agent EDR ou corriger une clé plist à distance.",
      ],
      concepts: [
        "Policy Scripts : exécution au check-in, login ou récurrente (cron Jamf).",
        "Paramètres $4–$11 passés à la policy pour réutiliser un script générique.",
        "Exit code 0 = succès ; codes non nuls remontés dans les logs policy.",
        "Scripts idempotents : safe to re-run sans effet de bord.",
      ],
      enterprise: [
        "Stocker scripts dans repo Git ; Jamf comme canal de distribution, pas source de vérité.",
        "Tester sur Mac lab avec utilisateur standard et admin avant production.",
        "Journaliser stdout/stderr via Extension Attribute ou fichier local + agent SIEM.",
      ],
    };
  }

  if (lower.includes("api") || lower.includes("webhook")) {
    const isWebhook = lower.includes("webhook");
    return {
      overview: [
        isWebhook
          ? `${title} configure les webhooks Jamf Pro pour notifier SIEM, ServiceNow ou pipelines CI/CD en temps réel.`
          : `${title} couvre l'API REST Jamf Pro v1/v2 : OAuth2 client credentials, pagination, rate limits et automatisation.`,
        "Cas réel : synchroniser inventaire Jamf → CMDB ServiceNow toutes les 15 minutes via API.",
        isWebhook
          ? "Événements : Smart Group membership change, policy completed, inventory update."
          : "Endpoints clés : /api/v1/computers-inventory, /api/v1/policies, /api/v1/computer-groups.",
      ],
      concepts: [
        isWebhook
          ? "Webhooks HTTP POST avec authentification (Basic, Bearer, HMAC)."
          : "POST /api/oauth/token → access_token 30 min, refresh via client credentials.",
        isWebhook
          ? "Retry et dead-letter : Jamf retente 3× avant abandon."
          : "Headers X-Rate-Limit-Remaining pour throttling batch.",
        "HTTPS obligatoire, certificats valides, IP allowlist côté récepteur.",
        "Idempotence côté consumer : même event ID ne doit pas dupliquer l'action.",
      ],
      enterprise: [
        "Secrets API dans Azure Key Vault ou HashiCorp — jamais en clair dans scripts.",
        "Compte API dédié avec rôle minimal (lecture seule vs read/write).",
        "Monitoring : alerte si webhook 5xx > seuil ou token expiry < 7 jours.",
      ],
    };
  }

  if (lower.includes("patch")) {
    return {
      overview: [
        `${title} gère le cycle patch Jamf : catalogues tiers (Jamf, Nudge, Installomator), Smart Groups cibles et reporting conformité OS/apps.`,
        "Le patch management Mac est critique : CVE macOS non patchés = surface d'attaque pour ransomware.",
        "Cas réel : déployer macOS 15.4 sur 800 Mac en 2 semaines avec exclusion des apps legacy Intel.",
      ],
      concepts: [
        "Patch policies vs Software Update policies — portée et granularité différentes.",
        "Nudge / Installomator pour inciter ou forcer les mises à jour utilisateur.",
        "Extension Attributes pour version OS et apps métier.",
        "Maintenance windows et deferral count pour limiter les interruptions.",
      ],
      enterprise: [
        "SLA patch : critical CVE < 72 h, standard < 14 jours.",
        "Pilot ring : 5 % → 25 % → 100 % avec critères rollback (crash rate, helpdesk tickets).",
        "Coordonner avec équipe sécurité pour priorisation CVE Apple HT articles.",
      ],
    };
  }

  if (lower.includes("dépannage") || lower.includes("troubleshooting")) {
    const domain = track.startsWith("jamf") ? jamfDomain(track) : track === "intune-apple-advanced" ? intuneDomain() : appleDomain();
    return {
      overview: [
        `${title} structure la résolution d'incidents ${domain} : méthode, outils, logs et escalade.`,
        "80 % des tickets MDM viennent de : scope incorrect, check-in expiré, conflit profils, certificat APNs expiré.",
        "Cas réel : 200 Mac ne reçoivent plus de policies après migration certificat APNs — diagnostic en 45 min.",
      ],
      concepts: [
        "Checklist : scope → check-in → conflit profils → logs serveur → logs appareil.",
        "Jamf : Policy Logs, Inventory, Extension Attributes, jamf.log local.",
        "Intune : Device timeline, MEM logs, Company Portal diagnostics.",
        "Apple : profiles -P, log show --predicate, Console.app filtered.",
      ],
      enterprise: [
        "Runbook tier 1/2/3 avec critères escalade vers architecte MDM.",
        "Base de connaissances : top 20 erreurs avec résolution documentée.",
        "Post-mortem obligatoire si incident > 4 h ou > 100 appareils impactés.",
      ],
    };
  }

  if (lower.includes("automatisation") || lower.includes("ci/cd") || lower.includes("workflow")) {
    return {
      overview: [
        `${title} intègre Jamf dans des pipelines DevOps : GitHub Actions, GitLab CI, Terraform et Infrastructure as Code.`,
        "Cas réel : toute modification Smart Group passe par PR Git + validation staging avant merge production.",
        "L'objectif : configuration MDM reproductible, auditable et rollbackable comme du code applicatif.",
      ],
      concepts: [
        "Jamf Pro API + webhooks déclenchent pipelines sur changement inventaire.",
        "Terraform provider Jamf (community) ou scripts Python/Go pour drift detection.",
        "Environments : DEV Jamf → STAGING → PROD avec promotion contrôlée.",
        "Tests automatisés : vérifier scope policy, membership Smart Group, payload checksum.",
      ],
      enterprise: [
        "Change advisory board (CAB) pour policies impactant > 500 appareils.",
        "Rollback automatique si health check post-deploy échoue (check-in rate drop).",
        "Secrets CI dans vault ; rotation tokens OAuth Jamf trimestrielle.",
      ],
    };
  }

  if (lower.includes("declarative") || lower.includes("ddm")) {
    return {
      overview: [
        `${title} présente Declarative Device Management (DDM) : modèle déclaratif Apple remplaçant les profils statiques push/pull.`,
        "DDM utilise declarations MDM + status channel pour software update, passcode, restrictions.",
        "Cas réel : forcer macOS update minimum via declaration au lieu de policy Jamf récurrente.",
      ],
      concepts: [
        "Declarations : état désiré poussé par MDM, appliqué localement par le device.",
        "Status channel : device remonte compliance en temps quasi-réel.",
        "Compatible iOS 17+, macOS 14+ supervisés — migration progressive depuis configuration profiles.",
        "Jamf et Intune supportent DDM avec UI dédiée (Software Update, Passcode).",
      ],
      enterprise: [
        "Pilot 50 appareils supervisés avant rollout DDM global.",
        "Monitorer status reports dans console MDM — alerte si declaration failed.",
        "Coexistence DDM + legacy profiles : documenter ordre de priorité Apple.",
      ],
    };
  }

  if (lower.includes("conditional access") || lower.includes("compliance")) {
    return {
      overview: [
        `${title} lie conformité appareil Apple et accès Entra ID via Conditional Access Microsoft.`,
        "Cas réel : bloquer Outlook/Teams si Mac non conforme (FileVault off, OS < 14, Defender absent).",
        "Zero Trust : l'identité seule ne suffit plus — la posture device compte.",
      ],
      concepts: [
        "Compliance policy Intune : FileVault, OS min, SIP, jailbreak, Defender ATP.",
        "CA policy : require compliant device OR require hybrid Azure AD joined.",
        "Grace period : 24–72 h avant blocage pour laisser remediation.",
        "Sign-in logs Entra ID : diagnostic blocage avec Conditional Access tab.",
      ],
      enterprise: [
        "Break-glass accounts exclus de CA pour admins d'urgence.",
        "Pilot group 50 users avant enforcement production M365.",
        "Communication utilisateur : Company Portal + guide remediation FileVault/OS update.",
      ],
    };
  }

  if (lower.includes("platform sso") || lower.includes("sso")) {
    return {
      overview: [
        `${title} configure Platform SSO macOS avec Entra ID : login local synchronisé, tokens Kerberos, accès apps Microsoft.`,
        "Cas réel : utilisateur ouvre Mac → Touch ID → session Entra active → Outlook sans re-auth.",
        "Remplace progressivement Jamf Connect ou scripts Kerberos legacy.",
      ],
      concepts: [
        "Platform SSO payload Intune + enrollment Entra ID sur Mac.",
        "Secure Enclave stocke credentials ; pas de mot de passe en clair.",
        "Prérequis : macOS 13+, supervise ou user-approved MDM, Entra ID P1+.",
        "Troubleshooting : ppsso log, Entra sign-in logs, Keychain access.",
      ],
      enterprise: [
        "Pilot avec équipe IT avant déploiement 500+ Mac.",
        "Plan B : comptes locaux admin break-glass documentés.",
        "Coordonner avec équipe réseau pour Kerberos/AD si hybride.",
      ],
    };
  }

  if (lower.includes("abm") || lower.includes("business manager")) {
    return {
      overview: [
        `${title} approfondit Apple Business Manager : fédération Entra, rôles admin, locations, tokens MDM et Apps & Books.`,
        "Cas réel : multinationale avec 3 locations ABM (EU, US, APAC) et fédération Managed Apple IDs.",
        "ABM est la source de vérité pour ownership device et licences VPP.",
      ],
      concepts: [
        "Roles : Admin, Device Manager, Content Manager — moindre privilège.",
        "MDM server tokens : 1 token actif par server assignment, renouvellement annuel.",
        "Federation Entra/Okta pour Managed Apple IDs sans mot de passe Apple.",
        "Apps & Books : VPP tokens liés au MDM pour distribution apps.",
      ],
      enterprise: [
        "Inventaire ABM ↔ MDM reconciliation mensuelle (serials orphelins).",
        "Procédure offboarding : release device + wipe via MDM avant revente.",
        "Audit trail ABM activé, logs exportés vers SIEM.",
      ],
    };
  }

  if (lower.includes("defender") || lower.includes("sécurité") || lower.includes("security")) {
    return {
      overview: [
        `${title} couvre la posture sécurité Mac en entreprise : Microsoft Defender, Gatekeeper, SIP, FileVault et compliance MDM.`,
        "Cas réel : SOC exige preuve Defender ATP actif sur 100 % des Mac avant accès données sensibles.",
        "Intégration Defender ↔ Intune compliance ↔ Conditional Access.",
      ],
      concepts: [
        "Defender for Endpoint macOS : onboarding via Intune ou script Jamf.",
        "Compliance policy vérifie health status Defender (tamper protection, defs à jour).",
        "Gatekeeper + Notarization : apps non signées bloquées.",
        "SIP et FileVault : prérequis compliance standard enterprise.",
      ],
      enterprise: [
        "Alertes Defender → SIEM (Sentinel, Splunk) avec playbook incident.",
        "Exception process pour apps legacy non notarisées (ticket + expiry).",
        "Quarterly security baseline review avec équipe GRC.",
      ],
    };
  }

  if (lower.includes("scep") || lower.includes("certificat") || lower.includes("wi-fi") || lower.includes("vpn")) {
    return {
      overview: [
        `${title} déploie certificats et profils réseau (SCEP, 802.1X, VPN) via Intune sur Mac/iOS.`,
        "Cas réel : Mac se connecte au Wi-Fi corporate EAP-TLS sans intervention utilisateur grâce au certificat SCEP.",
        "Chaîne PKI : CA enterprise → SCEP profile Intune → payload Wi-Fi/VPN.",
      ],
      concepts: [
        "SCEP profile : URL, challenge, key size, subject name format.",
        "Wi-Fi 802.1X : certificat user ou machine selon policy.",
        "VPN per-app ou full tunnel : split tunneling pour SaaS.",
        "Renouvellement certificat : alerte 30 j avant expiry.",
      ],
      enterprise: [
        "Test certificat sur Mac lab + iPhone pilote avant déploiement.",
        "Runbook renouvellement CA root (impact tous devices).",
        "Monitoring cert expiry via Intune reporting + alerte.",
      ],
    };
  }

  if (lower.includes("migration")) {
    return {
      overview: [
        `${title} planifie la migration Jamf : inventaire source, mapping policies, parallèle run, cutover et rollback.`,
        "Cas réel : migration Jamf Cloud → Jamf Pro on-prem ou changement de tenant pour acquisition.",
        "Durée typique : 3–6 mois pour 2 000 Mac avec double enrollment temporaire.",
      ],
      concepts: [
        "Export inventaire, policies, scripts, packages via API ou backup.",
        "Mapping 1:1 policies source → cible avec validation payload.",
        "Parallel run : appareils pilotes sur nouvelle instance 2 semaines.",
        "Cutover : re-enrollment ADE ou re-push MDM profile.",
      ],
      enterprise: [
        "Freeze changes 2 semaines avant cutover.",
        "Rollback plan : DNS, MDM profile, ABM token revert.",
        "Hypercare 30 jours post-migration avec équipe renforcée.",
      ],
    };
  }

  if (lower.includes("reporting")) {
    const domain = track.startsWith("jamf") ? jamfDomain(track) : intuneDomain();
    return {
      overview: [
        `${title} exploite les rapports ${domain} pour conformité, inventaire, patch status et KPIs direction.`,
        "Cas réel : dashboard mensuel pour CIO : % FileVault, OS current, apps métier, incidents MDM.",
        "Export API + Power BI / Tableau pour visualisation executive.",
      ],
      concepts: [
        "Inventaire : hardware, OS, apps, user, last check-in.",
        "Compliance : FileVault, patch, EDR, restrictions actives.",
        "Scheduled reports : email hebdo aux responsables flotte.",
        "API export CSV/JSON pour intégration BI.",
      ],
      enterprise: [
        "KPIs définis avec IT et sécurité : SLAs mesurables.",
        "Data retention : aligner avec politique RGPD/archivage.",
        "Alertes automatiques si compliance rate < 95 %.",
      ],
    };
  }

  if (lower.includes("zero-touch") || lower.includes("enrollment") || lower.includes("platform deployment")) {
    return {
      overview: [
        `${title} industrialise le déploiement zero-touch Apple : ABM, ADE, PreStage (Jamf) ou Enrollment Profile (Intune).`,
        "Cas réel : nouveau Mac livré → utilisateur allume → MDM + apps + FileVault sans intervention IT.",
        "Réduit le coût onboarding de ~2 h/device à ~5 min utilisateur.",
      ],
      concepts: [
        "Automated Device Enrollment (ADE) : supervision automatique, skip setup screens.",
        "PreStage Jamf / Enrollment Profile Intune : apps, policies, local admin au first boot.",
        "Return to Service (Apple) : re-enrollment après effacement sans perdre supervision.",
        "Custom enrollment URL pour BYOD vs corporate owned.",
      ],
      enterprise: [
        "Test end-to-end sur Mac neuf usine avant commande 500 unités.",
        "Procédure RMA : wipe → Return to Service → re-assign user.",
        "Metrics : time-to-productivity < 30 min post-unbox.",
      ],
    };
  }

  if (lower.includes("attestation") || lower.includes("mda")) {
    return {
      overview: [
        `${title} couvre Managed Device Attestation (MDA) : preuve cryptographique de l'intégrité device pour Zero Trust.`,
        "Cas réel : accès SaaS sensible conditionné à attestation valide (Secure Boot, OS integrity).",
        "Apple + IdP (Entra, Okta) + MDM collaborent pour device trust.",
      ],
      concepts: [
        "Attestation : device prouve état boot chain et OS non compromis.",
        "Intégration Entra ID device compliance + attestation claims.",
        "Compatible Apple Silicon, macOS 14+, iOS 17+ supervisés.",
        "Fallback si attestation fail : remediation ou accès limité.",
      ],
      enterprise: [
        "Pilot avec apps non-critiques avant données sensibles.",
        "Documenter comportement attestation fail (block vs warn).",
        "Aligner avec équipe sécurité sur niveau trust requis.",
      ],
    };
  }

  if (lower.includes("international") || lower.includes("silicon")) {
    return {
      overview: [
        lower.includes("silicon")
          ? `${title} traite le déploiement Apple Silicon à l'échelle : compatibilité apps, Rosetta 2, Recovery, effacement sécurisé.`
          : `${title} gère le déploiement Apple multi-régions : ABM locations, MDM sites, conformité locale (RGPD, China).`,
        "Cas réel : rollout MacBook Pro M4 dans 12 pays avec apps métier Universal Binary validées.",
        "Apple Silicon : plus de kernel extensions, Secure Enclave unifiée, Erase All Content and Settings.",
      ],
      concepts: [
        lower.includes("silicon")
          ? "Inventaire apps Intel vs Universal — plan Rosetta 2 ou remplacement."
          : "ABM locations par pays pour ownership et fiscalité.",
        "Time zone et langue : payloads localisés par région.",
        "Data residency : choix tenant Intune/Jamf région EU/US.",
        "Support 24/7 : runbooks traduits, escalation par fuseau.",
      ],
      enterprise: [
        "Qualification apps critique sur M-series avant commande masse.",
        "Legal review RGPD pour MDM logs et localisation data.",
        "Regional pilot : 1 pays → 3 pays → global.",
      ],
    };
  }

  if (lower.includes("projet final")) {
    return {
      overview: [
        `${title} consolide Jamf 400 : architecture, API, CI/CD, migration et troubleshooting en projet capstone.`,
        "Livrable : runbook complet pour scénario enterprise (2 000+ Mac, multi-site, HA, automation).",
        "Évaluation : quiz 25 questions + revue runbook par pairs.",
      ],
      concepts: [
        "Synthèse Smart Groups, policies, API, webhooks, patch, reporting.",
        "Documentation architecture avec diagramme réseau et flux check-in.",
        "Plan migration ou greenfield avec timeline et risques.",
        "KPIs : check-in rate, compliance %, MTTR incidents.",
      ],
      enterprise: [
        "Présentation style CAB : contexte, solution, risques, rollback.",
        "Portfolio artifact pour certification Jamf 400 ou entretien architecte.",
        "Feedback mentor sur gaps identifiés.",
      ],
    };
  }

  // Fallback enrichi — pas de marqueur « Module expert »
  const domain = track.startsWith("jamf")
    ? jamfDomain(track)
    : track === "intune-apple-advanced"
      ? intuneDomain()
      : appleDomain();

  return {
    overview: [
      `${title} — approfondissement ${domain} pour administrateurs MDM en production.`,
      `Scénario type : votre organisation doit implémenter « ${title} » sur un parc de 500 à 5 000 appareils Apple avec contraintes sécurité, identité et support.`,
      "Cette leçon suit la méthode académie : cadrage métier → configuration pilote → validation preuves → industrialisation documentée.",
    ],
    concepts: [
      `Comprendre le rôle de « ${title} » dans la chaîne ABM → MDM → IdP → apps métier.`,
      "Appliquer moindre privilège : comptes admin dédiés, secrets en vault, scopes explicites.",
      `Valider sur groupe pilote (5–10 appareils) avec critères go/no-go avant extension.`,
      `Référencer documentation officielle ${domain} et Apple Platform Deployment pour versions OS et limites.`,
    ],
    enterprise: [
      "Intégrer IT, sécurité, support et achats dans la conception du déploiement.",
      "Runbook obligatoire : propriétaire, date, dépendances, test, rollback, escalade.",
      "Mesurer succès : conformité %, check-in rate, tickets support, time-to-deploy.",
    ],
  };
}
