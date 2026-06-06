import type { Quiz } from "@/lib/types";
import { q } from "@/lib/quiz/question-builder";

export const quizAdeCertification: Quiz = {
  slug: "quiz-ade-certification",
  trackSlug: "apple-it-professional",
  title: "Quiz certification — Automated Device Enrollment",
  type: "quiz",
  description: "20 questions ADE : supervision, activation, serveur MDM, cycle de vie et zero-touch.",
  duration: "30 min",
  passingScore: 75,
  questions: [
    q("ade-q01", "ADE signifie historiquement aussi :", ["Apple Device Encryption", "Device Enrollment Program (DEP)", "Direct Enterprise Provisioning", "Data Export Protocol"], 1, "DEP a été renommé Automated Device Enrollment."),
    q("ade-q02", "Au premier boot ADE, l'appareil télécharge :", ["Profil iCloud perso", "Profil Remote Management MDM depuis Apple", "Profil Facebook", "Certificat utilisateur"], 1, "Apple sert le profil MDM assigné dans ABM."),
    q("ade-q03", "Supervision permet notamment :", ["Restrictions MDM avancées et silent app install", "Désactiver chiffrement", "Bypass Activation Lock sans ABM", "Root macOS"], 0, "Supervision débloque payloads management renforcés."),
    q("ade-q04", "500 MacBook zero-touch — assignation serials se fait :", ["Post-setup par utilisateur", "Dans ABM avant livraison", "Via email PDF", "Apple Store app"], 1, "Assignation ABM avant unboxing garantit ADE."),
    q("ade-q05", "Await Device Configured sur profil ADE :", ["Accélère Wi-Fi", "Retarde accès utilisateur jusqu'à fin config MDM", "Désactive FileVault", "Supprime supervision"], 1, "Bloque bureau jusqu'à policies appliquées."),
    q("ade-q06", "Mac enrollé manuellement sans ADE est :", ["Toujours supervisé", "Généralement non supervisé", "Automatiquement ADE", "Impossible à gérer"], 1, "Supervision ADE requiert flux enrollment automatisé."),
    q("ade-q07", "Return to Service (macOS récent) :", ["Efface sans re-enrollment", "Efface et ré-enroll ADE automatiquement", "Désactive MDM permanent", "Supprime ABM"], 1, "RTS modernise offboarding avec re-enrollment."),
    q("ade-q08", "Remote Management à l'écran setup indique :", ["Échec ADE", "Succès liaison Apple → MDM", "Mode recovery", "FileVault off"], 1, "Remote Management = profil MDM accepté."),
    q("ade-q09", "Profils ADE distincts macOS/iOS sont utiles quand :", ["Payloads identiques", "Payloads et écrans Setup diffèrent", "APNs différent", "ABM absent"], 1, "Séparer profils par plateforme."),
    q("ade-q10", "Offboarding — release ABM avant revente :", ["Optionnel toujours", "Obligatoire pour transfert org", "Remplace wipe MDM", "Active Activation Lock IT"], 1, "Release libère serial pour nouvel propriétaire."),
    q("ade-q11", "Locked enrollment empêche :", ["FileVault", "Retrait MDM par utilisateur", "Wi-Fi", "Mises à jour OS"], 1, "Locked = enrollment non supprimable par user."),
    q("ade-q12", "Skip Setup Assistant screens sert à :", ["Allonger setup", "Accélérer zero-touch en masse", "Désactiver ADE", "Forcer compte local"], 1, "Skip screens réduit friction déploiement."),
    q("ade-q13", "Check-in MDM post-ADE typique délai pilote :", ["7 jours", "< 30 minutes avec réseau", "Jamais", "1 an"], 1, "Premier check-in rapide si réseau OK."),
    q("ade-q14", "Serial absent ABM au setup — résultat :", ["ADE automatique quand même", "Setup standard sans Remote Management", "Supervision forcée", "Brick device"], 1, "Sans ABM, pas d'ADE."),
    q("ade-q15", "Profil ADE assigné après setup utilisateur :", ["Retroactive supervision", "Nécessite effacement pour ADE", "Ignore MDM", "Active FileVault seul"], 1, "Trop tard — wipe et re-flow ADE."),
    q("ade-q16", "Cycle de vie ADE inclut :", ["Achat → ABM → MDM → usage → release", "Uniquement achat", "Uniquement wipe", "Developer account"], 0, "Cycle complet de procurement à offboarding."),
    q("ade-q17", "Apple Configurator 2 peut :", ["Ajouter appareils à ABM (Apple Configurator enrollment)", "Remplacer ABM entier", "Créer D-U-N-S", "Signer apps B2B"], 0, "Configurator ajoute devices non agréés via Apple ID admin."),
    q("ade-q18", "Métrique time-to-productivity mesure :", ["Couleur écran", "Délai unbox → apps métier prêtes", "Poids MacBook", "Version Xcode"], 1, "KPI enterprise rollout ADE."),
    q("ade-q19", "Rollback pilote ADE 5 % échecs — action :", ["Ignorer", "Analyser logs MDM, ajuster profil, re-pilot", "Supprimer ABM", "Désactiver APNs"], 1, "Pilot itératif avant rollout 450 Mac."),
    q("ade-q20", "Display name profil ADE visible :", ["Uniquement console MDM", "Setup Assistant utilisateur", "App Store", "Finder only"], 1, "Nom org affiché à l'utilisateur au enrollment."),
  ],
};
