import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

/**
 * Authorization helpers for server actions and route handlers.
 *
 * Server actions are public HTTP endpoints: any argument a client passes
 * (user ids, trip ids, item ids...) can be forged. Never accept a user id
 * from the client — always derive it from the session with `requireUser()`,
 * then prove ownership of every record id with the `assert*Owner` helpers.
 */

export class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

/** Returns the signed-in user, or redirects to the sign-in page. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  return user;
}

// Records that don't exist and records owned by someone else return the same
// error, so callers can't probe which ids exist.

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

/** Normalises an optional category id and checks the user owns it. */
export async function resolveOwnedCategoryId(
  userId: string,
  categoryId: string | null | undefined,
): Promise<string | null> {
  if (!categoryId) return null;
  const category = await assertCategoryOwner(userId, categoryId);
  return category.id;
}
