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
}
