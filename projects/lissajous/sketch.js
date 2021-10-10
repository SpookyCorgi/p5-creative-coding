//constants for 3D lissajous
let vector
const a = 255
const b = 255
const c = 255
let n = 0
let m = 0
let delta1 = 90
let delta2 = 180
//shader
let myShader
let matcap = []
let currentImage
let lastImage
//others
let _text
let canvas
let restartTime
//source for the shader code: https://github.com/aferriss/p5jsShaderExamples
//source for all the matcap texture: https://github.com/nidorx/matcaps
function setup () {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0)
  canvas.style('z-index', '-1')

  vector = createVector(0, 0, 0)

  angleMode(DEGREES)
  noStroke()

  _text = createGraphics(40, 60)
  _text.fill(255)

  init()
}

function preload () {
  //load files for shader
  myShader = loadShader("shader.vert", "shader.frag");
  matcap[0] = loadImage("matcap.png");
  matcap[1] = loadImage("7877EE_D87FC5_75D9C7_1C78C0.png");
  matcap[2] = loadImage("515151_DCDCDC_B7B7B7_9B9B9B.png");
  matcap[3] = loadImage("422509_C89536_824512_0A0604.png");
  matcap[3] = loadImage("7B5254_E9DCC7_B19986_C8AC91.png");
}

function windowResized () {
  resizeCanvas(windowWidth, windowHeight)
}

function init () {
  //choose random n and m
  n = int(map(random(), 0, 1, 1, 10))
  m = int(map(random(), 0, 1, 1, 10))
  restartTime = millis()
  //choose an unrepeat texture
  lastImage = currentImage
  while (currentImage == lastImage) {
    currentImage = int(random() * matcap.length)
  }
}

function mouseClicked () {
  init()
}

function draw () {
  background(0)
  // Send the texture to the shader
  shader(myShader);
  myShader.setUniform("uMatcapTexture", matcap[currentImage]);
  //draw the background
  push()
  rotateX(delta1 / 10)
  rotateY(delta2 / 10)
  translate(0, 0, 0)
  sphere(2000, 12, 9)
  pop()
  //draw 3d lissajous
  //smaller increament when the constant is higher causing more rings
  for (let t = 0; t < 360; t += 0.8 / map(m * n, 1, 100, 1, 2)) {
    //equations can be found here https://mathcurve.com/courbes3d.gb/couronnesinusoidale/couronnesinusoidale.shtml
    let x = a * sin(t)
    let y = b * sin(n * t + delta1)
    let z = c * sin(m * t + delta2)
    vector.set(x, y, z)
    push()
    //scale according to screem
    if (windowWidth <= 1920) {
      scale(map(windowWidth / 1920, 0, 1, 0.5, 1))
    } else {
      scale(windowWidth / 1920)
    }
    translate(x, y, z);
    //scale according to z coordinate
    scale(map(z / 255, -1, 1, 0.7, 1))
    vector.normalize()
    //old code
    //rotateX(atan2(-vector.z - 1, -vector.y))
    //rotateY(atan2(-vector.x, -vector.z - 1))
    //rotateZ(atan2(-vector.y, -vector.x))
    //circle(0, 0, 30)
    sphere(25, 12, 9)
    pop()
  }
  //restart after 15 sec
  let now = (millis() - restartTime)
  if (now > 15000) {
    init()
  }

  delta1 = now / 20
  delta2 = now / 10

  _text.clear()
  _text.text("N: " + int(n * 100) / 100, 0, 14)
  _text.text("M: " + int(m * 100) / 100, 0, 29)
  image(_text, windowWidth / 2 - 60, -windowHeight / 2 + 30)
}
