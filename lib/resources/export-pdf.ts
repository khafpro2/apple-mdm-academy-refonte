import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { AcademyResource } from "@/src/lib/resources";
import { resourceToPlainText } from "@/src/lib/resources";

export async function exportResourcePdf(resource: AcademyResource): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const ink = rgb(0.08, 0.08, 0.1);
  const gray = rgb(0.45, 0.45, 0.47);
  const accent = rgb(0, 0.44, 0.89);
  const margin = 50;
  const lineHeight = 14;
  const pageWidth = 595;
  const pageHeight = 842;
  const maxWidth = pageWidth - margin * 2;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const dateStr = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function wrapText(text: string, size: number, font: typeof helvetica): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      const width = font.widthOfTextAtSize(test, size);
      if (width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function ensureSpace(needed: number) {
    if (y - needed < margin + 40) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
  }

  function drawLine(text: string, size: number, font: typeof helvetica, color = ink, bold = false) {
    const f = bold ? helveticaBold : font;
    const lines = wrapText(text, size, f);
    for (const line of lines) {
      ensureSpace(lineHeight);
      page.drawText(line, { x: margin, y, size, font: f, color });
      y -= lineHeight;
    }
  }

  // Header
  page.drawText("Apple MDM Academy", { x: margin, y, size: 11, font: helveticaBold, color: accent });
  y -= 18;
  page.drawText("RESSOURCE PROFESSIONNELLE", { x: margin, y, size: 8, font: helvetica, color: gray });
  y -= 24;

  drawLine(resource.title, 18, helvetica, ink, true);
  y -= 6;
  drawLine(`${resource.module} · ${resource.level} · ${resource.badge}`, 10, helvetica, gray);
  y -= 4;
  drawLine(`Généré le ${dateStr}`, 9, helvetica, gray);
  y -= 16;

  drawLine(resource.description, 11, helvetica, ink);
  y -= 12;

  for (const section of resource.sections) {
    ensureSpace(lineHeight * 2);
    drawLine(section.title, 13, helvetica, accent, true);
    y -= 4;
    for (const item of section.items) {
      drawLine(`☐  ${item}`, 10, helvetica, ink);
    }
    y -= 8;
  }

  // Footer on last page
  const footerY = margin - 10;
  page.drawLine({
    start: { x: margin, y: footerY + 20 },
    end: { x: pageWidth - margin, y: footerY + 20 },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.87),
  });
  page.drawText("Apple MDM Academy — Formation Apple, Jamf & Intune", {
    x: margin,
    y: footerY,
    size: 8,
    font: helvetica,
    color: gray,
  });
  page.drawText("apple-mdm-academy.fr", {
    x: pageWidth - margin - 100,
    y: footerY,
    size: 8,
    font: helvetica,
    color: accent,
  });

  return pdfDoc.save();
}

export function downloadResourcePdf(resource: AcademyResource): Promise<void> {
  return exportResourcePdf(resource).then((bytes) => {
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resource.slug}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

export { resourceToPlainText };
