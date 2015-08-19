var GlowMap = function(r, g, b) {

  this.r = r;
  this.g = g;
  this.b = b;
};

GlowMap.create = function(r, g, b) {
  return new GlowMap(r, g, b);
};

GlowMap.prototype.colorAt = function(d) {

  return [
    Math.min(255, Math.round(255 * d * this.r)),
    Math.min(255, Math.round(255 * d * this.g)),
    Math.min(255, Math.round(255 * d * this.b))
  ];
};

module.exports = GlowMap;
