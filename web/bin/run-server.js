#!/usr/bin/env node
'use strict';

process.env.NODE_ENV = 'production';
const server = require('progcon');
server.start(8080);
