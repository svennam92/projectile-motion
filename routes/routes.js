var views = require('./views/index');
var app = require('../app')

module.exports = function() {
  app.route('/').get(views.homepage);
}();
