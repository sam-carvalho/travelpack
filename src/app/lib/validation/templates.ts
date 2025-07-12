import { z } from "zod";

export const templateItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  quantity: z.number().int().min(1),
});

export const createTemplateSchema = z.object({
  name: z.string().min(1),
  items: z.array(templateItemSchema),
});

export const applyTemplateSchema = z.object({
  tripId: z.uuid(),
});
