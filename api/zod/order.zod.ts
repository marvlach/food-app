import { z } from "zod";

export const PostOrderItemSchema = z.object({
  item_id: z.string(),
  quantity: z.number(),
  comment: z.string(),
});

export const PostOrderBodySchema = z.object({
  currency: z.string(),
  order_items: z.array(PostOrderItemSchema),
});

export const GetOrderParamsSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const GetOrderByIdParamsSchema = z.object({
  email: z.string(),
  password: z.string(),
});
