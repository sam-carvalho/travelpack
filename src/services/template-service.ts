import prisma from "@/app/lib/prisma";

export class TemplateService {
  async createTemplate(userId: string, data: any) {
    return prisma.template.create({
      data: {
        name: data.name,
        userId,
        items: {
          create: data.items.map((item: any) => ({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
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
            category: item.category ?? "No Category",
            quantity: item.quantity,
          })),
        },
      },
    });
  }
}
