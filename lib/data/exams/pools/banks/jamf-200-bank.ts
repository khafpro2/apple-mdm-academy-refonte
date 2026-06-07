import type { Question } from "@/lib/types";
import { buildExamBank, type ExamBankInput } from "./exam-bank-builder";

const JAMF200_BANK_INPUTS: ExamBankInput[] = [
  {
    "id": "j200-api-01",
    "domain": "api-automation",
    "difficulty": "easy",
    "text": "Dans un contexte api enterprise Jamf 200, quelle pratique est correcte pour api automation ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-api-02",
    "domain": "api-automation",
    "difficulty": "medium",
    "text": "Scénario api : déploiement api automation à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-api-03",
    "domain": "api-automation",
    "difficulty": "hard",
    "text": "Audit conformité api automation (api) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-api-04",
    "domain": "api-automation",
    "difficulty": "easy",
    "text": "Erreur fréquente api automation en production api ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-api-05",
    "domain": "api-automation",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements api automation (api) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-api-06",
    "domain": "api-automation",
    "difficulty": "hard",
    "text": "Patch deadline api automation — comportement post-deadline (api) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-api-07",
    "domain": "api-automation",
    "difficulty": "easy",
    "text": "Script api automation retourne exit 0 sans effet (api) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-api-08",
    "domain": "api-automation",
    "difficulty": "medium",
    "text": "Token ABM expiration api automation (api) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-api-09",
    "domain": "api-automation",
    "difficulty": "hard",
    "text": "Smart Group nested api automation (api) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-api-10",
    "domain": "api-automation",
    "difficulty": "easy",
    "text": "API pagination api automation datasets api — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-pat-01",
    "domain": "patch-advanced",
    "difficulty": "easy",
    "text": "Dans un contexte patch enterprise Jamf 200, quelle pratique est correcte pour patch advanced ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-pat-02",
    "domain": "patch-advanced",
    "difficulty": "medium",
    "text": "Scénario patch : déploiement patch advanced à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-pat-03",
    "domain": "patch-advanced",
    "difficulty": "hard",
    "text": "Audit conformité patch advanced (patch) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-pat-04",
    "domain": "patch-advanced",
    "difficulty": "easy",
    "text": "Erreur fréquente patch advanced en production patch ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-pat-05",
    "domain": "patch-advanced",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements patch advanced (patch) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-pat-06",
    "domain": "patch-advanced",
    "difficulty": "hard",
    "text": "Patch deadline patch advanced — comportement post-deadline (patch) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-pat-07",
    "domain": "patch-advanced",
    "difficulty": "easy",
    "text": "Script patch advanced retourne exit 0 sans effet (patch) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-pat-08",
    "domain": "patch-advanced",
    "difficulty": "medium",
    "text": "Token ABM expiration patch advanced (patch) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-pat-09",
    "domain": "patch-advanced",
    "difficulty": "hard",
    "text": "Smart Group nested patch advanced (patch) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-pat-10",
    "domain": "patch-advanced",
    "difficulty": "easy",
    "text": "API pagination patch advanced datasets patch — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-scr-01",
    "domain": "scripts-advanced",
    "difficulty": "easy",
    "text": "Dans un contexte scripts enterprise Jamf 200, quelle pratique est correcte pour scripts advanced ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-170/scripts-policies"
  },
  {
    "id": "j200-scr-02",
    "domain": "scripts-advanced",
    "difficulty": "medium",
    "text": "Scénario scripts : déploiement scripts advanced à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-170/scripts-policies"
  },
  {
    "id": "j200-scr-03",
    "domain": "scripts-advanced",
    "difficulty": "hard",
    "text": "Audit conformité scripts advanced (scripts) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-170/scripts-policies"
  },
  {
    "id": "j200-scr-04",
    "domain": "scripts-advanced",
    "difficulty": "easy",
    "text": "Erreur fréquente scripts advanced en production scripts ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-170/scripts-policies"
  },
  {
    "id": "j200-scr-05",
    "domain": "scripts-advanced",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements scripts advanced (scripts) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-170/scripts-policies"
  },
  {
    "id": "j200-scr-06",
    "domain": "scripts-advanced",
    "difficulty": "hard",
    "text": "Patch deadline scripts advanced — comportement post-deadline (scripts) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-170/scripts-policies"
  },
  {
    "id": "j200-scr-07",
    "domain": "scripts-advanced",
    "difficulty": "easy",
    "text": "Script scripts advanced retourne exit 0 sans effet (scripts) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-170/scripts-policies"
  },
  {
    "id": "j200-scr-08",
    "domain": "scripts-advanced",
    "difficulty": "medium",
    "text": "Token ABM expiration scripts advanced (scripts) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-170/scripts-policies"
  },
  {
    "id": "j200-scr-09",
    "domain": "scripts-advanced",
    "difficulty": "hard",
    "text": "Smart Group nested scripts advanced (scripts) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-170/scripts-policies"
  },
  {
    "id": "j200-scr-10",
    "domain": "scripts-advanced",
    "difficulty": "easy",
    "text": "API pagination scripts advanced datasets scripts — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-170/scripts-policies"
  },
  {
    "id": "j200-sec-01",
    "domain": "protect-security",
    "difficulty": "easy",
    "text": "Dans un contexte protect enterprise Jamf 200, quelle pratique est correcte pour protect security ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-sec-02",
    "domain": "protect-security",
    "difficulty": "medium",
    "text": "Scénario protect : déploiement protect security à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-sec-03",
    "domain": "protect-security",
    "difficulty": "hard",
    "text": "Audit conformité protect security (protect) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-sec-04",
    "domain": "protect-security",
    "difficulty": "easy",
    "text": "Erreur fréquente protect security en production protect ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-sec-05",
    "domain": "protect-security",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements protect security (protect) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-sec-06",
    "domain": "protect-security",
    "difficulty": "hard",
    "text": "Patch deadline protect security — comportement post-deadline (protect) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-sec-07",
    "domain": "protect-security",
    "difficulty": "easy",
    "text": "Script protect security retourne exit 0 sans effet (protect) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-sec-08",
    "domain": "protect-security",
    "difficulty": "medium",
    "text": "Token ABM expiration protect security (protect) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-sec-09",
    "domain": "protect-security",
    "difficulty": "hard",
    "text": "Smart Group nested protect security (protect) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-sec-10",
    "domain": "protect-security",
    "difficulty": "easy",
    "text": "API pagination protect security datasets protect — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-sca-01",
    "domain": "scale-architecture",
    "difficulty": "easy",
    "text": "Dans un contexte scale enterprise Jamf 200, quelle pratique est correcte pour scale architecture ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-sca-02",
    "domain": "scale-architecture",
    "difficulty": "medium",
    "text": "Scénario scale : déploiement scale architecture à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-sca-03",
    "domain": "scale-architecture",
    "difficulty": "hard",
    "text": "Audit conformité scale architecture (scale) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-sca-04",
    "domain": "scale-architecture",
    "difficulty": "easy",
    "text": "Erreur fréquente scale architecture en production scale ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-sca-05",
    "domain": "scale-architecture",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements scale architecture (scale) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-sca-06",
    "domain": "scale-architecture",
    "difficulty": "hard",
    "text": "Patch deadline scale architecture — comportement post-deadline (scale) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-sca-07",
    "domain": "scale-architecture",
    "difficulty": "easy",
    "text": "Script scale architecture retourne exit 0 sans effet (scale) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-sca-08",
    "domain": "scale-architecture",
    "difficulty": "medium",
    "text": "Token ABM expiration scale architecture (scale) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-sca-09",
    "domain": "scale-architecture",
    "difficulty": "hard",
    "text": "Smart Group nested scale architecture (scale) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-sca-10",
    "domain": "scale-architecture",
    "difficulty": "easy",
    "text": "API pagination scale architecture datasets scale — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-whk-01",
    "domain": "webhooks-integration",
    "difficulty": "easy",
    "text": "Dans un contexte webhooks enterprise Jamf 200, quelle pratique est correcte pour webhooks integration ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-whk-02",
    "domain": "webhooks-integration",
    "difficulty": "medium",
    "text": "Scénario webhooks : déploiement webhooks integration à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-whk-03",
    "domain": "webhooks-integration",
    "difficulty": "hard",
    "text": "Audit conformité webhooks integration (webhooks) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-whk-04",
    "domain": "webhooks-integration",
    "difficulty": "easy",
    "text": "Erreur fréquente webhooks integration en production webhooks ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-whk-05",
    "domain": "webhooks-integration",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements webhooks integration (webhooks) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-whk-06",
    "domain": "webhooks-integration",
    "difficulty": "hard",
    "text": "Patch deadline webhooks integration — comportement post-deadline (webhooks) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-whk-07",
    "domain": "webhooks-integration",
    "difficulty": "easy",
    "text": "Script webhooks integration retourne exit 0 sans effet (webhooks) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-whk-08",
    "domain": "webhooks-integration",
    "difficulty": "medium",
    "text": "Token ABM expiration webhooks integration (webhooks) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-whk-09",
    "domain": "webhooks-integration",
    "difficulty": "hard",
    "text": "Smart Group nested webhooks integration (webhooks) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-whk-10",
    "domain": "webhooks-integration",
    "difficulty": "easy",
    "text": "API pagination webhooks integration datasets webhooks — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-200/api-jamf"
  },
  {
    "id": "j200-cmp-01",
    "domain": "compliance-cis",
    "difficulty": "easy",
    "text": "Dans un contexte compliance enterprise Jamf 200, quelle pratique est correcte pour compliance cis ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-cmp-02",
    "domain": "compliance-cis",
    "difficulty": "medium",
    "text": "Scénario compliance : déploiement compliance cis à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-cmp-03",
    "domain": "compliance-cis",
    "difficulty": "hard",
    "text": "Audit conformité compliance cis (compliance) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-cmp-04",
    "domain": "compliance-cis",
    "difficulty": "easy",
    "text": "Erreur fréquente compliance cis en production compliance ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-cmp-05",
    "domain": "compliance-cis",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements compliance cis (compliance) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-cmp-06",
    "domain": "compliance-cis",
    "difficulty": "hard",
    "text": "Patch deadline compliance cis — comportement post-deadline (compliance) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-cmp-07",
    "domain": "compliance-cis",
    "difficulty": "easy",
    "text": "Script compliance cis retourne exit 0 sans effet (compliance) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-cmp-08",
    "domain": "compliance-cis",
    "difficulty": "medium",
    "text": "Token ABM expiration compliance cis (compliance) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-cmp-09",
    "domain": "compliance-cis",
    "difficulty": "hard",
    "text": "Smart Group nested compliance cis (compliance) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-cmp-10",
    "domain": "compliance-cis",
    "difficulty": "easy",
    "text": "API pagination compliance cis datasets compliance — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-200/patch-management"
  },
  {
    "id": "j200-enr-01",
    "domain": "enrollment-advanced",
    "difficulty": "easy",
    "text": "Dans un contexte enrollment enterprise Jamf 200, quelle pratique est correcte pour enrollment advanced ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-170/workflows-enrollment"
  },
  {
    "id": "j200-enr-02",
    "domain": "enrollment-advanced",
    "difficulty": "medium",
    "text": "Scénario enrollment : déploiement enrollment advanced à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-170/workflows-enrollment"
  },
  {
    "id": "j200-enr-03",
    "domain": "enrollment-advanced",
    "difficulty": "hard",
    "text": "Audit conformité enrollment advanced (enrollment) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-170/workflows-enrollment"
  },
  {
    "id": "j200-enr-04",
    "domain": "enrollment-advanced",
    "difficulty": "easy",
    "text": "Erreur fréquente enrollment advanced en production enrollment ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-170/workflows-enrollment"
  },
  {
    "id": "j200-enr-05",
    "domain": "enrollment-advanced",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements enrollment advanced (enrollment) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-170/workflows-enrollment"
  },
  {
    "id": "j200-enr-06",
    "domain": "enrollment-advanced",
    "difficulty": "hard",
    "text": "Patch deadline enrollment advanced — comportement post-deadline (enrollment) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-170/workflows-enrollment"
  },
  {
    "id": "j200-enr-07",
    "domain": "enrollment-advanced",
    "difficulty": "easy",
    "text": "Script enrollment advanced retourne exit 0 sans effet (enrollment) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-170/workflows-enrollment"
  },
  {
    "id": "j200-enr-08",
    "domain": "enrollment-advanced",
    "difficulty": "medium",
    "text": "Token ABM expiration enrollment advanced (enrollment) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-170/workflows-enrollment"
  },
  {
    "id": "j200-enr-09",
    "domain": "enrollment-advanced",
    "difficulty": "hard",
    "text": "Smart Group nested enrollment advanced (enrollment) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-170/workflows-enrollment"
  },
  {
    "id": "j200-enr-10",
    "domain": "enrollment-advanced",
    "difficulty": "easy",
    "text": "API pagination enrollment advanced datasets enrollment — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-170/workflows-enrollment"
  },
  {
    "id": "j200-smg-01",
    "domain": "smart-groups-advanced",
    "difficulty": "easy",
    "text": "Dans un contexte smart enterprise Jamf 200, quelle pratique est correcte pour smart groups advanced ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-100/smart-groups"
  },
  {
    "id": "j200-smg-02",
    "domain": "smart-groups-advanced",
    "difficulty": "medium",
    "text": "Scénario smart : déploiement smart groups advanced à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-100/smart-groups"
  },
  {
    "id": "j200-smg-03",
    "domain": "smart-groups-advanced",
    "difficulty": "hard",
    "text": "Audit conformité smart groups advanced (smart) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-100/smart-groups"
  },
  {
    "id": "j200-smg-04",
    "domain": "smart-groups-advanced",
    "difficulty": "easy",
    "text": "Erreur fréquente smart groups advanced en production smart ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-100/smart-groups"
  },
  {
    "id": "j200-smg-05",
    "domain": "smart-groups-advanced",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements smart groups advanced (smart) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-100/smart-groups"
  },
  {
    "id": "j200-smg-06",
    "domain": "smart-groups-advanced",
    "difficulty": "hard",
    "text": "Patch deadline smart groups advanced — comportement post-deadline (smart) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-100/smart-groups"
  },
  {
    "id": "j200-smg-07",
    "domain": "smart-groups-advanced",
    "difficulty": "easy",
    "text": "Script smart groups advanced retourne exit 0 sans effet (smart) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-100/smart-groups"
  },
  {
    "id": "j200-smg-08",
    "domain": "smart-groups-advanced",
    "difficulty": "medium",
    "text": "Token ABM expiration smart groups advanced (smart) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-100/smart-groups"
  },
  {
    "id": "j200-smg-09",
    "domain": "smart-groups-advanced",
    "difficulty": "hard",
    "text": "Smart Group nested smart groups advanced (smart) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-100/smart-groups"
  },
  {
    "id": "j200-smg-10",
    "domain": "smart-groups-advanced",
    "difficulty": "easy",
    "text": "API pagination smart groups advanced datasets smart — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-100/smart-groups"
  },
  {
    "id": "j200-pol-01",
    "domain": "policies-advanced",
    "difficulty": "easy",
    "text": "Dans un contexte policies enterprise Jamf 200, quelle pratique est correcte pour policies advanced ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-100/policies-base"
  },
  {
    "id": "j200-pol-02",
    "domain": "policies-advanced",
    "difficulty": "medium",
    "text": "Scénario policies : déploiement policies advanced à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-100/policies-base"
  },
  {
    "id": "j200-pol-03",
    "domain": "policies-advanced",
    "difficulty": "hard",
    "text": "Audit conformité policies advanced (policies) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-100/policies-base"
  },
  {
    "id": "j200-pol-04",
    "domain": "policies-advanced",
    "difficulty": "easy",
    "text": "Erreur fréquente policies advanced en production policies ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-100/policies-base"
  },
  {
    "id": "j200-pol-05",
    "domain": "policies-advanced",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements policies advanced (policies) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-100/policies-base"
  },
  {
    "id": "j200-pol-06",
    "domain": "policies-advanced",
    "difficulty": "hard",
    "text": "Patch deadline policies advanced — comportement post-deadline (policies) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-100/policies-base"
  },
  {
    "id": "j200-pol-07",
    "domain": "policies-advanced",
    "difficulty": "easy",
    "text": "Script policies advanced retourne exit 0 sans effet (policies) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-100/policies-base"
  },
  {
    "id": "j200-pol-08",
    "domain": "policies-advanced",
    "difficulty": "medium",
    "text": "Token ABM expiration policies advanced (policies) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-100/policies-base"
  },
  {
    "id": "j200-pol-09",
    "domain": "policies-advanced",
    "difficulty": "hard",
    "text": "Smart Group nested policies advanced (policies) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-100/policies-base"
  },
  {
    "id": "j200-pol-10",
    "domain": "policies-advanced",
    "difficulty": "easy",
    "text": "API pagination policies advanced datasets policies — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-100/policies-base"
  },
  {
    "id": "j200-pkg-01",
    "domain": "packages-advanced",
    "difficulty": "easy",
    "text": "Dans un contexte packages enterprise Jamf 200, quelle pratique est correcte pour packages advanced ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-100/scope-deploiement"
  },
  {
    "id": "j200-pkg-02",
    "domain": "packages-advanced",
    "difficulty": "medium",
    "text": "Scénario packages : déploiement packages advanced à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-100/scope-deploiement"
  },
  {
    "id": "j200-pkg-03",
    "domain": "packages-advanced",
    "difficulty": "hard",
    "text": "Audit conformité packages advanced (packages) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-100/scope-deploiement"
  },
  {
    "id": "j200-pkg-04",
    "domain": "packages-advanced",
    "difficulty": "easy",
    "text": "Erreur fréquente packages advanced en production packages ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-100/scope-deploiement"
  },
  {
    "id": "j200-pkg-05",
    "domain": "packages-advanced",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements packages advanced (packages) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-100/scope-deploiement"
  },
  {
    "id": "j200-pkg-06",
    "domain": "packages-advanced",
    "difficulty": "hard",
    "text": "Patch deadline packages advanced — comportement post-deadline (packages) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-100/scope-deploiement"
  },
  {
    "id": "j200-pkg-07",
    "domain": "packages-advanced",
    "difficulty": "easy",
    "text": "Script packages advanced retourne exit 0 sans effet (packages) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-100/scope-deploiement"
  },
  {
    "id": "j200-pkg-08",
    "domain": "packages-advanced",
    "difficulty": "medium",
    "text": "Token ABM expiration packages advanced (packages) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-100/scope-deploiement"
  },
  {
    "id": "j200-pkg-09",
    "domain": "packages-advanced",
    "difficulty": "hard",
    "text": "Smart Group nested packages advanced (packages) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-100/scope-deploiement"
  },
  {
    "id": "j200-pkg-10",
    "domain": "packages-advanced",
    "difficulty": "easy",
    "text": "API pagination packages advanced datasets packages — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-100/scope-deploiement"
  },
  {
    "id": "j200-rpt-01",
    "domain": "reporting-bi",
    "difficulty": "easy",
    "text": "Dans un contexte reporting enterprise Jamf 200, quelle pratique est correcte pour reporting bi ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-fundamentals/jf-reporting"
  },
  {
    "id": "j200-rpt-02",
    "domain": "reporting-bi",
    "difficulty": "medium",
    "text": "Scénario reporting : déploiement reporting bi à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-fundamentals/jf-reporting"
  },
  {
    "id": "j200-rpt-03",
    "domain": "reporting-bi",
    "difficulty": "hard",
    "text": "Audit conformité reporting bi (reporting) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-fundamentals/jf-reporting"
  },
  {
    "id": "j200-rpt-04",
    "domain": "reporting-bi",
    "difficulty": "easy",
    "text": "Erreur fréquente reporting bi en production reporting ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-fundamentals/jf-reporting"
  },
  {
    "id": "j200-rpt-05",
    "domain": "reporting-bi",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements reporting bi (reporting) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-fundamentals/jf-reporting"
  },
  {
    "id": "j200-rpt-06",
    "domain": "reporting-bi",
    "difficulty": "hard",
    "text": "Patch deadline reporting bi — comportement post-deadline (reporting) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-fundamentals/jf-reporting"
  },
  {
    "id": "j200-rpt-07",
    "domain": "reporting-bi",
    "difficulty": "easy",
    "text": "Script reporting bi retourne exit 0 sans effet (reporting) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-fundamentals/jf-reporting"
  },
  {
    "id": "j200-rpt-08",
    "domain": "reporting-bi",
    "difficulty": "medium",
    "text": "Token ABM expiration reporting bi (reporting) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-fundamentals/jf-reporting"
  },
  {
    "id": "j200-rpt-09",
    "domain": "reporting-bi",
    "difficulty": "hard",
    "text": "Smart Group nested reporting bi (reporting) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-fundamentals/jf-reporting"
  },
  {
    "id": "j200-rpt-10",
    "domain": "reporting-bi",
    "difficulty": "easy",
    "text": "API pagination reporting bi datasets reporting — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-fundamentals/jf-reporting"
  },
  {
    "id": "j200-trb-01",
    "domain": "troubleshooting-advanced",
    "difficulty": "easy",
    "text": "Dans un contexte troubleshooting enterprise Jamf 200, quelle pratique est correcte pour troubleshooting advanced ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-fundamentals/jf-troubleshooting"
  },
  {
    "id": "j200-trb-02",
    "domain": "troubleshooting-advanced",
    "difficulty": "medium",
    "text": "Scénario troubleshooting : déploiement troubleshooting advanced à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-fundamentals/jf-troubleshooting"
  },
  {
    "id": "j200-trb-03",
    "domain": "troubleshooting-advanced",
    "difficulty": "hard",
    "text": "Audit conformité troubleshooting advanced (troubleshooting) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-fundamentals/jf-troubleshooting"
  },
  {
    "id": "j200-trb-04",
    "domain": "troubleshooting-advanced",
    "difficulty": "easy",
    "text": "Erreur fréquente troubleshooting advanced en production troubleshooting ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-fundamentals/jf-troubleshooting"
  },
  {
    "id": "j200-trb-05",
    "domain": "troubleshooting-advanced",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements troubleshooting advanced (troubleshooting) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-fundamentals/jf-troubleshooting"
  },
  {
    "id": "j200-trb-06",
    "domain": "troubleshooting-advanced",
    "difficulty": "hard",
    "text": "Patch deadline troubleshooting advanced — comportement post-deadline (troubleshooting) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-fundamentals/jf-troubleshooting"
  },
  {
    "id": "j200-trb-07",
    "domain": "troubleshooting-advanced",
    "difficulty": "easy",
    "text": "Script troubleshooting advanced retourne exit 0 sans effet (troubleshooting) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-fundamentals/jf-troubleshooting"
  },
  {
    "id": "j200-trb-08",
    "domain": "troubleshooting-advanced",
    "difficulty": "medium",
    "text": "Token ABM expiration troubleshooting advanced (troubleshooting) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-fundamentals/jf-troubleshooting"
  },
  {
    "id": "j200-trb-09",
    "domain": "troubleshooting-advanced",
    "difficulty": "hard",
    "text": "Smart Group nested troubleshooting advanced (troubleshooting) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-fundamentals/jf-troubleshooting"
  },
  {
    "id": "j200-trb-10",
    "domain": "troubleshooting-advanced",
    "difficulty": "easy",
    "text": "API pagination troubleshooting advanced datasets troubleshooting — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-fundamentals/jf-troubleshooting"
  },
  {
    "id": "j200-mob-01",
    "domain": "mobile-advanced",
    "difficulty": "easy",
    "text": "Dans un contexte mobile enterprise Jamf 200, quelle pratique est correcte pour mobile advanced ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-fundamentals/jf-mobile-devices"
  },
  {
    "id": "j200-mob-02",
    "domain": "mobile-advanced",
    "difficulty": "medium",
    "text": "Scénario mobile : déploiement mobile advanced à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-fundamentals/jf-mobile-devices"
  },
  {
    "id": "j200-mob-03",
    "domain": "mobile-advanced",
    "difficulty": "hard",
    "text": "Audit conformité mobile advanced (mobile) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-fundamentals/jf-mobile-devices"
  },
  {
    "id": "j200-mob-04",
    "domain": "mobile-advanced",
    "difficulty": "easy",
    "text": "Erreur fréquente mobile advanced en production mobile ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-fundamentals/jf-mobile-devices"
  },
  {
    "id": "j200-mob-05",
    "domain": "mobile-advanced",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements mobile advanced (mobile) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-fundamentals/jf-mobile-devices"
  },
  {
    "id": "j200-mob-06",
    "domain": "mobile-advanced",
    "difficulty": "hard",
    "text": "Patch deadline mobile advanced — comportement post-deadline (mobile) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-fundamentals/jf-mobile-devices"
  },
  {
    "id": "j200-mob-07",
    "domain": "mobile-advanced",
    "difficulty": "easy",
    "text": "Script mobile advanced retourne exit 0 sans effet (mobile) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-fundamentals/jf-mobile-devices"
  },
  {
    "id": "j200-mob-08",
    "domain": "mobile-advanced",
    "difficulty": "medium",
    "text": "Token ABM expiration mobile advanced (mobile) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-fundamentals/jf-mobile-devices"
  },
  {
    "id": "j200-mob-09",
    "domain": "mobile-advanced",
    "difficulty": "hard",
    "text": "Smart Group nested mobile advanced (mobile) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-fundamentals/jf-mobile-devices"
  },
  {
    "id": "j200-mob-10",
    "domain": "mobile-advanced",
    "difficulty": "easy",
    "text": "API pagination mobile advanced datasets mobile — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-fundamentals/jf-mobile-devices"
  },
  {
    "id": "j200-cfg-01",
    "domain": "config-profiles-advanced",
    "difficulty": "easy",
    "text": "Dans un contexte config enterprise Jamf 200, quelle pratique est correcte pour config profiles advanced ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-100/config-profiles-jamf"
  },
  {
    "id": "j200-cfg-02",
    "domain": "config-profiles-advanced",
    "difficulty": "medium",
    "text": "Scénario config : déploiement config profiles advanced à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-100/config-profiles-jamf"
  },
  {
    "id": "j200-cfg-03",
    "domain": "config-profiles-advanced",
    "difficulty": "hard",
    "text": "Audit conformité config profiles advanced (config) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-100/config-profiles-jamf"
  },
  {
    "id": "j200-cfg-04",
    "domain": "config-profiles-advanced",
    "difficulty": "easy",
    "text": "Erreur fréquente config profiles advanced en production config ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-100/config-profiles-jamf"
  },
  {
    "id": "j200-cfg-05",
    "domain": "config-profiles-advanced",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements config profiles advanced (config) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-100/config-profiles-jamf"
  },
  {
    "id": "j200-cfg-06",
    "domain": "config-profiles-advanced",
    "difficulty": "hard",
    "text": "Patch deadline config profiles advanced — comportement post-deadline (config) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-100/config-profiles-jamf"
  },
  {
    "id": "j200-cfg-07",
    "domain": "config-profiles-advanced",
    "difficulty": "easy",
    "text": "Script config profiles advanced retourne exit 0 sans effet (config) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-100/config-profiles-jamf"
  },
  {
    "id": "j200-cfg-08",
    "domain": "config-profiles-advanced",
    "difficulty": "medium",
    "text": "Token ABM expiration config profiles advanced (config) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-100/config-profiles-jamf"
  },
  {
    "id": "j200-cfg-09",
    "domain": "config-profiles-advanced",
    "difficulty": "hard",
    "text": "Smart Group nested config profiles advanced (config) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-100/config-profiles-jamf"
  },
  {
    "id": "j200-cfg-10",
    "domain": "config-profiles-advanced",
    "difficulty": "easy",
    "text": "API pagination config profiles advanced datasets config — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-100/config-profiles-jamf"
  },
  {
    "id": "j200-ssv-01",
    "domain": "self-service-advanced",
    "difficulty": "easy",
    "text": "Dans un contexte self enterprise Jamf 200, quelle pratique est correcte pour self service advanced ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-170/self-service"
  },
  {
    "id": "j200-ssv-02",
    "domain": "self-service-advanced",
    "difficulty": "medium",
    "text": "Scénario self : déploiement self service advanced à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-170/self-service"
  },
  {
    "id": "j200-ssv-03",
    "domain": "self-service-advanced",
    "difficulty": "hard",
    "text": "Audit conformité self service advanced (self) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-170/self-service"
  },
  {
    "id": "j200-ssv-04",
    "domain": "self-service-advanced",
    "difficulty": "easy",
    "text": "Erreur fréquente self service advanced en production self ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-170/self-service"
  },
  {
    "id": "j200-ssv-05",
    "domain": "self-service-advanced",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements self service advanced (self) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-170/self-service"
  },
  {
    "id": "j200-ssv-06",
    "domain": "self-service-advanced",
    "difficulty": "hard",
    "text": "Patch deadline self service advanced — comportement post-deadline (self) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-170/self-service"
  },
  {
    "id": "j200-ssv-07",
    "domain": "self-service-advanced",
    "difficulty": "easy",
    "text": "Script self service advanced retourne exit 0 sans effet (self) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-170/self-service"
  },
  {
    "id": "j200-ssv-08",
    "domain": "self-service-advanced",
    "difficulty": "medium",
    "text": "Token ABM expiration self service advanced (self) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-170/self-service"
  },
  {
    "id": "j200-ssv-09",
    "domain": "self-service-advanced",
    "difficulty": "hard",
    "text": "Smart Group nested self service advanced (self) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-170/self-service"
  },
  {
    "id": "j200-ssv-10",
    "domain": "self-service-advanced",
    "difficulty": "easy",
    "text": "API pagination self service advanced datasets self — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-170/self-service"
  },
  {
    "id": "j200-inv-01",
    "domain": "inventory-advanced",
    "difficulty": "easy",
    "text": "Dans un contexte inventory enterprise Jamf 200, quelle pratique est correcte pour inventory advanced ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-100/inventaire-recherche"
  },
  {
    "id": "j200-inv-02",
    "domain": "inventory-advanced",
    "difficulty": "medium",
    "text": "Scénario inventory : déploiement inventory advanced à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-100/inventaire-recherche"
  },
  {
    "id": "j200-inv-03",
    "domain": "inventory-advanced",
    "difficulty": "hard",
    "text": "Audit conformité inventory advanced (inventory) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-100/inventaire-recherche"
  },
  {
    "id": "j200-inv-04",
    "domain": "inventory-advanced",
    "difficulty": "easy",
    "text": "Erreur fréquente inventory advanced en production inventory ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-100/inventaire-recherche"
  },
  {
    "id": "j200-inv-05",
    "domain": "inventory-advanced",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements inventory advanced (inventory) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-100/inventaire-recherche"
  },
  {
    "id": "j200-inv-06",
    "domain": "inventory-advanced",
    "difficulty": "hard",
    "text": "Patch deadline inventory advanced — comportement post-deadline (inventory) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-100/inventaire-recherche"
  },
  {
    "id": "j200-inv-07",
    "domain": "inventory-advanced",
    "difficulty": "easy",
    "text": "Script inventory advanced retourne exit 0 sans effet (inventory) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-100/inventaire-recherche"
  },
  {
    "id": "j200-inv-08",
    "domain": "inventory-advanced",
    "difficulty": "medium",
    "text": "Token ABM expiration inventory advanced (inventory) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-100/inventaire-recherche"
  },
  {
    "id": "j200-inv-09",
    "domain": "inventory-advanced",
    "difficulty": "hard",
    "text": "Smart Group nested inventory advanced (inventory) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-100/inventaire-recherche"
  },
  {
    "id": "j200-inv-10",
    "domain": "inventory-advanced",
    "difficulty": "easy",
    "text": "API pagination inventory advanced datasets inventory — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-100/inventaire-recherche"
  },
  {
    "id": "j200-stg-01",
    "domain": "static-groups-advanced",
    "difficulty": "easy",
    "text": "Dans un contexte static enterprise Jamf 200, quelle pratique est correcte pour static groups advanced ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-fundamentals/jf-static-groups"
  },
  {
    "id": "j200-stg-02",
    "domain": "static-groups-advanced",
    "difficulty": "medium",
    "text": "Scénario static : déploiement static groups advanced à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-fundamentals/jf-static-groups"
  },
  {
    "id": "j200-stg-03",
    "domain": "static-groups-advanced",
    "difficulty": "hard",
    "text": "Audit conformité static groups advanced (static) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-fundamentals/jf-static-groups"
  },
  {
    "id": "j200-stg-04",
    "domain": "static-groups-advanced",
    "difficulty": "easy",
    "text": "Erreur fréquente static groups advanced en production static ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-fundamentals/jf-static-groups"
  },
  {
    "id": "j200-stg-05",
    "domain": "static-groups-advanced",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements static groups advanced (static) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-fundamentals/jf-static-groups"
  },
  {
    "id": "j200-stg-06",
    "domain": "static-groups-advanced",
    "difficulty": "hard",
    "text": "Patch deadline static groups advanced — comportement post-deadline (static) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-fundamentals/jf-static-groups"
  },
  {
    "id": "j200-stg-07",
    "domain": "static-groups-advanced",
    "difficulty": "easy",
    "text": "Script static groups advanced retourne exit 0 sans effet (static) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-fundamentals/jf-static-groups"
  },
  {
    "id": "j200-stg-08",
    "domain": "static-groups-advanced",
    "difficulty": "medium",
    "text": "Token ABM expiration static groups advanced (static) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-fundamentals/jf-static-groups"
  },
  {
    "id": "j200-stg-09",
    "domain": "static-groups-advanced",
    "difficulty": "hard",
    "text": "Smart Group nested static groups advanced (static) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-fundamentals/jf-static-groups"
  },
  {
    "id": "j200-stg-10",
    "domain": "static-groups-advanced",
    "difficulty": "easy",
    "text": "API pagination static groups advanced datasets static — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-fundamentals/jf-static-groups"
  },
  {
    "id": "j200-cmp-01",
    "domain": "computers-advanced",
    "difficulty": "easy",
    "text": "Dans un contexte computers enterprise Jamf 200, quelle pratique est correcte pour computers advanced ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-fundamentals/jf-computers"
  },
  {
    "id": "j200-cmp-02",
    "domain": "computers-advanced",
    "difficulty": "medium",
    "text": "Scénario computers : déploiement computers advanced à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-fundamentals/jf-computers"
  },
  {
    "id": "j200-cmp-03",
    "domain": "computers-advanced",
    "difficulty": "hard",
    "text": "Audit conformité computers advanced (computers) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-fundamentals/jf-computers"
  },
  {
    "id": "j200-cmp-04",
    "domain": "computers-advanced",
    "difficulty": "easy",
    "text": "Erreur fréquente computers advanced en production computers ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-fundamentals/jf-computers"
  },
  {
    "id": "j200-cmp-05",
    "domain": "computers-advanced",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements computers advanced (computers) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-fundamentals/jf-computers"
  },
  {
    "id": "j200-cmp-06",
    "domain": "computers-advanced",
    "difficulty": "hard",
    "text": "Patch deadline computers advanced — comportement post-deadline (computers) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-fundamentals/jf-computers"
  },
  {
    "id": "j200-cmp-07",
    "domain": "computers-advanced",
    "difficulty": "easy",
    "text": "Script computers advanced retourne exit 0 sans effet (computers) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-fundamentals/jf-computers"
  },
  {
    "id": "j200-cmp-08",
    "domain": "computers-advanced",
    "difficulty": "medium",
    "text": "Token ABM expiration computers advanced (computers) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-fundamentals/jf-computers"
  },
  {
    "id": "j200-cmp-09",
    "domain": "computers-advanced",
    "difficulty": "hard",
    "text": "Smart Group nested computers advanced (computers) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-fundamentals/jf-computers"
  },
  {
    "id": "j200-cmp-10",
    "domain": "computers-advanced",
    "difficulty": "easy",
    "text": "API pagination computers advanced datasets computers — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-fundamentals/jf-computers"
  },
  {
    "id": "j200-jcn-01",
    "domain": "jamf-connect",
    "difficulty": "easy",
    "text": "Dans un contexte jamf enterprise Jamf 200, quelle pratique est correcte pour jamf connect ?",
    "correct": "Automatiser via API avec gestion rate-limit et retry",
    "distractors": [
      "Ignorer les headers X-Rate-Limit",
      "Désactiver inventaire pour performance",
      "Utiliser compte admin partagé sans MFA"
    ],
    "explanation": "API Jamf exige respect rate-limit et OAuth Bearer.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-jcn-02",
    "domain": "jamf-connect",
    "difficulty": "medium",
    "text": "Scénario jamf : déploiement jamf connect à 5000 Mac — architecture recommandée ?",
    "correct": "Load balancer + cluster DB + Distribution Points régionaux",
    "distractors": [
      "Single Mac mini sans backup",
      "Policies sans Smart Groups",
      "Désactiver APNs"
    ],
    "explanation": "Scale Jamf = architecture distribuée.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-jcn-03",
    "domain": "jamf-connect",
    "difficulty": "hard",
    "text": "Audit conformité jamf connect (jamf) — outil Jamf adapté ?",
    "correct": "Jamf Compliance Editor + Extension Attributes preuve",
    "distractors": [
      "Email manuel uniquement",
      "Self Service seul",
      "Static Group vide"
    ],
    "explanation": "Compliance Editor pour benchmarks CIS/custom.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-jcn-04",
    "domain": "jamf-connect",
    "difficulty": "easy",
    "text": "Erreur fréquente jamf connect en production jamf ?",
    "correct": "Scope sans preview eligible ou membership",
    "distractors": [
      "Trop de logs",
      "Couleur Dashboard",
      "Nom policy trop court"
    ],
    "explanation": "Preview et pilote obligatoires avant scale.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-jcn-05",
    "domain": "jamf-connect",
    "difficulty": "medium",
    "text": "Intégration SIEM pour événements jamf connect (jamf) ?",
    "correct": "Webhooks Jamf Pro HTTP POST + log streaming",
    "distractors": [
      "FTP vers SIEM",
      "Export USB",
      "Screenshot manuel"
    ],
    "explanation": "Webhooks et syslog vers SIEM.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-jcn-06",
    "domain": "jamf-connect",
    "difficulty": "hard",
    "text": "Patch deadline jamf connect — comportement post-deadline (jamf) ?",
    "correct": "Force install selon configuration patch policy",
    "distractors": [
      "Supprime appareil",
      "Ignore patch",
      "Désactive MDM"
    ],
    "explanation": "Deadlines patch imposent installation.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-jcn-07",
    "domain": "jamf-connect",
    "difficulty": "easy",
    "text": "Script jamf connect retourne exit 0 sans effet (jamf) — validation ?",
    "correct": "Fichier témoin + EA + Policy Logs Jamf",
    "distractors": [
      "Confiance exit code seul",
      "Supprimer logs",
      "Reboot massif"
    ],
    "explanation": "Exit 0 insuffisant sans preuve.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-jcn-08",
    "domain": "jamf-connect",
    "difficulty": "medium",
    "text": "Token ABM expiration jamf connect (jamf) — impact ?",
    "correct": "Enrollment ADE bloqué après expiration token",
    "distractors": [
      "Policies supprimées",
      "Mac wipe auto",
      "APNs renouvelé auto"
    ],
    "explanation": "Token ABM 365j — alerte avant expiry.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-jcn-09",
    "domain": "jamf-connect",
    "difficulty": "hard",
    "text": "Smart Group nested jamf connect (jamf) — usage valide ?",
    "correct": "Smart Group basé sur autre Smart Group avec critères non circulaires",
    "distractors": [
      "Circularité A↔B",
      "Static only",
      "Sans critères"
    ],
    "explanation": "Nested OK sans circularité.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  },
  {
    "id": "j200-jcn-10",
    "domain": "jamf-connect",
    "difficulty": "easy",
    "text": "API pagination jamf connect datasets jamf — paramètre ?",
    "correct": "page-size et page dans requêtes REST",
    "distractors": [
      "Aucune pagination",
      "Email batch",
      "Un seul appel illimité"
    ],
    "explanation": "Pagination API pour gros inventaires.",
    "relatedModuleSlug": "jamf-200/integrations-tierces"
  }
];

export const jamf200Bank: Question[] = buildExamBank(JAMF200_BANK_INPUTS);
export const jamf200QuestionCount = jamf200Bank.length;
