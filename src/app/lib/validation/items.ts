import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  quantity: z.number().int().min(1),
  packed: z.boolean().default(false),
  packingListId: z.uuid(),
});

export const updateItemSchema = createItemSchema.partial();
