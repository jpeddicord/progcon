
export class RequestError {
  constructor(message) {
    this.name = 'RequestError';
    this.message = message;
    this.stack = new Error().stack;
    this.status = 400;
  }
}

export class AuthError {
  constructor(message) {
    this.name = 'AccessError';
    this.message = message;
    this.stack = new Error().stack;
    this.status = 401;
  }
}

export class AccessError {
  constructor(message) {
    this.name = 'AccessError';
    this.message = message;
    this.stack = new Error().stack;
    this.status = 403;
  }
}
