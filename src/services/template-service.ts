import prisma from "@/app/lib/prisma";
import { ItemService } from "./item-service";
import { Item } from "@/generated/prisma";

export class TemplateService {
  async createTemplate(
    userId: string,
    packingListId: string,
    packingListName: string,
  ) {
    const service = new ItemService();
    const items = await service.getItemsByPackingList(packingListId);

    const itemsData = (items as Item[]).map((item) => ({
      name: item.name,
      quantity: item.quantity,
      categoryId: item.categoryId ?? null,
    }));

    return prisma.template.create({
      data: {
        name: packingListName,
        userId,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: {
          include: { category: true },
        },
      },
    });
  }

  async getTemplatesByUser(userId: string) {
    return prisma.template.findMany({
      where: { userId },
      include: { items: true },
    });
  }

  async getTemplateById(userId: string, templateId: string) {
    return prisma.template.findFirst({
      where: { id: templateId, userId },
      include: { items: true },
    });
  }

  async deleteTemplate(userId: string, templateId: string) {
    return prisma.template.deleteMany({
      where: { id: templateId, userId },
    });
  }

  // Applies a template to a trip by creating a new packing list
  // with items from the template
  async applyTemplateToTrip(templateId: string, tripId: string) {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { items: true },
    });

    if (!template) throw new Error("Template not found");

    return prisma.packingList.create({
      data: {
        name: `From template: ${template.name}`,
        tripId,
        items: {
          create: template.items.map((item) => ({
            name: item.name,
            category: item.categoryId,
            quantity: item.quantity,
          })),
        },
      },
    });
  }
}
