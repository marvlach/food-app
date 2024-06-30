import express from "express";
import { prisma } from "./globals";
import { validateApiKey } from "./middlewares";
import { getExchangeRate } from "./services";
import { ExchangeApiError } from "./errors";

const router = express.Router();

// get exchange rate by name and date
router.get("/", validateApiKey, async (req, res, next) => {
  try {
    const currency = req.query.currency;
    if (typeof currency !== "string" && typeof currency !== "undefined") {
      throw new ExchangeApiError("Unproccessable Entity");
    }
    const data = await getExchangeRate(currency, prisma);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
