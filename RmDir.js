var RmDir = (function () { 
  var async = require('async'),
    fs = require('fs'),
    path = require('path');

  var my = function (directory, cb) {
    console.log(directory);
    my.deletedir(directory, cb);
  };

  my.deletedir = function (directory, cb) {
    fs.readdir(directory, my.deletefiles.bind(undefined, directory, cb));
  };

  my.deletefiles = function (directory, cb, error, files) {
    async.each(files, my.deleteitem.bind(undefined, directory), my.rmdir.bind(undefined, directory, cb));
  };

  my.deleteitem = function (directory, file, cb) {
    file = path.resolve(directory, file);
    fs.stat(file, my.stat.bind(undefined, file, cb));
  };

  my.stat = function (file, cb, error, stats) {
    if (stats.isDirectory()) {
      my.deletedir(file, cb);
    } else {
      fs.unlink(file, cb);
    }
  };

  my.rmdir = function (directory, cb, error) {
    fs.rmdir(directory, cb);
  };

  return my;  
})();

module.exports = RmDir;
 