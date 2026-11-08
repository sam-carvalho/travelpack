// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock("@/app/lib/prisma", () => require("@/test-utils/prisma-mock"));

import prismaMock, { resetPrismaMock } from "@/test-utils/prisma-mock";
import { importPackingList } from "./import-shared-list";
import type { SharedPackingList } from "@/generated/prisma";

const prisma = prismaMock as unknown as Record<
  string,
  Record<string, jest.Mock>
>;

const shared = (items: unknown): SharedPackingList => ({
  id: "shared-1",
  createdAt: new Date(),
  title: "Lisbon",
  name: "Main",
  destination: "Portugal",
  startDate: new Date("2027-03-01"),
  endDate: new Date("2027-03-05"),
  notes: null,
  items: items as SharedPackingList["items"],
});

beforeEach(() => {
  resetPrismaMock();
  prisma.trip.create.mockResolvedValue({ id: "new-trip" });
  prisma.packingList.create.mockResolvedValue({ id: "new-list" });
});

describe("importPackingList", () => {
  it("maps categories by name into the importer's own categories", async () => {
    prisma.category.findFirst.mockImplementation(async ({ where }) =>
      where.name === "Clothing" ? { id: "mine-clothing" } : null,
    );
    prisma.category.create.mockResolvedValue({ id: "mine-gear" });

    await importPackingList(
      "user-b",
      shared([
        // Legacy snapshot: full item row with the sharer's category id.
        {
          name: "Socks",
          quantity: 4,
          categoryId: "sharer-cat",
          category: { id: "sharer-cat", name: "Clothing" },
        },
        // Current snapshot shape.
        { name: "Tent", quantity: 1, categoryName: "Gear" },
        { name: "Map", quantity: 1, categoryName: null },
      ]),
    );

    expect(prisma.trip.create.mock.calls[0][0].data.userId).toBe("user-b");
    expect(prisma.category.create.mock.calls[0][0].data).toEqual({
      name: "Gear",
      userId: "user-b",
    });
    const items = prisma.item.createMany.mock.calls[0][0].data;
    expect(items.map((i: { categoryId: string | null }) => i.categoryId)).toEqual(
      ["mine-clothing", "mine-gear", null],
    );
    expect(JSON.stringify(items)).not.toContain("sharer-cat");
  });

  it("ignores malformed or oversized snapshots", async () => {
    await importPackingList("user-b", shared({ not: "an array" }));
    await importPackingList(
      "user-b",
      shared(Array.from({ length: 501 }, () => ({ name: "x", quantity: 1 }))),
    );
    await importPackingList("user-b", shared([{ name: "", quantity: 1 }]));
    expect(prisma.item.createMany).not.toHaveBeenCalled();
  });
});
