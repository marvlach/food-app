import { z } from "zod";

export const GetMenuParamsSchema = z.object({
  currency: z.string().nullable().or(z.literal(undefined)),
});
