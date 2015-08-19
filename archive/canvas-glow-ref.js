console.time('canvas-glow');

document.body.style.background = '#333';

/**
 * See: http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 *
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {

    var hue2rgb = function(p, q, t) {

      if(t < 0)
        t += 1;
      if(t > 1)
        t -= 1;
      if (t < 1 / 6)
        return p + (q - p) * 6 * t;
      if (t < 1 / 2)
        return q;
      if (t < 2 / 3)
        return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// --------------------
// Draw bands to canvas
// --------------------

var bCanvas = document.createElement('canvas');
bCanvas.width = 256;
bCanvas.height = 256;
document.body.appendChild(bCanvas);

var bCtx = bCanvas.getContext('2d');

function getBandColor(d, m) {
  // d = d * d; // Fudge
  return [
    Math.min(255, Math.round(255 * d * m[0])),
    Math.min(255, Math.round(255 * d * m[1])),
    Math.min(255, Math.round(255 * d * m[2]))
  ];
}

function drawBand(m, y, h) {
  var d = 0.0;
  for (var x = 0; x < bCanvas.width; x += 1) {
    d = x / (bCanvas.width - 1);
    var c = getBandColor(d, m);
    bCtx.fillStyle = 'rgba(' + c[0] + ', ' + c[1] + ', ' + c[2] + ', 1.0)';
    bCtx.fillRect(x, y, 1, h);
  }
}

var h = 32;

for (var i = 0; i < 8; i += 1) {

  // var m = hslToRgb((i % 8) / 8, 0.8, 0.005);

  var m = [
    Math.random() * 5.0,
    Math.random() * 5.0,
    Math.random() * 5.0
  ];
  drawBand(m, i * h, h);
}

// ------------------------
// Draw greyscale glow text
// ------------------------

var tCanvas = document.createElement('canvas');
tCanvas.width = 400;
tCanvas.height = 100;
document.body.appendChild(tCanvas);

var tGfx = tCanvas.getContext('2d');
tGfx.fillStyle = 'black';
tGfx.fillRect(0, 0, tCanvas.width, tCanvas.height);

function drawText(text, opacity) {
  tGfx.fillStyle = 'rgba(255, 255, 255, ' + opacity + ')';
  tGfx.font = '64px sans-serif';
  tGfx.textAlign = 'center';
  tGfx.textBaseline = 'middle';
  tGfx.fillText(text, tCanvas.width / 2, tCanvas.height / 2, tCanvas.width);
}

function drawGlowText(glow, text) {
  var spread = glow.spread;

  while (spread > 1.0) {
    drawText(text, glow.strength);
    StackBlur.canvasRGB(tCanvas, 0, 0, tCanvas.width, tCanvas.height, spread);
    spread = spread / glow.attenuation;
  }

  drawText(text, 1.0);
}

var glow = {
  strength: 0.5,
  spread: 64.0,
  attenuation: 2.0
};

drawGlowText(glow, 'WebSeed');

// -----------------------------
// Map band color to glow canvas
// -----------------------------

function doGlow(i) {

  var tImage = tGfx.getImageData(0, 0, tCanvas.width, tCanvas.height);

  var m = [
    Math.random() * 5.0,
    Math.random() * 5.0,
    Math.random() * 5.0
  ];

  for (var y = 0; y < tCanvas.height; y += 1) {
    for (var x = 0; x < tCanvas.width; x += 1) {

      var index = (y * tCanvas.width + x);
      var tRed = tImage.data[index * 4 + 0];
      var tGreen = tImage.data[index * 4 + 1];
      var tBlue = tImage.data[index * 4 + 2];
      var tAlpha = tImage.data[index * 4 + 3];

      var tGrey = (tRed + tGreen + tBlue) / 3;
      var tGreyNormalized = tGrey / 255.0;

      // console.log(tGreyNormalized);

      var tBand = getBandColor(tGreyNormalized, m);

      tImage.data[index * 4 + 0] = tBand[0];
      tImage.data[index * 4 + 1] = tBand[1];
      tImage.data[index * 4 + 2] = tBand[2];
      // tImage.data[index * 4 + 3] = 0;
    }
  }

  var gCanvas = document.createElement('canvas');
  gCanvas.width = tCanvas.width;
  gCanvas.height = tCanvas.height;
  document.body.appendChild(gCanvas);

  var gGfx = gCanvas.getContext('2d');
  gGfx.putImageData(tImage, 0, 0);

}

for (var i = 0; i < 100; i += 1) {
  doGlow(i);
}

console.timeEnd('canvas-glow');
