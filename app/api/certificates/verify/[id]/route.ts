import { NextResponse } from "next/server";
import { lookupPublicCertificate } from "@/lib/certificates/public-lookup";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cert = await lookupPublicCertificate(id);
  if (!cert) {
    return NextResponse.json({ valid: false, error: "Certificat introuvable ou non validé" }, { status: 404 });
  }
  return NextResponse.json(cert);
}
