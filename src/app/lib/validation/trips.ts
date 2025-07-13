import { z } from "zod";

export const createTripSchema = z
  .object({
    name: z.string().min(1, "Trip name is required"),
    destination: z.string().min(1, "Destination is required"),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start date",
    }),
    endDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid end date",
      })
      .refine((val) => new Date(val) > new Date(), {
        message: "End date must be in the future",
      }),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (start >= end) {
      ctx.addIssue({
        path: ["endDate"],
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
      });
    }
  });

export const updateTripSchema = createTripSchema.partial();
