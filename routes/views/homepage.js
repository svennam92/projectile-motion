var cache = require('memory-cache'),
    app = require('../../app'),
    each = require('lodash.foreach'),
    ftConfig = require('../../config/flowthingsConfig');

var ftApi = ftConfig.api,
    ftCreds = ftConfig.creds,
    token = ftConfig.token;

var flowthingsAccount = ftConfig.creds.account;


module.exports = function(req, res) {
  var flowthingsToken;
  var tokenString = ftConfig.tokenString;
  var flows = ftConfig.flows;

  var data = {
    flowthingsAccount: flowthingsAccount,
    flowthingsToken: tokenString,
    flows: flows,
    state: cache.get('current-state'),
    guess: cache.get('current-guess'),
    score: cache.get('current-score'),
    auth: {
      account: flowthingsAccount,
      token: tokenString
    }
  };

  if (!tokenString) {
    ftApi.token.create(token, function(err, response) {
      if (err) return res.render('500');
      data.flowthingsToken = data.auth.token = response.tokenString;
      res.render('index', {data: data});
    })
  } else {
    res.render('index', {data: data});
  }
};
