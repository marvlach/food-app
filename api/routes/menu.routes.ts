import express from "express";
import { prisma } from "../globals/prisma-client";
import { guestAuthenticator } from "../middlewares/auth.middleware";
import { GetMenuParamsSchema } from "../zod/menu.zod";
import { getMenuWithCurrency } from "../services/menu.service";
import { exchangeApi } from "../services/exchange.service";
import { getMenuRequestValidator } from "../middlewares/validation.middleware";
const router = express.Router();

// user get menu
router.get("/", guestAuthenticator.authenticate, getMenuRequestValidator.validate, async (req, res, next) => {
  try {
    const currency = req.query.currency as string | undefined;
    const menu = await getMenuWithCurrency(currency, prisma, exchangeApi);
    res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
});

export default router;
