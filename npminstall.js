var exec = require('child_process').exec;

module.exports = {
	begin : function (cb) {
  		exec('npm install', {env: process.env}, cb);
	}
};