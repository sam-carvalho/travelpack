import prisma from "@/app/lib/prisma";
import { BaseReport } from "./base-report";

export class PackingHabitsReport extends BaseReport {
  async fetchData(): Promise<void> {
    const items = await prisma.item.findMany({
      where: { packingList: { trip: { userId: this.userId } } },
      include: { packingList: true },
    });

    const itemFrequency = new Map<string, number>();

    for (const item of items) {
      const key = `${item.name} (${item.category ?? "No Category"})`;
      itemFrequency.set(key, (itemFrequency.get(key) ?? 0) + item.quantity);
    }

    this.data = Array.from(itemFrequency.entries()).map(([key, count]) => ({
      label: key,
      count,
    }));
  }
}
