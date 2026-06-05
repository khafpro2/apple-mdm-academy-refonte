import { NextResponse } from "next/server";
import { tracks, courses, labs, quizzes } from "@/lib/data";
import { commercialCertificationPaths } from "@/lib/data/commercial-certification-paths";

const API_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: API_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: API_HEADERS });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ resource: string[] }> }
) {
  const { resource } = await params;
  const key = resource?.[0];

  switch (key) {
    case "users":
      return json({
        data: [{ id: "demo-user", email: "demo@apple-mdm-academy.com", role: "learner" }],
        meta: { note: "Auth requise en production — données démo" },
      });
    case "courses":
      return json({
        data: courses.map((c) => ({
          slug: c.slug,
          title: c.title,
          track: c.trackSlug,
          lessons: c.modules.reduce((acc, m) => acc + m.lessons.length, 0),
        })),
        meta: { total: courses.length, tracks: tracks.length },
      });
    case "labs":
      return json({
        data: labs.map((l) => ({ slug: l.slug, title: l.title, track: l.trackSlug, duration: l.duration })),
        meta: { total: labs.length },
      });
    case "exams":
      return json({
        data: quizzes
          .filter((q) => q.type === "examen")
          .map((q) => ({ slug: q.slug, title: q.title, questions: q.questions.length, duration: q.duration })),
        meta: { total: quizzes.filter((q) => q.type === "examen").length },
      });
    case "certificates":
      return json({
        data: commercialCertificationPaths.map((p) => ({
          slug: p.slug,
          name: p.certificateName,
          track: p.trackSlug,
        })),
        meta: { note: "Certificats utilisateur via auth" },
      });
    case "progress":
      return json({
        data: tracks.map((t) => ({
          trackSlug: t.slug,
          title: t.title,
          percent: 0,
          lessonsCompleted: 0,
          lessonsTotal: t.lessons,
        })),
        meta: { note: "Progression réelle via Supabase — démo à 0%" },
      });
    default:
      return json({ error: "Not found", available: ["users", "courses", "labs", "exams", "certificates", "progress"] }, 404);
  }
}
