import { getAuthorizedUser } from "@/app/lib/auth";
import { PackingSummaryReport } from "@/services/reports/packing-summary-report";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getAuthorizedUser();
  if (user instanceof NextResponse) return user;

  const report = new PackingSummaryReport(user.id, "Packing Summary Report");
  await report.fetchData();

  return NextResponse.json({
    metadata: report.getMetadata(),
    data: report.getTabularData(),
  });
}
