"use server";

import { TripService } from "@/services/trip-service";
import { revalidatePath } from "next/cache";

export async function deleteTripAction(userId: string, tripId: string) {
  const service = new TripService();
  await service.deleteTrip(userId, tripId);

  revalidatePath("/trips");
}
