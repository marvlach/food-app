import express from "express";
import { LoginBodyType } from "../types/auth.types";
import { guestLogin, login } from "../services/auth.service";
import { prisma } from "../globals/prisma-client";
import { loginRequestValidator } from "../middlewares/validation.middleware";
import { merchantAuthenticator } from "../middlewares/auth.middleware";

const router = express.Router();

// merchant login with username, password
router.post("/login", loginRequestValidator.validate, async (req, res, next) => {
  try {
    const { email, password }: LoginBodyType = req.body;

    const token = await login(email, password, prisma);

    res.status(200).json({ token: token });
  } catch (error) {
    next(error);
  }
});

// guest login with nothing
router.get("/login", async (req, res, next) => {
  try {
    const guestUserId = req.cookies.guest_user_id;
    const { created, id } = await guestLogin(guestUserId, prisma);

    res.cookie("guest_user_id", id, { maxAge: 9000000, httpOnly: true });
    if (created) {
      res.status(201).json({ message: "New User Detected" });
    } else {
      res.status(200).json({ message: "User Exist" });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/me", merchantAuthenticator.authenticate, async (req, res, next) => {
  try {
    // @ts-ignore
    res.status(200).json({ merchant: req.merchant });
  } catch (error) {
    next(error);
  }
});

export default router;
