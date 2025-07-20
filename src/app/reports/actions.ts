"use server";

import { PackingActivityReport } from "@/app/lib/reports/packing-activity-report";
import { ItemService } from "@/services/item-service";
import { renderToBuffer } from "@react-pdf/renderer";
import { TopCategoriesReportPDF } from "@/app/components/reports/top-category-pdf";
import { MostPackedItemsReportPDF } from "../components/reports/most-packed-items-pdf";

export async function generatePackingReport(
  userId: string,
  formData: {
    keyword: string;
  },
) {
  const report = new PackingActivityReport();
  return await report.generate(userId, formData);
}

export async function getPackingStats(userId: string) {
  const service = new ItemService();
  return await service.getStatsSummary(userId);
}

export async function getTopCategoriesData(userId: string) {
  const service = new ItemService();
  return service.getTopCategories(userId);
}

export async function getMostPackedItemsData(userId: string) {
  const service = new ItemService();
  return service.getMostPackedItems(userId);
}

export async function generateTopCategoriesReport(userId: string) {
  const data = await getTopCategoriesData(userId);
  const document = TopCategoriesReportPDF({ data });
  const pdfBuffer = await renderToBuffer(document);

  return new Blob([pdfBuffer], { type: "application/pdf" });
}

export async function generateMostPackedItemsReport(userId: string) {
  const data = await getMostPackedItemsData(userId);
  const document = MostPackedItemsReportPDF({ data });
  const pdfBuffer = await renderToBuffer(document);

  return new Blob([pdfBuffer], { type: "application/pdf" });
}
