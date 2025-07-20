import prisma from "@/app/lib/prisma";
import { CreateTripInput, SearchFilters } from "@/app/lib/types";
import { SearchFiltersSchema } from "@/app/lib/validation/search-filters";

export class TripService {
  async createTrip(userId: string, input: CreateTripInput) {
    return prisma.trip.create({
      data: {
        ...input,
        userId,
      },
    });
  }

  async getTripsByUser(userId: string) {
    return prisma.trip.findMany({
      where: { userId },
      orderBy: { startDate: "asc" },
      include: {
        packingLists: {
          include: {
            items: true,
          },
        },
      },
    });
  }

  async getFilteredTripsByUser(userId: string, filtersRaw: SearchFilters) {
    const parsed = SearchFiltersSchema.safeParse(filtersRaw);
    if (!parsed.success) {
      throw new Error("Invalid search filters");
    }

    const filters = parsed.data;

    const where: any = { userId };

    if (filters.start) {
      where.startDate = { gte: filters.start };
    }

    if (filters.end) {
      where.endDate = {
        ...(where.endDate || {}),
        lte: filters.end,
      };
    }

    if (filters.keyword) {
      where.OR = [
        { name: { contains: filters.keyword, mode: "insensitive" } },
        { destination: { contains: filters.keyword, mode: "insensitive" } },
        {
          packingLists: {
            some: {
              items: {
                some: {
                  name: {
                    contains: filters.keyword,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        },
      ];
    }

    return prisma.trip.findMany({
      where,
      include: {
        packingLists: {
          include: {
            items: filters.keyword
              ? {
                  where: {
                    name: {
                      contains: filters.keyword,
                      mode: "insensitive",
                    },
                  },
                }
              : true,
          },
        },
      },
    });
  }

  async getTripById(userId: string, tripId: string) {
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId,
      },
      include: {
        packingLists: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!trip || trip.userId !== userId) {
      throw new Error("Trip not found or access denied.");
    }

    return trip;
  }

  async updateTrip(
    userId: string,
    tripId: string,
    updates: Partial<CreateTripInput>,
  ) {
    return prisma.trip.updateMany({
      where: {
        id: tripId,
        userId,
      },
      data: updates,
    });
  }

  async deleteTrip(userId: string, tripId: string) {
    return prisma.trip.deleteMany({
      where: {
        id: tripId,
        userId,
      },
    });
  }
}
