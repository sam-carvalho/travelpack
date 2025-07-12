import { z } from "zod";

export const createTripSchema = z.object({
  name: z.string().min(1),
  destination: z.string().min(1),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
  notes: z.string().optional(),
});

export const updateTripSchema = createTripSchema.partial();
