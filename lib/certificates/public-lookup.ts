import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getQuiz } from "@/lib/data/quizzes";
import { siteConfig } from "@/lib/seo/site-config";

export type PublicCertificate = {
  valid: true;
  resultId: string;
  examTitle: string;
  score: number;
  completedAt: string;
  holderName: string;
  verifyUrl: string;
  examMode: boolean;
};

export async function lookupPublicCertificate(resultId: string): Promise<PublicCertificate | null> {
  const id = resultId.trim();
  if (!id) return null;

  const supabase = createServiceRoleClient();
  if (!supabase) return null;

  const { data: result } = await supabase
    .from("quiz_results")
    .select("id, quiz_slug, score, passed, completed_at, exam_mode, user_id")
    .eq("id", id)
    .eq("passed", true)
    .maybeSingle();

  if (!result) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", result.user_id)
    .maybeSingle();

  const quiz = getQuiz(result.quiz_slug);

  return {
    valid: true,
    resultId: result.id,
    examTitle: quiz?.title ?? result.quiz_slug,
    score: result.score,
    completedAt: result.completed_at,
    holderName: profile?.full_name?.trim() || "Apprenant certifié",
    verifyUrl: `${siteConfig.url}/certificat/verify?id=${result.id}`,
    examMode: Boolean(result.exam_mode),
  };
}
