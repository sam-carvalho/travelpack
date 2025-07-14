"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PackingListService } from "@/services/packing-list-service";
import it from "zod/v4/locales/it.cjs";
import { ItemService } from "@/services/item-service";

// const CreateTrip = createPackingListSchema.omit({ id: true });

// export async function createTripAction(userId: string, input: FormData) {
//   const rawFormData = CreateTrip.parse({
//     name: input.get("name"),
//     destination: input.get("destination"),
//     startDate: input.get("startDate"),
//     endDate: input.get("endDate"),
//     notes: input.get("notes") || null,
//   });
//   const service = new TripService();
//   await service.createTrip(userId, rawFormData as CreateTripInput);

//   revalidatePath("/trips");
//   redirect("/trips");
// }

// const UpdateTrip = updatePackingListSchema.omit({ id: true });

// export async function updateTripAction(
//   userId: string,
//   tripId: string,
//   updates: FormData
// ) {
//   const rawUpdates = UpdateTrip.parse({
//     name: updates.get("name"),
//     destination: updates.get("destination"),
//     startDate: updates.get("startDate"),
//     endDate: updates.get("endDate"),
//     notes: updates.get("notes"),
//   });
//   const service = new TripService();
//   await service.updateTrip(
//     userId,
//     tripId,
//     rawUpdates as Partial<CreateTripInput>
//   );

//   revalidatePath(`/trips/${tripId}`);
//   redirect(`/trips/${tripId}`);
// }

export async function deletePackingListAction(
  tripId: string,
  packingListId: string
) {
  const service = new PackingListService();
  await service.deletePackingList(packingListId);

  revalidatePath(`/trips/${tripId}/packing-lists`);
  redirect(`/trips/${tripId}/packing-lists`);
}

export async function deletePackingListItemAction(
  tripId: string,
  packingListId: string,
  itemId: string
) {
  const service = new ItemService();
  await service.deleteItem(itemId);

  revalidatePath(`/trips/${tripId}/packing-lists`);
  redirect(`/trips/${tripId}/packing-lists`);
}

export async function togglePackedAction(formData: FormData) {
  const tripId = formData.get("tripId") as string;
  const packingListId = formData.get("packingListId") as string;
  const itemId = formData.get("itemId") as string;
  const packed = formData.get("packed") === "on";

  const service = new ItemService();
  await service.updateItem(itemId, { packed });

  revalidatePath(`/trips/${tripId}/packing-lists/${packingListId}`);
}
