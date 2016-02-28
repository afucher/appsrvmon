module.exports = watch;

var chokidar = require('chokidar');
var bus = require('../utils/bus');


function watch( path ){
  path = path || '';


  var watcher = chokidar.watch(path + '/appserver.ini', {
  ignored: /[\/\\]\./,
  persistent: true
});

// Something to use when events are received.
var log = console.log.bind(console);
// Add event listeners.
watcher
  .on('change', path =>   bus.emit('restart'))
  //.on('change', path => log(`File ${path} has been changed`))

};
