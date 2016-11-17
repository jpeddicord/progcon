/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

interface Item {
  data: string;
  resolve: Function;
  reject: Function;
}

/**
 * Nanomsg socket wrapper to queue REQ/REP calls while waiting for responses.
 */
export default class Broker {
  socket: any;

  _waiting = false;
  _queue: Item[] = [];
  _active: Item | null = null;

  constructor(socket: any) {
    this.socket = socket;
    this.socket.on('data', this._recv);
  }

  get size() {
    return this._queue.length + (this._active != null ? 1 : 0);
  }

  /**
   * Queue up a message to send over the socket.
   *
   * Returns a Promise that resolves on message response.
   */
  send(data: string) {
    return new Promise((resolve, reject) => {
      this._queue.push({data, resolve, reject});
      this._drain();
    });
  }

  /**
   * Drain the queue, sending each item as the previous one finishes.
   */
  _drain = () => {
    if (this._waiting) {
      return;
    }
    if (this._queue.length === 0) {
      return;
    }
    this._waiting = true;

    this._active = this._queue.shift() as Item;
    this.socket.send(this._active.data);
  };

  /**
   * Receive a response, resolve the promise, and continue draining the queue.
   */
  _recv = (buf: string) => {
    if (this._active == null) {
      throw new Error('Internal state error: broker._active is null');
    }

    this._active.resolve(buf);
    this._active = null;
    this._waiting = false;

    this._drain();
  };

}
