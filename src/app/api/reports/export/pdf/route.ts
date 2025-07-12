import { getAuthorizedUser } from "@/app/lib/auth";
import { ReportService } from "@/services/report-service";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const service = new ReportService();
  const pdfBytes = await service.exportReportToPDF(user.id);

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="packing-report.pdf"`,
    },
  });
}
