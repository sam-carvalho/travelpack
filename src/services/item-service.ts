import prisma from "@/app/lib/prisma";
import { Item } from "@/generated/prisma";

export class ItemService {
  async addItem(packingListId: string, data: Omit<Item, "id">) {
    return prisma.item.create({
      data: {
        ...data,
        packingListId,
      },
    });
  }

  async addManyItems(data: Omit<Item, "id">[]) {
    await prisma.item.createMany({
      data,
    });
  }

  async updateItem(id: string, data: Partial<Item>) {
    return prisma.item.update({
      where: { id },
      data,
    });
  }

  async deleteItem(id: string) {
    return prisma.item.delete({
      where: { id },
    });
  }

  async getItemsByPackingList(packingListId: string) {
    return prisma.item.findMany({
      where: { packingListId },
      include: {
        category: true,
      },
    });
  }

  async getStatsSummary(userId: string) {
    const [totalItemsPacked, mostPackedItem, mostUsedCategory, totalTrips] =
      await Promise.all([
        prisma.item.aggregate({
          _sum: { quantity: true },
          where: {
            packingList: {
              trip: { userId },
            },
          },
        }),

        prisma.item.groupBy({
          by: ["name"],
          where: {
            packingList: {
              trip: { userId },
            },
          },
          _count: { name: true },
          orderBy: { _count: { name: "desc" } },
          take: 1,
        }),

        prisma.item.groupBy({
          by: ["categoryId"],
          where: {
            categoryId: { not: null },
            packingList: {
              trip: { userId },
            },
          },
          _count: { categoryId: true },
          orderBy: { _count: { categoryId: "desc" } },
          take: 1,
        }),

        prisma.trip.count({
          where: { userId },
        }),
      ]);

    const categoryName = mostUsedCategory[0]?.categoryId
      ? await prisma.category.findUnique({
          where: { id: mostUsedCategory[0].categoryId },
        })
      : null;

    return [
      {
        label: "Total Items Packed",
        value: totalItemsPacked._sum.quantity ?? 0,
      },
      {
        label: "Most Packed Item",
        value: mostPackedItem[0]?.name ?? "N/A",
      },
      {
        label: "Most Used Category",
        value: categoryName?.name ?? "No Category",
      },
      { label: "Total Number of Trips", value: totalTrips },
    ];
  }

  async getTopCategories(userId: string) {
    const past90Days = new Date();
    past90Days.setDate(past90Days.getDate() - 90);

    const items = await prisma.item.findMany({
      where: {
        createdAt: { gte: past90Days },
        packingList: { trip: { userId } },
      },
      include: { category: true },
    });

    const counts: Record<string, number> = {};
    for (const item of items) {
      const category = item.category?.name ?? "No Category";
      counts[category] = (counts[category] || 0) + item.quantity;
    }

    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }

  async getMostPackedItems(userId: string) {
    const items = await prisma.item.findMany({
      where: { packingList: { trip: { userId } } },
    });

    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.name] = (counts[item.name] || 0) + item.quantity;
    }

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }
}
