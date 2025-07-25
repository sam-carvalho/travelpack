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

  async getCategoryByName(userId: string, name: string) {
    return prisma.category.findFirst({
      where: { name, userId },
    });
  }

  async getAllCategories(userId: string) {
    return prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  }

  async setDefaultCategories(userId: string) {
    const defaultCategories = [
      "Clothing",
      "Electronics",
      "Toiletries",
      "Travel Documents",
    ];

    try {
      await prisma.category.createMany({
        data: defaultCategories.map((name) => ({ name, userId })),
      });
    } catch (error) {
      console.error("Failed to create default categories:", error);
      throw new Error("Unable to create default categories.");
    }
  }

  async updateCategory(userId: string, categoryId: string, newName: string) {
    return prisma.category.updateMany({
      where: { id: categoryId, userId },
      data: { name: newName },
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
