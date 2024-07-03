import express from "express";
import { prisma } from "../globals/prisma-client";
import { guestAuthenticator, guestOrMerchantAuthenticator, merchantAuthenticator } from "../middlewares/auth.middleware";
import { PostOrderBodyType } from "../types/order.types";
import { createNewOrder, getOrders } from "../services/order.service";
import { User } from "@prisma/client";
import { getOrdersRequestValidator, postOrderRequestValidator } from "../middlewares/validation.middleware";
import { exchangeApi } from "../services/exchange.service";

const router = express.Router();

// user post order
router.post("/", guestAuthenticator.authenticate, postOrderRequestValidator.validate, async (req, res, next) => {
  try {
    // @ts-ignore
    const user: User = req.user;
    const order: PostOrderBodyType = req.body;

    const placedOrder = await createNewOrder(user, order, prisma, exchangeApi);
    res.status(200).json({ message: "Successfully placed order", order: placedOrder });
  } catch (error) {
    next(error);
  }
});

// if it's merchant get all orders, if guest get guest's orders
router.get("/", guestOrMerchantAuthenticator.authenticate, getOrdersRequestValidator.validate, async (req, res, next) => {
  try {
    // @ts-ignore
    const where = req.merchant ? undefined : { user_id: req.user.id };
    const isView = req.query.view;
    const orders = await getOrders(where, prisma);
    if (isView) {
      res.status(200).render('orders', { orders });
    } else {
      res.status(200).json({ orders });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
