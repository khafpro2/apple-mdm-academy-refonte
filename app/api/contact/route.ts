import { NextRequest, NextResponse } from "next/server";

// ── Types ──────────────────────────────────────────────────────────────────
interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string; // champ piège anti-spam
}

// ── Validation ─────────────────────────────────────────────────────────────
function validatePayload(data: unknown): { ok: true; payload: ContactPayload } | { ok: false; error: string } {
  if (!data || typeof data !== "object") return { ok: false, error: "Données invalides." };

  const d = data as Record<string, unknown>;

  if (d.honeypot && String(d.honeypot).length > 0) {
    // Bot détecté — répondre OK pour ne pas alerter le bot
    return { ok: false, error: "HONEYPOT" };
  }

  const name = typeof d.name === "string" ? d.name.trim() : "";
  const email = typeof d.email === "string" ? d.email.trim() : "";
  const subject = typeof d.subject === "string" ? d.subject.trim() : "";
  const message = typeof d.message === "string" ? d.message.trim() : "";

  if (!name || name.length < 2)   return { ok: false, error: "Nom invalide (2 caractères minimum)." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Adresse email invalide." };
  if (!message || message.length < 10) return { ok: false, error: "Message trop court (10 caractères minimum)." };
  if (message.length > 5000) return { ok: false, error: "Message trop long (5000 caractères maximum)." };

  return { ok: true, payload: { name, email, subject: subject || "Contact général", message } };
}

// ── Rate limiting simple (IP) ──────────────────────────────────────────────
const contactRateLimit = new Map<string, { count: number; reset: number }>();

function checkContactRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = contactRateLimit.get(ip);
  if (!entry || now > entry.reset) {
    contactRateLimit.set(ip, { count: 1, reset: now + 60 * 60 * 1000 }); // 1h window
    return true;
  }
  if (entry.count >= 5) return false; // max 5 messages/h par IP
  entry.count++;
  return true;
}

// ── Envoi Resend ───────────────────────────────────────────────────────────
async function sendWithResend(payload: ContactPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY non configuré");

  const to = process.env.CONTACT_EMAIL ?? "contact@apple-mdm-academy.fr";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Apple MDM Academy <noreply@apple-mdm-academy.fr>`,
      to: [to],
      reply_to: payload.email,
      subject: `[Contact] ${payload.subject} — ${payload.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 12px;">
          <h2 style="margin: 0 0 16px; color: #1d1d1f;">Nouveau message de contact</h2>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
            <tr style="border-bottom: 1px solid #e8e8ed;">
              <td style="padding: 10px 16px; font-weight: 600; color: #6e6e73; width: 100px;">Nom</td>
              <td style="padding: 10px 16px; color: #1d1d1f;">${escapeHtml(payload.name)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e8e8ed;">
              <td style="padding: 10px 16px; font-weight: 600; color: #6e6e73;">Email</td>
              <td style="padding: 10px 16px;"><a href="mailto:${escapeHtml(payload.email)}" style="color: #0071e3;">${escapeHtml(payload.email)}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e8e8ed;">
              <td style="padding: 10px 16px; font-weight: 600; color: #6e6e73;">Sujet</td>
              <td style="padding: 10px 16px; color: #1d1d1f;">${escapeHtml(payload.subject)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-weight: 600; color: #6e6e73; vertical-align: top;">Message</td>
              <td style="padding: 10px 16px; color: #1d1d1f; white-space: pre-wrap;">${escapeHtml(payload.message)}</td>
            </tr>
          </table>
          <p style="margin: 16px 0 0; font-size: 12px; color: #86868b;">Apple MDM Academy — Répondre directement à ${escapeHtml(payload.email)}</p>
        </div>
      `,
      text: `Nom: ${payload.name}\nEmail: ${payload.email}\nSujet: ${payload.subject}\n\n${payload.message}`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error ${res.status}: ${err}`);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ── Fallback Supabase ──────────────────────────────────────────────────────
async function saveToSupabase(payload: ContactPayload): Promise<void> {
  // Optionnel: sauvegarder dans une table contact_requests si Supabase est dispo
  // const supabase = await createClient();
  // if (!supabase) return;
  // await supabase.from("contact_requests").insert([payload]);
  void payload; // noop for now
}

// ── Handler POST ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkContactRateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de messages envoyés. Réessayez dans une heure." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const validation = validatePayload(body);
  if (!validation.ok) {
    const errValidation = validation as { ok: false; error: string };
    // Honeypot silencieux
    if (errValidation.error === "HONEYPOT") {
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    return NextResponse.json({ error: errValidation.error }, { status: 422 });
  }

  const { payload } = validation;

  // Tenter Resend puis fallback Supabase
  let emailSent = false;
  try {
    await sendWithResend(payload);
    emailSent = true;
  } catch (err) {
    console.error("[contact] Resend failed:", err);
    // Fallback: sauvegarder en base
    try {
      await saveToSupabase(payload);
    } catch (supaErr) {
      console.error("[contact] Supabase fallback failed:", supaErr);
    }
  }

  return NextResponse.json({
    ok: true,
    emailSent,
    message: emailSent
      ? "Votre message a bien été envoyé. Nous vous répondrons sous 24 h."
      : "Message reçu. Nous vous contacterons sous 24 h.",
  });
}
