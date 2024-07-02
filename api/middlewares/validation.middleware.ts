import { RequestArgsValidationSchemas } from "../types/request.types";
import { Request, Response, NextFunction } from "express";
import { FoodServiceUnprocessableEntityError } from "../utils/errors";
import { PostOrderBodySchema } from "../zod/order.zod";
import { GetMenuParamsSchema } from "../zod/menu.zod";
import { LoginBodySchema } from "../zod/auth.zod";

class RequestArgsValidator {
  validator: RequestArgsValidationSchemas;

  constructor(validator: RequestArgsValidationSchemas) {
    this.validator = validator;
    this.validate = this.validate.bind(this);
  }

  async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (this.validator.params) {
        this.validator.params.parse(req.params);
      }
      if (this.validator.body) {
        this.validator.body.parse(req.body);
      }
      next();
    } catch (error) {
      // ts doesn't know that this is a ZodError, but I do...
      next(new FoodServiceUnprocessableEntityError("Unproccessable Entity", error));
    }
  }
}

export const postOrderRequestValidator = new RequestArgsValidator({ body: PostOrderBodySchema });
export const getMenuRequestValidator = new RequestArgsValidator({ params: GetMenuParamsSchema });
export const loginRequestValidator = new RequestArgsValidator({ body: LoginBodySchema });

export const exportRequestArgsValidatorForTesting = {
  RequestArgsValidator: RequestArgsValidator
} 
