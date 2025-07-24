"use client";

import { PackingReportWidget } from "@/app/components/reports/packing-report-widget";
import { generateMostPackedItemsReport } from "@/app/reports/actions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#0ea5e9", "#f97316", "#ec4899", "#a855f7"];

export function MostPackedItemsWidget({
  mostPackedItems,
  userId,
}: {
  mostPackedItems: { name: string; count: number }[];
  userId: string;
}) {
  const handleDownload = async () => {
    const blob = await generateMostPackedItemsReport(userId);

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "most-packed-items-report.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PackingReportWidget
      title="Most Frequently Packed Items"
      description="Last 90 Days"
      chart={
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={mostPackedItems}
            layout="vertical"
            margin={{ top: 10, right: 20, bottom: 10, left: 50 }}
          >
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Bar dataKey="count" barSize={20}>
              {mostPackedItems.map((entry, index) => (
                <Cell
                  key={`bar-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      }
      legend={null}
      onDownload={handleDownload}
    />
  );
}
