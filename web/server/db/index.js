import pgp from 'pg-promise';
import config from '../config';

let opts = {};

if (process.env.NODE_ENV === 'development') {
  const monitor = require('pg-monitor');
  monitor.attach(opts);
}

const db = pgp(opts)(config.database);

export default db;
