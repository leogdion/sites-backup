var S3 = (function () { 
  var fs = require('fs');

  var instance = function (config) {
    this.config = config;
    this.AWS = require('aws-sdk');
    this.AWS.config.update(config.config);
    this.s3 = new this.AWS.S3();
  };

  instance.prototype = {
    upload : function (file, key, cb) {
      fs.readFile(file, this.put.bind(this, file, key, cb));
    },
    put : function (file, key, cb, error, data) {
      if (error) {
        cb(error);
        return;
      }
      console.log(key);
      key = this.config.Folder ? 
        [this.config.Folder, key].join('/') :
        key;
      var obj = {
        Bucket : this.config.Bucket,
        Key : key,
        Body: data
      };
      this.s3.client.putObject(obj, cb);
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
 