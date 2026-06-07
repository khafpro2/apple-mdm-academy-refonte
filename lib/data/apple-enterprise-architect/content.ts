/** Contenu modules Apple Enterprise Architect — théorie, diagrammes, projets */

import { AEA_TROUBLESHOOTING_SCENARIOS } from "./troubleshooting";

export type AeaModuleContent = {
  overview: string[];
  concepts: string[];
  enterprise: string[];
  diagram: string;
  diagramCaption: string;
};

export const AEA_REAL_PROJECTS = [
  {
    id: "proj-100-mac",
    title: "Projet 1 — Déploiement de 100 Mac",
    objective: "Zero-touch ADE, profils sécurité, apps VPP, Platform SSO pilote 10%, production 100 Mac en 4 semaines.",
    deliverables: ["Runbook ABM assignation serials", "Profils ADE macOS + post-enrollment", "Dashboard conformité", "Rétrospective time-to-productivity"],
    kpis: ["≥ 95 % enrollés J+14", "FileVault escrow 100 %", "Support tickets < 5 % parc"],
  },
  {
    id: "proj-jamf-intune",
    title: "Projet 2 — Migration Jamf vers Intune",
    objective: "Migrer 800 Mac Jamf Pro vers Intune sans perte conformité CA M365.",
    deliverables: ["Matrice équivalence policies/profils", "Plan vague pilote 50 Mac", "Script export inventaire Jamf API", "Rollback wipe/re-ADE"],
    kpis: ["0 incident CA production", "Parité conformité ≥ 98 %", "Cutover week-end 4h max"],
  },
  {
    id: "proj-psso",
    title: "Projet 3 — Déploiement Platform SSO",
    objective: "Platform SSO Entra sur 500 Mac macOS 14+ avec MFA CA et fallback offline documenté.",
    deliverables: ["Profil MDM Platform SSO", "CA report-only → enforcement", "Guide utilisateur login Mac", "Runbook dépannage keychain"],
    kpis: ["≥ 90 % login sans mot de passe local J+30", "MFA prompt < 2/session", "0 lockout VIP"],
  },
  {
    id: "proj-security",
    title: "Projet 4 — Mise en conformité sécurité",
    objective: "ISO 27001 : FileVault, Gatekeeper, Defender, MDA attestation, Activation Lock bypass ABM.",
    deliverables: ["Baseline profils macOS/iOS", "Compliance Intune + CA", "Rapport audit preuves", "Plan remédiation écarts"],
    kpis: ["100 % FileVault escrow", "Defender healthy ≥ 98 %", "0 non-conformité critique audit"],
  },
];

export const AEA_MODULE_CONTENT: Record<string, AeaModuleContent> = {
  "aea-m01": {
    overview: [
      "L'architecture Apple Enterprise relie Apple Business Manager, le canal APNs, l'ADE, les Managed Apple IDs et Platform SSO au MDM (Jamf ou Intune).",
      "L'architecte doit cartographier identité, enrollment, configuration, sécurité et support avant tout déploiement à l'échelle.",
    ],
    concepts: [
      "ABM : inventaire appareils, tokens MDM, Apps & Books, fédération Entra pour Managed Apple IDs.",
      "APNs : certificat push unique par tenant MDM — prérequis absolu commandes temps réel.",
      "ADE : enrollment zero-touch supervisé, locked enrollment, profils distincts iOS/macOS.",
      "Managed Apple ID : identité org distincte Apple ID perso — Apps & Books user-based.",
      "Platform SSO : extension macOS + Entra — login Mac sans mot de passe local.",
    ],
    enterprise: [
      "Documenter chaîne confiance : Apple ID APNs, token ABM, comptes admin, calendrier renouvellement.",
      "Séparer staging/production ABM et MDM pour valider ADE avant rollout global.",
      "Matrice RACI : ABM owner, MDM owner, Entra owner, support L2.",
    ],
    diagram: `flowchart LR
  ABM[Apple Business Manager] --> Token[Enrollment Token]
  Token --> MDM[Jamf / Intune]
  MDM --> APNs[APNs Push]
  APNs --> Device[iOS / macOS]
  Entra[Entra ID] --> MAID[Managed Apple ID]
  Entra --> PSSO[Platform SSO]
  PSSO --> Device
  MDM --> Profiles[Configuration Profiles]
  Profiles --> Device`,
    diagramCaption: "Stack Apple Enterprise — ABM, MDM, APNs, identité Entra et appareil géré.",
  },
  "aea-m02": {
    overview: [
      "L'identité Apple Enterprise s'appuie sur Entra ID : fédération ABM, SSO macOS/iOS, MFA et Conditional Access liés à la conformité MDM.",
      "Pas d'Azure générique : chaque composant sert Apple (MAID, PSSO, accès M365 depuis Mac/iPhone gérés).",
    ],
    concepts: [
      "Fédération ABM ↔ Entra : Managed Apple IDs, domain capture, sync attributs UPN.",
      "Platform SSO + Enterprise SSO plug-in : registration token, Team ID extension.",
      "Conditional Access : require compliant Apple device + MFA pour Outlook/Teams.",
      "Groupes dynamiques Entra : All Mac ADE, All iOS Supervised pour assignments Intune.",
      "Break-glass accounts exclus CA — documentés et audités.",
    ],
    enterprise: [
      "Lab identité : ABM federation test → PSSO pilote 10 Mac → CA report-only 2 semaines → enforcement.",
      "Sign-in logs Entra = source vérité diagnostics blocages Apple.",
      "Aligner offboarding RH : Entra disable → MAID revoke → remote wipe Mac ABM.",
    ],
    diagram: `flowchart TB
  User[Utilisateur Mac] --> PSSO[Platform SSO]
  PSSO --> Entra[Entra ID]
  Entra --> MFA[MFA]
  Entra --> CA[Conditional Access]
  CA --> Compliance[Intune Compliance]
  Compliance --> Mac[Mac ADE géré]
  ABM[ABM Federation] --> MAID[Managed Apple ID]
  MAID --> User`,
    diagramCaption: "Architecture identité — Entra ID, PSSO, CA et conformité Apple.",
  },
  "aea-m03": {
    overview: [
      "Jamf Pro Enterprise : Smart Groups avancés, policies complexes, packages, scripts, patch management et Self Service à l'échelle 500+ Mac.",
      "L'architecte Jamf conçoit scope, triggers, Distribution Points et automation API.",
    ],
    concepts: [
      "Smart Groups : critères EA, OS, apps, FileVault — jamais circulaires (Jamf 11.16).",
      "Policies : triggers Check-in, Enrollment Complete, Self Service — frequency maîtrisée.",
      "Packages .pkg + Distribution Points régionaux pour WAN.",
      "Scripts bash avec logs, exit codes, fichiers témoin.",
      "Patch Management : eligible list preview, scope Smart Groups, Self Service optionnel.",
      "Self Service : catalogue IT apps/policies approuvées.",
    ],
    enterprise: [
      "Rollout 500 Mac : PreStage ADE minimal + policies post-enrollment par vague 50.",
      "API Jamf OAuth2 pour export CMDB et création Smart Groups automatisée.",
      "Runbook policy failure : Policy Logs → jamf.log → rollback scope.",
    ],
    diagram: `flowchart LR
  ABM --> PreStage[Computer PreStage]
  PreStage --> Jamf[Jamf Pro]
  Jamf --> SG[Smart Groups]
  SG --> Pol[Policies]
  Pol --> Pkg[Packages / Scripts]
  Pol --> Patch[Patch Policies]
  Jamf --> SS[Self Service]
  SS --> Mac[Mac Fleet]`,
    diagramCaption: "Jamf Enterprise — ADE, Smart Groups, policies et Self Service.",
  },
  "aea-m04": {
    overview: [
      "Intune Apple Enterprise : ADE multi-régions, APNs, compliance, Defender macOS, Platform SSO et déploiement mondial.",
      "Architecte conçoit assignments dynamiques, baseline sécurité et connecteurs ABM par filiale.",
    ],
    concepts: [
      "Enrollment Program Tokens multiples (ABM locations → Intune).",
      "Configuration profiles Settings catalog + compliance macOS/iOS.",
      "Defender onboarding Endpoint security policy.",
      "Scripts macOS Intune pour tâches post-enrollment.",
      "Company Portal enrollment utilisateur complémentaire BYOD.",
    ],
    enterprise: [
      "Déploiement mondial : EU/US/APAC groupes dynamiques Entra → profiles régionaux Wi-Fi/VPN.",
      "Await Device Configured + profils légers ADE pour éviter timeout Setup Assistant.",
      "Defender + compliance + CA = stack Zero Trust Microsoft sur Mac.",
    ],
    diagram: `flowchart TB
  ABM_G[ABM Global] --> Tokens[EP Tokens EU/US/APAC]
  Tokens --> Intune[Intune]
  Intune --> ADE[ADE Profiles]
  Intune --> Comp[Compliance]
  Intune --> Def[Defender macOS]
  Comp --> CA[Conditional Access]
  ADE --> Fleet[Mac/iOS Worldwide]`,
    diagramCaption: "Intune global — tokens ABM, ADE, compliance et Defender.",
  },
  "aea-m05": {
    overview: [
      "Sécurité Apple enterprise : FileVault escrow, Gatekeeper, SIP, XProtect, Managed Device Attestation et durcissement MDM.",
      "Audit sécurité = preuves console MDM + état local appareil + rapports conformité.",
    ],
    concepts: [
      "FileVault + Bootstrap Token → escrow clé recovery Intune/Jamf.",
      "Gatekeeper + notarisation : allow Team ID via MDM transition apps legacy.",
      "SIP : non désactivable en production — alerte si compliance detect off.",
      "XProtect : defs via OS updates — compliance min OS.",
      "MDA iOS 16+ : attestation device pour accès Zero Trust.",
    ],
    enterprise: [
      "Lab audit : sample 10 % parc, checklist ISO, export compliance, remédiation Smart Group non conformes.",
      "Activation Lock bypass ABM documenté offboarding.",
      "PPPC profiles pour EDR, backup, apps métier.",
    ],
    diagram: `flowchart LR
  MDM[MDM Profile] --> FV[FileVault Escrow]
  MDM --> GK[Gatekeeper]
  MDM --> FW[Firewall]
  FV --> Audit[Security Audit]
  GK --> Audit
  Defender[Defender EDR] --> Audit
  MDA[Device Attestation] --> Audit`,
    diagramCaption: "Couches sécurité Apple — chiffrement, durcissement, EDR, attestation.",
  },
  "aea-m06": {
    overview: [
      "Automatisation : Bash/shell, scripts Jamf policies, scripts Intune macOS, API et pipelines CI/CD pour déploiements reproductibles.",
      "Objectif : zéro intervention manuelle sur 500 Mac pour apps, configs et patches.",
    ],
    concepts: [
      "Scripts Jamf : parameters, priority, exit codes, Policy Logs.",
      "Scripts Intune : #!/bin/bash, run as root, frequency, assignment groups.",
      "Jamf API + webhooks → ServiceNow/Jira tickets auto.",
      "Intune Graph API export compliance reports.",
      "Idempotence : fichiers témoin /var/tmp/org.deploy.done.",
    ],
    enterprise: [
      "Pipeline : Git repo scripts → review → upload Jamf/Intune → pilot SG → production.",
      "Secrets jamais en clair — vault + EA Jamf ou Azure Key Vault.",
      "Rollback script documenté par policy.",
    ],
    diagram: `flowchart LR
  Git[Git Repo Scripts] --> CI[Review / CI]
  CI --> JamfAPI[Jamf API]
  CI --> IntuneAPI[Graph / Intune]
  JamfAPI --> Deploy[Mac Fleet Deploy]
  IntuneAPI --> Deploy`,
    diagramCaption: "Automatisation — scripts versionnés, API MDM, déploiement fleet.",
  },
  "aea-m07": {
    overview: [
      "Dépannage avancé : méthode en couches APNs → ABM → enrollment → profils → compliance → CA → apps.",
      "50 scénarios enterprise couvrant Jamf, Intune, Entra et Apple.",
    ],
    concepts: [
      ...AEA_TROUBLESHOOTING_SCENARIOS.slice(0, 5).map((s) => `[${s.layer}] ${s.symptom} → ${s.firstCheck}`),
      "Logs Jamf : Policy Logs, jamf.log, managedsoftwareupdate.log.",
      "Logs Intune : device timeline, per-setting errors, Company Portal.",
      "Logs macOS : Console unified logging, log show --predicate.",
      "Entra sign-in logs pour CA/MFA/SSO.",
    ],
    enterprise: [
      "Playbook L1/L2/L3 avec escalade et SLAs.",
      "Base de connaissances interne alimentée par les 50 scénarios.",
      "Post-mortem obligatoire incident > 50 appareils.",
    ],
    diagram: `flowchart TB
  L1[L1 Helpdesk] --> Layer{Couche?}
  Layer -->|Push| APNs[APNs / Token]
  Layer -->|Enroll| ADE[ABM / ADE]
  Layer -->|Config| Prof[Profils MDM]
  Layer -->|Access| CA[Compliance / CA]
  APNs --> Fix[Fix + KB Update]
  ADE --> Fix
  Prof --> Fix
  CA --> Fix`,
    diagramCaption: "Méthode dépannage — diagnostic par couche MDM/identité.",
  },
  "aea-m08": {
    overview: [
      "Projets réels capstone : 100 Mac, migration Jamf→Intune, Platform SSO, conformité sécurité.",
      "Chaque projet = livrables, KPIs, runbook et présentation architecte au comité IT.",
    ],
    concepts: AEA_REAL_PROJECTS.map((p) => `${p.title} : ${p.objective}`),
    enterprise: [
      "Sélectionner 1 projet principal + 1 projet secondaire pour certification.",
      "Documenter risques, rollback, communication utilisateurs.",
      "Revue pairs architecte Jamf/Intune/Security avant go-live.",
    ],
    diagram: `flowchart LR
  P1[100 Mac ADE] --> Capstone[Enterprise Architect]
  P2[Migration Jamf Intune] --> Capstone
  P3[Platform SSO] --> Capstone
  P4[Security Compliance] --> Capstone
  Capstone --> Cert[Certification AEA]`,
    diagramCaption: "Capstone — quatre projets enterprise vers certification architecte.",
  },
};

export function getAeaModuleContent(slug: string): AeaModuleContent | undefined {
  return AEA_MODULE_CONTENT[slug];
}

export function getAeaTroubleshootingForLesson(): string[] {
  return AEA_TROUBLESHOOTING_SCENARIOS.map(
    (s) => `${s.id} [${s.layer}] ${s.symptom} — Vérifier : ${s.firstCheck}. Cause : ${s.rootCause}. Fix : ${s.resolution}.`
  );
}
