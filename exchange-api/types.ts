import { z } from "zod";
import { FixerResponseBodySchema } from "./schemas";

export type FixerResponseBodyType = z.infer<typeof FixerResponseBodySchema>;