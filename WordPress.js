var WordPress = (function () {
  var my = require('./BaseWeb.js').build('wp-config.php', /define\(\'DB_NAME\', \'([^\']+)\'\);/);
  return my; 
})();

module.exports = new WordPress();
