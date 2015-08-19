function createCanvasWithText(text) {

  var canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 100;

  var g = canvas.getContext('2d');
  g.fillStyle = 'black';
  g.fillRect(0, 0, canvas.width, canvas.height);

  g.fillStyle = 'white';
  // g.fillStyle = 'rgba(255, 255, 255, ' + opacity + ')';
  g.font = '64px sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width);

  return canvas;
}

module.exports = createCanvasWithText;
