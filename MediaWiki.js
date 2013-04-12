var MediaWiki = (function () {
  var fs = require('fs'),
    path = require('path');
    
  var my = function () {

  };

  my.prototype = {  	
    evaluate : function (dirPath, cb) {
      fs.exists(path.resolve(dirPath, 'LocalSettings.php'), cb);
    }
  };

  return my;  
})();

module.exports = new MediaWiki();
 