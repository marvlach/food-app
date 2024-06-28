import { z } from "zod";
import { LoginBodySchema, JWTPayloadSchema } from "../zod/auth.zod";

export type LoginBodyType = z.infer<typeof LoginBodySchema>;
export type JWTPayloadType = z.infer<typeof JWTPayloadSchema>;
