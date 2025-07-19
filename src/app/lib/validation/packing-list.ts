import { z } from "zod";
import { templateItemSchema } from "./templates";

export const createPackingListSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  tripId: z.uuid(),
  items: z.array(templateItemSchema).optional(),
});

export const updatePackingListSchema = createPackingListSchema.partial();

export const importPackingListSchema = z.object({
  name: z.string(),
  items: z
    .array(
      z.object({
        name: z.string(),
        quantity: z.number(),
        category: z.string(),
        packed: z.boolean(),
      }),
    )
    .min(1),
  destination: z.string(),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
  notes: z.string().optional(),
});
