(function(root){
  var ProjectileMotion = root.ProjectileMotion = (root.ProjectileMotion || {});

  var self;

  var Notifications = ProjectileMotion.Notifications = function() {
    this.notifications = [];
    this.id = 0;
    self = this;
    this.newGameCheck;
  }

  Notifications.prototype.remove = function(id, cb) {
    $('#' + id).fadeOut('fast', function() {
      $('#' + id).remove()
      if (cb) {
        cb()
      }
    })
  }

  Notifications.prototype.removeAll = function() {
    for(var i=0; i<this.notifications.length; i++) {
      var evtId = this.notifications[i];
      if (i == this.notifications.length - 1) {
        this.remove(evtId, this.newGame);
      } else {
        this.remove(evtId);
      }
    }
    if (this.notifications.length === 0 && !this.newGameCheck) {
      this.newGameCheck = true;
      this.newGame();
    }
  }

  Notifications.prototype.newGame = function() {
    self.notifications = [];
    console.log(self.newGameCheck)
    console.log(self.notifications)
    self.add(0, 0, true, function() {
      self.newGameCheck = false;
      console.log(self.notifications)
    });
  }

  Notifications.prototype.add = function(score, currentScore, newGame, cb) {
    var id = this.mkId();
    this.notifications.push(id)
    var notification = this.makeNotification(score, currentScore, newGame, cb);
    $(".events").prepend(notification);
    if (this.notifications.length > 5) {
      var evtId = this.notifications.shift();
      this.remove(evtId, function() {
        self.showNew(id, cb)
      });
    } else {
      this.showNew(id, cb)
    }
  }

  Notifications.prototype.showNew = function(id, cb) {
    $('#' + id).fadeIn('fast', cb);
  }

  Notifications.prototype.makeNotification = function(score, currentScore, newGame) {
    var eventTemplate = "<li class=\"event jquery-hidden alert ";
    if (score == 0) {
      eventTemplate += "alert-info";
    } else if (score < 0) {
      eventTemplate += "alert-danger";
    } else if (score > 0) {
      eventTemplate += "alert-success";
    }

    eventTemplate += "\" role=\"alert\"";

    eventTemplate += "id=\"" + this.id + "\">";
    if (newGame) eventTemplate += "<strong>New Game<strong><br>"

    eventTemplate += "Score: " + score + "";
    eventTemplate += "<br>"
    eventTemplate += "Total Score: " + currentScore;
    eventTemplate += "</li>";
    return eventTemplate;
  }

  Notifications.prototype.mkId = function() {
    this.id++;
    return this.id;
  }

})(this);
