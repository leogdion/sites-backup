var DirectoryDetect = (function () {
  var my = function () {

  };

  my.prototype = {
    begin : function (configuration, cb) {
      for (var key in configuration) {
        var value = configuration[key];
        console.log(value);
        break;
      }
      cb();
    }
  };

  return my;  
})();

module.exports = new DirectoryDetect();
 