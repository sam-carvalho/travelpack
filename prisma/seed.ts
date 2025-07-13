import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("test1234!", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@travelpack.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@travelpack.com",
      password,
    },
  });

  // Create default categories
  const defaultCategories = ["Clothing", "Toiletries", "Electronics"];
  const categories = await prisma.category.createMany({
    data: defaultCategories.map((name) => ({ name, userId: user.id })),
    skipDuplicates: true,
  });

  const categoryRecords = await prisma.category.findMany({
    where: { userId: user.id },
  });
  const categoryMap = Object.fromEntries(
    categoryRecords.map((c) => [c.name, c.id])
  );

  const trip = await prisma.trip.create({
    data: {
      name: "Japan 2025",
      destination: "Tokyo",
      startDate: new Date("2025-09-15"),
      endDate: new Date("2025-09-25"),
      notes: "Bring power adapter!",
      userId: user.id,
    },
  });

  const packingList = await prisma.packingList.create({
    data: {
      name: "Main Suitcase",
      tripId: trip.id,
      isTemplate: false,
    },
  });

  await prisma.item.createMany({
    data: [
      {
        name: "T-Shirts",
        category: "Clothing",
        quantity: 5,
        packed: false,
        packingListId: packingList.id,
        categoryId: categoryMap["Clothing"],
      },
      {
        name: "Toothbrush",
        category: "Toiletries",
        quantity: 1,
        packed: false,
        packingListId: packingList.id,
        categoryId: categoryMap["Toiletries"],
      },
      {
        name: "Laptop",
        category: "Electronics",
        quantity: 1,
        packed: true,
        packingListId: packingList.id,
        categoryId: categoryMap["Electronics"],
      },
    ],
  });

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
