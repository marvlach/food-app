import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { FixerResponseBodySchema } from "./schemas";
import { FixerResponseBodyType } from "./types";
import { ExchangeApiError } from "./errors";
import { settings } from "./globals";

export async function getGuestByApiKey(apiKey: string, prisma: PrismaClient) {
  const user = await prisma.user.findFirst({ where: { apiKey } });
  return user;
}

export async function getExchangeRateTEST(prisma: PrismaClient) {
  console.log("getting exchange rates");
  const user = await prisma.user.findMany();
  return user;
}

async function upsertManyExchangeRates(newExchangeRates: FixerResponseBodyType, prisma: PrismaClient) {
  const currentDate = new Date()
  const data = Object.entries(newExchangeRates.rates).map(([name, rate]) => ({
    currency: name,
    rate: rate,
    date: currentDate,
  }));
  await prisma.$transaction([prisma.exchangeRates.deleteMany(), prisma.exchangeRates.createMany({ data })]);
}

async function getExchangeRateFromFixer(fixerApiKey: string) {
  const url = "http://data.fixer.io/api/latest";
  const response = await axios.get(url, { params: { base: "EUR", access_key: fixerApiKey } });
  const resBody = response.data;
  FixerResponseBodySchema.parse(resBody);
  return resBody as FixerResponseBodyType;
}

export async function updateExchangeRates(prisma: PrismaClient) {
  try {
    console.log("Begin Updating exchange rates");

    console.log("Fetching latest exchange rates from Fixer");
    const data = await getExchangeRateFromFixer(settings.fixerApiKey);
    
    console.log('Data detched from fixer successfully')
    console.log("Upsert latest exchange rates to MongoDB");

    await upsertManyExchangeRates(data, prisma);

    console.log("Updated exchange rates successfully");
  } catch (error) {
    console.error(error);
  }
}
