var fs = require('fs'),
  path = require('path'), 
  async = require('async');

var ParentDetect = (function () {
  var directorydetect = require('./DirectoryDetect.js');

  function begindetect (file, cb) {
    fs.stat(path.resolve(file, function (error, stats) {
      if (error) {
        console.log(error);
        cb(error);
        return;
      }
      if (stats.isDirectory()) {
        directorydetect.begin({
          "path" : file,
          "optional" : true
        }, cb);
      }
    });
  }

  function onreaddir (cb, parent, error, files) {
    if (error) {
      console.log(error);
      process.exit(1);
    }
    async.map(files, function ()
    async.each(, begindetect, cb);
  }


  var my = function () {

  };

  my.prototype = {
    begin : function (configuration, cb) {
      for (var key in configuration) {
        var value = configuration[key];
        fs.readdir(value, onreaddir.bind(undefined, cb, value));
        break;
      }
    }
  };

  return my;  
})();

module.exports = new ParentDetect();
