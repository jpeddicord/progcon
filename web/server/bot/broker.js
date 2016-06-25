/**
 * Nanomsg socket wrapper to queue REQ/REP calls while waiting for responses.
 */
export default class Broker {

  _waiting = false;
  _queue = [];
  _active = null;

  constructor(socket) {
    this.socket = socket;
    this.socket.on('data', this._recv);
  }

  get size() {
    return this._queue.length;
  }

  /**
   * Queue up a message to send over the socket.
   *
   * Returns a Promise that resolves on message response.
   */
  send(data) {
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

    this._active = this._queue.shift();
    this.socket.send(this._active.data);
  };

  /**
   * Receive a response, resolve the promise, and continue draining the queue.
   */
  _recv = buf => {
    this._active.resolve(buf);
    this._active = null;
    this._waiting = false;

    this._drain();
  };

}
