/**
 * Crée ou met à jour le compte démo Supabase + données de progression.
 * Usage: SUPABASE_SERVICE_ROLE_KEY=... npm run seed:demo
 */
import { createClient, type User } from "@supabase/supabase-js";
import { DEMO_USER_EMAIL, DEMO_USER_FULL_NAME, DEMO_USER_PASSWORD } from "../lib/demo/constants";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_TRACK_PROGRESS = [
  { track_slug: "apple-it-professional", percent: 75 },
  { track_slug: "intune-mac", percent: 60 },
  { track_slug: "jamf-100", percent: 40 },
  { track_slug: "apple-enterprise-expert", percent: 25 },
];

const DEMO_BADGES = ["first-quiz", "first-lab", "badge-abm"];

const DEMO_LABS = [
  "abm-intune",
  "ade-iphone",
  "ade-macos",
  "apns",
  "apps-books",
  "managed-apple-ids",
  "platform-sso",
  "ios-configuration-profile",
];

const DEMO_QUIZ_RESULTS = [
  { quiz_slug: "quiz-abm-certification", score: 88, passed: true },
  { quiz_slug: "quiz-jamf-100", score: 92, passed: true },
  { quiz_slug: "quiz-intune-mac", score: 85, passed: true },
  { quiz_slug: "quiz-module-11-intune-apple", score: 79, passed: true },
  { quiz_slug: "quiz-module-12-jamf-fundamentals", score: 84, passed: true },
  { quiz_slug: "quiz-module-13-smart-groups", score: 90, passed: true },
  { quiz_slug: "quiz-module-14-policies", score: 81, passed: true },
  { quiz_slug: "quiz-module-15-scripts", score: 77, passed: true },
  { quiz_slug: "quiz-module-16-patch", score: 83, passed: true },
  { quiz_slug: "quiz-module-17-protect", score: 86, passed: true },
  { quiz_slug: "quiz-module-18-security", score: 80, passed: true },
  { quiz_slug: "quiz-azure-for-apple-admins", score: 78, passed: true },
  { quiz_slug: "examen-jamf-100-blanc", score: 62, passed: false },
];

async function main() {
  const { data: list, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) throw listError;

  const users = (list.users ?? []) as User[];
  let userId = users.find((u) => u.email?.toLowerCase() === DEMO_USER_EMAIL.toLowerCase())?.id;

  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email: DEMO_USER_EMAIL,
      password: DEMO_USER_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: DEMO_USER_FULL_NAME, role: "student", demo: true },
    });
    if (error || !data.user) throw error ?? new Error("createUser failed");
    userId = data.user.id;
    console.log("✅ Utilisateur démo créé");
  } else {
    await admin.auth.admin.updateUserById(userId, {
      password: DEMO_USER_PASSWORD,
      user_metadata: { full_name: DEMO_USER_FULL_NAME, role: "student", demo: true },
    });
    console.log("✅ Utilisateur démo mis à jour");
  }

  await admin.from("profiles").upsert({
    id: userId,
    full_name: DEMO_USER_FULL_NAME,
    is_admin: false,
    updated_at: new Date().toISOString(),
  });

  await admin.from("track_progress").delete().eq("user_id", userId);
  await admin.from("track_progress").insert(
    DEMO_TRACK_PROGRESS.map((row) => ({ user_id: userId, ...row }))
  );

  await admin.from("user_badges").delete().eq("user_id", userId);
  await admin.from("user_badges").insert(DEMO_BADGES.map((badge_id) => ({ user_id: userId, badge_id })));

  await admin.from("lesson_progress").delete().eq("user_id", userId);
  await admin.from("lesson_progress").insert(
    DEMO_LABS.map((lesson_slug) => ({
      user_id: userId,
      lesson_slug,
      course_slug: "labs",
      score: 100,
      completed_at: new Date().toISOString(),
    }))
  );

  await admin.from("quiz_results").delete().eq("user_id", userId);
  await admin.from("quiz_results").insert(
    DEMO_QUIZ_RESULTS.map((row) => ({
      user_id: userId,
      quiz_slug: row.quiz_slug,
      score: row.score,
      passed: row.passed,
      duration_seconds: 900,
      exam_mode: row.quiz_slug.startsWith("examen-"),
      completed_at: new Date().toISOString(),
    }))
  );

  console.log(`✅ Données démo seedées pour ${DEMO_USER_EMAIL}`);
  console.log(`   Mot de passe : ${DEMO_USER_PASSWORD}`);
}

main().catch((err) => {
  console.error("❌ Seed démo échoué:", err);
  process.exit(1);
});
