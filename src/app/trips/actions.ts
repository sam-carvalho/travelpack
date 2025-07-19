"use server";

import { TripService } from "@/services/trip-service";
import { revalidatePath } from "next/cache";
import { CreateTripInput } from "@/app/lib/types";
import { redirect } from "next/navigation";

export async function createTripAction(userId: string, input: CreateTripInput) {
  const rawFormData = {
    name: input.name,
    destination: input.destination,
    startDate: new Date(input.startDate),
    endDate: new Date(input.endDate),
    notes: input.notes || null,
  };
  const service = new TripService();
  await service.createTrip(userId, rawFormData as CreateTripInput);

  revalidatePath("/trips");
  redirect("/trips");
}

export async function updateTripAction(
  userId: string,
  tripId: string,
  updates: Partial<CreateTripInput>,
) {
  const rawUpdates = {
    name: updates.name,
    destination: updates.destination,
    startDate: updates.startDate,
    endDate: updates.endDate,
    notes: updates.notes,
  };
  const service = new TripService();
  await service.updateTrip(
    userId,
    tripId,
    rawUpdates as Partial<CreateTripInput>,
  );

  revalidatePath(`/trips/${tripId}`);
  redirect(`/trips/${tripId}`);
}

export async function deleteTripAction(userId: string, tripId: string) {
  const service = new TripService();
  await service.deleteTrip(userId, tripId);

  revalidatePath("/trips");
  redirect("/trips");
}
