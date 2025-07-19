"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PackingListService } from "@/services/packing-list-service";
import { ItemService } from "@/services/item-service";
import { CategoryService } from "@/services/category-service";
import { formatOption } from "@/app/utils/formatSelectOption";
import { TemplateService } from "@/services/template-service";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { PackingList } from "@/app/lib/types";
import { TripService } from "@/services/trip-service";

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

import { z } from "zod";
import { getCurrentUser } from "@/app/lib/auth";

const PackingListSchema = z.object({
  title: z.string().min(1),
  tripId: z.uuid(),
});

export async function createPackingList(_: unknown, formData: FormData) {
  const user = await getCurrentUser();

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

  const data = { name: title, tripId };

  const listService = new PackingListService();
  const list = await listService.createPackingList(tripId, data);

  revalidatePath(`/trips/${tripId}/packing-lists/${list.id}`);
  redirect(`/trips/${tripId}/packing-lists/${list.id}`);
}

export async function updatePackingList(id: string, formData: FormData) {
  const user = await getCurrentUser();

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
  tripId: string,
  packingListId: string,
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
    categoryId: input.categoryId ?? null,
    packed: false,
    packingListId,
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
  revalidatePath(`/templates`);
  return template;
}

export async function exportPackingListPdf(packingListId: string) {
  const service = new PackingListService();
  const packingList = await service.getPackingListById(packingListId);
  if (!packingList) throw new Error("Packing list not found.");

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage();
  const { height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 12;

  let y = height - 50;
  const rowHeight = 24;

  const tableX = 50;
  const colWidths = [60, 180, 80, 180];
  const colX = {
    packed: tableX,
    name: tableX + colWidths[0],
    quantity: tableX + colWidths[0] + colWidths[1],
    category: tableX + colWidths[0] + colWidths[1] + colWidths[2],
  };

  // Title
  page.drawText(`Packing List: ${packingList.name}`, {
    x: tableX,
    y,
    size: 18,
    font: boldFont,
    color: rgb(0, 0.53, 0.71),
  });

  y -= 30;

  // Header background
  page.drawRectangle({
    x: tableX,
    y: y - rowHeight + 6,
    width: colWidths.reduce((sum, w) => sum + w, 0),
    height: rowHeight,
    color: rgb(0.95, 0.95, 0.95),
  });

  // Header labels
  page.drawText("Packed", {
    x: colX.packed,
    y: y + 6,
    size: fontSize,
    font: boldFont,
  });
  page.drawText("Item Name", {
    x: colX.name + 6,
    y,
    size: fontSize,
    font: boldFont,
  });
  page.drawText("Quantity", {
    x: colX.quantity + 6,
    y,
    size: fontSize,
    font: boldFont,
  });
  page.drawText("Category", {
    x: colX.category + 6,
    y,
    size: fontSize,
    font: boldFont,
  });

  y -= rowHeight;

  packingList.items.forEach((item) => {
    // Draw row background
    page.drawRectangle({
      x: tableX,
      y: y - rowHeight + 6,
      width: colWidths.reduce((sum, w) => sum + w, 0),
      height: rowHeight,
      borderWidth: 0.5,
      color: rgb(1, 1, 1),
      borderColor: rgb(0.8, 0.8, 0.8),
    });

    // ✅ Draw checkbox (manual checkable square)
    page.drawRectangle({
      x: colX.packed + 6,
      y: y - 10, // vertical alignment
      width: 10,
      height: 10,
      borderColor: rgb(0.2, 0.2, 0.2),
      borderWidth: 1,
      color: rgb(1, 1, 1), // white fill
    });

    // Text cells
    page.drawText(item.name, {
      x: colX.name + 6,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(String(item.quantity), {
      x: colX.quantity + 6,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(item.category?.name || "—", {
      x: colX.category + 6,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    y -= rowHeight;

    // 📄 Pagination: add a new page if needed
    if (y < 50) {
      page = pdfDoc.addPage();
      y = height - 50;
    }
  });

  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${packingList.name}.pdf"`,
    },
  });
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
