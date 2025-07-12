import { getAuthorizedUser } from "@/app/lib/auth";
import { PackingSummaryReport } from "@/services/reports/packing-summary-report";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const report = new PackingSummaryReport(user.id, "Packing Summary Report");
  await report.fetchData();

  const pdfBytes = await report.exportToPDF();

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="packing-summary-report.pdf"`,
    },
  });
}
