import { z } from "zod";

export const searchReportsQuerySchema = z.object({
  q: z.string().min(1, "Search query cannot be empty"),
});
