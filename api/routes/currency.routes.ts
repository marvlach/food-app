import express from "express";
import { getAllAvailableCurrencies } from "../services/currency.service";
import { exchangeApi } from "../services/exchange.service";
const router = express.Router();

// user get currency
router.get("/", async (req, res, next) => {
  try {
    const allCurrencies = await getAllAvailableCurrencies(exchangeApi);
    res.status(200).json({ currencies: allCurrencies });
  } catch (error) {
    next(error);
  }
});

export default router;
