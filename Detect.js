var Detect = (function () {
  var my = function () {

  };

  my.types = {
    'parent' : require('./ParentDetect.js')
  };

  my.prototype = {
    parse : function (configuration, cb) {
      if (configuration) {
        console.log(configuration);
        for (var key in configuration) {
          var detector = my.types[key];

          if (detector) {
            detector.begin(configuration, cb);
            break;
          }
        }
      }
    }
  };

  return my;  
})();

module.exports = new Detect();