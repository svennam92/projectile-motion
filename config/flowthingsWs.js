var app = require('../app'),
    ftConfig = require('./flowthingsConfig'),
    cache = require('memory-cache'),
    each = require('lodash.foreach');

function setGuess(response) {
  cache.put("current-guess", response.value.elems.points.value);
}

function setScore(response) {
  cache.put("current-score", response.value.elems.score.value);
}

function setState(response) {
  var currentState = {};
  each(response.value.elems, function(value, key) {
    currentState[key] = value.value;
  });
  cache.put("current-state", currentState);
}

module.exports = function() {
  var ftApi = ftConfig.api,
      ftCreds = ftConfig.creds,
      flows = ftConfig.flows;

  ftApi.drop(flows["current-state"]).find({hints: false, limit: 1})
    .then(function(drops) {
      if (!drops.length) {
        cache.put("current-state", {});
      } else {
        var currentState = drops[0].elems;
        cache.put("current-state", currentState);
      }
    })
    .catch(function(err) {
      console.log(err)
    })

  ftApi.drop(flows["current-guess"]).find({limit: 1})
    .then(function(drops) {
      if (!drops.length) {
        cache.put("current-guess", []);
      } else {
        cache.put("current-guess", drops[0].elems.points.value);
      }
    })
    .catch(function(err) {
      console.log(err)
    })

  ftApi.drop(flows["current-score"]).find({hints: false, limit: 1})
    .then(function(drops) {
      if (!drops.length) {
        cache.put("current-score", 0);
      } else{
        cache.put("current-score", drops[0].elems.score);
      }
    })
    .catch(function(err) {
      console.log(err)
    })

  ftApi.webSocket.connect(function(ws) {
    ws.flow.subscribe(flows["current-score"], setScore);
    ws.flow.subscribe(flows["current-state"], setState);
    ws.flow.subscribe(flows["current-guess"], setGuess);
  });
}();
