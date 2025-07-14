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
    return prisma.packingList.findFirst({
      where: {
        tripId,
        id: packingListId,
      },
      include: { items: true },
    });
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
