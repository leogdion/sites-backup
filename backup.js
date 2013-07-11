
var os = require('os'),
  async = require('async'),
  wrench = require('wrench'),
  path = require('path'),
  detect = require('./Detect.js'),
  zip = require('./Zip.js'),
  fs = require('fs'),
  cloud = require('./Cloud.js'),
  randomizer = require('./Random.js'),
  dateFormat = require('dateformat'),
  rmdir = require('./RmDir.js'),
  spawn = require('child_process').spawn;

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
    console.log("reading configuration...");
    this.config = config;
    this.cloud = cloud.configure(this.config.cloud);
    this.now = new Date();
    async.concat(config.directories, detect.parse, this.parsedball.bind(this));
  },
  parsedball : function (error, results) {
    async.map(results, this.createtemp.bind(this), this.upload.bind(this));
  },
  createtemp : function (configuration, cb) {
    var tmpDir = path.resolve(os.tmpDir(), randomizer());
    configuration.tmpDir = tmpDir;
    fs.mkdir(tmpDir, this.tempcreated.bind(this, configuration, cb));
  },
  tempcreated : function (configuration, cb, error) {
    fs.mkdir(path.resolve(configuration.tmpDir, 'web'), this.webcreated.bind(this, configuration, cb));
  },
  webcreated : function (configuration, cb, error) {
    console.log(configuration.name + ": copying files...");
    wrench.copyDirRecursive(configuration.directory, path.resolve(configuration.tmpDir, 'web'), this.parseDb.bind(this, configuration ,cb));
  },
  parseDb : function (configuration, cb, error, files) {
    configuration.web.parse(configuration, this.backupdb.bind(this, configuration, cb));
  },
  backupdb : function (configuration, cb, error) {
    var fd = fs.createWriteStream(path.resolve(configuration.tmpDir, 'database.sql'));
    var dbConfig = this.config.databases[configuration.host];
    var dumpps = spawn('mysqldump', ['--add-drop-table', '-u' + dbConfig.user, '-p' + dbConfig.password, '-h' + configuration.host, configuration.databaseName]);
    console.log(configuration.name + ": beginning database backup...");
    dumpps.stdout.pipe(fd);
    dumpps.stderr.pipe(process.stderr);
    dumpps.on('close', this.compress.bind(this, configuration, cb));
  },
  compress : function (configuration, cb, code) {
    console.log(configuration.name + ": creating zip file...");
    zip(configuration.tmpDir, function(error, zipfile) {
      if (error) {
        cb(error);
        return;
      }
      configuration.tmpzip = zipfile;
      cb(undefined, configuration);
    });
  },
  upload : function (error, results) {
    if (error) {
      cb(error);
      return;
    }
    async.eachSeries(results, this.uploadFile.bind(this), this.cleanup.bind(this, results));
  },
  uploadFile : function (configuration, cb) {
    console.log(configuration.name + ": uploading backup...");
    this.cloud.upload(configuration.tmpzip, this.filename(configuration), cb);
  },
  filename : function (configuration) {
    return [dateFormat(this.now, "yy-mm-dd-HHMM"), path.basename(configuration.directory), path.extname(configuration.tmpzip).substring(1)].join('.');
  },
  cleanup : function (results, error) {
    if (error) {
      cb(error);
      return;
    }
    console.log("cleaning up...");
    async.each(results, this.deletefiles.bind(this), this.done.bind(this));
  },
  deletefiles : function (configuration, cb) {
    fs.unlink(configuration.tmpzip, this.deletefolder.bind(this, configuration.tmpDir, cb));
  },
  deletefolder : function (directory, cb, error) {
    if (error) {
      cb(error);
      return;
    }
    rmdir(directory, cb);
  },
  done : function (error) {
    if (error) {
      console.log(error);
      return;
    }
    console.log('completed.');
  }
};

backup.oninstall = function (configurationPath, error, stdout, stderr) {
  var b = new backup(configurationPath);
  b.start(error, stdout, stderr);
};
module.exports = backup;


