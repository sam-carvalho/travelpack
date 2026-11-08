import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  return user;
}

// Missing and not-owned records throw the same error so ids can't be probed.
export async function assertTripOwner(userId: string, tripId: unknown) {
  const id = z.uuid().safeParse(tripId);
  if (!id.success) throw new NotFoundError("Trip not found");
  const trip = await prisma.trip.findFirst({
    where: { id: id.data, userId },
    select: { id: true },
  });
  if (!trip) throw new NotFoundError("Trip not found");
  return trip;
}

export async function assertListOwner(userId: string, listId: unknown) {
  const id = z.uuid().safeParse(listId);
  if (!id.success) throw new NotFoundError("Packing list not found");
  const list = await prisma.packingList.findFirst({
    where: { id: id.data, trip: { userId } },
    select: { id: true, tripId: true },
  });
  if (!list) throw new NotFoundError("Packing list not found");
  return list;
}

export async function assertItemOwner(userId: string, itemId: unknown) {
  const id = z.uuid().safeParse(itemId);
  if (!id.success) throw new NotFoundError("Item not found");
  const item = await prisma.item.findFirst({
    where: { id: id.data, packingList: { trip: { userId } } },
    select: {
      id: true,
      packingListId: true,
      packingList: { select: { tripId: true } },
    },
  });
  if (!item) throw new NotFoundError("Item not found");
  return {
    id: item.id,
    packingListId: item.packingListId,
    tripId: item.packingList.tripId,
  };
}

export async function assertCategoryOwner(userId: string, categoryId: unknown) {
  const id = z.uuid().safeParse(categoryId);
  if (!id.success) throw new NotFoundError("Category not found");
  const category = await prisma.category.findFirst({
    where: { id: id.data, userId },
    select: { id: true },
  });
  if (!category) throw new NotFoundError("Category not found");
  return category;
}

export async function resolveOwnedCategoryId(
  userId: string,
  categoryId: string | null | undefined,
): Promise<string | null> {
  if (!categoryId) return null;
  const category = await assertCategoryOwner(userId, categoryId);
  return category.id;
}
