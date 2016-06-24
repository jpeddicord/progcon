const config = {
  database: {
    host: '',
    database: '',
    user: '',
    password: '',
  },
  jwt: {
    // set this to a random string
    secret: '',
  },
  admin: {
    password: '',
  },
  problems: {
    paths: [
      '../../sample-problems',
    ],
  bot: {
    ipcCommands: 'tcp://localhost:12345',
  },
};

export function load() {
  return Promise.resolve();
}

export default config;
