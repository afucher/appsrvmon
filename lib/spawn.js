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

  let stdio = ['pipe', 'pipe', 'pipe'];
    stdio = ['ignore', process.stdout, process.stderr];

  let child = _spawn(appserver_path,[args,shFlag], {
    stdio: stdio,
  });

  bus.on('restart', () => {
    _restart = restart;
    child.kill();
    console.log('restarting...')
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
