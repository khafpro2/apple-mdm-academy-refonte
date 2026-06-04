import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { getBestPassedResult } from "@/lib/supabase/admin";
import { getQuiz } from "@/lib/data";
import { generateCertificatePdf } from "@/lib/certificates/generate-pdf";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ quizSlug: string }> }
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { quizSlug } = await params;
  const result = await getBestPassedResult(user.id, quizSlug);

  if (!result) {
    return NextResponse.json(
      { error: "Aucun résultat validé pour ce quiz" },
      { status: 404 }
    );
  }

  const quiz = getQuiz(quizSlug);
  const userName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Apprenant";

  const pdfBytes = await generateCertificatePdf({
    userName,
    quizTitle: quiz?.title ?? quizSlug,
    score: result.score,
    completedAt: result.completed_at,
  });

  const filename = `certificat-${quizSlug}.pdf`;

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-cache",
    },
  });
}
