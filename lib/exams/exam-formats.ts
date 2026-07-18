import type { OfficialSource } from "@/lib/types";
import type { ExamDomain, ExamFormat } from "@/lib/exams/exam-types";

const CHECKED_AT = "2026-07-18";

const APPLE_DEVICE_SUPPORT: OfficialSource = {
  title: "Apple Professional Training — Apple Device Support Exam",
  publisher: "Apple",
  url: "https://it-training.apple.com/support/tutorials/course/sup030/",
  checkedAt: CHECKED_AT,
};

const APPLE_DEPLOYMENT: OfficialSource = {
  title: "Apple Professional Training — Apple Deployment and Management Exam",
  publisher: "Apple",
  url: "https://it-training.apple.com/deployment/tutorials/course/dep030/",
  checkedAt: CHECKED_AT,
};

const JAMF_100: OfficialSource = {
  title: "Jamf Training — Jamf Pro Associate Exam",
  publisher: "Jamf",
  url: "https://training.jamf.com/jamf-certified-associate-exam-english-en",
  checkedAt: CHECKED_AT,
};

const JAMF_CERTIFICATIONS: OfficialSource = {
  title: "Jamf Support — Training Courses & Certifications",
  publisher: "Jamf",
  url: "https://support.jamf.com/en/articles/13180165-jamf-training-courses-certifications",
  checkedAt: CHECKED_AT,
};

const MICROSOFT_MD_102: OfficialSource = {
  title: "Microsoft Learn — Study guide for Exam MD-102",
  publisher: "Microsoft",
  url: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/md-102",
  checkedAt: CHECKED_AT,
};

function domain(id: string, label: string, weightPercent?: number, sourceVerified = false): ExamDomain {
  return { id, label, weightPercent, sourceVerified };
}

const APPLE_DEPLOYMENT_DOMAINS: ExamDomain[] = [
  domain("device-management", "Device Management"),
  domain("enrollment", "Device Enrollment and Deployment"),
  domain("apple-business", "Apple Business"),
  domain("configurator", "Apple Configurator"),
  domain("network", "Network Preparation and Integration"),
  domain("identity", "Identity Services and Federation"),
  domain("configuration", "Device Configuration"),
  domain("software-updates", "Software Updates"),
  domain("content", "Content Buying and Distribution"),
  domain("security", "Device Security"),
];

export const examFormats: Record<string, ExamFormat> = {
  "apple-device-support": {
    id: "apple-device-support",
    routeSlug: "apple-device-support",
    quizSlug: "examen-apple-device-support",
    officialName: "Apple Device Support Exam",
    vendor: "Apple",
    certification: "Apple Certified Support Professional",
    durationMinutes: 120,
    questionCount: 80,
    passingScore: 75,
    domains: [
      domain("iphone-ipad", "iPhone and iPad fundamentals"),
      domain("mac-support", "macOS support"),
      domain("security", "Security and privacy"),
      domain("troubleshooting", "Troubleshooting and recovery"),
    ],
    difficulty: "professional",
    questionTypes: ["single-select", "multi-select"],
    displayMode: "one-question",
    modes: buildModes({ durationMinutes: 120, questionCount: 80 }),
    scoring: { passingScore: 75, scoreType: "percent", weighted: false },
    verificationStatus: "official-verified",
    sources: [APPLE_DEVICE_SUPPORT],
  },
  "apple-it-professional": appleAcademyPlaceholder(
    "apple-it-professional",
    "Examen interne Apple MDM Academy — Apple IT Professional",
    "Examen interne Apple MDM Academy",
    120,
    200,
    "professional",
  ),
  "apple-deployment": {
    id: "apple-deployment",
    routeSlug: "apple-deployment",
    quizSlug: "examen-apple-deployment",
    officialName: "Apple Deployment and Management Exam",
    vendor: "Apple",
    certification: "Apple Certified IT Professional",
    durationMinutes: 120,
    questionCount: 80,
    passingScore: 75,
    domains: APPLE_DEPLOYMENT_DOMAINS,
    difficulty: "professional",
    questionTypes: ["single-select", "multi-select"],
    displayMode: "one-question",
    modes: buildModes({ durationMinutes: 120, questionCount: 80 }),
    scoring: { passingScore: 75, scoreType: "percent", weighted: false },
    verificationStatus: "official-verified",
    sources: [APPLE_DEPLOYMENT],
  },
  "apple-security": appleAcademyPlaceholder(
    "apple-security",
    "Examen interne Apple MDM Academy — Apple Security",
    "Examen interne Apple MDM Academy",
    120,
    100,
    "advanced",
  ),
  "apple-enterprise-expert": appleAcademyPlaceholder(
    "apple-enterprise-expert",
    "Examen interne Apple MDM Academy — Apple Enterprise Expert",
    "Examen interne Apple MDM Academy",
    120,
    100,
    "advanced",
  ),
  "apple-enterprise-architect": appleAcademyPlaceholder(
    "apple-enterprise-architect",
    "Examen interne Apple MDM Academy — Apple Enterprise Architect",
    "Examen interne Apple MDM Academy",
    180,
    200,
    "expert",
  ),
  "jamf-100": {
    id: "jamf-100",
    routeSlug: "jamf-100",
    quizSlug: "examen-jamf-100-blanc",
    officialName: "Jamf Pro Associate Exam",
    vendor: "Jamf",
    certification: "Jamf Certified Associate - Jamf Pro",
    durationMinutes: 60,
    questionCount: 50,
    passingScore: 80,
    domains: [
      domain("ios", "iOS foundations"),
      domain("macos", "macOS foundations"),
      domain("mdm", "Mobile device management"),
      domain("jamf-pro", "Jamf Pro foundations"),
    ],
    difficulty: "associate",
    questionTypes: ["single-select"],
    displayMode: "one-question",
    modes: buildModes({ durationMinutes: 60, questionCount: 50, passingScore: 80 }),
    scoring: { passingScore: 80, scoreType: "percent", weighted: false },
    verificationStatus: "official-verified",
    sources: [JAMF_100],
  },
  "jamf-200": jamfPlaceholder("jamf-200", "Jamf 200", "Jamf Certified Tech - Jamf Pro", "professional"),
  "jamf-300": jamfPlaceholder("jamf-300", "Jamf 300", "Jamf Certified Admin - Jamf Pro", "advanced"),
  "jamf-400": jamfPlaceholder("jamf-400", "Jamf 400", "Jamf Certified Expert - Jamf Pro", "expert"),
  "intune-apple": microsoftPlaceholder("intune-apple", "Évaluation interne Intune pour appareils Apple"),
  "intune-apple-advanced": microsoftPlaceholder("intune-apple-advanced", "Évaluation interne avancée Intune pour appareils Apple"),
  "md-102": {
    id: "md-102",
    routeSlug: "md-102",
    quizSlug: "examen-md-102",
    officialName: "Exam MD-102: Endpoint Administrator",
    vendor: "Microsoft",
    certification: "Microsoft 365 Certified: Endpoint Administrator Associate",
    durationMinutes: 100,
    questionCount: null,
    passingScore: 700,
    domains: [
      domain("prepare-infrastructure", "Prepare infrastructure for devices", 20, true),
      domain("manage-maintain", "Manage and maintain devices", 25, true),
      domain("protect-devices", "Protect devices", 15, true),
      domain("apps", "Manage and secure applications", 15, true),
      domain("optimize", "Optimize endpoint operations", 10, true),
    ],
    difficulty: "professional",
    questionTypes: ["single-select", "multi-select", "case-study"],
    displayMode: "one-question",
    modes: buildModes({ durationMinutes: 100, questionCount: 60, passingScore: 70 }),
    scoring: { passingScore: 70, scoreType: "scaled", scaledPassingScore: 700, weighted: false },
    verificationStatus: "official-partial",
    sources: [MICROSOFT_MD_102],
    notes: ["Microsoft publishes the passing scaled score and skills measured; exact live item count can vary."],
  },
};

function buildModes(input: { durationMinutes: number; questionCount: number; passingScore?: number }): ExamFormat["modes"] {
  return {
    training: {
      questionCount: Math.min(20, input.questionCount),
      durationMinutes: undefined,
      timerRequired: false,
      timerCanPause: true,
      correctionTiming: "immediate",
      showExplanations: "after-answer",
      randomizeQuestions: true,
      randomizeOptions: true,
      lockAnswers: false,
      allowResume: true,
    },
    simulation: {
      questionCount: input.questionCount,
      durationMinutes: input.durationMinutes,
      timerRequired: true,
      timerCanPause: false,
      correctionTiming: "end-only",
      showExplanations: "after-submit",
      randomizeQuestions: true,
      randomizeOptions: true,
      lockAnswers: true,
      allowResume: true,
    },
  };
}

function jamfPlaceholder(
  routeSlug: "jamf-200" | "jamf-300" | "jamf-400",
  officialName: string,
  certification: string,
  difficulty: ExamFormat["difficulty"],
): ExamFormat {
  const questionCount = routeSlug === "jamf-200" ? 60 : routeSlug === "jamf-300" ? 75 : 90;
  return {
    id: routeSlug,
    routeSlug,
    quizSlug: `examen-${routeSlug}`,
    officialName,
    vendor: "Jamf",
    certification,
    durationMinutes: null,
    questionCount: null,
    passingScore: null,
    domains: [
      domain("jamf-pro", "Jamf Pro administration"),
      domain("practical-tasks", "Practical tasks"),
      domain("troubleshooting", "Troubleshooting"),
    ],
    difficulty,
    questionTypes: routeSlug === "jamf-200" ? ["single-select", "practical-task"] : ["single-select", "multi-select", "practical-task"],
    displayMode: "sectioned",
    modes: buildModes({ durationMinutes: 120, questionCount, passingScore: 75 }),
    scoring: { passingScore: 75, scoreType: "percent", weighted: false },
    verificationStatus: "needs-review",
    sources: [JAMF_CERTIFICATIONS],
    notes: [
      "Jamf confirms course/certification format categories; exact live timing and cut score require direct official verification.",
      "Academy simulation format; official timing, count, and threshold are not asserted.",
    ],
  };
}

function appleAcademyPlaceholder(
  routeSlug: "apple-it-professional" | "apple-security" | "apple-enterprise-expert" | "apple-enterprise-architect",
  officialName: string,
  certification: string,
  durationMinutes: number,
  questionCount: number,
  difficulty: ExamFormat["difficulty"],
): ExamFormat {
  return {
    id: routeSlug,
    routeSlug,
    quizSlug: routeSlug === "apple-it-professional" ? "examen-apple-it-pro" : `examen-${routeSlug}`,
    officialName,
    vendor: "Apple",
    certification,
    durationMinutes,
    questionCount,
    passingScore: 80,
    domains: [
      domain("deployment", "Deployment and management"),
      domain("security", "Security and compliance"),
      domain("identity", "Identity and accounts"),
      domain("troubleshooting", "Troubleshooting"),
    ],
    difficulty,
    questionTypes: ["single-select", "multi-select", "case-study"],
    displayMode: "one-question",
    modes: buildModes({ durationMinutes, questionCount, passingScore: 80 }),
    scoring: { passingScore: 80, scoreType: "percent", weighted: false },
    verificationStatus: "internal",
    sources: [APPLE_DEPLOYMENT],
    notes: ["Academy simulation format; exact official equivalence is not asserted."],
  };
}

function microsoftPlaceholder(routeSlug: "intune-apple" | "intune-apple-advanced", officialName: string): ExamFormat {
  return {
    id: routeSlug,
    routeSlug,
    quizSlug: routeSlug === "intune-apple" ? "examen-intune-apple" : "examen-intune-apple-advanced",
    officialName,
    vendor: "Microsoft",
    certification: "Évaluation interne Intune pour appareils Apple",
    durationMinutes: null,
    questionCount: null,
    passingScore: null,
    domains: [
      domain("enrollment", "Apple enrollment with Intune"),
      domain("configuration", "Configuration profiles"),
      domain("compliance", "Compliance and Conditional Access"),
      domain("security", "Endpoint security"),
      domain("troubleshooting", "Troubleshooting"),
    ],
    difficulty: routeSlug === "intune-apple" ? "professional" : "advanced",
    questionTypes: ["single-select", "multi-select", "case-study"],
    displayMode: "one-question",
    modes: buildModes({ durationMinutes: 120, questionCount: 60, passingScore: 80 }),
    scoring: { passingScore: 80, scoreType: "percent", weighted: false },
    verificationStatus: "internal",
    sources: [MICROSOFT_MD_102],
    notes: ["This is an academy simulation, not a Microsoft certification title."],
  };
}
