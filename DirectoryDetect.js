var DirectoryDetect = (function () {
  var async = require('async'),
    path = require('path'),
    webs = require('./Webs.js');

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
    ondetect : function (configuration, cb, result) {
      if (result) {
        configuration.web = webs[result];
        configuration.webname = result;
        configuration.name = path.basename(configuration.directory);
        console.log(configuration.name + " (" + configuration.webname + ")");
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
 