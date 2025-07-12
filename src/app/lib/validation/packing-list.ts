import { z } from "zod";
import { templateItemSchema } from "./templates";

export const createPackingListSchema = z.object({
  name: z.string().min(1),
  tripId: z.uuid(),
  items: z.array(templateItemSchema).optional(),
});

export const updatePackingListSchema = createPackingListSchema.partial();
