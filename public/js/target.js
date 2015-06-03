(function(root) {

  var ProjectileMotion = root.ProjectileMotion = (root.ProjectileMotion || {});

  var Target = ProjectileMotion.Target = function(distance, dimY, color, colorHit) {
    this.pos = [distance, dimY];
    color = [].concat(color);
    colorHit = [].concat(colorHit);

    this.color = [color[0] || 'green',
                  color[1] || 'yellow',
                  color[3] || 'red'];
    this.colorHit = [colorHit[0] || 'yellow',
                     colorHit[1] || 'red'];
    this.radius = 24;
  };

  Target.prototype.draw = function(ctx, color) {
    color = color || this.color;
    var radiusCorrection = 1;
    for(var i=0; i<color.length; i++) {
      this.drawPart(ctx, color[i], this.radius / radiusCorrection);
      radiusCorrection *= 2;
    }
  };

  Target.prototype.drawPart = function(ctx, color, radius) {
    ctx.strokeStyle = color;
    ctx.beginPath();

    ctx.arc(
      this.pos[0],
      this.pos[1],
      radius,
      0,
      2*Math.PI,
      false
    );

    ctx.fillStyle = color;
    ctx.fill();

    ctx.stroke();
  };

  Target.prototype.hit = function(ctx) {
    this.draw(ctx, this.colorHit);
  };


})(this);
