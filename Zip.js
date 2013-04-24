var Zip = (function () {
  var randomizer = require('./Random.js'),
    spawn = require('child_process').spawn,
    os = require('os'),
    async = require('async'),
    fs = require('fs'),
    path = require('path');
  };
  

 var my = function (directory, cb) {
    var zipfile = path.join(os.tmpDir(), randomizer() + ".zip");
    console.log('zipping ' + directory + ' to ' + zipfile);
    var zipps = spawn('zip', ['-R', zipfile, "*"], { cwd : directory });
    zipps.stdout.on('data', function (data) {
     // console.log(data.toString());
    });
    zipps.stderr.on('data', function (data) {
      console.log(data.toString());
      cb(data);
    });
    zipps.on('close', function (code) {
      console.log('completed ' + zipfile);
      cb(code || undefined, zipfile);
    });
  };

  return my;
})();

module.exports = Zip;
