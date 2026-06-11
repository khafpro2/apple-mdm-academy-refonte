/**
 * Service d'envoi email centralisé via Resend
 * Usage: await sendEmail({ to: "user@co.fr", ...welcomeEmail("Jean") })
 */

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  from?: string;
}

const FROM_DEFAULT = "Apple MDM Academy <noreply@apple-mdm-academy.fr>";

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY manquant");
    return { ok: false };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: payload.from ?? FROM_DEFAULT,
        to: Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[email] Resend error ${res.status}: ${err}`);
      return { ok: false };
    }

    const data = await res.json() as { id: string };
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[email] Erreur réseau:", err);
    return { ok: false };
  }
}
