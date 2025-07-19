import prisma from "@/app/lib/prisma";
import { CreateTripInput } from "@/app/lib/types";

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
