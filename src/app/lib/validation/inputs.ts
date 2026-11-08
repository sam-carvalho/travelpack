import { z } from "zod";

// Server-side validation for server action inputs. Client-side checks are only
// a convenience — every action re-validates what it receives here.

export const ItemInputSchema = z.object({
  name: z.string().trim().min(1, "Item name is required").max(100),
  quantity: z.coerce.number().int().min(1).max(999),
  categoryId: z.string().nullable().optional(),
});

export const CategoryNameSchema = z
  .string()
  .trim()
  .min(1, "Category name is required")
  .max(50);

const TripFields = {
  name: z.string().trim().min(1, "Trip name is required").max(100),
  destination: z.string().trim().min(1, "Destination is required").max(100),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  notes: z.string().max(2000).nullable().optional(),
};

export const TripInputSchema = z
  .object(TripFields)
  .refine((t) => t.endDate >= t.startDate, {
    path: ["endDate"],
    message: "End date must be after start date",
  });

export const TripUpdateSchema = z
  .object(TripFields)
  .partial()
  .refine((t) => !t.startDate || !t.endDate || t.endDate >= t.startDate, {
    path: ["endDate"],
    message: "End date must be after start date",
  });

// Shape of the item snapshot stored in SharedPackingList.items. Older links
// stored full item rows (with the sharer's categoryId); newer ones store only
// the category name. Either way, only these fields are ever read back.
export const SharedItemsSchema = z
  .array(
    z.object({
      name: z.string().trim().min(1).max(100),
      quantity: z.coerce.number().int().min(1).max(999).catch(1),
      categoryName: z.string().trim().max(50).nullish(),
      category: z.object({ name: z.string().trim().max(50) }).nullish(),
    }),
  )
  .max(500);
