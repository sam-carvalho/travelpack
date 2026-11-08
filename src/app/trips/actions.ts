"use server";

import { TripService } from "@/services/trip-service";
import { revalidatePath } from "next/cache";
import { CreateTripInput } from "@/app/lib/types";
import { redirect } from "next/navigation";
import { assertTripOwner, requireUser } from "@/app/lib/authz";
import { TripInputSchema, TripUpdateSchema } from "@/app/lib/validation/inputs";

export async function createTripAction(input: CreateTripInput) {
  const user = await requireUser();
  const data = TripInputSchema.parse(input);

  const service = new TripService();
  await service.createTrip(user.id, {
    ...data,
    notes: data.notes || undefined,
  });

  revalidatePath("/trips");
  redirect("/trips");
}

export async function updateTripAction(
  tripId: string,
  updates: Partial<CreateTripInput>,
) {
  const user = await requireUser();
  const trip = await assertTripOwner(user.id, tripId);
  const data = TripUpdateSchema.parse(updates);

  const service = new TripService();
  await service.updateTrip(user.id, trip.id, {
    ...data,
    notes: data.notes ?? undefined,
  });

  revalidatePath(`/trips/${trip.id}`);
  redirect(`/trips/${trip.id}`);
}

export async function deleteTripAction(tripId: string) {
  const user = await requireUser();

  const service = new TripService();
  await service.deleteTrip(user.id, tripId);

  revalidatePath("/trips");
  redirect("/trips");
}
