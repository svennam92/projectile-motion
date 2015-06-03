var app = require('../app');

module.exports = function() {
  require('./middleware');
  require('./websockets');
  require('./routes');
}();
