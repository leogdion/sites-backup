var MediaWiki = (function () {
  var my = require('./BaseWeb.js').build('LocalSettings.php', /\$wgDBname \= \"([^"]+)\"/);
  return my; 
})();

module.exports = new MediaWiki();
 