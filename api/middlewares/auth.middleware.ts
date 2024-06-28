import { NextFunction, Request, Response } from "express";
import { FoodAuthorizationError } from "../utils/errors";

import { getGuestById } from "../services/auth.service";
import { prisma } from "../globals/prisma-client";

// guest auth
export async function validateGuestCookie(req: Request, res: Response, next: NextFunction) {
  try {
    const guestUserId = req.cookies.guest_user_id;
    if (typeof guestUserId !== "string") {
      throw new FoodAuthorizationError("Cannot order without a valid cookie");
    }

    const user = await getGuestById(guestUserId, prisma);

    if (!user) {
      throw new FoodAuthorizationError("Cannot order without a valid cookie");
    }

    // @ts-ignore
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}
