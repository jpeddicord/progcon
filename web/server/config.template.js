const config = {
  logLevel: 'info',
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
    // generate this with:
    // crypto.pbkdf2Sync('password', '', 1000000, 16, 'sha256');
    passwordHash: '',
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

// load any remote configuration here (passwords, for example)
exports.load = function () {
  return Promise.resolve(config);
};
exports.default = config;
