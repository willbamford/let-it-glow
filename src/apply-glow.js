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

  var strength = opts.strength;
  var spread = opts.spread;
  var attenuation = opts.attenuation;

  while (spread > 1.0) {

    // console.log('Pass with spread ' + spread);

    tg.save();
    tg.globalCompositeOperation = 'lighter';
    tg.globalAlpha = strength;
    tg.drawImage(source, 0, 0);
    StackBlur.canvasRGBA(target, 0, 0, imageData.width, imageData.height, spread);
    tg.restore();
    spread = spread / attenuation;
  }

  tg.drawImage(source, 0, 0);

  return tg.getImageData(0, 0, target.width, target.height);
}
module.exports = applyGlow;
