var hbs = require('express-handlebars');

module.exports = function() {
  _helpers = {};

  _helpers.jsonStringify = function(json) {
    return JSON.stringify(json);
  };

  _helpers.toISOString = function(date) {
    return date.toISOString();
  };

  _helpers.debug = function() {
    var args = _.toArray(arguments);
    args.pop();
    console.log.apply(console, [].concat(["Handlebars: "], args));
  };

  return _helpers;
}();
