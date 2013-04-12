var DirectoryDetect = (function () {
  var my = function () {

  };

  my.prototype = {
    begin : function (configuration, cb) {
      for (var key in configuration) {
        var value = configuration[key];
        cb(undefined, [configuration]);
        return;
      }
      console.log('test');
      cb();
    }
  };

  return my;  
})();

module.exports = new DirectoryDetect();
 