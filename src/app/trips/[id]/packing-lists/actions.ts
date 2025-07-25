"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PackingListService } from "@/services/packing-list-service";
import { ItemService } from "@/services/item-service";
import { CategoryService } from "@/services/category-service";
import { formatOption } from "@/app/utils/formatSelectOption";
import { TemplateService } from "@/services/template-service";
import { PackingList } from "@/app/lib/types";
import { TripService } from "@/services/trip-service";
import { z } from "zod";
import { getCurrentUser } from "@/app/lib/auth";

const PackingListSchema = z.object({
  title: z.string().min(1),
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

  const { title, tripId } = result.data;

  const listService = new PackingListService();
  const packingList = await listService.getPackingListById(id);

  if (!packingList || packingList.trip.userId !== user.id) {
    return { message: "Packing list not found or unauthorized." };
  }

  await listService.updatePackingList(id, { name: String(title) });

  revalidatePath(`/trips/${tripId}/packing-lists/${id}/edit`);
  redirect(`/trips/${tripId}/packing-lists/${id}/edit`);
}

export async function deletePackingListAction(
  packingListId: string,
  tripId: string,
) {
  const service = new PackingListService();
  await service.deletePackingList(packingListId);

  revalidatePath(`/trips/${tripId}/packing-lists`);
  redirect(`/trips/${tripId}/packing-lists`);
}

export async function deletePackingListItemAction(
  tripId: string,
  itemId: string,
  packingListId: string,
) {
  const service = new ItemService();
  await service.deleteItem(itemId);

  revalidatePath(`/trips/${tripId}/packing-lists/${packingListId}`);
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

export async function addPackingItemAction(
  tripId: string,
  packingListId: string,
  input: { name: string; quantity: number; categoryId?: string },
) {
  const service = new ItemService();
  await service.addItem(packingListId, {
    name: input.name,
    quantity: input.quantity,
    categoryId:
      input.categoryId && input.categoryId !== "" ? input.categoryId : null,
    packed: false,
    packingListId,
  });
  revalidatePath(`/trips/${tripId}/packing-lists/${packingListId}`);
}

export async function updatePackingItemAction(
  itemId: string,
  tripId: string,
  packingListId: string,
  data: { name: string; quantity: number; categoryId: string | null },
) {
  const service = new ItemService();
  await service.updateItem(itemId, {
    name: data.name,
    quantity: data.quantity,
    categoryId:
      data.categoryId && data.categoryId !== "" ? data.categoryId : null,
  });
  revalidatePath(`/trips/${tripId}/packing-lists/${packingListId}`);
}

export async function createCategoryAction(
  userId: string,
  name: string,
  tripId: string,
  packingListId: string,
) {
  const service = new CategoryService();
  const existing = await service.getCategoryByName(userId, name);
  if (existing) return formatOption(name, existing.id);
  const newCategory = await service.createCategory(userId, name);
  revalidatePath(`/trips/${tripId}/packing-lists/${packingListId}`);
  return formatOption(name, newCategory.id);
}

export async function createTemplateAction(
  userId: string,
  packingListName: string,
  packingListId: string,
) {
  const service = new TemplateService();
  const template = await service.createTemplate(
    userId,
    packingListId,
    packingListName,
  );
  return template;
}

export async function exportPackingListToLink(
  userId: string,
  list: PackingList,
) {
  const tripService = new TripService();
  const trip = await tripService.getTripById(userId, list.tripId);
  if (trip) {
    const { destination, startDate, endDate, notes } = trip;
    const { name, items } = list;

    const listService = new PackingListService();
    return await listService.exportPackingList({
      title: trip.name,
      name,
      destination,
      startDate,
      endDate,
      notes: notes ?? "",
      items,
    });
  }
}
