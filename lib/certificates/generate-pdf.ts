import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export type CertificateData = {
  userName: string;
  quizTitle: string;
  score: number;
  completedAt: string;
};

export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const accent = rgb(0, 0.44, 0.89);
  const ink = rgb(0.11, 0.11, 0.12);
  const muted = rgb(0.43, 0.43, 0.45);

  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: accent,
    borderWidth: 2,
  });

  page.drawRectangle({
    x: 40,
    y: 40,
    width: width - 80,
    height: height - 80,
    borderColor: rgb(0.9, 0.9, 0.92),
    borderWidth: 1,
  });

  const dateStr = new Date(data.completedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  page.drawText("Apple MDM Academy", {
    x: width / 2 - 95,
    y: height - 90,
    size: 14,
    font: helveticaBold,
    color: accent,
  });

  page.drawText("CERTIFICAT DE REUSSITE", {
    x: width / 2 - 130,
    y: height - 130,
    size: 24,
    font: helveticaBold,
    color: ink,
  });

  page.drawText("Ce certificat atteste que", {
    x: width / 2 - 80,
    y: height - 190,
    size: 12,
    font: helvetica,
    color: muted,
  });

  page.drawText(data.userName, {
    x: width / 2 - data.userName.length * 5,
    y: height - 230,
    size: 28,
    font: helveticaBold,
    color: ink,
  });

  page.drawText("a reussi avec succes", {
    x: width / 2 - 70,
    y: height - 280,
    size: 12,
    font: helvetica,
    color: muted,
  });

  const titleLines = wrapText(data.quizTitle, 40);
  titleLines.forEach((line, i) => {
    page.drawText(line, {
      x: width / 2 - line.length * 4.5,
      y: height - 320 - i * 22,
      size: 18,
      font: helveticaBold,
      color: ink,
    });
  });

  const titleOffset = titleLines.length * 22;
  page.drawText(`Score obtenu : ${data.score}%`, {
    x: width / 2 - 60,
    y: height - 340 - titleOffset,
    size: 14,
    font: helvetica,
    color: accent,
  });

  page.drawText(`Delivre le ${dateStr}`, {
    x: width / 2 - 70,
    y: 80,
    size: 11,
    font: helvetica,
    color: muted,
  });

  page.drawText("apple-mdm-academy.fr", {
    x: width / 2 - 65,
    y: 55,
    size: 10,
    font: helvetica,
    color: muted,
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
