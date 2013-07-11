var WordPress = (function () {
  var my = require('./BaseWeb.js').build('wp-config.php', {
  	databaseName : /define\(\'DB_NAME\', \'([^\']+)\'\);/,
  	host : /define\(\'DB_HOST\', \'([^\']+)\'\);/
  });
  // define('DB_HOST', 'localhost');
  return my; 
})();

module.exports = new WordPress();
