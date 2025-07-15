import prisma from "@/app/lib/prisma";

export class PackingListService {
  async createPackingList(tripId: string, data: any) {
    return prisma.packingList.create({
      data: {
        ...data,
        tripId,
      },
    });
  }

  async getPackingListsByTrip(tripId: string) {
    return prisma.packingList.findMany({
      where: { tripId },
      include: { items: true },
    });
  }

  async getPackingListById(tripId: string, packingListId: string) {
    const packingList = await prisma.packingList.findFirst({
      where: { tripId, id: packingListId },
    });

    if (!packingList) return null;

    const items = await prisma.item.findMany({
      where: { packingListId },
      orderBy: { name: "asc" },
    });

    return {
      ...packingList,
      items,
    };
  }

  async updatePackingList(id: string, data: any) {
    return prisma.packingList.update({
      where: { id },
      data,
    });
  }

  async deletePackingList(id: string) {
    return prisma.packingList.delete({
      where: { id },
    });
  }
}
