import express from "express";
import RequestArgsValidator from "../utils/request-schema-validation";
import { prisma } from "../globals/prisma-client";
import { validateGuestCookie } from "../middlewares/auth.middleware";
import { User } from "@prisma/client";
import { GetMenuParamsSchema } from "../zod/menu.zod";
import { getMenuWithCurrency } from "../services/menu.service";
import { exchangeApi } from "../services/exchange.service";
const router = express.Router();

const getMenuRequestValidator = new RequestArgsValidator({ params: GetMenuParamsSchema });

// user get menu
router.get("/", validateGuestCookie, async (req, res, next) => {
  try {
    getMenuRequestValidator.validate(req);
    const currency = req.query.currency as string | undefined;

    const menu = await getMenuWithCurrency(currency, prisma, exchangeApi);
    res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
});

export default router;
