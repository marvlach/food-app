import dotenv from "dotenv";

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

if (!process.env.SEED_INITIAL_USERNAME) {
  throw new Error("Env Var SEED_INITIAL_USERNAME not set in .env file");
}

if (!process.env.SEED_INITIAL_PASSWORD) {
  throw new Error("Env Var SEED_INITIAL_PASSWORD not set in .env file");
}

if (!process.env.JWT_SECRET) {
  throw new Error("Env Var JWT_SECRET not set in .env file");
}

if (!process.env.EXCHANGE_API_BASE_URL) {
  throw new Error("Env Var EXCHANGE_API_BASE_URL not set in .env file");
}

if (!process.env.EXCHANGE_API_APP_NAME) {
  throw new Error("Env Var EXCHANGE_API_APP_NAME not set in .env file");
}

if (!process.env.EXCHANGE_API_API_KEY) {
  throw new Error("Env Var EXCHANGE_API_API_KEY not set in .env file");
}

export const settings = {
  seedInitialUsername: process.env.SEED_INITIAL_USERNAME,
  seedInitialPassword: process.env.SEED_INITIAL_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  port: Number(process.env.PORT) || 7001,
  exchangeApiBaseUrl: process.env.EXCHANGE_API_BASE_URL,
  exchangeApiAppName: process.env.EXCHANGE_API_APP_NAME,
  exchangeApiApiKey: process.env.EXCHANGE_API_API_KEY,
};
