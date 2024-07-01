import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { settings } from "../globals/settings";
import { JWTPayloadType } from "../types/auth.types";
import { FoodAuthenticationError } from "../utils/errors";

export async function login(email: string, password: string, prisma: PrismaClient) {
  const foundMerchant = await prisma.merchant.findFirst({ where: { email } });

  if (!foundMerchant) {
    throw new FoodAuthenticationError("Invalid email or password");
  }

  const match = await bcryptjs.compare(password, foundMerchant.password);

  if (!match) {
    throw new FoodAuthenticationError("Invalid email or password");
  }

  const jwtPayload: JWTPayloadType = {
    id: foundMerchant.id,
    email: foundMerchant.email,
    name: foundMerchant.name,
    isAdmin: foundMerchant.is_admin,
  };

  const accessToken = jwt.sign(jwtPayload, settings.jwtSecret, { expiresIn: "1000s" });

  return accessToken;
}

export async function getGuestById(guestUserId: string, prisma: PrismaClient) {
  const user = await prisma.user.findFirst({ where: { id: guestUserId } });
  return user;
}

export async function createNewGuest(prisma: PrismaClient) {
  const randomName = (Math.random() + 1).toString(36).substring(2);
  const newUser = await prisma.user.create({ data: { name: randomName } });
  return newUser;
}

export async function guestLogin(guestUserId: unknown, prisma: PrismaClient) {
  // guest already exist
  if (typeof guestUserId === "string") {
    const user = await getGuestById(guestUserId, prisma);
    if (user) {
      return { created: false, id: user.id };
    }
  }

  // new guest
  const newUser = await createNewGuest(prisma);
  return { created: true, id: newUser.id };
}
