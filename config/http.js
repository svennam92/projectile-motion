var app = require('../app');

var http = require('http').Server(app);

module.exports = function() {
  return http;
}();
