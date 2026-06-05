import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getQuiz } from "@/lib/data";
import { siteConfig } from "@/lib/seo/site-config";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service indisponible" }, { status: 503 });
  }

  const { data: result } = await supabase
    .from("quiz_results")
    .select("id, quiz_slug, score, passed, completed_at, exam_mode, user_id")
    .eq("id", id)
    .maybeSingle();

  if (!result || !result.passed) {
    return NextResponse.json({ valid: false, error: "Certificat introuvable ou non validé" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", result.user_id)
    .maybeSingle();

  const quiz = getQuiz(result.quiz_slug);

  return NextResponse.json({
    valid: true,
    resultId: result.id,
    examTitle: quiz?.title ?? result.quiz_slug,
    score: result.score,
    completedAt: result.completed_at,
    holderName: profile?.full_name ?? "Apprenant certifié",
    verifyUrl: `${siteConfig.url}/certificat/verify?id=${result.id}`,
    examMode: result.exam_mode,
  });
}
