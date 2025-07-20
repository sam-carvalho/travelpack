import { z } from "zod";

export const SearchFiltersSchema = z.object({
  start: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined))
    .refine((val) => !val || !isNaN(val.getTime()), {
      message: "Invalid start date",
    }),

  end: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined))
    .refine((val) => !val || !isNaN(val.getTime()), {
      message: "Invalid end date",
    }),

  keyword: z.string().optional(),
});

export type ValidatedSearchFilters = z.infer<typeof SearchFiltersSchema>;
