const methods = [
  "findFirst",
  "findUnique",
  "findMany",
  "create",
  "createMany",
  "update",
  "updateMany",
  "delete",
  "deleteMany",
  "aggregate",
  "groupBy",
  "count",
] as const;

const models = [
  "user",
  "trip",
  "packingList",
  "item",
  "category",
  "template",
  "sharedPackingList",
] as const;

type Model = Record<(typeof methods)[number], jest.Mock>;

const prisma = Object.fromEntries(
  models.map((m) => [
    m,
    Object.fromEntries(methods.map((fn) => [fn, jest.fn()])),
  ]),
) as Record<(typeof models)[number], Model>;

export function resetPrismaMock() {
  for (const m of models) {
    for (const fn of methods) prisma[m][fn].mockReset();
    prisma[m].findMany.mockResolvedValue([]);
    prisma[m].groupBy.mockResolvedValue([]);
    prisma[m].count.mockResolvedValue(0);
    prisma[m].updateMany.mockResolvedValue({ count: 1 });
    prisma[m].deleteMany.mockResolvedValue({ count: 1 });
  }
}

resetPrismaMock();

export default prisma;
