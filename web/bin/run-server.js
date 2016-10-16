#!/usr/bin/env node
'use strict';

process.env.NODE_ENV = 'production';
let server;
try {
  server = require('progcon');
} catch (ex) {
  server = require('../web/server/index.js');
}
server.start(8080);
