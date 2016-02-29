#!/usr/bin/env node --harmony
'use strict';
var program = require('commander');
var spawn = require('../lib/spawn.js');
var path = require('path');

program
  .version('0.0.1')
  .option('-a, --appserver <path/to/appserver>', 'path to appserver.exe');

program.parse(process.argv);

let path_appserver = program.appserver || '';
path_appserver = path.resolve(path_appserver,'.\\appserver.exe');

let command = {
  path : path_appserver
};
spawn(command);
