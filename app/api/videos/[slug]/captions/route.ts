import { NextResponse } from "next/server";
import { buildWebVttFromTranscript, staticCaptionsFileExists } from "@/lib/video/captions";
import { getVideoTranscript } from "@/src/lib/video-transcripts";
import { readFileSync } from "node:fs";
import path from "node:path";

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const locale = "fr";

  if (staticCaptionsFileExists(process.cwd(), slug, locale)) {
    const filePath = path.join(
      process.cwd(),
      "public",
      "videos",
      "captions",
      `${slug}.${locale}.vtt`
    );
    const body = readFileSync(filePath, "utf8");
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/vtt; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const transcript = getVideoTranscript(slug);
  if (!transcript) {
    return NextResponse.json({ error: "Captions unavailable" }, { status: 404 });
  }

  const body = buildWebVttFromTranscript(transcript, locale);
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/vtt; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
