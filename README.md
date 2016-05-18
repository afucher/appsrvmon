[![Stories in Ready](https://badge.waffle.io/afucher/appsrvmon.png?label=ready&title=Ready)](https://waffle.io/afucher/appsrvmon)
# Appsrvmon

For use in **development** environment of applications that use [TOTVS | Application Server](http://tdn.totvs.com/display/tec/Application+Server).

appsrvmon will watch the [ini](http://tdn.totvs.com/pages/viewpage.action?pageId=6064745) file in the appserver's directory.

appsrvmon simply wraps [TOTVS | Application Server](http://tdn.totvs.com/display/tec/Application+Server) and keeps an eye on ini file that have changed. Remember that appsrvmon is a replacement wrapper for appserver, think of it as replacing the command `appserver -console` on the command line.

[![npm version](https://badge.fury.io/js/appsrvmon.svg)](https://badge.fury.io/js/appsrvmon)

# Installation

Either through forking or by using [npm](http://npmjs.org) (the recommended way):

    npm install -g appsrvmon

And appsrvmon will be installed in to your bin path. Note that as of npm v1, you must explicitly tell npm to install globally as appsrvmon is a command line utility.

# Usage

appsrvmon wraps the execution of [TOTVS | Application Server](http://tdn.totvs.com/display/tec/Application+Server), so you can just run in the appserver directory:

    appsrvmon

If you want to specify the path of the application server, just use:  

    appsrvmon -a path\to\application_server

For CLI options, use the `-h` (or `--help`) argument:

    appsrvmon -h

## Future features
 - [ ] Config which .ini keys will make the application server restart when changed
 - [ ] Command to rename/move the console.log file

## Automatic re-running

appsrvmon will restart the application server whenever the .ini file changes.

## Manual restarting

If you need to manually restart your application, instead of stopping and restart appsrvmon, you can simply type `rs` with and `enter`, and apprvmon will restart your application server.

# Credits
This tool is inspired by: [nodemon](https://github.com/remy/nodemon)

# Attention!!
This tool does not have any link with TOTVS, this repository is fully independent.
