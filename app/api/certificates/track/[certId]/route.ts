import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { generateCertificatePdf } from "@/lib/certificates/generate-pdf";
import { evaluateCertification, getTrackCertificate } from "@/lib/certifications";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ certId: string }> }
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { certId } = await params;
  const cert = getTrackCertificate(certId);
  if (!cert) {
    return NextResponse.json({ error: "Certificat inconnu" }, { status: 404 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase non configuré" }, { status: 503 });
  }

  const [lessonRes, examRes] = await Promise.all([
    supabase
      .from("lesson_progress")
      .select("lesson_slug, course_slug")
      .eq("user_id", user.id),
    supabase
      .from("quiz_results")
      .select("quiz_slug, score, passed")
      .eq("user_id", user.id)
      .eq("passed", true),
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

  const examScores = new Map<string, number>();
  for (const r of examRes.data ?? []) {
    const prev = examScores.get(r.quiz_slug as string) ?? 0;
    examScores.set(r.quiz_slug as string, Math.max(prev, r.score as number));
  }

  const eligibility = evaluateCertification(cert, completedLessons, completedLabs, examScores);

  if (!eligibility.eligible) {
    return NextResponse.json(
      {
        error: "Certificat non disponible",
        lessonsPercent: eligibility.lessonsPercent,
        labsPercent: eligibility.labsPercent,
        examPassed: eligibility.examPassed,
      },
      { status: 403 }
    );
  }

  const userName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Apprenant";

  const score = eligibility.examScore ?? cert.passingScore;

  const pdfBytes = await generateCertificatePdf({
    userName,
    quizTitle: cert.title,
    score,
    completedAt: new Date().toISOString(),
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificat-${certId}.pdf"`,
      "Cache-Control": "private, no-cache",
    },
  });
}
