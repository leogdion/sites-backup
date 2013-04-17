
var os = require('os'),
  async = require('async'),
  wrench = require('wrench'),
  path = require('path'),
  detect = require('./Detect.js'),
  fs = require('fs'),
  fstream = require('fstream'),
  tar = require('tar'),
  zlib = require('zlib'),
  spawn = require('child_process').spawn;

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
    console.log(configuration.tmpDir);
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
    configuration.zipfile = path.join(os.tmpDir(), makeid() + ".tar.gz");
    var writer = fstream.Writer({ 'path': configuration.zipfile });
    var reader = 
    fstream.Reader({ 'path': configuration.tmpDir, 'type': 'Directory' }) /* Read the source directory */
    .pipe(tar.Pack()) /* Convert the directory to a .tar file */
    .pipe(zlib.Gzip()) /* Compress the .tar file */
    .pipe(writer);
    /*
    writer.on("end", function () {
      console.log(configuration);
      cb(undefined, configuration);
    }); 
    reader.on("end", function () {
      console.log(configuration);
      cb(undefined, configuration);
    });
    */ 
      cb(undefined, configuration);


    //cb(undefined, configuration);
    //this.readfiles([configuration.tmpDir], this.onreaddirdone.bind(this, configuration, cb), configuration.tmpDir);
    //fs.readdir(configuration.tmpDir, this.onreaddir.bind(this, configuration, cb));
    //this.zipUpAFolder(this.this.compresscompleted.bind(this, configuration, cb));
    //console.log(code);
    //cb(undefined, configuration);
  },
  /*
  onreaddir : function (configuration, cb, error, files) {
    async.concat(files, this.readdir.bind(this), this.onreaddirdone.bind(this, configuration, cb));
  },
  onreadsubdir : function (configuration, cb, error, files) {
    async.concat(files, this.readdir.bind(this), cb);
  },
  */
  /*
  readfiles : function (files, cb, basePath) {
    //console.log(basePath);
    async.concat(files, this.readdir.bind(this, basePath), cb);
  },
  readdir : function (basePath, file, cb) {

    //console.log(basePath);
    fs.stat(file, this.onfilestat.bind(this, basePath, file, cb));
  },
  onreaddir : function (basePath, file, cb, error, files) {
    async.map(files, this.resolvepath.bind(this, file), this.pathsresolved.bind(this,basePath, cb));
  },
  resolvepath : function (dir, file, cb) {
    cb(undefined, path.join(dir, file));
  },
  pathsresolved : function (basePath,cb, error, files) {
    this.readfiles(files, cb, basePath);
  },
  onfilestat : function (basePath, file, cb, error, stat) {
    if (stat.isDirectory()) {
      fs.readdir(file, this.onreaddir.bind(this,basePath, file, cb));
    } else {
      //console.log(basePath);
      //console.log(file);
      //console.log(path.relative(basePath, file));
      cb(undefined,  { name: path.relative(basePath, file), path: file });
    }
  },
  onreaddirdone : function (configuration, cb, error, files) {
    var archive = new zip();
    archive.addFiles(files, this.savezip.bind(this, configuration, cb, archive));

  },
  savezip : function (configuration, cb, archive, error) {
    configuration.zipfile = path.join(os.tmpDir(), makeid() + ".zip");
    fs.writeFile(configuration.zipfile, archive.toBuffer(), this.zipFileSaved.bind(this, configuration, cb));
  },
  zipFileSaved : function (configuration, cb) {
    cb(undefined, configuration);
  },
  */
  /*
  zipUpAFolder : function(dir, callback) {
      var archive = new zip();

      // map all files in the approot thru this function
      folder.mapAllFiles(dir, function (path, stats, callback) {
          // prepare for the .addFiles function
          callback({ 
              name: path.replace(dir, "").substr(1), 
              path: path 
          });
      }, function (err, data) {
          if (err) return callback(err);

          // add the files to the zip
          archive.addFiles(data, function (err) {
              if (err) return callback(err);

              // write the zip file
              fs.writeFile(dir + ".zip", archive.toBuffer(), function (err) {
                  if (err) return callback(err);

                  callback(null, dir + ".zip");
              });                    
          });
      });    
  },
  */
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


