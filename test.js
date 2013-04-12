//var npminstall = require('./npminstall.js');
var _setup;
exports.setUp = function (cb) {
		if (_setup) {
			cb();
			return;
		}
		_setup = true;
		var npminstall = require('./npminstall.js');
		npminstall.begin(function (error) {
			console.log('setUp');
			cb();
		});
		
		//cb();
	};
exports.tests = {
	testa : function (test) {
		console.log('testa');
		test.done();
	},
	testb : function (test) {
		console.log('testb');
		test.done();
	}
};
/*
npminstall.begin(function (error) {
	var nodeunit = require('nodeunit');
});
*/