import { PrismaClient } from "@prisma/client";
import { ExchangeApiType } from "./exchange.service";

export async function getMenuWithCurrency(
  currency: string | undefined,
  prisma: PrismaClient,
  exchangeApi: ExchangeApiType
) {
  const menu = await prisma.category.findMany({
    orderBy: { display_order: "asc" },
    include: {
      items: {
        where: { available: true },
        orderBy: { display_order: "asc" },
      },
    },
  });

  const rate = currency ? (await exchangeApi.exchange.get(currency)).rates[currency] : 1;

  const menuWithPrices = menu.map((cat) => ({
    ...cat,
    items: cat.items.map((it) => ({ ...it, price: Math.round(it.priceEUR * rate) })),
  }));
  return menuWithPrices;
}
