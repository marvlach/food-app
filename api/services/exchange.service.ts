import { StaticApiKeyInHeaderApiClient } from "../utils/axios-requests";
import { settings } from "../globals/settings";
import { FoodServiceUnavailableError } from "../utils/errors";

// class responsible for path "/exchange" of ExchangeApi
class ExchangeApiExchange {
  private client: StaticApiKeyInHeaderApiClient;
  private path = "/exchange";

  constructor(client: StaticApiKeyInHeaderApiClient) {
    this.client = client;
  }

  public async get(currency: string | undefined): Promise<{ date: string; rates: Record<string, number> }> {
    try {
      const response = await this.client.get(this.path, currency ? { params: { currency } } : {});
      return response;
    } catch (error) {
      const message = `
      [Exchange Api]: Erroreous response from external Exchange Api\n
      GET /exchange?currency=${currency}
      `;
      throw new FoodServiceUnavailableError(message, error);
    }
  }
}

/*  
// class responsible for /other path
class ExchangeApiOther {
  private client: StaticApiKeyInHeaderApiClient;
  private path = "/other";

  ...
}
*/

const exchangeClient = new StaticApiKeyInHeaderApiClient(settings.exchangeApiBaseUrl, {
  "x-app-name": settings.exchangeApiAppName,
  "x-api-key": settings.exchangeApiApiKey,
});

const exchange = new ExchangeApiExchange(exchangeClient);
// const other = new ExchangeApiOther(exchangeClient);

/* 
proxy object that exposes all paths of API,
if we had more paths they would be appended here.
Dev can treat HTTP request like repository layer
example: 
await exchangeApi.exchange.get()
await exchangeApi.other.post(args)
*/
export const exchangeApi = {
  exchange,
  // other
};

export type ExchangeApiType = {
  exchange: ExchangeApiExchange;
};
