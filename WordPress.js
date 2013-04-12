var WordPress = (function () {
  var fs = require('fs'),
    path = require('path');

  var my = function () {

  };

  my.prototype = {
    evaluate : function (dirPath, cb) {
      fs.exists(path.resolve(dirPath, 'wp-config.php'), cb);
    }
  };

  return my;  
})();

module.exports = new WordPress();
 