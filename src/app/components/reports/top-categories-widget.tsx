"use client";

import { PackingReportWidget } from "@/app/components/reports/packing-report-widget";
import { generateTopCategoriesReport } from "@/app/reports/actions";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#0ea5e9", "#f97316", "#ec4899"];

export function TopCategoriesWidget({
  topCategories,
  userId,
}: {
  topCategories: { name: string; count: number }[];
  userId: string;
}) {
  const handleDownload = async () => {
    const blob = await generateTopCategoriesReport(userId);

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "top-categories-report.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PackingReportWidget
      title="Top Categories"
      description="Last 90 Days"
      chart={
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={topCategories}
              innerRadius={50}
              outerRadius={70}
              dataKey="count"
              paddingAngle={2}
            >
              {topCategories.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      }
      legend={
        <>
          {topCategories.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              {d.name}
            </div>
          ))}
        </>
      }
      onDownload={handleDownload}
    />
  );
}
