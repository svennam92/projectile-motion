var ftConfig = require('./flowthingsConfig'),
    fs = require('fs'),
    flowthings = require('flowthings'),
    Promise = require('bluebird'),
    path = require('path'),
    clone = require('lodash.clone'),
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

var ftApi = flowthings.API(creds, {
  transform: flowthings.promisify(Promise)
});

var account = creds.account;

// var ftApi = ftConfig.api,
//     ftCreds = ftConfig.creds,
//     account = ftConfig.creds.account;

var jsonPath = path.join(__dirname, './flowthingsObjects.json')

var ftObjects = fs.readFileSync(jsonPath, {encoding: 'utf8'});
ftObjects = JSON.parse(ftObjects);
ftObjects = JSON.stringify(ftObjects);

var basePath = "/" + account + "/"

ftObjects = ftObjects.replace(/\/iot-shoot\/shot-fired/gi, basePath + "shot-fired")
ftObjects = ftObjects.replace(/\/iot-shoot\/current-score/gi, basePath + "current-score")
ftObjects = ftObjects.replace(/\/iot-shoot\/current-state/gi, basePath + "current-state")
ftObjects = ftObjects.replace(/\/iot-shoot\/current-guess/gi, basePath + "current-guess")
ftObjects = ftObjects.replace(/\/iot-shoot\/result/gi, basePath + "result")
// var flowthingsObjects = fs.readFileSync('flowthingsObjects.json');
ftObjects = JSON.parse(ftObjects)


var oldflows = {
  "shot-fired": "f5568c59e68056d1bbd64ddfe",
  // "parameters": "f5568c4305bb709355caededb",
  "current-score": "f556cfbde68056d40e7909011",
  "result": "f556d1b7b68056d40e7909b9b",
  "current-state": "f5568cb3c5bb709355caee40c",
  "current-guess": "f556b2ce15bb7092bdca7845e"
};

var newFlows = {
  "shot-fired": "",
  // "parameters": "f5568c4305bb709355caededb",
  "current-score": "",
  "result": "",
  "current-state": "",
  "current-guess": ""
}

var replacements = {
  "f5568c59e68056d1bbd64ddfe": "",
  // "f5568c4305bb709355caededb": "",
  "f556cfbde68056d40e7909011": "",
  "f556d1b7b68056d40e7909b9b": "",
  "f5568cb3c5bb709355caee40c": "",
  "f556b2ce15bb7092bdca7845e": ""
}

var flowsArray = [
  "f5568c59e68056d1bbd64ddfe",
  // "f5568c4305bb709355caededb",
  "f556cfbde68056d40e7909011",
  "f556d1b7b68056d40e7909b9b",
  "f5568cb3c5bb709355caee40c",
  "f556b2ce15bb7092bdca7845e"
]

var oldTracks = [
  "t5568ce5368056d1bbd64e329",
  "t556b31fa68056d2f14d2d1b0",
  "t556b3d5f5bb7092bdca798f5",
  "t556d1ce65bb7090bf7938a89",
]

var flowNames = [
  "shot-fired",
  // "parameters",
  "current-score",
  "result",
  "current-state",
  "current-guess"
]

var newTracks = []

var oldFlow;
var newFlow;
var flowName;
var oldTrack;
var flows = ftObjects.flows;
var tracks = ftObjects.tracks;

var newObjects = {
  flows: {},
  tracks: {}
}

function replaceInTrack(tracks, oldId, newId) {
  var regex = new RegExp(oldId, 'gi');
  tracks = JSON.stringify(tracks);
  tracks = tracks.replace(regex, newId);
  tracks = JSON.parse(tracks);
  return tracks;
}

function removeId(object) {
  var newObject = clone(object)
  delete newObject.id
  return newObject
}

function setupApplication(cb) {
  oldFlow = flows.shift();
  flowName = flowNames.shift();

  ftApi.flow.create(removeId(oldFlow))
    .then(function(flow) {
      newFlows[flowName] = flow.id;
      tracks = replaceInTrack(tracks, oldFlow.id, flow.id);
      oldFlow = flows.shift();
      flowName = flowNames.shift();
      return ftApi.flow.create(removeId(oldFlow));
    })
    .then(function(flow) {
      newFlows[flowName] = flow.id;
      tracks = replaceInTrack(tracks, oldFlow.id, flow.id);
      oldFlow = flows.shift();
      flowName = flowNames.shift();
      return ftApi.flow.create(removeId(oldFlow));
    })
    .then(function(flow) {
      newFlows[flowName] = flow.id;
      tracks = replaceInTrack(tracks, oldFlow.id, flow.id);
      oldFlow = flows.shift();
      flowName = flowNames.shift();
      return ftApi.flow.create(removeId(oldFlow));
    })
    .then(function(flow) {
      newFlows[flowName] = flow.id;
      tracks = replaceInTrack(tracks, oldFlow.id, flow.id);
      oldFlow = flows.shift();
      flowName = flowNames.shift();
      return ftApi.flow.create(removeId(oldFlow));
    })
    .then(function(flow) {
      newFlows[flowName] = flow.id;
      tracks = replaceInTrack(tracks, oldFlow.id, flow.id);

      oldTrack = tracks.shift();

      return ftApi.track.create(removeId(oldTrack));
    })
    .then(function(track) {
      newTracks.push(track);
      oldTrack = tracks.shift();
      return ftApi.track.create(removeId(oldTrack));
    })
    .then(function(track) {
      newTracks.push(track);
      oldTrack = tracks.shift();
      return ftApi.track.create(removeId(oldTrack));
    })
    .then(function(track) {
      newTracks.push(track);
      oldTrack = tracks.shift();
      return ftApi.track.create(removeId(oldTrack));
    })
    .then(function(track) {
      newTracks.push(track);
      oldTrack = tracks.shift();
      module.exports = newFlows;
      if (cb) cb(newFlows);
    })
    .catch(function(err) {
      return console.log(err);
    })
}

module.exports = setupApplication;
