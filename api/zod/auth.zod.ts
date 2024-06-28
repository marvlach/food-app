import { z } from "zod";

export const LoginBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const JWTPayloadSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  isAdmin: z.boolean(),
});


