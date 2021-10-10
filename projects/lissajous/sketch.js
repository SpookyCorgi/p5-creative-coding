let vector
let oldVector
let a = 255
let b = 255
let c = 255
let n = 0
let m = 0
let deltaN
let deltaM
let delta1 = 90
let delta2 = 180
let add = 0
p5.disableFriendlyErrors = true;
let _text
let canvas
let restartTime = 0
function setup () {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0)
  canvas.style('z-index', '-1')

  vector = createVector(0, 0, 0)
  oldVector = createVector(0, 0, 0)


  angleMode(DEGREES)
  stroke(255)
  noFill()

  _text = createGraphics(40, 40)
  _text.fill(255)

  init()
}

function windowResized () {
  resizeCanvas(windowWidth, windowHeight)
}

function init () {
  deltaN = int(map(random(), 0, 1, 1, 10))
  deltaM = int(map(random(), 0, 1, 1, 10))
  n = deltaN
  m = deltaM
  restartTime = millis()
}

function mouseClicked () {
  init()
}

function draw () {
  background(0)

  for (let t = 0; t < 360; t += 0.3) {

    let x = a * sin(t)
    let y = b * sin(n * t + delta1)
    let z = c * sin(m * t + delta2)
    vector.set(x, y, z)
    stroke(color(x, y, z))
    push()
    scale(map(windowWidth / 1920, 0, 1, 0.5, 1))
    translate(x, y, z);
    scale(map(z / 255, -1, 1, 0.7, 1))
    vector.normalize()
    //rotateX(atan2(-vector.z - 1, -vector.y))
    //rotateY(atan2(-vector.x, -vector.z - 1))
    //rotateZ(atan2(-vector.y, -vector.x))
    //circle(0, 0, 30)
    sphere(25, 4, 3)
    pop()
  }


  let now = (millis() - restartTime)
  if (now > 15000) {
    init()
  }

  delta1 = now / 20
  delta2 = now / 10

  _text.background(0)
  _text.text("N: " + int(n * 100) / 100, 0, 10)
  _text.text("M: " + int(m * 100) / 100, 0, 30)
  image(_text, windowWidth / 2 - 60, -windowHeight / 2 + 40)
}
