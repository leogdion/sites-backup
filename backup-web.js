var exec = require('child_process').exec

process.chdir(__dirname);

exec('npm install', {env: process.env} , function (error, stdout, stderr) {
    if (error) {
      console.log('exec error: ' + error);
      process.exit(1);
    }

    var async = require('async'),
      fs = require('fs'),
      configreader = require('./ConfigReader.js'),
      detect = require('./Detect.js');

    configreader.get( function (error, config) {
      if (error) {
        console.log(error);
        process.exit(1);
      }

      async.each(config.directories, detect.parse, function (error) {
        console.log(error);
      });
    //  config.directories.each()
    });
});
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


