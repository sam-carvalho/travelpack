"use server";

import { PackingActivityReport } from "@/app/lib/reports/packing-activity-report";
import { ItemService } from "@/services/item-service";
import { renderToBuffer } from "@react-pdf/renderer";
import { TopCategoriesReportPDF } from "@/app/components/reports/top-category-pdf";
import { MostPackedItemsReportPDF } from "../components/reports/most-packed-items-pdf";
import { requireUser } from "@/app/lib/authz";

// Every report is scoped to the signed-in user; callers cannot pass a user id.

export async function generatePackingReport(formData: { keyword: string }) {
  const user = await requireUser();
  const report = new PackingActivityReport();
  return await report.generate(user.id, formData);
}

export async function getPackingStats() {
  const user = await requireUser();
  const service = new ItemService();
  return await service.getStatsSummary(user.id);
}

export async function getTopCategoriesData() {
  const user = await requireUser();
  const service = new ItemService();
  return service.getTopCategories(user.id);
}

export async function getMostPackedItemsData() {
  const user = await requireUser();
  const service = new ItemService();
  return service.getMostPackedItems(user.id);
}

export async function generateTopCategoriesReport() {
  const data = await getTopCategoriesData();
  const document = TopCategoriesReportPDF({ data });
  const pdfBuffer = await renderToBuffer(document);

  return new Blob([pdfBuffer], { type: "application/pdf" });
}

export async function generateMostPackedItemsReport() {
  const data = await getMostPackedItemsData();
  const document = MostPackedItemsReportPDF({ data });
  const pdfBuffer = await renderToBuffer(document);

  return new Blob([pdfBuffer], { type: "application/pdf" });
}
