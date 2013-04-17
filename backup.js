
var os = require('os'),
  async = require('async'),
  wrench = require('wrench'),
  path = require('path'),
  detect = require('./Detect.js'),
  zip = require('./Zip.js'),
  fs = require('fs'),
  fstream = require('fstream'),
  tar = require('tar'),
  zlib = require('zlib'),
  spawn = require('child_process').spawn;

function makeid()
{
  console.log('fix this...');
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
    this.config = config;
    async.concat(config.directories, detect.parse, this.parsedball.bind(this));
  //  config.directories.each()
  },
  parsedball : function (error, results) {
    async.map(results, this.createtemp.bind(this), this.upload.bind(this));
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
    wrench.copyDirRecursive(configuration.directory, path.resolve(configuration.tmpDir, 'web'), this.parseDb.bind(this, configuration ,cb));
  },
  parseDb : function (configuration, cb, error, files) {
    configuration.web.parse(configuration, this.backupdb.bind(this, configuration, cb));
  },
  backupdb : function (configuration, cb, error) {
    //mysqldump --add-drop-table -u root -p$MYSQL_PASSWORD $DB_NAME >$DUMP_PATH
    var fd = fs.createWriteStream(path.resolve(configuration.tmpDir, 'database.sql'));

    var dumpps = spawn('mysqldump', ['--add-drop-table', '-u' + this.config.database.user, '-p' + this.config.database.password, configuration.databaseName]);
    dumpps.stdout.pipe(fd);
    dumpps.stderr.pipe(process.stderr);
    dumpps.on('close', this.compress.bind(this, configuration, cb));
    //fs.open(path.resolve(configuration.tmpDir, 'database.sql'), 'ax', this.beginDump.bind(this, configuration, cb));
  },
  compress : function (configuration, cb, code) {
    cb(undefined, configuration);
    zip(configuration.tmpDir, function(error, zipfile) {
      configuration.tmpzip = zipfile;
    });
    /*
    zip(configuration.tmpDir, function (error, zipfile) {
      configuration.zipfile = zipfile;
      cb(error, configuration);
    });
*/
  },
  upload : function (error, results) {
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


