#!/usr/bin/env node
require('babel-register')({
    presets: ['env']
});
require('./server/server.js')