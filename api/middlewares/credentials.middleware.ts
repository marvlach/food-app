import { NextFunction, Request, Response } from "express";

export const credentials = (req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
};
