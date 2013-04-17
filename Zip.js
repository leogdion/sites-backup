var Zip = (function () {
  var randomizer = require('./Random.js'),
    zip = require('node-zip'),
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
      this.zip = zip();
      cb(this.zipfile);
      this.addFiles([this.directory], this.finish.bind(this, cb));
    },
    addFiles : function (files, cb) {
      console.log(this.directory);
      async.each(files, this.drill.bind(this), cb);
    },
    drill : function (file, cb) {
      console.log(this.directory);
      fs.stat(file, this.onstat.bind(this, file, cb));
    },
    onstat : function (file, cb, error, stats) {
      if (error) {
      console.log('onstat');
        console.log(error);
        cb(error);
      }
      console.log('onstat');
      console.log(this.directory);
      if (stats.isDirectory()) {        
        fs.readdir(file, this.onreaddir.bind(this, cb, file));
      } else {
        fs.readFile(file, this.onreadfile.bind(this, cb, file));
        //console.log(basePath);
        //console.log(file);
        //console.log(path.relative(basePath, file));
        //cb(undefined,  { name: path.relative(basePath, file), path: file });
      }
    },
    onreaddir : function (cb, dir, error, files) {
      if (error) {
      console.log('onreaddir');
        console.log(error);
        cb(error);
      }
      console.log('onreaddir');
      console.log(this.directory);
      async.map(files, this.resolvepath.bind(this, dir), this.pathresolved.bind(this, cb));
    },
    onreadfile : function (cb, file, error, data) {
      if (error) {
      console.log('onreadfile');
        console.log(error);
        cb(error);
      }
      console.log('onreadfile');
      if (!this.directory) {
        process.exit(1);
      }
      //console.log(file);
      //console.log(this.directoy);
      //console.log(path.relative(this.directoy, file));
      this.zip.file(path.relative(this.directory, file), data.toString());
      cb();
    },
    resolvepath : function (dir, file, cb) {
      cb(undefined, path.resolve(dir, file));
    },
    pathresolved : function (cb, error, files) {
      if (error) {
        console.log('onreadfile');
        console.log(error);
        cb(error);
      }
      console.log('pathresolved');
      console.log(this.directory);
      this.addFiles(files, cb);      
    },
    finish : function (cb, error) {
      console.log(this.zipfile);
      fs.writeFile(this.zipfile,  this.zip.generate({base64:false,compression:'DEFLATE'}), 'binary', this.end.bind(this, cb));
      //cb(undefined, this.zipfile);
    },
    end : function (cb, error) {
      console.log(this.zipfile);
      console.log('done.');
      cb(error, this.zipfile);
    }
  };

  var my = function (directory, cb) {
    console.log(directory);
    var that  = new instance(directory);
    that.begin(cb);
  };

  return my;
})();

module.exports = Zip;