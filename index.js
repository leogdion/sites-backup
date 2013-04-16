var npminstall = require('./npminstall.js');

process.chdir(__dirname);

npminstall.begin('./backup.js', './config.json');
/*
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

    var os = require('os'),
      async = require('async'),
      fstream = require('fstream'),
      path = require('path'),
      detect = require('./Detect.js');

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
    fstream
    .Reader(configuration.directory)
    .pipe(path.resolve(configuration.tmpDir, 'web'));
    cb(configuration);
  },
  backupdb : function (error, results) {

  }
};

backup.oninstall = function (configurationPath, error, stdout, stderr) {
  var b = new backup(configurationPath);
  b.start(error, stdout, stderr);
};

backup.start = function (configurationPath) {
  npminstall.begin(backup.oninstall.bind(undefined, configurationPath));
};

backup.start('./config.json');
*/