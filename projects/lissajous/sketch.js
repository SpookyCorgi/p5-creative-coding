let canvas
function setup () {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0)
  canvas.style('z-index', '-1')

  angleMode(DEGREES)
  stroke(color('#ffffff50'))
}

function windowResized () {
  resizeCanvas(windowWidth, windowHeight)
}


let x
let y
let z
let a = 300
let b = 300
let c = 300
let n = 11
let m = 31
let delta1 = 90
let delta2 = 180
let add = 0

function draw () {
  background(0);
  normalMaterial()

  for (let t = 0; t < 600; t += 0.4) {
    x = a * sin(t)
    y = b * sin(n * t + delta1)
    z = c * sin(m * t + delta2)
    push()
    translate(x, y, z);
    cylinder(5, 20);
    pop()
  }

  delta1++
  delta2++
}
