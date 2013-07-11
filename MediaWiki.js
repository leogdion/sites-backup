var MediaWiki = (function () {
  var my = require('./BaseWeb.js').build('LocalSettings.php', {
  	databaseName : /\$wgDBname \= \"([^"]+)\"/,
  	host : /\$wgDBserver \= \"([^"]+)\"/
  });
  return my;
})();

module.exports = new MediaWiki();