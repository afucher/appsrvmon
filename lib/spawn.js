'use strict';
const childProcess = require('child_process');
const _spawn = childProcess.spawn;
const watch = require('./watch');
const path = require('path');
var bus = require('../utils/bus');

let run = (command) => {
  let shFlag = '/c';
  let appserver_path = command.path || 'appserver.exe';
  let restart = run.bind(this, command);
  let args = command.args || [];
  args.push('-console');
  args = args.join(' ');

  let stdio = ['pipe', 'pipe', 'pipe'];
    stdio = ['pipe', process.stdout, process.stderr];

  let child = _spawn(appserver_path,[args,shFlag], {
    stdio: stdio,
  });

  bus.on('restart', () => {
    child.kill();
    console.log('restarting...')
  })

  child.on('exit', function (code, signal) {
    restart();
  });

  //Start watching appserver.ini file
  watch(path.dirname(appserver_path));

};

module.exports = run;
