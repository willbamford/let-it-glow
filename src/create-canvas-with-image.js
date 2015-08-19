function createCanvasWithImage(src, doneFn) {

  var image = new Image();
  image.src = src;
  image.onload = function() {

    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    var g = canvas.getContext('2d');
    g.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
    doneFn(canvas);
  };
}

module.exports = createCanvasWithImage;
