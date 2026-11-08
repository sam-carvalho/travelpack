import prisma from "@/app/lib/prisma";

// `.travelpack` schema v1, shared with the iOS app.
export interface TravelPackExportV1 {
  format: "travelpack";
  schemaVersion: 1;
  exportedAt: string;
  source: "web";
  categories: { id: string; name: string }[];
  trips: {
    id: string;
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    notes: string | null;
    packingLists: {
      id: string;
      name: string;
      items: {
        id: string;
        name: string;
        quantity: number;
        packed: boolean;
        categoryId: string | null;
        createdAt: string;
      }[];
    }[];
  }[];
  templates: {
    id: string;
    name: string;
    createdAt: string;
    items: {
      id: string;
      name: string;
      quantity: number;
      categoryId: string | null;
    }[];
  }[];
}

interface ExportSource {
  categories: { id: string; name: string }[];
  trips: {
    id: string;
    name: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    notes: string | null;
    packingLists: {
      id: string;
      name: string;
      items: {
        id: string;
        name: string;
        quantity: number;
        packed: boolean;
        categoryId: string | null;
        createdAt: Date;
      }[];
    }[];
  }[];
  templates: {
    id: string;
    name: string;
    createdAt: Date;
    items: {
      id: string;
      name: string;
      quantity: number;
      categoryId: string | null;
    }[];
  }[];
}

export function toExportDocument(
  source: ExportSource,
  now: Date = new Date(),
): TravelPackExportV1 {
  const ownCategoryIds = new Set(source.categories.map((c) => c.id));
  const categoryRef = (id: string | null) =>
    id && ownCategoryIds.has(id) ? id : null;

  return {
    format: "travelpack",
    schemaVersion: 1,
    exportedAt: now.toISOString(),
    source: "web",
    categories: source.categories.map(({ id, name }) => ({ id, name })),
    trips: source.trips.map((trip) => ({
      id: trip.id,
      name: trip.name,
      destination: trip.destination,
      startDate: trip.startDate.toISOString(),
      endDate: trip.endDate.toISOString(),
      notes: trip.notes,
      packingLists: trip.packingLists.map((list) => ({
        id: list.id,
        name: list.name,
        items: list.items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          packed: item.packed,
          categoryId: categoryRef(item.categoryId),
          createdAt: item.createdAt.toISOString(),
        })),
      })),
    })),
    templates: source.templates.map((template) => ({
      id: template.id,
      name: template.name,
      createdAt: template.createdAt.toISOString(),
      items: template.items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        categoryId: categoryRef(item.categoryId),
      })),
    })),
  };
}

export class ExportService {
  async exportUserData(userId: string): Promise<TravelPackExportV1> {
    const [categories, trips, templates] = await Promise.all([
      prisma.category.findMany({
        where: { userId },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.trip.findMany({
        where: { userId },
        orderBy: { startDate: "asc" },
        select: {
          id: true,
          name: true,
          destination: true,
          startDate: true,
          endDate: true,
          notes: true,
          packingLists: {
            select: {
              id: true,
              name: true,
              items: {
                select: {
                  id: true,
                  name: true,
                  quantity: true,
                  packed: true,
                  categoryId: true,
                  createdAt: true,
                },
                orderBy: { createdAt: "asc" },
              },
            },
          },
        },
      }),
      prisma.template.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          createdAt: true,
          items: {
            select: { id: true, name: true, quantity: true, categoryId: true },
          },
        },
      }),
    ]);

    return toExportDocument({ categories, trips, templates });
  }
}
