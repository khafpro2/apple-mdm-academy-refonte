import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { generateCertificatePdf } from "@/lib/certificates/generate-pdf";
import { evaluateAcitpReadiness } from "@/lib/data/acitp/readiness";

export const runtime = "nodejs";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase non configuré" }, { status: 503 });
  }

  const [lessonRes, examRes] = await Promise.all([
    supabase.from("lesson_progress").select("lesson_slug, course_slug").eq("user_id", user.id),
    supabase
      .from("quiz_results")
      .select("quiz_slug, score")
      .eq("user_id", user.id)
      .eq("quiz_slug", "examen-apple-it-pro")
      .order("score", { ascending: false })
      .limit(1),
  ]);

  const completedLessons = new Set(
    (lessonRes.data ?? [])
      .filter((r) => r.course_slug !== "labs")
      .map((r) => r.lesson_slug as string)
  );
  const completedLabs = new Set(
    (lessonRes.data ?? [])
      .filter((r) => r.course_slug === "labs")
      .map((r) => r.lesson_slug as string)
  );

  const examScore = (examRes.data?.[0]?.score as number) ?? null;
  const readiness = evaluateAcitpReadiness(completedLessons, completedLabs, examScore);

  if (!readiness.eligibleForCertificate) {
    return NextResponse.json(
      {
        error: "Certificat non disponible",
        lessonsPercent: readiness.lessonsPercent,
        labsPercent: readiness.labsPercent,
        examScore: readiness.examScore,
        examPassed: readiness.examPassed,
      },
      { status: 403 }
    );
  }

  const userName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Apprenant";

  const pdfBytes = await generateCertificatePdf({
    userName,
    quizTitle: "Apple IT Professional Ready",
    score: examScore ?? readiness.examPercent,
    completedAt: new Date().toISOString(),
    moduleLabel: "Apple MDM Academy — Préparation Apple Certified IT Professional",
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="apple-it-professional-ready.pdf"',
      "Cache-Control": "private, no-cache",
    },
  });
}
