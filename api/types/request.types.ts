import { ZodSchema } from "zod";

export type RequestArgsValidationSchemas = {
  params?: ZodSchema;
  body?: ZodSchema;
};
