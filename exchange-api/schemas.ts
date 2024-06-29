import { z } from "zod";

export const FixerResponseBodySchema = z.object({
  success: z.literal(true),
  timestamp: z.number(),
  base: z.literal("EUR"),
  date: z.string(),
  rates: z.record(z.string(), z.number()),
});
