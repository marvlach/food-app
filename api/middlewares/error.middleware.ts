import { NextFunction, Request, Response } from "express";
import {
  FoodAuthenticationError,
  FoodAuthorizationError,
  FoodError,
  FoodServiceUnavailableError,
} from "../utils/errors";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function globalErrorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof FoodError) {
    res.status(400).json({ message: error.message });
  } else if (error instanceof FoodAuthorizationError) {
    res.status(403).json({ message: error.message });
  } else if (error instanceof FoodAuthenticationError) {
    res.status(401).json({ message: error.message });
  } else if (error instanceof ZodError) {
    res.status(422).json({ message: "Unproccessable Entity", error });
  } else if (error instanceof PrismaClientKnownRequestError) {
    res.status(400).json({ message: error.message, error: error.meta });
  } else if (error instanceof FoodServiceUnavailableError) {
    res.status(503).json({ message: error.message, error: error.error });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
