/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */


export class RequestError extends Error {
  status: number;
  constructor(message) {
    super(message);
    this.name = 'RequestError';
    this.message = message;
    this.stack = new Error().stack;
    this.status = 400;
  }
}

export class AuthError extends RequestError {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.status = 401;
  }
}

export class AccessError extends RequestError {
  constructor(message) {
    super(message);
    this.name = 'AccessError';
    this.status = 403;
  }
}

export class NotFoundError extends RequestError {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}
