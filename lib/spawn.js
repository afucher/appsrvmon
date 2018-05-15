'use strict';

const childProcess = require('child_process');
const _spawn = childProcess.spawn;
const watch = require('./watch');
const path = require('path');
const fs = require('fs');
var bus = require('../utils/bus');
const noop = () => {};


let run = (command, client, watchINI) => {
  let shFlag = '/c';
  let serverName = process.platform == 'win32' ? 'appserver.exe' : 'appsrvlinux';
  let appserver_path = command.path || serverName;
  let restart = run.bind(this, command);
  let _restart = noop;
  let args = command.args || [];

  args.push('-console');
  args = args.join(' ');

  // allow appsrvmon to restart when the use types 'rs\n'
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function (data) {
    data = (data + '').trim().toLowerCase();

    // if the keys entered match the restartable value, then restart!
    if (data === 'rs') {
      bus.emit('restart');
    }
  
    if (data === 'ini') {
      bus.emit('iniFile');
    }

    if(data === 'sc') {
      bus.emit('smartClient');
    }
  });

  let stdio = ['pipe', process.stdout, process.stderr];

  console.log('Appsrvmon starting Application Server...');

  let child = _spawn(appserver_path,[args,shFlag], {
    stdio: stdio,
  });

  bus.on('restart', () => {
    console.log('Restarting...');
    _restart = restart;
    process.stdin.removeAllListeners();
    bus.removeAllListeners();
    child.kill();
  })

  bus.on('iniFile', () => {
    let ini = path.dirname(appserver_path) + path.sep + 'appserver.ini';

    if(fs.existsSync(ini)) {
      childProcess.exec(path.dirname(appserver_path) + path.sep + 'appserver.ini');
    }
  });

  bus.on('smartClient', () => {
    let binClient;

    if(client) {
      if(fs.existsSync(client)) {
        let stat = fs.statSync(client);

        if(stat.isFile()) {
          binClient = path.dirname(client);
        }
        else {
          binClient = client;
        }
      }
    }
    else {
      let paths = path.dirname(appserver_path).split(path.sep);

      binClient = '';

      for( let i = 0; i < paths.length - 1; i++) {
        binClient += paths[i] + path.sep;
      }

      binClient += 'smartclient';

      if (!fs.existsSync(binClient)) {
        binClient = null;
      }
    }

    if(binClient) {
      let win = process.platform == 'win32';

      binClient = binClient + path.sep + 'smartclient' + ( win ? '.exe' : '' );

      if(fs.existsSync(binClient)) {
        childProcess.exec(binClient + (win ? ' -M -Q' : '' ) );
      }
    }
  });

  process.once('SIGINT', function () {
    if (child) {
      child.kill();
      //Sends message to appserver
      console.log('YES\n');
    }
    process.exit(0);
  });

  child.on('exit', function (code, signal) {
    _restart();
  });

  //Start watching appserver.ini file
  if(!watchINI || !( watchINI == 'NO' || watchINI == 'NOT' || watchINI == 'NAO' || watchINI == 'N') ) {
    watch(path.dirname(appserver_path));
  }

};

module.exports = run;