var Cloud = (function () {
  var fs = require('fs'),
    path = require('path');
    
  var my = function () {

  };

  my.prototype = {  	
    configure : function (config) {
      var type = Object.keys(config)[0];
      return this.types[type].configure(config[type]);
    },
    types : {
      "aws-s3" : require('./S3.js')
    }
  };

  return my;  
})();

module.exports = new Cloud();
 