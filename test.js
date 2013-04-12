//var npminstall = require('./npminstall.js');
var _setup;
exports.setUp = function (cb) {
		if (_setup) {
			cb();
			return;
		}
		_setup = true;
		console.log('setUp');
		cb();
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