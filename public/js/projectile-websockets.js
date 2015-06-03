(function(root) {

  var ProjectileMotion = root.ProjectileMotion = (root.ProjectileMotion || {});
  var self;

  var ProjectileWebSockets = ProjectileMotion.Websockets = function(auth, subscriptions, msgCallback) {
    this.auth = auth;
    this.subscriptions = subscriptions;
    this.msgCallback = msgCallback;
    this.connection;
    self = this;
  };

  ProjectileWebSockets.prototype.newGame = function(flowId) {
    this.connection.send(this.newGameMsg(flowId));
  };

  ProjectileWebSockets.prototype.newGameMsg = function(flowId) {
    return JSON.stringify({
      msgId: "newGame",
      object: "drop",
      type: "create",
      flowId: flowId,
      value: {
        elems: {
          score: 0,
          newGame: true
        }
      }
    });
  };

  ProjectileWebSockets.prototype.heartbeatWS = function() {
    self.connection.send(self.heartbeatMessage());
    console.log("WS Heartbeat");
  };

  ProjectileWebSockets.prototype.heartbeatMessage = function() {
    return JSON.stringify({
      "type": "heartbeat"
    });
  };

  ProjectileWebSockets.prototype.subscribeFlow = function(i) {
    return JSON.stringify({
      "msgId": "subscribe_device",
      "object": "drop",
      "type": "subscribe",
      "flowId": self.subscriptions[i]
    });
  };

  ProjectileWebSockets.prototype.subscribeFlows = function() {
    for(var i=0; i<self.subscriptions.length; i++) {
      self.connection.send(self.subscribeFlow(i));
    }
  };


  ProjectileWebSockets.prototype.onConnect = function() {
    var counter = setInterval(self.heartbeatWS, 10000);
    self.subscribeFlows();
  };

  ProjectileWebSockets.prototype.onMessage = function(event) {
    var message = JSON.parse(event.data);
    var drop;

    if (message.value) {
      drop = message.value;
    } else if (message.body) {
      drop = message.body;
    } else {
      return;
    }

    if (_.isEmpty(drop)) return;

    self.msgCallback(drop);
  };

  ProjectileWebSockets.prototype.connect = function(event) {
    var self = this;

    request = $.ajax({
      url: "https://ws.flowthings.io/session",
      beforeSend: function(req) {
        req.setRequestHeader("X-Auth-Token", self.auth.token);
        req.setRequestHeader("X-Auth-Account", self.auth.account);
        req.withCredentials = true;
      },
      type: "post",
      dataType: 'json',
      success: function(data) {
        var sessionId = data["body"]["id"];
        var url = "wss://ws.flowthings.io/session/" + sessionId + "/ws";

        var connection = self.connection = new WebSocket(url);

        connection.onopen = self.onConnect;
        connection.onmessage = self.onMessage;

        connection.onerror = function(error) {
          console.log('WebSocket Error ' + error);
        };
      },
      error: function(jqXHR, textStatus, textString) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(textString);
      }
    });
  };


})(this);
