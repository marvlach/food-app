export class FoodError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, FoodError.prototype);
  }
}

export class FoodAuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, FoodAuthenticationError.prototype);
  }
}

export class FoodAuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, FoodAuthorizationError.prototype);
  }
}

export class FoodServiceUnavailableError extends Error {
  error: unknown;

  constructor(message: string, error: unknown) {
    super(message);
    this.error = error;
    Object.setPrototypeOf(this, FoodServiceUnavailableError.prototype);
  }
}

export class FoodServiceUnprocessableEntityError extends Error {
  error: unknown;

  constructor(message: string, error: unknown) {
    super(message);
    this.error = error;
    Object.setPrototypeOf(this, FoodServiceUnprocessableEntityError.prototype);
  }
}
