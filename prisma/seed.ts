import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("test1234", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@travelpack.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@travelpack.com",
      password,
    },
  });

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
      },
      {
        name: "Toothbrush",
        category: "Toiletries",
        quantity: 1,
        packed: false,
        packingListId: packingList.id,
      },
      {
        name: "Laptop",
        category: "Electronics",
        quantity: 1,
        packed: true,
        packingListId: packingList.id,
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
