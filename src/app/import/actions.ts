"use server";

import { Item, SharedPackingList } from "@/generated/prisma";
import { ItemService } from "@/services/item-service";
import { PackingListService } from "@/services/packing-list-service";
import { TripService } from "@/services/trip-service";

export async function importPackingList(
  userId: string,
  sharedList: SharedPackingList,
) {
  const tripService = new TripService();
  const trip = await tripService.createTrip(userId, {
    name: `Imported Trip: ${sharedList.title}`,
    destination: sharedList.destination,
    startDate: sharedList.startDate,
    endDate: sharedList.endDate,
    notes: sharedList.notes ?? "",
  });

  const packingListService = new PackingListService();
  const newList = await packingListService.createPackingList(trip.id, {
    name: `Imported List: ${sharedList.name}`,
    tripId: trip.id,
  });

  const items = (sharedList.items as Item[]).map((item) => ({
    name: item.name,
    quantity: item.quantity,
    categoryId: item.categoryId ?? null,
    packed: false,
    packingListId: newList.id,
  }));

  const itemService = new ItemService();
  await itemService.addManyItems(items);

  return trip.id;
}
