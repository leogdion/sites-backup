
var os = require('os'),
  async = require('async'),
  wrench = require('wrench'),
  path = require('path'),
  detect = require('./Detect.js'),
  fs = require('fs');

function makeid()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 5; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

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


    async.concat(config.directories, detect.parse, this.parsedball.bind(this));
  //  config.directories.each()
  },
  parsedball : function (error, results) {
    async.map(results, this.createtemp.bind(this), this.backupdb.bind(this));
  },
  createtemp : function (configuration, cb) {
    var tmpDir = path.resolve(os.tmpDir(), makeid());
    configuration.tmpDir = tmpDir;
    fs.mkdir(tmpDir, this.tempcreated.bind(this, configuration, cb));
    //cb(undefined, configuration);
  },
  tempcreated : function (configuration, cb, error) {
    fs.mkdir(path.resolve(configuration.tmpDir, 'web'), this.webcreated.bind(this, configuration, cb));
  },
  webcreated : function (configuration, cb, error) {
    console.log(configuration.tmpDir);
    wrench.copyDirRecursive(configuration.directory, path.resolve(configuration.tmpDir, 'web'), this.parseDb.bind(this, configuration ,cb));
  },
  parseDb : function (configuration, cb, error, files) {
    configuration.web.parse(configuration, cb);
  },
  backupdb : function (error, results) {
    console.log(results);
  }
};

backup.oninstall = function (configurationPath, error, stdout, stderr) {
  var b = new backup(configurationPath);
  b.start(error, stdout, stderr);
};
/*
backup.start = function (configurationPath) {
  npminstall.begin(backup.oninstall.bind(undefined, configurationPath));
};

backup.start('./config.json');
*/

module.exports = backup;
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


