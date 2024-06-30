import { ExchangeApiType } from "./exchange.service";

export async function getAllAvailableCurrencies(exchangeApi: ExchangeApiType) {
  const allExchanges = await exchangeApi.exchange.get(undefined);
  const allCurrencies = Object.keys(allExchanges.rates);
  return allCurrencies;
}
