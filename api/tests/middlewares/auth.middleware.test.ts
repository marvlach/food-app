import { exportValidationUnitsForTesting, exportAuthClassesForTesting } from "../../middlewares/auth.middleware";
import { Request } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { getGuestById } from "../../services/auth.service";
import { prisma } from "../../globals/prisma-client";
import { FoodAuthenticationError } from "../../utils/errors";

jest.mock("../../services/auth.service");
jest.mock("../../globals/prisma-client");
jest.mock("jsonwebtoken");

const { validateGuestCookieRule, validateMerchantJWTRule } = exportValidationUnitsForTesting;

const { AuthRule, AuthRuleAnd, AuthRuleOr, AuthRuleNot, AuthenticationMiddleware } = exportAuthClassesForTesting;

const aUnitThatAlwaysRejects = jest.fn().mockResolvedValue({ valid: false, error: new Error("Invalid guest cookie") });
const aUnitThatAlwaysAccepts = jest
  .fn()
  .mockResolvedValue({ valid: true, payload: { withThisName: "attachThisToRequestObject" } });

/*  
 * All these tests were written from ChatGPT
 */
describe("Authentication Rules", () => {
  describe("Authentication Classes", () => {
    describe("AuthRule", () => {
      it("should authenticate successfully", async () => {
        const rule = new AuthRule(aUnitThatAlwaysAccepts);
        const req = {} as Request;

        const result = await rule.authenticate(req);

        expect(result).toEqual({ valid: true, payload: { withThisName: "attachThisToRequestObject" } });
        expect(aUnitThatAlwaysAccepts).toHaveBeenCalledWith(req);
      });

      it("should fail to authenticate", async () => {
        const rule = new AuthRule(aUnitThatAlwaysRejects);
        const req = {} as Request;

        const result = await rule.authenticate(req);

        expect(result).toEqual({ valid: false, error: new Error("Invalid guest cookie") });
        expect(aUnitThatAlwaysRejects).toHaveBeenCalledWith(req);
      });
    });

    describe("AuthRuleAnd", () => {
      it("should authenticate successfully with all rules valid", async () => {
        const andRule = new AuthRuleAnd([new AuthRule(aUnitThatAlwaysAccepts), new AuthRule(aUnitThatAlwaysAccepts)]);
        const req = {} as Request;

        const result = await andRule.authenticate(req);

        expect(result).toEqual({ valid: true, payload: { withThisName: "attachThisToRequestObject" } });
      });

      it("should fail to authenticate if any rule is invalid", async () => {
        const andRule = new AuthRuleAnd([new AuthRule(aUnitThatAlwaysAccepts), new AuthRule(aUnitThatAlwaysRejects)]);
        const req = {} as Request;

        const result = await andRule.authenticate(req);

        expect(result).toEqual({ valid: false, error: new Error("Invalid guest cookie") });
      });
    });

    describe("AuthRuleOr", () => {
      it("should authenticate successfully if at least one rule is valid", async () => {
        const orRule = new AuthRuleOr([new AuthRule(aUnitThatAlwaysRejects), new AuthRule(aUnitThatAlwaysAccepts)]);
        const req = {} as Request;

        const result = await orRule.authenticate(req);

        expect(result).toEqual({ valid: true, payload: { withThisName: "attachThisToRequestObject" } });
      });

      it("should fail to authenticate if all rules are invalid", async () => {
        const orRule = new AuthRuleOr([new AuthRule(aUnitThatAlwaysRejects), new AuthRule(aUnitThatAlwaysRejects)]);
        const req = {} as Request;

        const result = await orRule.authenticate(req);

        expect(result).toEqual({ valid: false, error: new Error("Invalid guest cookie") });
      });
    });

    describe("AuthRuleNot", () => {
      it("should authenticate successfully if the rule is invalid", async () => {
        const notRule = new AuthRuleNot(new AuthRule(aUnitThatAlwaysRejects));
        const req = {} as Request;

        const result = await notRule.authenticate(req);

        expect(result).toEqual({ valid: true, payload: {} });
      });

      it("should fail to authenticate if the rule is valid", async () => {
        const notRule = new AuthRuleNot(new AuthRule(aUnitThatAlwaysAccepts));
        const req = {} as Request;

        const result = await notRule.authenticate(req);

        expect(result).toEqual({ valid: false, error: new FoodAuthenticationError("Unauthenticated") });
      });
    });

    describe("AuthenticationMiddleware", () => {
      it("should authenticate and attach payload to request", async () => {
        const andRule = new AuthRuleAnd([new AuthRule(aUnitThatAlwaysAccepts)]);
        const middleware = new AuthenticationMiddleware(andRule);
        const req = {} as Request;
        const res = {} as Response;
        const next = jest.fn();

        // @ts-ignore
        await middleware.authenticate(req, res, next);
        // @ts-ignore
        expect(req.withThisName).toEqual("attachThisToRequestObject");
        expect(next).toHaveBeenCalledWith();
      });

      it("should fail to authenticate and call next with error", async () => {
        const andRule = new AuthRuleAnd([new AuthRule(aUnitThatAlwaysRejects)]);
        const middleware = new AuthenticationMiddleware(andRule);
        const req = {} as Request;
        const res = {} as Response;
        const next = jest.fn();
        // @ts-ignore
        await middleware.authenticate(req, res, next);

        expect(next).toHaveBeenCalledWith(new Error("Invalid guest cookie"));
      });
    });
  });

  describe("validateGuestCookieRule", () => {
    it("should validate guest cookie successfully", async () => {
      const mockRequest = {
        cookies: { guest_user_id: "valid_guest_id" },
      };
      const mockUser = { id: "valid_guest_id", name: "Guest User" };

      (getGuestById as jest.Mock).mockResolvedValue(mockUser);
      // @ts-ignore
      const result = await validateGuestCookieRule(mockRequest);
      expect(result).toEqual({ valid: true, payload: { user: mockUser } });
      expect(getGuestById).toHaveBeenCalledWith("valid_guest_id", prisma);
    });

    it("should fail to validate guest cookie with invalid ID", async () => {
      const mockRequest = {
        cookies: { guest_user_id: "invalid_guest_id" },
      };

      (getGuestById as jest.Mock).mockResolvedValue(null);
      // @ts-ignore
      const result = await validateGuestCookieRule(mockRequest);

      expect(result).toEqual({ valid: false, error: new FoodAuthenticationError("Invalid guest cookie") });
    });

    it("should fail to validate guest cookie without ID", async () => {
      const mockRequest = {
        cookies: {},
      } as Request;

      const result = await validateGuestCookieRule(mockRequest);

      expect(result).toEqual({ valid: false, error: new FoodAuthenticationError("Invalid guest cookie") });
    });
  });

  describe("validateMerchantJWTRule", () => {
    it("should validate merchant JWT successfully", async () => {
      const mockRequest = {
        headers: { authorization: "Bearer valid_jwt_token" },
      } as Request;
      const mockDecoded = { merchantId: "merchant_id", name: "Merchant" };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const result = await validateMerchantJWTRule(mockRequest);

      expect(result).toEqual({ valid: true, payload: { merchant: mockDecoded } });
      expect(jwt.verify).toHaveBeenCalledWith("valid_jwt_token", expect.any(String));
    });

    it("should fail to validate merchant JWT with invalid token", async () => {
      const mockRequest = {
        headers: { authorization: "Bearer invalid_jwt_token" },
      } as Request;

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new JsonWebTokenError("invalid token");
      });

      const result = await validateMerchantJWTRule(mockRequest);

      expect(result).toEqual({ valid: false, error: new FoodAuthenticationError("JWT Error") });
    });

    it("should fail to validate merchant JWT without authorization header", async () => {
      const mockRequest = {
        headers: {},
      } as Request;

      const result = await validateMerchantJWTRule(mockRequest);

      expect(result).toEqual({ valid: false, error: new FoodAuthenticationError("Invalid merchant token") });
    });
  });
});
