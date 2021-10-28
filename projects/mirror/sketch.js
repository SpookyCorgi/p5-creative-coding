let canvas

let hAmount
let vAmount
let hPadding
let vPadding
let paddingTop = 60
let gridSize = 20

let capture
let captureStartX = 0
let captureStartY = 0
let captureScale = 1
let captureWidth
let captureHeight

let slider

function setup () {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')

    createCanvas(windowWidth, windowHeight)

    sizing()

    //capture and scale
    capture = createCapture(VIDEO)
    capture.hide()
    scaling()
    noStroke()
    rectMode(CENTER)


    //slider
    slider = createSlider(10, 100, 40);
    slider.position(windowWidth / 2 - 80, 30);
    slider.style('width', '160px');
}

function sizing () {
    //checkboxes
    hAmount = Math.floor(windowWidth / gridSize)
    vAmount = Math.floor((windowHeight - paddingTop) / gridSize)
    hPadding = (windowWidth - gridSize * hAmount) / 2
    vPadding = (windowHeight - paddingTop - gridSize * vAmount) / 2
    console.log(gridSize, hAmount, vAmount, hPadding, vPadding, windowWidth, windowHeight)
    console.log(hPadding + 0 * gridSize - windowWidth / 2 + gridSize / 2, paddingTop + vPadding + 0 * gridSize - windowHeight / 2 + gridSize / 2)
}
function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
    sizing()
}

function scaling () {
    //auto scale and clip capture to the screensize
    let canvasRatio = windowWidth / (windowHeight - paddingTop)
    let captureRatio = capture.width / capture.height

    if (canvasRatio >= captureRatio) {
        captureWidth = capture.width
        captureHeight = capture.width / canvasRatio
        captureStartY = int((capture.height - captureHeight) / 2)
        captureScale = int(capture.width / hAmount)
    } else {
        captureHeight = capture.height
        captureWidth = capture.height * canvasRatio
        captureStartX = int((capture.width - captureWidth) / 2)
        captureScale = int(capture.height / vAmount)
    }
}

function draw () {
    gridSize = slider.value()
    sizing()
    scaling()

    texture(capture)
    background(0)

    capture.loadPixels()
    for (let j = 0; j < vAmount; j++) {
        for (let i = 0; i < hAmount; i++) {
            let start = (captureStartY * capture.width + captureStartX) * 4
            let p = start + (j * capture.width * captureScale + i * captureScale) * 4
            r = capture.pixels[p]
            g = capture.pixels[p + 1]
            b = capture.pixels[p + 2]
            let brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b
            push()
            translate(hPadding + i * gridSize - windowWidth / 2 + gridSize / 2, paddingTop + vPadding + j * gridSize - windowHeight / 2 + gridSize / 2)
            rotateY((255 - brightness) / 255 * HALF_PI)
            box(gridSize / 5 * 4, gridSize / 5 * 4, gridSize / 5)
            pop()
        }
    }
    capture.updatePixels()
}