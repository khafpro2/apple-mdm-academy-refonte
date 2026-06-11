"use client";

import dynamic from "next/dynamic";

interface SimpleQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const RevisionSession = dynamic(
  () => import("@/components/revision/revision-session").then((m) => ({ default: m.RevisionSession })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    ),
  }
);

interface Props {
  questions: SimpleQuestion[];
  quizSlug: string;
}

export function RevisionSessionWrapper({ questions, quizSlug }: Props) {
  return <RevisionSession questions={questions as import("@/lib/types").Question[]} quizSlug={quizSlug} />;
}
