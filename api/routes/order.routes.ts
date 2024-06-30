import express from "express";
import RequestArgsValidator from "../utils/request-schema-validation";
import { prisma } from "../globals/prisma-client";
import { validateGuestCookie } from "../middlewares/auth.middleware";
import { PostOrderBodySchema } from "../zod/order.zod";
import { PostOrderBodyType } from "../types/order.types";
import { createNewOrder } from "../services/order.service";
import { User } from "@prisma/client";

const router = express.Router();

const postOrderRequestValidator = new RequestArgsValidator({ body: PostOrderBodySchema });

// user post order
router.post("/", validateGuestCookie, async (req, res, next) => {
  try {
    // @ts-ignore
    const user: User = req.user;
    const order: PostOrderBodyType = req.body;

    console.log(user);
    console.log(order);

    postOrderRequestValidator.validate(req);

    const a = createNewOrder(user, order, prisma);
    res.status(200).json({ token: "hi" });
  } catch (error) {
    next(error);
  }
});

export default router;
