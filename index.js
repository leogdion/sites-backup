var npminstall = require('./npminstall.js');
process.chdir(__dirname);
npminstall.begin('./backup.js', './config.json');