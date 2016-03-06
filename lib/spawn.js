'use strict';
const childProcess = require('child_process');
const _spawn = childProcess.spawn;
const watch = require('./watch');
const path = require('path');
var bus = require('../utils/bus');
const noop = () => {};


let run = (command) => {
  let shFlag = '/c';
  let appserver_path = command.path || 'appserver.exe';
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
  });


  let stdio = ['pipe', process.stdout, process.stderr];
  console.log('Appsrvmon starting Application Server...');
  let child = _spawn(appserver_path,[args,shFlag], {
    stdio: stdio,
  });

  bus.on('restart', () => {
    console.log('Restarting...')
    _restart = restart;
    bus.removeAllListeners();
    child.kill();
  })

  process.once('SIGINT', function () {
    if (child) {
      child.kill();
      //Sends message to appserver
      console.log('YES\n')
    }
    process.exit(0);
  });

  child.on('exit', function (code, signal) {
    _restart();
  });

  //Start watching appserver.ini file
  watch(path.dirname(appserver_path));

};

module.exports = run;
