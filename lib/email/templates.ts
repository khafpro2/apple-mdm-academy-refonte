/**
 * Templates HTML pour les emails Resend — Apple MDM Academy
 */

const BASE_STYLE = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  max-width: 560px;
  margin: 0 auto;
  color: #1d1d1f;
  line-height: 1.6;
`;

const LOGO = `
  <div style="text-align:center;margin-bottom:24px">
    <span style="font-size:18px;font-weight:700;color:#0071e3">Apple MDM Academy</span>
  </div>
`;

const FOOTER = `
  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e8e8ed;font-size:12px;color:#86868b;text-align:center">
    Apple MDM Academy — Formation Apple, Jamf Pro &amp; Intune<br>
    <a href="https://apple-mdm-academy-refonte.vercel.app/unsubscribe" style="color:#86868b">Se désabonner</a>
  </div>
`;

// ── Email de bienvenue ────────────────────────────────────────────────────────
export function welcomeEmail(firstName: string): { subject: string; html: string; text: string } {
  return {
    subject: `Bienvenue sur Apple MDM Academy, ${firstName} ! 🎉`,
    html: `<div style="${BASE_STYLE}">
      ${LOGO}
      <h1 style="font-size:24px;font-weight:700;margin:0 0 16px">Bienvenue, ${firstName} !</h1>
      <p>Votre compte Apple MDM Academy est prêt. Vous avez accès à :</p>
      <ul style="padding-left:20px;margin:16px 0">
        <li><strong>9 parcours certifiants</strong> — Jamf 100/200, Apple IT Pro, Intune et plus</li>
        <li><strong>40+ labs pratiques</strong> guidés pas à pas</li>
        <li><strong>Examens blancs</strong> avec correction détaillée</li>
        <li><strong>Certificats PDF</strong> téléchargeables</li>
      </ul>
      <div style="text-align:center;margin:28px 0">
        <a href="https://apple-mdm-academy-refonte.vercel.app/dashboard"
           style="display:inline-block;background:#0071e3;color:white;padding:14px 28px;border-radius:100px;font-weight:600;text-decoration:none;font-size:15px">
          Commencer ma formation →
        </a>
      </div>
      <p style="font-size:14px;color:#6e6e73">
        Besoin d'aide ? <a href="https://apple-mdm-academy-refonte.vercel.app/support" style="color:#0071e3">Centre de support</a>
      </p>
      ${FOOTER}
    </div>`,
    text: `Bienvenue sur Apple MDM Academy, ${firstName} !\n\nVotre compte est prêt.\n\nAccédez à votre formation : https://apple-mdm-academy-refonte.vercel.app/dashboard`,
  };
}

// ── Email récapitulatif d'examen ─────────────────────────────────────────────
export function examResultEmail(params: {
  firstName: string;
  examTitle: string;
  score: number;
  passed: boolean;
  correctCount: number;
  totalCount: number;
  elapsedMinutes: number;
  examUrl: string;
}): { subject: string; html: string; text: string } {
  const { firstName, examTitle, score, passed, correctCount, totalCount, elapsedMinutes, examUrl } = params;
  const emoji = passed ? "🎉" : "📖";
  const statusText = passed ? "Félicitations — Examen réussi !" : "Continuez vos efforts !";
  const statusColor = passed ? "#059669" : "#d97706";

  return {
    subject: `${emoji} ${statusText} — ${examTitle} (${score}%)`,
    html: `<div style="${BASE_STYLE}">
      ${LOGO}
      <div style="text-align:center;padding:24px;background:${passed ? '#d1fae5' : '#fef3c7'};border-radius:16px;margin-bottom:24px">
        <p style="font-size:48px;margin:0">${emoji}</p>
        <h1 style="font-size:22px;font-weight:700;color:${statusColor};margin:8px 0">${statusText}</h1>
        <p style="font-size:36px;font-weight:800;color:${statusColor};margin:4px 0">${score}%</p>
        <p style="color:#6e6e73;font-size:14px;margin:4px 0">${correctCount}/${totalCount} bonnes réponses · ${elapsedMinutes} min</p>
      </div>
      <p>Bonjour ${firstName},</p>
      <p>Vous venez de terminer l'examen <strong>${examTitle}</strong>.</p>
      ${passed
        ? `<p>Votre score de ${score}% dépasse le seuil requis. Votre certificat est disponible sur votre tableau de bord !</p>`
        : `<p>Avec ${score}%, continuez à réviser les modules concernés — vous y êtes presque ! Consultez la correction détaillée pour identifier vos points faibles.</p>`
      }
      <div style="text-align:center;margin:24px 0">
        <a href="${examUrl}"
           style="display:inline-block;background:#0071e3;color:white;padding:12px 24px;border-radius:100px;font-weight:600;text-decoration:none">
          Voir la correction détaillée →
        </a>
      </div>
      ${FOOTER}
    </div>`,
    text: `${statusText} — ${examTitle}\nScore: ${score}% (${correctCount}/${totalCount})\n\nVoir la correction: ${examUrl}`,
  };
}

// ── Email de certification obtenue ────────────────────────────────────────────
export function certificationEmail(params: {
  firstName: string;
  certTitle: string;
  score: number;
  certUrl: string;
}): { subject: string; html: string; text: string } {
  const { firstName, certTitle, score, certUrl } = params;

  return {
    subject: `🏆 Certification obtenue — ${certTitle}`,
    html: `<div style="${BASE_STYLE}">
      ${LOGO}
      <div style="text-align:center;padding:32px;background:linear-gradient(135deg,#dbeafe,#ede9fe);border-radius:16px;margin-bottom:24px">
        <p style="font-size:56px;margin:0">🏆</p>
        <h1 style="font-size:22px;font-weight:700;color:#1d1d1f;margin:12px 0">Certification obtenue !</h1>
        <p style="font-weight:700;font-size:18px;color:#0071e3;margin:4px 0">${certTitle}</p>
        <p style="color:#6e6e73;font-size:14px;margin:4px 0">Score : ${score}%</p>
      </div>
      <p>Félicitations ${firstName} !</p>
      <p>Vous avez obtenu votre certification <strong>${certTitle}</strong> sur Apple MDM Academy. Votre certificat PDF est disponible et vérifiable en ligne.</p>
      <div style="text-align:center;margin:24px 0">
        <a href="${certUrl}"
           style="display:inline-block;background:#0071e3;color:white;padding:14px 28px;border-radius:100px;font-weight:600;text-decoration:none">
          Télécharger mon certificat →
        </a>
      </div>
      <p style="font-size:13px;color:#6e6e73;text-align:center">
        Partagez votre réussite sur <a href="https://linkedin.com" style="color:#0071e3">LinkedIn</a> avec le lien de vérification !
      </p>
      ${FOOTER}
    </div>`,
    text: `Félicitations ${firstName} ! Certification obtenue : ${certTitle} (${score}%)\nTélécharger : ${certUrl}`,
  };
}

// ── Rappel d'inactivité ────────────────────────────────────────────────────────
export function inactivityReminderEmail(params: {
  firstName: string;
  daysSince: number;
  lastCourseTitle?: string;
  resumeUrl: string;
}): { subject: string; html: string; text: string } {
  const { firstName, daysSince, lastCourseTitle, resumeUrl } = params;

  return {
    subject: `${firstName}, votre formation vous attend 📚`,
    html: `<div style="${BASE_STYLE}">
      ${LOGO}
      <p>Bonjour ${firstName},</p>
      <p>Cela fait <strong>${daysSince} jours</strong> que vous n'avez pas ouvert Apple MDM Academy.${lastCourseTitle ? ` Votre dernière activité était sur <strong>${lastCourseTitle}</strong>.` : ''}</p>
      <p>Même 15 minutes par jour font une grande différence dans votre préparation !</p>
      <div style="text-align:center;margin:24px 0">
        <a href="${resumeUrl}"
           style="display:inline-block;background:#0071e3;color:white;padding:14px 28px;border-radius:100px;font-weight:600;text-decoration:none">
          Reprendre ma formation →
        </a>
      </div>
      ${FOOTER}
    </div>`,
    text: `Bonjour ${firstName}, reprenez votre formation Apple MDM Academy : ${resumeUrl}`,
  };
}
