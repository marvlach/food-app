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
