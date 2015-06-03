var express = require('express'),
    flowthings = require('flowthings'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    exphbs = require('express-handlebars'),
    serveStatic = require('serve-static'),
    favicon = require('serve-favicon'),
    errorhandler = require('errorhandler'),
    multer = require('multer'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    path = require('path');

if (process.env != "production") {
  require('dotenv').load();
}

var config = JSON.parse(process.env.VCAP_SERVICES || "{}");
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 3000);

var services = JSON.parse(process.env.VCAP_SERVICES || "{}");

var app = express();
app.set('environment', process.env.environment);
app.locals = process.env.environment;

module.exports = app;


require('./config/flowthingsConfig');


var http = require('./config/http');

var config = JSON.parse(process.env.VCAP_SERVICES || "{}");

var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 3000);

http.listen(port, function() {
  console.log('App started on port ' + port);
});

require('./config/config');
require('./routes/index');

var publicFolder = "/dist";

app.use(express.static(__dirname + publicFolder));
app.set('views', path.join(__dirname + '/views'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(errorhandler());
app.use(bodyParser.json());

app.use(cookieParser());
app.use(logger('dev'));
app.use(methodOverride());

app.use(session({ resave: true,
                saveUninitialized: true,
                secret: 'uwotm8' }));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: require('./views/helpers')
})

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
