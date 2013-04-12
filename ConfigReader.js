var ConfigReader = (function () {
  var my = function () {

  };

  my.prototype = {
    get : function (filenameOrCallback, cb) {
      var config;
      var filename = typeof(filenameOrCallback) === 'string' ? filenameOrCallback : './config.json';
      cb = typeof(filenameOrCallback) === 'string' ? cb : filenameOrCallback;
      try {
        config = require(filename);
        cb(undefined, config);
      } catch (ex) {
        cb(ex, config);
      }
    }
  };

  return my;  
})();

module.exports = new ConfigReader();