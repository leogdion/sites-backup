var BaseWeb = (function () {
  var fs = require('fs'),
    path = require('path');
    
  var my = function () {

  };

  my.prototype = {  	
    evaluate : function (dirPath, cb) {
      fs.exists(path.resolve(dirPath, this.configurationFile), cb);
    },
    parse : function (configuration ,cb) {
      fs.readFile(path.resolve(configuration.directory, this.configurationFile), this.parseFile.bind(this, configuration, cb));
    },
    parseFile : function (configuration, cb, error, data) {
      for (var name in this.regexes) {
        configuration[name] = data.toString().match(this.regexes[name])[1];
      }
      cb();
    },
    build : function (configurationFile, regexes) {
  	  var that = function () {};
  	  that.prototype = new my();
  	  that.prototype.configurationFile = configurationFile;
  	  that.prototype.regexes = regexes;
	    return that; 
    }
  };

  return my;  
})();

module.exports = new BaseWeb();
 