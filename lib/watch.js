module.exports = watch;

var chokidar = require('chokidar');
var bus = require('../utils/bus');
var _ = require('underscore');
var watcher
var debouncedBus;

function watch( path ){
  path = path || '';
  if (watcher) return;
   watcher = chokidar.watch(path + '/appserver.ini', {
    ignored: /[\/\\]\./,
    persistent: true
  });

  if (debouncedBus === undefined) {
    debouncedBus = _.debounce(restartBus, 300);
  }
  // Something to use when events are received.
  var log = console.log.bind(console);
  // Add event listeners.
  watcher
    .on('change', debouncedBus)
    //.on('change', path => log(`File ${path} has been changed`))

};

restartBus = () => {
  console.log("Restarting...");
  bus.emit('restart');
}
