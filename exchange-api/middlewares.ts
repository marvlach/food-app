import { NextFunction, Request, Response } from "express";
import { ExchangeApiError, ExchangeApiAuthenticationError, ExchangeApiAuthorizationError } from "./errors";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getGuestByApiKey } from "./services";
import { prisma } from "./globals";

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

// guest auth
export async function validateApiKey(req: Request, res: Response, next: NextFunction) {
  try {
    const authKey = req.headers.authorization;
    if (!authKey) {
      throw new ExchangeApiAuthenticationError("API KEY not provided");
    }

    const user = await getGuestByApiKey(authKey, prisma);

    if (!user) {
      throw new ExchangeApiAuthenticationError("Invalid API KEY");
    }

    next();
  } catch (error) {
    next(error);
  }
}
