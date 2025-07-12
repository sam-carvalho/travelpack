import prisma from "@/app/lib/prisma";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { format } from "date-fns";

export class ReportService {
  async generateReportData(userId: string) {
    const items = await prisma.item.findMany({
      where: {
        packingList: {
          trip: { userId },
        },
      },
      select: {
        name: true,
        category: true,
        quantity: true,
        packed: true,
        packingList: {
          select: {
            trip: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const summary = items.reduce((acc, item) => {
      const key = `${item.name}-${item.category}`;
      acc[key] = acc[key] || {
        name: item.name,
        category: item.category,
        total: 0,
        usedIn: new Set<string>(),
      };

      acc[key].total += item.quantity;
      acc[key].usedIn.add(item.packingList.trip.name);
      return acc;
    }, {} as Record<string, { name: string; category: string; total: number; usedIn: Set<string> }>);

    return Object.values(summary).map((s) => ({
      name: s.name,
      category: s.category,
      total: s.total,
      usedIn: [...s.usedIn],
    }));
  }

  async exportReportToPDF(userId: string) {
    const data = await this.generateReportData(userId);
    const pdf = await PDFDocument.create();
    const page = pdf.addPage();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();

    let y = height - 40;
    const title = `Packing Report - ${format(new Date(), "yyyy-MM-dd HH:mm")}`;
    page.drawText(title, {
      x: 50,
      y,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });

    y -= 40;
    page.drawText("Name        | Category      | Total Used | Trips", {
      x: 50,
      y,
      size: 12,
      font,
    });

    y -= 20;
    data.forEach((item) => {
      const trips = item.usedIn.join(", ");
      page.drawText(
        `${item.name.padEnd(12)} | ${item.category.padEnd(13)} | ${item.total
          .toString()
          .padEnd(11)} | ${trips}`,
        {
          x: 50,
          y,
          size: 10,
          font,
        }
      );
      y -= 15;
    });

    const pdfBytes = await pdf.save();
    return pdfBytes;
  }
}
