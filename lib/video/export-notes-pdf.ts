import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { VideoCourseNotes } from "@/src/lib/video-production";

export async function exportVideoNotesPdf(notes: VideoCourseNotes): Promise<Uint8Array> {
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
      if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
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
    for (const line of wrapText(text, size, f)) {
      ensureSpace(lineHeight);
      page.drawText(line, { x: margin, y, size, font: f, color });
      y -= lineHeight;
    }
  }

  page.drawText("Apple MDM Academy", { x: margin, y, size: 11, font: helveticaBold, color: accent });
  y -= 18;
  page.drawText("NOTES DE COURS VIDÉO", { x: margin, y, size: 8, font: helvetica, color: gray });
  y -= 24;

  drawLine(notes.title, 18, helvetica, ink, true);
  y -= 6;
  drawLine(`Généré le ${dateStr}`, 9, helvetica, gray);
  y -= 16;

  drawLine("Résumé", 13, helvetica, accent, true);
  y -= 4;
  drawLine(notes.summary, 10, helvetica, ink);
  y -= 12;

  if (notes.commands.length > 0) {
    drawLine("Commandes", 13, helvetica, accent, true);
    y -= 4;
    for (const cmd of notes.commands) {
      drawLine(`$ ${cmd}`, 10, helvetica, ink);
    }
    y -= 8;
  }

  if (notes.checklist.length > 0) {
    drawLine("Checklist", 13, helvetica, accent, true);
    y -= 4;
    for (const item of notes.checklist) {
      drawLine(`☐  ${item}`, 10, helvetica, ink);
    }
    y -= 8;
  }

  if (notes.links.length > 0) {
    drawLine("Liens utiles", 13, helvetica, accent, true);
    y -= 4;
    for (const link of notes.links) {
      drawLine(`${link.label} — ${link.href}`, 10, helvetica, ink);
    }
  }

  return pdfDoc.save();
}

export function downloadVideoNotesPdf(notes: VideoCourseNotes): Promise<void> {
  return exportVideoNotesPdf(notes).then((bytes) => {
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${notes.slug}-notes.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
