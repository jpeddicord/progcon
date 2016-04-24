import pgp from 'pg-promise';
import config from '../config';

const db = pgp()(config.database);

export default db;
