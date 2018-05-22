#!/usr/bin/env node --harmony
'use strict';

var program = require('commander');
var spawn = require('../lib/spawn.js');
var path = require('path');
var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync(__dirname + '/../package.json'));

let serverName = process.platform == 'win32' ? 'appserver.exe' : 'appsrvlinux';

program
  .version(pkg.version)
  .option('-a, --appserver <path/to/appserver>', 'path to ' + serverName )
  .option('-c, --smartclient <path/to/smartclient>', 'path to smartclient' )
  .option('-d, --disablewatchini <disable/watch/ini/file>', 'disable watch ini file' );

program.parse(process.argv);

let path_client = program.smartclient;
let disablewatchini = program.disablewatchini;
let path_appserver = program.appserver || '';

path_appserver = path.resolve(path_appserver,'.\\' + serverName );

let command = {
  path : path_appserver
};

spawn(command,path_client,disablewatchini);
