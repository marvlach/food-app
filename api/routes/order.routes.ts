import express from "express";
import { prisma } from "../globals/prisma-client";
import { guestAuthenticator, guestOrMerchantAuthenticator } from "../middlewares/auth.middleware";
import { PostOrderBodyType } from "../types/order.types";
import { createNewOrder } from "../services/order.service";
import { User } from "@prisma/client";
import { postOrderRequestValidator } from "../middlewares/validation.middleware";

const router = express.Router();

// user post order
router.post("/", guestAuthenticator.authenticate, postOrderRequestValidator.validate, async (req, res, next) => {
  try {
    // @ts-ignore
    const user: User = req.user;
    const order: PostOrderBodyType = req.body;

    const a = createNewOrder(user, order, prisma);
    res.status(200).json({ token: "hi" });
  } catch (error) {
    next(error);
  }
});

// user post order
// if it's merchant get all orders, if guest get guest's orders
router.get("/", guestOrMerchantAuthenticator.authenticate, async (req, res, next) => {
  try {
    // @ts-ignore
    console.log(req.merchant, req.user);

    res.status(200).json({ token: "hi" });
  } catch (error) {
    next(error);
  }
});

export default router;
