var exec = require('child_process').exec

process.chdir(__dirname);

var backup = function (configurationPath) {

};

backup.prototype = {
  start : function (error) {
    if (error) {
      console.log('exec error: ' + error);
      process.exit(1);
    }

    var configreader = require('./ConfigReader.js');

    configreader.get( this.ongetconfiguration.bind(this));
  },
  ongetconfiguration : function (error, config) {
    if (error) {
      console.log(error);
      process.exit(1);
    }

    var async = require('async'),
      detect = require('./Detect.js');

    async.concat(config.directories, detect.parse, this.backupall.bind(this));
  //  config.directories.each()
  },
  backupall : function (error, results) {
    console.log(results);
  }
};

backup.oninstall = function (configurationPath, error, stdout, stderr) {
  var b = new backup(configurationPath);
  b.start(error, stdout, stderr);
};

backup.start = function (configurationPath) {
  exec('npm install', {env: process.env}, backup.oninstall.bind(undefined, configurationPath));
};

backup.start('./config.json');

  /*
install.stdout.on('data', function (data) {
  console.log(data.toString());
});

install.stderr.on('data', function (data) {
  console.log(data.toString());
});

install.on('exit', function (code, signal) {

  var async = require('async');

 

});
*/
// 1. read config
//  if no config, report error
// 2. parse directories for path and type
// 3. backup each directory and mysql db


