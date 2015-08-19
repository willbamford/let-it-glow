function createCanvasWithGlowMap(map) {

  var canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 32;

  var g = canvas.getContext('2d');

  function drawGlowMap(m, y, h) {
    var d = 0.0;
    for (var x = 0; x < canvas.width; x += 1) {
      d = x / (canvas.width - 1);
      var c = m.colorAt(d);
      g.fillStyle = 'rgba(' + c[0] + ', ' + c[1] + ', ' + c[2] + ', 1.0)';
      g.fillRect(x, y, 1, h);
    }
  }

  drawGlowMap(map, 0, canvas.height);
  return canvas;
}

module.exports = createCanvasWithGlowMap;
