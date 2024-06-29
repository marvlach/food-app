import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

if (!process.env.DATABASE_URL) {
  throw new Error("Env Var DATABASE_URL not set in .env file");
}

if (!process.env.SEED_INITIAL_USER) {
  throw new Error("Env Var SEED_INITIAL_USER not set in .env file");
}

if (!process.env.SEED_INITIAL_API_KEY) {
  throw new Error("Env Var SEED_INITIAL_API_KEY not set in .env file");
}

if (!process.env.FIXER_API_KEY) {
  throw new Error("Env Var FIXER_API_KEY not set in .env file");
}

export const settings = {
  seedInitialUser: process.env.SEED_INITIAL_USER,
  seedInitialApiKey: process.env.SEED_INITIAL_API_KEY,
  fixerFetchExchangeRatesCronSchedule: process.env.FIXER_FETCH_EXCHANGE_RATES_CRON_SCHEDULE || "0 * * * *",
  fixerApiKey: process.env.FIXER_API_KEY,
  port: Number(process.env.PORT) || 7002,
};
