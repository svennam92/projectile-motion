var flowthings = require('flowthings'),
    Promise = require('bluebird')
    cache = require('memory-cache'),
    each = require('lodash.foreach'),
    config = JSON.parse(process.env.VCAP_SERVICES || "{}");

var creds;

if (config.hasOwnProperty('flowthings')) {
  creds = config["flowthings"][0].credentials
} else {
  creds = {
    "account": process.env.ftaccount,
    "token": process.env.fttoken
  };
}

var flows = {
  "shot-fired": "f5568c59e68056d1bbd64ddfe",
  // "parameters": "f5568c4305bb709355caededb",
  "current-score": "f556cfbde68056d40e7909011",
  "result": "f556d1b7b68056d40e7909b9b",
  "current-state": "f5568cb3c5bb709355caee40c",
  "current-guess": "f556b2ce15bb7092bdca7845e",
  "success": "f556b2c645bb7092bdca78376"
};

var api = flowthings.API(creds, {
  transform: flowthings.promisify(Promise)
});

var flowthingsAccount = creds.account;
var account = creds.account;

var flowthingsToken;

var token = {
  "paths" : {}
};

each(flows, function(value, key) {
  var tokenPath = "/" + flowthingsAccount + "/" + key;
  token["paths"][tokenPath] = {
    "dropRead": true,
    "dropWrite": false
  };
})

var tokenPath = "/" + flowthingsAccount + "/" + "current-score";
token["paths"][tokenPath] = {
  "dropRead": true,
  "dropWrite": true
};

exports.creds = creds;

exports.token = token;

exports.api = api;

exports.flows = {};

exports.tokenString = "";

function createToken() {
  api.token.create(token)
    .then(function(token) {
      flowthingsToken = token.tokenString;
      exports.tokenString = flowthingsToken;
      require('./flowthingsWs');
    })
    .catch(function(err) {
      if (err) console.log("Error creating Token: ", err);
    });
}

var filter = "path=~/^\\/" + account + "\\/"

var flowNames = [
  "shot-fired",
  // "parameters",
  "current-score",
  "result",
  "current-state",
  "current-guess"
];

filter += "(";

filter += flowNames.join("|");
filter += ")$/";

var params = {
  filter: filter
}

api.flow.find(params)
  .then(function(respFlows) {
    var newFlows = {};
    if (respFlows.length) {
      var regex = new RegExp('\/' + account + '\/')
      for (var i=0; i<respFlows.length; i++) {
        var flowName = respFlows[i].path.replace(regex, "")
        newFlows[flowName] = respFlows[i].id;
      }
      exports.flows = newFlows;
      createToken()
    } else {
      require('./setupApplication')(function(flows) {
        createToken()
        exports.flows = flows;
      });
    }
  })
  .catch(function(err) {
    console.log(err)
  });
