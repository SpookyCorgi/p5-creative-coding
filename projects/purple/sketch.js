
let img
let r = 0
let g = 0
let b = 0
let x = 0
let y = 0
let canvas;
function setup () {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
    textSize(16)
    textFont('Courier New')
    strokeWeight(3)
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)

}
function preload () {
    img = loadImage('PXL_20211015_021226465_exported_10597.jpg')
}

function mouseClicked () {
    loadPixels()
    x = mouseX
    y = mouseY
    let p = (mouseY * width + mouseX) * 4
    r = pixels[p]
    g = pixels[p + 1]
    b = pixels[p + 2]
}

function draw () {
    background(0);
    image(img, width / 2 - 225, 40, 450, 600)

    fill(color(r, g, b))
    noStroke()
    rect(width / 2 - 225 + 50, 680, 100, 100)

    fill(255)
    text('R: ' + r, width / 2 - 225 + 200, 680)
    text('G: ' + g, width / 2 - 225 + 200, 710)
    text('B: ' + b, width / 2 - 225 + 200, 740)
    text('Hex: ' + "#" + hex(r, 2) + hex(g, 2) + hex(b, 2), width / 2 - 225 + 200, 770)
    text('Point: x:' + x + " y:" + y, width / 2 - 225 + 200, 800)

    stroke(color(255, 0, 0))
    noFill()
    circle(x, y, 10)
}