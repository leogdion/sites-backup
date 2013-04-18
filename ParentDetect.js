var fs = require('fs'),
  path = require('path'), 
  async = require('async');

var ParentDetect = (function () {
  var directorydetect = require('./DirectoryDetect.js');

  var parser = function (parent) {
    this.parent = parent;
  };

  parser.prototype = {
    begin : function (file, cb) {
      
      fs.stat(path.resolve(this.parent, file), this.onstat.bind(this, file, cb));
      
    },
    onstat : function (file, cb, error, stat) {
      if (stat.isDirectory()) {
        directorydetect.begin({
          "directory" : path.resolve(this.parent, file),
          "optional" : true
        }, cb);
      } else {
        cb();
      }
    }
  };

  function onreaddir (cb, parent, error, files) {
    if (error) {
      console.log(error);
      process.exit(1);
    }
    var p = new parser (parent);
    async.concat(files, p.begin.bind(p), cb);
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
