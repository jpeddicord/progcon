import nanomsg from 'nanomsg';
import Broker from './broker';
import config from '../config';

const brokers = new Set();

export function initBalancer() {
  for (let conf of config.bots) {
    const b = createBroker(conf.socket);
    brokers.add(b);
  }
}

function createBroker(addr) {
  const socket = nanomsg.socket('req');
  socket.connect(addr);
  return new Broker(socket);
}

/**
 * Select a broker with the smallest queue.
 */
export function pickBroker() {
  let smallest = null;
  let smallestBroker;
  for (let broker of brokers) {
    const size = broker.size;

    // short circuit: empty queue will always be smallest, duh
    if (size === 0) {
      return broker;
    }

    if (smallest == null || size < smallest) {
      smallest = size;
      smallestBroker = broker;
    }
  }

  return smallestBroker;
}
