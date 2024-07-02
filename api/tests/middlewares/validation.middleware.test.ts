import { exportRequestArgsValidatorForTesting } from "../../middlewares/validation.middleware";
import { z } from "zod";
import { FoodServiceUnprocessableEntityError } from "../../utils/errors";

const SomeBodySchema = z.object({
  currency: z.string(),
  address: z.string(),
});

const SomeParamsSchema = z.object({
  currency: z.string(),
  address: z.string(),
});

const together = { body: SomeBodySchema, params: SomeParamsSchema };

const validator = new exportRequestArgsValidatorForTesting.RequestArgsValidator(together);

describe("Mock this, mock that", () => {
  it("should succeed at validating", async () => {
    const mockRequest = {
      body: { currency: "12", address: "232" },
      params: { currency: "12", address: "232" },
    };
    const mockNextFunction = jest.fn(() => {});
    // @ts-ignore
    validator.validate(mockRequest, {}, mockNextFunction);
    expect(mockNextFunction).toHaveBeenCalledWith()
  });

  it("should fail at validating", async () => {
    const mockRequest = {
      body: { currency: "12", address: "232" },
    };
    const mockNextFunction = jest.fn(() => {});
    // @ts-ignore
    validator.validate(mockRequest, {}, mockNextFunction);
    expect(mockNextFunction).toHaveBeenCalledWith(expect.any(FoodServiceUnprocessableEntityError))
  });
});
