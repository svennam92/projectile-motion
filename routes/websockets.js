var cache = require('memory-cache'),
    ftConfig = require('../config/flowthingsConfig'),
    app = require('../app');

var http = require('../config/http')

// var http = require('http').Server(app);

var ftApi = ftConfig.api,
    ftCreds = ftConfig.creds,
    flows = ftConfig.flows;

var devices = cache.get('devices');

module.exports = function() {
  var io = require('socket.io')(http);
}();
