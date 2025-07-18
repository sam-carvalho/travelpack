import prisma from "@/app/lib/prisma";
import { PackingListItem } from "@/app/lib/types";
import { PackingList, Prisma } from "@/generated/prisma/client";

export class PackingListService {
  async createPackingList(tripId: string, data: Omit<PackingList, "id">) {
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
      include: {
        category: true,
      },
      orderBy: { name: "asc" },
    });

    return {
      ...packingList,
      items,
    };
  }

  async updatePackingList(id: string, data: Partial<PackingList>) {
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

  async exportPackingList({
    title,
    name,
    destination,
    startDate,
    endDate,
    notes,
    items,
  }: {
    title: string;
    name: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    notes?: string;
    items?: PackingListItem[];
  }) {
    const shared = await prisma.sharedPackingList.create({
      data: {
        title,
        name,
        destination,
        startDate,
        endDate,
        notes,
        items: items as unknown as Prisma.InputJsonValue,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
    return `https://${baseUrl}/import?listId=${shared.id}`;
  }

  async getExportedPackingListById(listId: string) {
    return await prisma.sharedPackingList.findUnique({
      where: { id: listId },
    });
  }
}
