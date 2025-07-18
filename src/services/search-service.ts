import prisma from "@/app/lib/prisma";

export class SearchService {
  // Search packing lists by trip name, list name or keyword
  async searchPackingLists(userId: string, query: string) {
    return prisma.packingList.findMany({
      where: {
        trip: {
          userId,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { destination: { contains: query, mode: "insensitive" } },
          ],
        },
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          {
            items: { some: { name: { contains: query, mode: "insensitive" } } },
          },
        ],
      },
      include: {
        trip: true,
        items: true,
      },
    });
  }

  // Search items by category or keyword
  async searchItems(userId: string, query: string) {
    return prisma.item.findMany({
      where: {
        packingList: {
          trip: { userId },
        },
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          //{ category: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        packingList: { include: { trip: true } },
      },
    });
  }

  // Search reports by trip name, list name or category
  async searchReports(userId: string, query: string) {
    return prisma.item.findMany({
      where: {
        packingList: {
          trip: {
            userId,
            destination: {
              contains: query,
              mode: "insensitive",
            },
          },
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        OR: [
          //{ category: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        packingList: {
          include: {
            trip: true,
          },
        },
      },
    });
  }
}
