(function(root) {
  var ProjectileMotion = root.ProjectileMotion = (root.ProjectileMotion || {});

  var ParabolicPoint = ProjectileMotion.ParabolicPoint = function(pos, color, radius, fill) {
    this.pos = pos;
    this.color = color || 'white';
    this.radius = radius || 4;
    this.fill = fill;
  };

  ParabolicPoint.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.color;
    ctx.beginPath();

    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2*Math.PI,
      false
    );
    if(this.fill) {
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    ctx.stroke();
  };

})(this);
