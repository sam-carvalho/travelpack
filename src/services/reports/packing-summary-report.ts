import { BaseReport } from "./base-report";
import prisma from "@/app/lib/prisma";

export class PackingSummaryReport extends BaseReport {
  async fetchData() {
    const items = await prisma.item.findMany({
      where: {
        packingList: {
          trip: { userId: this.userId },
        },
      },
      select: {
        name: true,
        category: true,
        quantity: true,
        packingList: {
          select: {
            trip: {
              select: { name: true },
            },
          },
        },
      },
    });

    const summary = items.reduce(
      (acc, item) => {
        const key = `${item.name}-${item.category}`;
        acc[key] = acc[key] || {
          name: item.name,
          category: item.category || "No Category",
          total: 0,
          usedIn: new Set<string>(),
        };
        acc[key].total += item.quantity;
        acc[key].usedIn.add(item.packingList.trip.name);
        return acc;
      },
      {} as Record<
        string,
        { name: string; category: string; total: number; usedIn: Set<string> }
      >,
    );

    this.data = Object.values(summary).map((s) => ({
      label: `${s.name} (${s.category})`,
      count: s.total,
      context: [...s.usedIn].join(", "),
    }));
  }
}
