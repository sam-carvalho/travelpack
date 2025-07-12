import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { format } from "date-fns";
import { ReportRecord } from "@/app/lib/types";

export class PDFExporter {
  constructor(
    private title: string,
    private timestamp: Date,
    private data: ReportRecord[]
  ) {}

  // Generates a PDF document with the provided title, timestamp, and data
  async generate(): Promise<Buffer> {
    const pdf = await PDFDocument.create();
    let page = pdf.addPage();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();

    let y = height - 40;

    page.drawText(
      `${this.title} - ${format(this.timestamp, "yyyy-MM-dd HH:mm")}`,
      {
        x: 50,
        y,
        size: 18,
        font,
        color: rgb(0, 0, 0),
      }
    );

    y -= 40;
    page.drawText("Label                  | Count | Context", {
      x: 50,
      y,
      size: 12,
      font,
    });

    y -= 20;

    for (const row of this.data) {
      const context = row.context ?? "-";
      const text = `${row.label.padEnd(22)} | ${row.count
        .toString()
        .padEnd(5)} | ${context}`;
      page.drawText(text, {
        x: 50,
        y,
        size: 10,
        font,
      });
      y -= 15;

      if (y < 50) {
        // Add a new page if we're at the bottom
        page = pdf.addPage();
        y = height - 40;
      }
    }

    const pdfBytes = await pdf.save();
    return Buffer.from(pdfBytes);
  }
}
