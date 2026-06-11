/**
 * Webhook Supabase → emails automatiques
 * users INSERT → welcome email
 * quiz_results INSERT → recap examen
 */
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send";
import { welcomeEmail, examResultEmail } from "@/lib/email/templates";
import { getQuiz } from "@/lib/data/quizzes";

const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;

function verifySecret(req: NextRequest): boolean {
  if (!WEBHOOK_SECRET) return true;
  return req.headers.get("x-webhook-secret") === WEBHOOK_SECRET;
}

interface Payload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  if (!verifySecret(req)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { type, table, record } = await req.json() as Payload;
  if (type !== "INSERT") return NextResponse.json({ ok: true });

  try {
    // Welcome email
    if (table === "users" || table === "profiles") {
      const email = record["email"] as string;
      if (!email) return NextResponse.json({ ok: true });
      const name = (record["full_name"] as string) ?? email.split("@")[0];
      const firstName = name.split(" ")[0] ?? "Apprenant";
      await sendEmail({ to: email, ...welcomeEmail(firstName) });
      return NextResponse.json({ ok: true, action: "welcome_sent" });
    }

    // Exam result email
    if (table === "quiz_results") {
      const userEmail = record["user_email"] as string | undefined;
      if (!userEmail) return NextResponse.json({ ok: true });

      const quizSlug = record["quiz_slug"] as string;
      const quiz = getQuiz(quizSlug);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

      await sendEmail({
        to: userEmail,
        ...examResultEmail({
          firstName: userEmail.split("@")[0],
          examTitle: quiz?.title ?? quizSlug,
          score: record["score"] as number,
          passed: record["passed"] as boolean,
          correctCount: (record["correct_count"] as number) ?? 0,
          totalCount: (record["total_count"] as number) ?? 0,
          elapsedMinutes: Math.round(((record["elapsed_seconds"] as number) ?? 0) / 60),
          examUrl: `${siteUrl}/examens/${quizSlug}/result?id=${record["id"]}`,
        }),
      });
      return NextResponse.json({ ok: true, action: "exam_recap_sent" });
    }

    return NextResponse.json({ ok: true, action: "no_handler" });
  } catch (err) {
    console.error("[webhook/supabase]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
