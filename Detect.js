var Detect = (function () {
  var my = function () {

  };

  my.types = {
    'parent' : require('./ParentDetect.js')
  };

  my.prototype = {
    parse : function (configuration, cb) {
      if (configuration) {
        for (var key in configuration) {
          var detector = my.types[key];

          if (detector) {
            detector.begin(configuration, cb);
            return;
          }
        }
      }
      cb('Invalid Configuration');
    }
  };

  return my;  
})();


module.exports = new Detect();