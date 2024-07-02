import { PrismaClient, User } from "@prisma/client";
import { PostOrderBodyType } from "../types/order.types";
import { ExchangeApiType } from "./exchange.service";

export async function createNewOrder(
  user: User,
  order: PostOrderBodyType,
  prisma: PrismaClient,
  exchangeApi: ExchangeApiType
) {
  const { currency, order_items: orderItems } = order;
  const rate = currency !== "EUR" ? (await exchangeApi.exchange.get(currency)).rates[currency] : 1;

  const itemIdsInOrder = await prisma.item.findMany({
    select: { id: true, priceEUR: true },
    where: { id: { in: orderItems.map((oi) => oi.item_id) } },
  });

  const itemPrices = itemIdsInOrder.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.priceEUR }), {}) as {
    [k: string]: number;
  };

  const orderItemsToInsert = orderItems.map((oi) => ({ ...oi, priceEURThen: itemPrices[oi.item_id] }));

  const orderToInsert = await prisma.order.create({
    data: {
      user_id: user.id,
      address: order.address,
      currency: currency,
      exchangeToEURThen: rate,
      order_items: { create: orderItemsToInsert },
    },
    include: { order_items: true },
  });
  return orderToInsert;
}

export async function getOrders(where: { [k: string]: unknown } | undefined, prisma: PrismaClient) {
  const orders = await prisma.order.findMany({
    ...(where && { where }),
    include: { order_items: { include: { item: true } } },
    orderBy: { createdAt: "asc" },
  });
  return orders;
}
