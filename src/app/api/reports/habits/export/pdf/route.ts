import { getAuthorizedUser } from "@/app/lib/auth";
import { PackingHabitsReport } from "@/services/reports/packing-habits-report";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const report = new PackingHabitsReport(user.id, "Packing Habits Report");
  await report.fetchData();

  const pdfBytes = await report.exportToPDF();

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="packing-habits-report.pdf"`,
    },
  });
}
