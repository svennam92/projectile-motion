(function(root) {

  var ProjectileMotion = root.ProjectileMotion = (root.ProjectileMotion || {});
  var self;

  var Game = ProjectileMotion.Game = function(ctx, auth, flows, sizeX, sizeY, guess, target_distance, score) {
    self = this;
    this.ctx = ctx;
    this.auth = auth;
    this.flows = flows;
    this.flowId = flows.shot;
    this.flowsArray = [];
    this.projectileNumber = 0;
    this.hit;
    this.timeoutId;
    this.dimX = sizeX;
    this.dimY = sizeY;
    this.shooting = false;
    this.projectileArray = [];
    this.currentScore = score;
    this.score = 0;
    this.insult = "";

    this.notifications = new ProjectileMotion.Notifications();

    this.target = new ProjectileMotion.Target(target_distance, this.dimY);
    if (guess) {
      this.guess = this.setupGuess(guess);
    } else {
      this.guess = [];
    }
    _.each(flows, function(value, key) {
      self.flowsArray.push(value);
    })
  };

  Game.prototype.start = function() {
    this.ws = new ProjectileMotion.Websockets(this.auth, this.flowsArray, this.msgCallback);
    this.ws.connect();
    this.draw();
  };

  Game.prototype.draw = function() {
    var ctx = self.ctx.getContext("2d");
    ctx.fillStyle = '#002a3b';
    ctx.fillRect(0,0,self.dimX,self.dimY);
    if (self.hit && self.shot) {
      self.target.hit(ctx);
    } else {
      self.target.draw(ctx);
    }
    if (!self.shooting && !self.shot) {
      self.drawGuess(ctx);
    } else {
      self.drawProjectiles(ctx);
    }
  };

  Game.prototype.fire = function() {
    self.shooting = true;
    self.shot = false;
    self.draw();
    $('.fire').removeClass('hidden');
  };

  Game.prototype.drawGuess = function(ctx) {
    for (var i=0; i<3; i++) {
      self.guess[i].draw(ctx);
    }
  };

  Game.prototype.drawProjectiles = function(ctx) {
    self.projectileNumber = 0;
    self.drawProjectile(ctx);
    if (self.shooting) {
      for (var i=1; i<self.projectileArray.length; i++) {
        setTimeout(function() {
          self.drawProjectile(ctx);
        }, 50 * i);
      }

      self.timeoutId = setTimeout(function() {
        if (self.shot === false) return;
        self.resetFire();
        self.draw();
      }, 30000);
    } else {
      for (var i=0; i<self.projectileArray.length; i++) {
        self.drawProjectile(ctx);
      };
    }
  };

  Game.prototype.drawProjectile = function(ctx) {
    if (!self.projectileArray[self.projectileNumber]) return;
    self.projectileArray[self.projectileNumber].draw(ctx);
    self.projectileNumber++;
    if (self.projectileArray.length == self.projectileNumber) {
      self.afterProjectiles(ctx);
    }
  };

  Game.prototype.afterProjectiles = function(ctx) {
    if (self.hit) {
      self.target.hit(ctx);
      $('.hit-text').removeClass('hidden');
    } else {
      $('.miss-text').removeClass('hidden');
    }

    $('.score').text(self.currentScore);
    this.notifications.add(this.score, this.currentScore, null, this.insult);
    this.insult = "";

    self.shot = true;
    self.shooting = false;
  };

  Game.prototype.showScore = function() {
    $('.score').text(self.currentScore);
  };


  Game.prototype.msgCallback = function(drop) {

    if (drop.flowId === self.flows["current-state"]) {
      _.each(drop.elems, function(value, key) {
        if(key != 'fire') {
          $('.' + key).text(value.value);
        }
        if (key == 'target_distance') {
          self.target = new ProjectileMotion.Target(value.value, self.dimY);
        }
      });

      if (!self.shooting && self.shot) {
        clearTimeout(self.timeoutId);
        self.resetFire();
      }
      if (self.shooting) return;
    }

    if (drop.flowId === self.flows["current-guess"]) {
      var pointsArray = drop.elems.points.value;
      self.guess = self.setupGuess(pointsArray);
    }

    if (drop.flowId === self.flows["result"]) {
      self.reportHit(drop.elems.score.value);
      if (drop.elems.insult && drop.elems.insult.value) {
        self.insult = drop.elems.insult.value;
      }
      return;
    }

    if (drop.flowId === self.flows["shot-fired"]) {
      return self.projectileCallback(drop);
    }

    if (drop.flowId === self.flows["current-score"]) {
      if (drop.elems.newGame && drop.elems.newGame.value) {
        return self.newGame();
      } else {
        return self.reportScore(drop.elems.score.value);
      }
    }

    self.draw();
  };

  Game.prototype.reportScore = function(score) {
    self.currentScore = score;
  }

  Game.prototype.reportHit = function(score) {
    if (score > 0) {
      self.hit = true;
    } else {
      self.hit = false;
    }
    self.score = score;
  }

  Game.prototype.setupGuess = function(pointsArray) {
    var guess = [];

    for(var i=0; i<pointsArray.length; i++) {
      var points = [Math.round(pointsArray[i].value[0].value),
                    self.dimY - Math.round(pointsArray[i].value[1].value)];
      var projectile = new ProjectileMotion.ParabolicPoint(points, 'white', 3);
      guess.push(projectile);
    }
    return guess;
  };

  Game.prototype.projectileCallback = function(drop) {
    if (self.shooting) return;
    var pointsArray = drop.elems.points.value;

    self.projectileArray = [];

    for(var i=0; i<pointsArray.length; i++) {
      var points = [Math.round(pointsArray[i].value[0].value),
                    self.dimY - Math.round(pointsArray[i].value[1].value)];
      var projectile = new ProjectileMotion.ParabolicPoint(points, 'white', 3, true);
      self.projectileArray.push(projectile);
    }

    self.fire();

  };

  Game.prototype.updateCallback = function(drop) {
    self.draw();
  };

  Game.prototype.resetFire = function() {
    self.shooting = false;
    self.hit = false;
    self.shot = false;
    $('.fire').addClass('hidden');
    $('.hit-text').addClass('hidden');
    $('.miss-text').addClass('hidden');
  }

  Game.prototype.newGameButton = function() {
    self.ws.newGame(self.flows["current-score"]);
  }

  Game.prototype.newGame = function() {
    self.notifications.removeAll();
    self.resetFire();
    self.draw();
    $('.score').text(0);
  }

  $('.reset-btn').click(function() {
    clearTimeout(self.timeoutId);
    self.resetFire();
    self.draw();
  });

  $('.new-game-btn').click(function() {
    self.newGameButton();
  })

})(this);
