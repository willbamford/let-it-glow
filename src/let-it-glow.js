var StackBlur = require('stackblur-canvas');
var GlowMap = require('./glow-map.js');
var colorUtils = require('./color-utils.js');
var applyFilter = require('./apply-filter.js');
var applyGlow = require('./apply-glow.js');
var applyGlowMap = require('./apply-glow-map.js');
var createCanvasWithImageData = require('./create-canvas-with-image-data.js');
var createCanvasWithGlowMap = require('./create-canvas-with-glow-map.js');

var LetItGlow = function(canvas, opts) {

  console.time('let-it-glow');

  opts = opts || {};

  opts.filterFn = opts.filterFn || function(x, y, red, green, blue, alpha) {
    var brightness = colorUtils.brightness(red, green, blue);
    // brightness = brightness / 255;
    // brightness = (brightness * brightness) * 255;

    brightness = (brightness - 200) * 2;
    // brightness = brightness > 200 ? 255 : 0;
    alpha = alpha / 255;
    return alpha * brightness;
  };

  opts.glow = opts.glow || {
    strength: 0.8,
    spread: 128.0,
    attenuation: 1.5
  };

  opts.map = opts.map || GlowMap.create(Math.random() * 5.0, Math.random() * 5.0, Math.random() * 5.0);

  var g = canvas.getContext('2d');
  var imageData = g.getImageData(0, 0, canvas.width, canvas.height);

  var filteredImageData = applyFilter(opts.filterFn, imageData);
  var filteredCanvas = createCanvasWithImageData(filteredImageData);

  var glowImageData = applyGlow(opts.glow, filteredImageData);
  var glowCanvas = createCanvasWithImageData(glowImageData);

  var mapCanvas = createCanvasWithGlowMap(opts.map);
  var finalCanvas = applyGlowMap(opts.map, canvas, glowImageData);

  document.body.appendChild(canvas);
  document.body.appendChild(filteredCanvas);
  document.body.appendChild(glowCanvas);
  document.body.appendChild(finalCanvas);
  document.body.appendChild(mapCanvas);

  console.timeEnd('let-it-glow');
};

LetItGlow.create = function(canvas, opts) {
  return new LetItGlow(canvas, opts);
};

LetItGlow.GlowMap = GlowMap;
LetItGlow.createCanvasWithGlowMap = require('./create-canvas-with-glow-map.js');
LetItGlow.createCanvasWithImageData = require('./create-canvas-with-image-data.js');
LetItGlow.createCanvasWithText = require('./create-canvas-with-text.js');
LetItGlow.createCanvasWithImage = require('./create-canvas-with-image.js');

// LetItGlow.createWithCanvasId = function(canvasId) {};
// LetItGlow.createWithImageUrl = function(imageUrl) {};
// LetItGlow.createWithImage = function(image) {};

module.exports = LetItGlow;
