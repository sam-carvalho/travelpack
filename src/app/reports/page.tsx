import { PackingReportSearchForm } from "@/app/components/reports/search-form";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { PackingReportResult } from "@/app/components/reports/search-results";
import {
  generatePackingReport,
  getMostPackedItemsData,
  getPackingStats,
  getTopCategoriesData,
} from "@/app/reports/actions";
import { StatsHeader } from "../components/reports/stats-header";
import { TopCategoriesWidget } from "../components/reports/top-categories-widget";
import { MostPackedItemsWidget } from "../components/reports/most-packed-items-widget";

export default async function ReportsPage(props: {
  searchParams?: Promise<{
    keyword?: string;
  }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin?callbackUrl=/reports");
  }

  const searchParams = await props.searchParams;
  const keyword = searchParams?.keyword ?? "";

  const reportData = await generatePackingReport(user.id, {
    keyword,
  });

  const [packingStats, topCategories, mostPackedItems] = await Promise.all([
    getPackingStats(user.id),
    getTopCategoriesData(user.id),
    getMostPackedItemsData(user.id),
  ]);

  return (
    <div className="min-h-md mt-16 w-7xl overflow-hidden rounded-xl bg-gradient-to-bl from-neutral-50 via-neutral-50 to-zinc-100 p-12 shadow-lg">
      <StatsHeader stats={packingStats} />
      <PackingReportSearchForm />
      {keyword && <PackingReportResult data={reportData} />}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="w-full lg:w-1/2">
          <TopCategoriesWidget userId={user.id} topCategories={topCategories} />
        </div>
        <div className="w-full lg:w-1/2">
          <MostPackedItemsWidget
            userId={user.id}
            mostPackedItems={mostPackedItems}
          />
        </div>
      </div>
    </div>
  );
}
