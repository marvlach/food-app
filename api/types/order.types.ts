import { z } from "zod";
import { PostOrderItemSchema, PostOrderBodySchema } from "../zod/order.zod";

export type PostOrderItemType = z.infer<typeof PostOrderItemSchema>;
export type PostOrderBodyType = z.infer<typeof PostOrderBodySchema>;
