import exp from "constants";
import { createNewOrder, getOrders } from "../../services/order.service";

const mockUser = {
  id: "123",
  name: "Takis",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const order = {
  currency: "USD",
  address: "Vas. Sofias 5, Athens",
  order_items: [
    {
      item_id: "1",
      quantity: 1,
      comment: "xwris alati",
    },
    {
      item_id: "12",
      quantity: 3,
      comment: "toubano",
    },
    {
      item_id: "32",
      quantity: 5,
      comment: "",
    },
  ],
};

const mockPrisma = {
  item: {
    findMany: async () => {
      return Promise.resolve([order]);
    },
  },
  order: {
    findMany: async () => {
      return Promise.resolve([
        { id: "1", priceEUR: 123 },
        { id: "12", priceEUR: 301 },
        { id: "3", priceEUR: 1343 },
      ]);
    },
    create: () => ({ created: true }),
  },
};

const mockExchangeApi = {
  exchange: {
    get: () => ({ dates: "2023-01-01", rates: { USD: 1.321 } }),
  },
};

describe("Everything should be mockable in service layer", () => {
  it("should post an order", async () => {
    // @ts-ignore
    const result = await createNewOrder(mockUser, order, mockPrisma, mockExchangeApi);
    expect(result).toEqual({ created: true });
  });

  it("should get orders", async () => {
    // @ts-ignore
    const orders = await getOrders(undefined, mockPrisma);
    expect(orders).toEqual(orders)
  });
});
