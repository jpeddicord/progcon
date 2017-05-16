'use strict';

var config = {
  logLevel: 'silly',
  database: {
    host: 'localhost',
    database: 'progcon',
    user: 'jacob',
    password: null,
  },
  jwt: {
    secret: 'alksdjhflkasdhf',
  },
  admin: {
    passwordHash: 'ae95fd24e51b4c14a76a8f5550abd96d',
  },
  problems: {
    paths: [__dirname + '/../../../sample-problems'],
  },
  bots: [
    // load-balanced between the list of configs here
    {
      socket: 'ipc:///tmp/progcon-bot.1',
      logLevel: 'trace',
      logFile: '/home/jacob/Desktop/progcon-bot.log.1',
    }, {
      socket: 'ipc:///tmp/progcon-bot.2',
      logLevel: 'debug',
      logFile: '/home/jacob/Desktop/progcon-bot.log.2',
    },
  ],
  registration: {
    // extra registration fields
    fields: [
      { name: 'email', label: 'Email Address' },
    ],
  },
};

exports.load = function () {
  return Promise.resolve(config);
};
exports.config = config;
