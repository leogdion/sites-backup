var Zip = (function () {
  var randomizer = require('./Random.js'),
    zip = require('adm-zip'),
    os = require('os'),
    async = require('async'),
    fs = require('fs'),
    path = require('path');

  var instance = function (directory) {
    this.directory = directory;
  };

  instance.prototype = {
    begin : function (cb) {
      this.cb = cb;
      this.zipfile = path.join(os.tmpDir(), randomizer() + ".zip");
      this.zip = new zip();
      this.zip.addLocalFolder(this.directory, ".");
      this.zip.writeZip(this.zipfile);
      //this.zip.toBuffer(this.onBuffer.bind(this, cb));
      cb(undefined, this.zipfile);
      //this.addFiles([this.directory], this.finish.bind(this, cb));
    },
    onBuffer : function (cb, buffer) {
      console.log('writing file...');
      fs.writeFile(this.zipfile, buffer, this.end.bind(this, cb));
    },
    addFiles : function (files, cb) {
      async.eachSeries(files, this.drill.bind(this), cb);
    },
    drill : function (file, cb) {
      fs.stat(file, this.onstat.bind(this, file, cb));
    },
    onstat : function (file, cb, error, stats) {
      if (error) {
        cb(error);
        return;
      }
      if (stats.isDirectory()) {        
        fs.readdir(file, this.onreaddir.bind(this, cb, file));
      } else {
        fs.readFile(file, this.onreadfile.bind(this, cb, file));
      }
    },
    onreaddir : function (cb, dir, error, files) {
      if (error) {
        cb(error);
        return;
      }
      async.map(files, this.resolvepath.bind(this, dir), this.pathresolved.bind(this, cb));
    },
    onreadfile : function (cb, file, error, data) {
      if (error) {
        cb(error);
        return;
      }
      this.zip.file(path.relative(this.directory, file), data.toString());
      cb();
    },
    resolvepath : function (dir, file, cb) {
      cb(undefined, path.resolve(dir, file));
    },
    pathresolved : function (cb, error, files) {
      if (error) {
        cb(error);
        return;
      }
      this.addFiles(files, cb);      
    },
    finish : function (cb, error) {
      if (error) {
        cb(error);
        return;
      }
      console.log(this.directory + ": writing file...");
      fs.writeFile(this.zipfile,  this.zip.generate({base64:false,compression:'DEFLATE'}), 'binary', this.end.bind(this, cb));
    },
    end : function (cb, error) {
      cb(error, this.zipfile);
    }
  };

  var my = function (directory, cb) {
    var that  = new instance(directory);
    that.begin(cb);
  };

  return my;
})();

module.exports = Zip;