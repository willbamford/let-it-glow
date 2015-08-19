function applyFilter(fn, imageData) {

  var offset4 = 0;
  for (var y = 0; y < imageData.height; y += 1) {
    for (var x = 0; x < imageData.width; x += 1) {

      var red = imageData.data[offset4 + 0];
      var green = imageData.data[offset4 + 1];
      var blue = imageData.data[offset4 + 2];
      var alpha = imageData.data[offset4 + 3];

      var value = fn(x, y, red, green, blue, alpha);

      imageData.data[offset4 + 0] = 255;
      imageData.data[offset4 + 1] = 255;
      imageData.data[offset4 + 2] = 255;
      imageData.data[offset4 + 3] = value;

      offset4 += 4;
    }
  }
  return imageData;
}

module.exports = applyFilter;
