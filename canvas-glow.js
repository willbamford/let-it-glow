console.time('canvas-glow');

document.body.style.background = '#333';

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
  return {
    r: Math.min(255, Math.floor(255 * d * m.r)),
    g: Math.min(255, Math.floor(255 * d * m.g)),
    b: Math.min(255, Math.floor(255 * d * m.b))
  };
}

function drawBand(m, y, h) {
  var d = 0.0;
  for (var x = 0; x < bCanvas.width; x += 1) {
    d = x / (bCanvas.width - 1);
    var c = getBandColor(d, m);
    bCtx.fillStyle = 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', 1.0)';
    bCtx.fillRect(x, y, 1, h);
  }
}

var h = 8;

for (var i = 0; i < 32; i += 1) {
  var m = {
    r: Math.random() * 5.0,
    g: Math.random() * 5.0,
    b: Math.random() * 5.0
  };
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
  spread: 128.0,
  attenuation: 2.0
};

drawGlowText(glow, 'Glow!');

// -----------------------------
// Map band color to glow canvas
// -----------------------------

var tImage = tGfx.getImageData(0, 0, tCanvas.width, tCanvas.height);

var m = {
  r: Math.random() * 5.0,
  g: Math.random() * 5.0,
  b: Math.random() * 5.0
};

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

    tImage.data[index * 4 + 0] = tBand.r;
    tImage.data[index * 4 + 1] = tBand.g;
    tImage.data[index * 4 + 2] = tBand.b;
    // tImage.data[index * 4 + 3] = 0;
  }
}

var gCanvas = document.createElement('canvas');
gCanvas.width = tCanvas.width;
gCanvas.height = tCanvas.height;
document.body.appendChild(gCanvas);

var gGfx = gCanvas.getContext('2d');
gGfx.putImageData(tImage, 0, 0);

console.timeEnd('canvas-glow');
