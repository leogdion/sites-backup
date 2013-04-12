var fs = require('fs'),
  async = require('async');

var ParentDetect = (function () {
  var directorydetect = require('./DirectoryDetect.js');

  function begindetect (file, cb) {
    fs.stat(file, function (error, stats) {
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

  function onreaddir (cb, error, files) {
    if (error) {
      console.log(error);
      process.exit(1);
    }

    async.each(files, begindetect, cb);
  }


  var my = function () {

  };

  my.prototype = {
    begin : function (configuration, cb) {
      for (var key in configuration) {
        var value = configuration[key];
        fs.readdir(value, onreaddir.bind(undefined, cb));
        break;
      }
    }
  };

  return my;  
})();

module.exports = new ParentDetect();
