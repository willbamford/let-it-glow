var createCanvasWithImageData = function(imageData) {
  var canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  var g = canvas.getContext('2d');
  g.putImageData(imageData, 0, 0);
  return canvas;
};

module.exports = createCanvasWithImageData;
