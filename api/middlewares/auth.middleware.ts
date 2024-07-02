import { NextFunction, Request, Response } from "express";
import { FoodAuthenticationError } from "../utils/errors";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { getGuestById } from "../services/auth.service";
import { prisma } from "../globals/prisma-client";
import { settings } from "../globals/settings";

type AuthenticationRuleResult =
  | {
      valid: true;
      payload: Record<string, unknown>;
    }
  | {
      valid: false;
      error: unknown;
    };

interface IAuthRule {
  authenticate: (req: Request) => Promise<AuthenticationRuleResult>;
}

interface IAuthenticationMiddleware {
  authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

class AuthRule implements IAuthRule {
  rule: (req: Request) => Promise<AuthenticationRuleResult>;

  constructor(rule: (req: Request) => Promise<AuthenticationRuleResult>) {
    this.rule = rule;
  }

  async authenticate(req: Request) {
    return await this.rule(req);
  }
}

class AuthRuleAnd implements IAuthRule {
  and: (AuthRuleAnd | AuthRule | AuthRuleOr | AuthRuleNot)[];

  constructor(and: (AuthRuleAnd | AuthRule | AuthRuleOr | AuthRuleNot)[]) {
    this.and = and;
  }

  async authenticate(req: Request): Promise<AuthenticationRuleResult> {
    const allResults = await Promise.all(this.and.map((r) => r.authenticate(req)));

    const allTrue = allResults.every((res) => res.valid);

    if (!allTrue) {
      const firstError = allResults.filter((res) => !res.valid)[0];
      // @ts-ignore
      return { valid: false, error: firstError.error };
    }
    // make payload from all payloads
    // @ts-ignore
    const allPayloads = allResults.reduce((prev, curr) => ({ ...prev, ...curr.payload }), {});
    return {
      valid: true,
      payload: allPayloads,
    };
  }
}

class AuthRuleOr implements IAuthRule {
  or: (AuthRuleAnd | AuthRule | AuthRuleOr | AuthRuleNot)[];

  constructor(or: (AuthRuleAnd | AuthRule | AuthRuleOr | AuthRuleNot)[]) {
    this.or = or;
  }

  async authenticate(req: Request): Promise<AuthenticationRuleResult> {
    const allResults = await Promise.all(this.or.map((r) => r.authenticate(req)));

    const atLeastOneTrue = allResults.some((res) => res.valid);

    if (!atLeastOneTrue) {
      const firstError = allResults.filter((res) => !res.valid)[0];
      // @ts-ignore
      return { valid: false, error: firstError.error };
    }
    // make payload from valid payloads
    const payloads = allResults
      .filter((res) => res.valid)
      // @ts-ignore
      .reduce((prev, curr) => ({ ...prev, ...curr.payload }), {});
    return { valid: true, payload: payloads };
  }
}

class AuthRuleNot implements IAuthRule {
  not: AuthRuleAnd | AuthRule | AuthRuleOr | AuthRuleNot;

  constructor(not: AuthRuleAnd | AuthRule | AuthRuleOr | AuthRuleNot) {
    this.not = not;
  }

  async authenticate(req: Request): Promise<AuthenticationRuleResult> {
    const res = await this.not.authenticate(req);
    if (res.valid) {
      return { valid: false, error: new FoodAuthenticationError("Unauthenticated") };
    }
    return { valid: true, payload: {} };
  }
}

class AuthenticationMiddleware implements IAuthenticationMiddleware {
  rules: AuthRuleAnd | AuthRule | AuthRuleOr | AuthRuleNot;

  constructor(rules: AuthRuleAnd | AuthRule | AuthRuleOr | AuthRuleNot) {
    this.rules = rules;
    // Bind the authenticate method to ensure 'this' context is correct
    this.authenticate = this.authenticate.bind(this);
  }

  async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.rules.authenticate(req);
      if (!result.valid) {
        throw result.error;
      }
      // attach all payload key value pairs to req object
      for (const prop in result.payload) {
        // @ts-ignore
        req[prop] = result.payload[prop];
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}

const validateGuestCookieRule = async (req: Request): Promise<AuthenticationRuleResult> => {
  try {
    const guestUserId = req.cookies.guest_user_id;
    if (typeof guestUserId !== "string") {
      throw new FoodAuthenticationError("Invalid guest cookie");
    }
    const user = await getGuestById(guestUserId, prisma);

    if (!user) {
      throw new FoodAuthenticationError("Invalid guest cookie");
    }

    return { valid: true, payload: { user: user } };
  } catch (error) {
    return { valid: false, error: error };
  }
};

const validateMerchantJWTRule = async (req: Request): Promise<AuthenticationRuleResult> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new FoodAuthenticationError("Invalid merchant token");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, settings.jwtSecret);

    return Promise.resolve({ valid: true, payload: { merchant: decoded } });
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return Promise.resolve({ valid: false, error: new FoodAuthenticationError("JWT Error") });
    }
    return Promise.resolve({ valid: false, error: error });
  }
};

export const guestAuthenticator = new AuthenticationMiddleware(new AuthRule(validateGuestCookieRule));
export const merchantAuthenticator = new AuthenticationMiddleware(new AuthRule(validateMerchantJWTRule));

export const guestOrMerchantAuthenticator = new AuthenticationMiddleware(
  new AuthRuleOr([new AuthRule(validateGuestCookieRule), new AuthRule(validateMerchantJWTRule)])
);

export const guestXORMerchantAuthenticator = new AuthenticationMiddleware(
  new AuthRuleOr([
    new AuthRuleAnd([new AuthRule(validateGuestCookieRule), new AuthRuleNot(new AuthRule(validateMerchantJWTRule))]),
    new AuthRuleAnd([new AuthRuleNot(new AuthRule(validateGuestCookieRule)), new AuthRule(validateMerchantJWTRule)]),
  ])
);

export const exportValidationUnitsForTesting = {
  validateGuestCookieRule,
  validateMerchantJWTRule,
}

export const exportAuthClassesForTesting = {
  AuthRule,
  AuthRuleAnd,
  AuthRuleOr,
  AuthRuleNot,
  AuthenticationMiddleware,
}