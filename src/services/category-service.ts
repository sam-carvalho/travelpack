import prisma from "@/app/lib/prisma";

export class CategoryService {
  async createCategory(userId: string, name: string) {
    return prisma.category.create({
      data: {
        name,
        userId,
      },
    });
  }

  async getAllCategories(userId: string) {
    return prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  }

  async setDefaultCategories(userId: string) {
    const defaultCategories = ["Clothing", "Electronics", "Toiletries"];

    await prisma.category.createMany({
      data: defaultCategories.map((name) => ({ name, userId })),
      skipDuplicates: true,
    });
  }

  async deleteCategory(userId: string, categoryId: string) {
    return prisma.category.deleteMany({
      where: {
        id: categoryId,
        userId,
      },
    });
  }
}
