var exec = require('child_process').exec;

module.exports = {
	begin : function (cb) {
		console.log("installing modules...");
		if (typeof(cb) === 'string') {
			var modName = cb;
			cb = function () {
				var mod = require(modName);
				mod.oninstall.apply(arguments);
			};
		}

  		exec('npm install', {env: process.env}, cb);
	}
};
