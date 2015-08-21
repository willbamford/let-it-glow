var StackBlur = require('stackblur-canvas');

function applyGlow(opts, imageData) {

  var source = document.createElement('canvas');
  source.width = imageData.width;
  source.height = imageData.height;
  var sg = source.getContext('2d');
  sg.putImageData(imageData, 0, 0);

  var target = document.createElement('canvas');
  target.width = imageData.width;
  target.height = imageData.height;
  var tg = target.getContext('2d');

  var spread = opts.spread;
  var passes = opts.passes;
  var highlight = opts.highlight;

  tg.save();
  tg.globalCompositeOperation = 'lighter';
  while (passes > 0) {
    console.log('Pass with spread: ' + spread);
    tg.drawImage(source, 0, 0);
    StackBlur.canvasRGBA(target, 0, 0, imageData.width, imageData.height, spread);
    spread = spread / 2;
    passes -= 1;
  }

  if (highlight > 0) {
    tg.globalAlpha = highlight;
    tg.drawImage(source, 0, 0);
  }

  tg.restore();

  return tg.getImageData(0, 0, target.width, target.height);
}
module.exports = applyGlow;
