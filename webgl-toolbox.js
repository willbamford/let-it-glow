function loadImage(src, fn) {
  var image = new Image();
  image.src = src;
  image.onload = function() {
    fn(image);
  };
  return image;
}

function createShaderFromScript(gl, id, type) {

  var el = document.getElementById(id);
  var type = el.type == 'x-shader/x-vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
  return createShader(gl, el.text, type);
}

function createShader(gl, source, type) {

  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (!compiled) {
    console.log('Error compiling shader: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl, shaders, attribs) {

  var program = gl.createProgram();

  for (var i = 0; i < shaders.length; i += 1)
    gl.attachShader(program, shaders[i]);

  if (attribs) {

    for (var i = 0; i < attribs.length; i += 1) {
      gl.bindAttribLocation(program, attribs[i].location, attribs[i].name);
    }
  }

  gl.linkProgram(program);
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    console.log('Error linking program: ' + gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function createTexture(gl) {
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return texture;
}

function setFramebuffer(gl, framebuffer, resolutionLocation, width, height) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.uniform2f(resolutionLocation, width, height);
  gl.viewport(0, 0, width, height);
}
