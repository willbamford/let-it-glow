function applyGlowMap(map, sourceCanvas, glowImageData) {

  var canvas = document.createElement('canvas');
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;
  var g = canvas.getContext('2d');
  g.drawImage(sourceCanvas, 0, 0);

  var glowMapCanvas = document.createElement('canvas');
  glowMapCanvas.width = sourceCanvas.width;
  glowMapCanvas.height = sourceCanvas.height;

  var offset4 = 0;
  for (var y = 0; y < canvas.height; y += 1) {
    for (var x = 0; x < canvas.width; x += 1) {

      var index = (y * canvas.width + x);
      // var red = glowImageData.data[offset4 + 0];
      // var green = glowImageData.data[offset4 + 1];
      // var blue = glowImageData.data[offset4 + 2];
      var alpha = glowImageData.data[offset4 + 3];

      var band = map.colorAt(alpha / 255);

      glowImageData.data[offset4 + 0] = band[0];
      glowImageData.data[offset4 + 1] = band[1];
      glowImageData.data[offset4 + 2] = band[2];
      glowImageData.data[offset4 + 3] = 255;
      offset4 += 4;
    }
  }

  var gg = glowMapCanvas.getContext('2d');
  gg.putImageData(glowImageData, 0, 0);

  // g.fillStyle = '#000';
  // g.fillRect(0, 0, canvas.width, canvas.height);
  g.globalCompositeOperation = 'lighter'; // 'lighten', 'soft-light', 'hard-light'
  // g.globalAlpha = 0.8;
  g.drawImage(glowMapCanvas, 0, 0);

  return canvas;
}

module.exports = applyGlowMap;
