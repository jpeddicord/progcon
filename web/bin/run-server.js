#!/usr/bin/env node
'use strict';

process.env.NODE_ENV = 'production';
let server;
try {
  server = require('progcon');
} catch (ex) {
  // add this directory to PATH for bot binaries
  const parts = process.env.PATH.split(':');
  parts.unshift(__dirname);
  process.env.PATH = parts.join(':');
  console.log('Using PATH of', process.env.PATH);
  server = require('../web/server/index.js');
}
server.start(8080);
