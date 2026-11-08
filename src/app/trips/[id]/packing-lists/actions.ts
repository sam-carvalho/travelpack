"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PackingListService } from "@/services/packing-list-service";
import { ItemService } from "@/services/item-service";
import { CategoryService } from "@/services/category-service";
import { formatOption } from "@/app/utils/formatSelectOption";
import { TemplateService } from "@/services/template-service";
import { TripService } from "@/services/trip-service";
import { z } from "zod";
import { getCurrentUser } from "@/app/lib/auth";
import {
  assertItemOwner,
  assertListOwner,
  requireUser,
  resolveOwnedCategoryId,
} from "@/app/lib/authz";
import {
  CategoryNameSchema,
  ItemInputSchema,
} from "@/app/lib/validation/inputs";

const PackingListSchema = z.object({
  title: z.string().trim().min(1).max(100),
  tripId: z.uuid(),
});

export async function createPackingList(_: unknown, formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin?callbackUrl=/trips");
  }

  const result = PackingListSchema.safeParse({
    title: formData.get("title"),
    tripId: formData.get("tripId"),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { title, tripId } = result.data;

  const tripService = new TripService();
  const trip = await tripService.getTripById(user.id, tripId);

  if (!trip || trip.userId !== user.id) {
    return { message: "Trip not found or unauthorized." };
  }

  const listService = new PackingListService();
  const newList = await listService.createPackingList(tripId, {
    name: title,
    tripId,
  });

  const templateId = formData.get("templateId")?.toString();
  if (templateId) {
    const templateService = new TemplateService();
    const itemService = new ItemService();

    const template = await templateService.getTemplateById(user.id, templateId);
    if (template && template.items.length > 0) {
      const items = template.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        categoryId: item.categoryId ?? null,
        packed: false,
        packingListId: newList.id,
      }));

      await itemService.addManyItems(items);
    }
  }

  revalidatePath(`/trips/${tripId}/packing-lists/${newList.id}`);
  redirect(`/trips/${tripId}/packing-lists/${newList.id}`);
}

export async function updatePackingList(id: string, formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin?callbackUrl=/trips");
  }

  const result = PackingListSchema.safeParse({
    title: formData.get("title"),
    tripId: formData.get("tripId"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { title } = result.data;

  const listService = new PackingListService();
  const packingList = await listService.getPackingListById(id);

  if (!packingList || packingList.trip.userId !== user.id) {
    return { message: "Packing list not found or unauthorized." };
  }

  await listService.updatePackingList(id, { name: String(title) });

  const tripId = packingList.tripId;
  revalidatePath(`/trips/${tripId}/packing-lists/${id}/edit`);
  redirect(`/trips/${tripId}/packing-lists/${id}/edit`);
}

export async function deletePackingListAction(packingListId: string) {
  const user = await requireUser();
  const list = await assertListOwner(user.id, packingListId);

  const service = new PackingListService();
  await service.deletePackingList(list.id);

  revalidatePath(`/trips/${list.tripId}/packing-lists`);
  redirect(`/trips/${list.tripId}/packing-lists`);
}

export async function deletePackingListItemAction(itemId: string) {
  const user = await requireUser();
  const item = await assertItemOwner(user.id, itemId);

  const service = new ItemService();
  await service.deleteItem(item.id);

  revalidatePath(`/trips/${item.tripId}/packing-lists/${item.packingListId}`);
}

export async function togglePackedAction(formData: FormData) {
  const user = await requireUser();
  const item = await assertItemOwner(user.id, formData.get("itemId"));
  const packed = formData.get("packed") === "on";

  const service = new ItemService();
  await service.updateItem(item.id, { packed });

  revalidatePath(`/trips/${item.tripId}/packing-lists/${item.packingListId}`);
}

export async function addPackingItemAction(
  packingListId: string,
  input: { name: string; quantity: number; categoryId?: string | null },
) {
  const user = await requireUser();
  const list = await assertListOwner(user.id, packingListId);
  const data = ItemInputSchema.parse(input);
  const categoryId = await resolveOwnedCategoryId(user.id, data.categoryId);

  const service = new ItemService();
  await service.addItem(list.id, {
    name: data.name,
    quantity: data.quantity,
    categoryId,
    packed: false,
    packingListId: list.id,
  });
  revalidatePath(`/trips/${list.tripId}/packing-lists/${list.id}`);
}

export async function updatePackingItemAction(
  itemId: string,
  input: { name: string; quantity: number; categoryId: string | null },
) {
  const user = await requireUser();
  const item = await assertItemOwner(user.id, itemId);
  const data = ItemInputSchema.parse(input);
  const categoryId = await resolveOwnedCategoryId(user.id, data.categoryId);

  const service = new ItemService();
  await service.updateItem(item.id, {
    name: data.name,
    quantity: data.quantity,
    categoryId,
  });
  revalidatePath(`/trips/${item.tripId}/packing-lists/${item.packingListId}`);
}

export async function createCategoryAction(name: string, packingListId: string) {
  const user = await requireUser();
  const list = await assertListOwner(user.id, packingListId);
  const categoryName = CategoryNameSchema.parse(name);

  const service = new CategoryService();
  const existing = await service.getCategoryByName(user.id, categoryName);
  if (existing) return formatOption(categoryName, existing.id);
  const newCategory = await service.createCategory(user.id, categoryName);
  revalidatePath(`/trips/${list.tripId}/packing-lists/${list.id}`);
  return formatOption(categoryName, newCategory.id);
}

export async function createTemplateAction(packingListId: string) {
  const user = await requireUser();
  const list = await assertListOwner(user.id, packingListId);

  const listService = new PackingListService();
  const fullList = await listService.getPackingListById(list.id);
  if (!fullList) return null;

  const service = new TemplateService();
  return service.createTemplate(user.id, list.id, fullList.name);
}

export async function exportPackingListToLink(packingListId: string) {
  const user = await requireUser();
  const owned = await assertListOwner(user.id, packingListId);

  const listService = new PackingListService();
  const list = await listService.getPackingListById(owned.id);
  if (!list) return null;

  const { trip } = list;
  return listService.exportPackingList({
    title: trip.name,
    name: list.name,
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    notes: trip.notes ?? "",
    items: list.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      categoryName: item.category?.name ?? null,
    })),
  });
}
