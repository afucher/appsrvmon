'use strict';
var program = require('commander');
var spawn = require('./lib/spawn.js');
var path = require('path');

let serverName = process.platform == 'win32' ? 'appserver.exe' : 'appsrvlinux';

program
  .version('0.0.2')
  .option('-a, --appserver <path/to/appserver>', 'path to ' + serverName )
  .option('-c, --smartclient <path/to/smartclient>', 'path to smartclient' );

program.parse(process.argv);

let path_client = program.smartclient;
let path_appserver = program.appserver || '';
path_appserver = path.resolve(path_appserver,'.\\' + serverName );

let command = {
  path : path_appserver
};
//command.push(path_appserver);
console.log(command);
spawn(command,path_client);
