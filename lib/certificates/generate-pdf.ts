import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import { siteConfig } from "@/lib/seo/site-config";

export type CertificateData = {
  userName: string;
  quizTitle: string;
  score: number;
  completedAt: string;
  moduleLabel?: string;
  resultId?: string;
};

export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const appleGray = rgb(0.45, 0.45, 0.47);
  const ink = rgb(0.08, 0.08, 0.1);
  const accent = rgb(0, 0.44, 0.89);
  const gold = rgb(0.72, 0.58, 0.15);

  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.98, 0.98, 0.99) });

  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: gold,
    borderWidth: 2,
  });

  page.drawRectangle({
    x: 32,
    y: 32,
    width: width - 64,
    height: height - 64,
    borderColor: rgb(0.88, 0.88, 0.9),
    borderWidth: 1,
  });

  const dateStr = new Date(data.completedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  page.drawText("Apple MDM Academy", {
    x: width / 2 - 95,
    y: height - 72,
    size: 13,
    font: helveticaBold,
    color: accent,
  });

  page.drawText("APPLE PREMIUM TRAINING", {
    x: width / 2 - 108,
    y: height - 98,
    size: 10,
    font: helvetica,
    color: appleGray,
  });

  page.drawText("CERTIFICAT DE REUSSITE", {
    x: width / 2 - 132,
    y: height - 140,
    size: 26,
    font: helveticaBold,
    color: ink,
  });

  page.drawText("Ce certificat atteste que", {
    x: width / 2 - 82,
    y: height - 185,
    size: 12,
    font: helvetica,
    color: appleGray,
  });

  const nameWidth = Math.min(data.userName.length * 7, 400);
  page.drawText(data.userName, {
    x: width / 2 - nameWidth / 2,
    y: height - 225,
    size: 28,
    font: helveticaBold,
    color: ink,
  });

  page.drawText("a valide avec succes", {
    x: width / 2 - 72,
    y: height - 265,
    size: 12,
    font: helvetica,
    color: appleGray,
  });

  const moduleTitle = data.moduleLabel ?? data.quizTitle;
  const titleLines = wrapText(moduleTitle, 42);
  titleLines.forEach((line, i) => {
    const lw = line.length * 4.5;
    page.drawText(line, {
      x: width / 2 - lw / 2,
      y: height - 300 - i * 22,
      size: 17,
      font: helveticaBold,
      color: ink,
    });
  });

  const titleOffset = titleLines.length * 22;
  page.drawText(`Score obtenu : ${data.score}%`, {
    x: width / 2 - 65,
    y: height - 320 - titleOffset,
    size: 14,
    font: helveticaBold,
    color: accent,
  });

  if (data.resultId) {
    const verifyUrl = `${siteConfig.url}/certificat/verify?id=${data.resultId}`;
    const qrPng = await QRCode.toBuffer(verifyUrl, { width: 120, margin: 1, type: "png" });
    const qrImage = await pdfDoc.embedPng(qrPng);
    page.drawImage(qrImage, { x: width - 160, y: 48, width: 96, height: 96 });
    page.drawText("Verification QR", {
      x: width - 168,
      y: 42,
      size: 8,
      font: helvetica,
      color: appleGray,
    });
    page.drawText(`ID: ${data.resultId.slice(0, 8)}…`, {
      x: 48,
      y: 52,
      size: 8,
      font: helvetica,
      color: appleGray,
    });
  }

  page.drawText(`Delivre le ${dateStr}`, {
    x: width / 2 - 72,
    y: 72,
    size: 11,
    font: helvetica,
    color: appleGray,
  });

  page.drawText("apple-mdm-academy.fr · Formation certifiante Apple MDM", {
    x: width / 2 - 145,
    y: 52,
    size: 9,
    font: helvetica,
    color: appleGray,
  });

  return pdfDoc.save();
}

function wrapText(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}
