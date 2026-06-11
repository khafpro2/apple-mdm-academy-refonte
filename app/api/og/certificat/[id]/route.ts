/**
 * OG Image API pour partage certificats (SVG optimisé pour LinkedIn/Twitter)
 * GET /api/og/certificat/[id]
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getQuiz } from "@/lib/data/quizzes";

export const runtime = "edge";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let examTitle = "Certification Apple MDM";
  let score = 0;
  let dateStr = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  try {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase
        .from("quiz_results")
        .select("quiz_slug, score, completed_at")
        .eq("id", id)
        .eq("passed", true)
        .maybeSingle();

      if (data) {
        const quiz = getQuiz(data.quiz_slug);
        examTitle = quiz?.title ?? examTitle;
        score = data.score;
        dateStr = new Date(data.completed_at).toLocaleDateString("fr-FR", {
          month: "long", year: "numeric",
        });
      }
    }
  } catch { /* fallback */ }

  const title = examTitle.length > 35 ? examTitle.slice(0, 32) + "…" : examTitle;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#dbeafe"/>
      <stop offset="100%" stop-color="#ede9fe"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="20" y="20" width="1160" height="590" rx="24" fill="none" stroke="#0071e3" stroke-width="2" stroke-opacity="0.25"/>
  <text x="600" y="185" font-size="90" text-anchor="middle">&#127942;</text>
  <text x="600" y="272" font-family="-apple-system,sans-serif" font-size="18" font-weight="600" fill="#6e6e73" text-anchor="middle" letter-spacing="3">CERTIFICATION OBTENUE</text>
  <text x="600" y="345" font-family="-apple-system,sans-serif" font-size="46" font-weight="800" fill="#1d1d1f" text-anchor="middle">${title}</text>
  <text x="600" y="420" font-family="-apple-system,sans-serif" font-size="72" font-weight="900" fill="#0071e3" text-anchor="middle">${score}%</text>
  <text x="600" y="468" font-family="-apple-system,sans-serif" font-size="18" fill="#86868b" text-anchor="middle">${dateStr}</text>
  <text x="600" y="562" font-family="-apple-system,sans-serif" font-size="24" font-weight="700" fill="#0071e3" text-anchor="middle">Apple MDM Academy</text>
  <text x="600" y="595" font-family="monospace" font-size="11" fill="#86868b" text-anchor="middle">${id.slice(0, 16).toUpperCase()}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
