var DirectoryDetect = (function () {
  var async = require('async'),
    webs = require('./Webs.js'),
    fstream = require('fstream'),
    tar = require('tar'),
    zlib = require('zlib');

  var my = function () {

  };

  my.prototype = {
    begin : function (configuration, cb) {
      for (var key in configuration) {
        var value = configuration[key];
        async.detect(Object.keys(webs), this.test.bind(this, value), this.ondetect.bind(this, configuration, cb));
        return;
      }
      cb();
    },
    test : function (value, type, cb) {
      webs[type].evaluate(value, cb);
    },
    ondetect : function (configuration, cb, result) {/*
      fstream.Reader({ 'path': configuration['directory'], 'type': 'Directory' }) 
        .pipe(tar.Pack()) 
        .pipe(zlib.Gzip())
        .pipe(fstream.Writer({ 'path': 'compressed_folder.tar.gz' }));   
        */
      if (result) {
        configuration.web = webs[result];
        configuration.webname = result;
        cb(undefined, [configuration]);
      } else if (configuration.optional) {
        cb(undefined, []);
      } else {
        cb("Could not detect directory type.");
      }
    }
  };

  return my;  
})();

module.exports = new DirectoryDetect();
 