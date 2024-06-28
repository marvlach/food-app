import { RequestArgsValidationSchemas } from "../types/request.types";
import { Request, Response, NextFunction } from "express";

export default class RequestArgsValidator {
  validator: RequestArgsValidationSchemas;

  constructor(validator: RequestArgsValidationSchemas) {
    this.validator = validator;
  }

  validate(req: Request) {
    if (this.validator.params) {
      this.validator.params.parse(req.params);
    }
    if (this.validator.body) {
      this.validator.body.parse(req.body);
    }
  }
}
