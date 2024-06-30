import { NextFunction, Request, Response } from "express";
import { ExchangeApiError, ExchangeApiAuthenticationError, ExchangeApiAuthorizationError } from "./errors";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getUserByName } from "./services";
import { prisma } from "./globals";
import bcryptjs from "bcryptjs";

export function globalErrorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof ExchangeApiError) {
    res.status(400).json({ message: error.message });
  } else if (error instanceof ExchangeApiAuthorizationError) {
    res.status(403).json({ message: error.message });
  } else if (error instanceof ExchangeApiAuthenticationError) {
    res.status(401).json({ message: error.message });
  } else if (error instanceof ZodError) {
    res.status(422).json({ message: "Unproccessable Entity", error });
  } else if (error instanceof PrismaClientKnownRequestError) {
    res.status(400).json({ message: error.message, error: error.meta });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function validateApiKey(req: Request, res: Response, next: NextFunction) {
  try {
    const appName = req.headers["x-app-name"];
    const apiKey = req.headers["x-api-key"];

    if (typeof apiKey !== "string") {
      throw new ExchangeApiAuthenticationError("Api Key not provided in request headers");
    }

    if (typeof appName !== "string") {
      throw new ExchangeApiAuthenticationError("App Name not provided in request headers");
    }

    const user = await getUserByName(appName, prisma);

    if (!user) {
      throw new ExchangeApiAuthenticationError("Invalid App Name");
    }

    const match = await bcryptjs.compare(apiKey, user.apiKey);

    if (!match) {
      throw new ExchangeApiAuthenticationError("Invalid Api Key");
    }
  
    next();
  } catch (error) {
    next(error);
  }
}
