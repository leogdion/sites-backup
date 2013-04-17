var S3 = (function () { 
  var instance = function (config) {
    //this.AWS = reqire()
  };

  instance.prototype = {
    upload : function (file, key, cb) {
      cb();
    }
  };

  var my = function () {

  };

  my.prototype = {  
    configure : function (config) {
      return new instance(config);
    }
  };

  return my;  
})();

module.exports = new S3();
 