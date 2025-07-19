import prisma from "@/app/lib/prisma";
import { ItemService } from "./item-service";
import { PackingListItem } from "@/app/lib/types";

export class TemplateService {
  async createTemplate(
    userId: string,
    packingListId: string,
    packingListName: string,
  ) {
    const service = new ItemService();
    const items = await service.getItemsByPackingList(packingListId);

    return prisma.template.create({
      data: {
        name: packingListName,
        userId,
        items: {
          create: items.map((item: PackingListItem) => ({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            categoryId: item.categoryId,
          })),
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

  async getTemplateById(templateId: string, userId: string) {
    return prisma.template.findFirst({
      where: { id: templateId, userId },
      include: { items: true },
    });
  }

  async deleteTemplate(templateId: string, userId: string) {
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
