import { SharedPackingList } from "@/generated/prisma";
import { ItemService } from "@/services/item-service";
import { PackingListService } from "@/services/packing-list-service";
import { TripService } from "@/services/trip-service";
import { CategoryService } from "@/services/category-service";
import { SharedItemsSchema } from "@/app/lib/validation/inputs";

// Not a server action on purpose: it trusts the userId it is given.
export async function importPackingList(
  userId: string,
  sharedList: SharedPackingList,
) {
  const parsed = SharedItemsSchema.safeParse(sharedList.items);
  const sharedItems = parsed.success ? parsed.data : [];

  const tripService = new TripService();
  const trip = await tripService.createTrip(userId, {
    name: `Imported Trip: ${sharedList.title}`.slice(0, 100),
    destination: sharedList.destination,
    startDate: sharedList.startDate,
    endDate: sharedList.endDate,
    notes: sharedList.notes ?? "",
  });

  const packingListService = new PackingListService();
  const newList = await packingListService.createPackingList(trip.id, {
    name: `Imported List: ${sharedList.name}`.slice(0, 100),
    tripId: trip.id,
  });

  // Match by name so the sharer's category ids never cross accounts.
  const categoryService = new CategoryService();
  const categoryIds = new Map<string, string>();
  for (const item of sharedItems) {
    const name = item.categoryName ?? item.category?.name;
    if (!name || categoryIds.has(name)) continue;
    const existing = await categoryService.getCategoryByName(userId, name);
    const category =
      existing ?? (await categoryService.createCategory(userId, name));
    categoryIds.set(name, category.id);
  }

  const items = sharedItems.map((item) => {
    const name = item.categoryName ?? item.category?.name;
    return {
      name: item.name,
      quantity: item.quantity,
      categoryId: name ? (categoryIds.get(name) ?? null) : null,
      packed: false,
      packingListId: newList.id,
    };
  });

  if (items.length > 0) {
    const itemService = new ItemService();
    await itemService.addManyItems(items);
  }

  return trip.id;
}
