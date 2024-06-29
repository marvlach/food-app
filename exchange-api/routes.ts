import express from "express";
import { prisma } from "./globals";
import { validateApiKey } from "./middlewares";

const router = express.Router();

// get exchange rate by name and date
router.get("/", validateApiKey, async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
});

export default router;
