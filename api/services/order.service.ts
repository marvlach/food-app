import { PrismaClient, User } from "@prisma/client";
import { PostOrderBodyType } from "../types/order.types";

export async function createNewOrder(
  user: User, 
  order: PostOrderBodyType, 
  prisma: PrismaClient,
) {
  
}
