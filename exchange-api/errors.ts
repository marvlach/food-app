export class ExchangeApiError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ExchangeApiError.prototype);
  }
}

export class ExchangeApiAuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ExchangeApiAuthenticationError.prototype);
  }
}

export class ExchangeApiAuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ExchangeApiAuthorizationError.prototype);
  }
}
