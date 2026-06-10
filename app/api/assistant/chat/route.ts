import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `Tu es Apple MDM Assistant, l'assistant pédagogique d'Apple MDM Academy.
Tu aides les administrateurs IT à apprendre et comprendre :
- Apple MDM (configuration profiles, ADE, ABM, APNs, Managed Apple IDs)
- Jamf Pro (Smart Groups, policies, packages, Self Service, Protect, Jamf 100/200)
- Microsoft Intune pour Apple (compliance, configuration profiles, Platform SSO)
- Sécurité Apple (FileVault, Gatekeeper, XProtect, SIP, Activation Lock)
- Certifications : Apple Certified IT Professional, Jamf 100/200, Intune Apple

Réponds en français, de manière concise et pédagogique.
Pour les questions techniques, donne des étapes claires numérotées.
Pour les concepts, explique le "pourquoi" avant le "comment".
Si la question ne concerne pas Apple MDM/IT, indique poliment que tu es spécialisé MDM Apple.
Longueur cible : 2-5 paragraphes ou une liste courte. Sois précis et utile.`;

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const { messages } = body;

  if (!messages?.length) {
    return Response.json({ error: "Messages requis" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      return Response.json({
        reply: "Je rencontre une difficulté technique. Consultez la documentation ou réessayez.",
      });
    }

    const data = await response.json() as {
      content: { type: string; text: string }[];
    };
    const reply = data.content.find((c) => c.type === "text")?.text ?? "";
    return Response.json({ reply });

  } catch {
    return Response.json({
      reply: "Service temporairement indisponible. Réessayez dans quelques instants.",
    });
  }
}
