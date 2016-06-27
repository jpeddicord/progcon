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
  },
  bots: [
    // load-balanced between the list of configs here
    {
      socket: 'tcp://localhost:12345',
      logLevel: 'info',
      logFile: '/tmp/progcon-bot.log',
    },
    // add more; use a unique socket and log file for each!
  ],
};

export function load() {
  return Promise.resolve();
}

export default config;
