
let img
let r = 0
let g = 0
let b = 0
let x = 0
let y = 0
let canvas;
let w
function setup () {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
    textSize(16)
    textFont('Courier New')
    strokeWeight(3)
    w = height / 2 / 16 * 9
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
    w = height / 2 / 16 * 9
}
function preload () {
    img = loadImage('PXL_20211015_021226465_exported_10597.jpg')
}

function mouseClicked () {
    let d = pixelDensity()
    console.log(d)
    loadPixels()
    x = mouseX
    y = mouseY
    let p = (mouseY * d * width * d + mouseX * d) * 4
    r = pixels[p]
    g = pixels[p + 1]
    b = pixels[p + 2]
    updatePixels()
}

function draw () {
    background(0);
    image(img, width / 2 - w / 2, 80, w, height / 2)

    fill(color(r, g, b))
    noStroke()
    rect(width / 2 - w / 2, height / 2 + 100, w / 4, w / 4)

    fill(255)
    text('R: ' + r, width / 2 - w / 2 + w / 4 + 20, height / 2 + 120)
    text('G: ' + g, width / 2 - w / 2 + w / 4 + 20, height / 2 + 150)
    text('B: ' + b, width / 2 - w / 2 + w / 4 + 20, height / 2 + 180)
    text('Hex: ' + "#" + hex(r, 2) + hex(g, 2) + hex(b, 2), width / 2 - w / 2 + w / 4 + 20, height / 2 + 210)
    text('Point: x:' + x + " y:" + y, width / 2 - w / 2 + w / 4 + 20, height / 2 + 240)

    stroke(color(255, 0, 0))
    noFill()
    circle(x, y, 10)
}