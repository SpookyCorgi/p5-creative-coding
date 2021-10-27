let canvas

let hAmount
let vAmount
let hPadding
let vPadding
let paddingTop = 60
let brightnessThreshold = 128
let gridSize = 20

let checkboxes = []

let capture
let captureStartX = 0
let captureStartY = 0
let captureScale = 1
let captureWidth
let captureHeight
function setup () {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')

    createCanvas(windowWidth, windowHeight);

    //checkboxes
    hAmount = int(windowWidth / gridSize)
    vAmount = int((windowHeight - paddingTop) / gridSize)
    hPadding = windowWidth % gridSize / 2
    vPadding = (windowHeight - paddingTop) % gridSize / 2
    for (let j = 0; j < vAmount; j++) {
        for (let i = 0; i < hAmount; i++) {
            let checkbox = createCheckbox('', true);
            checkbox.position(hPadding + i * gridSize, paddingTop + vPadding + j * gridSize);
            checkboxes.push(checkbox)
        }
    }

    //capture and scale
    capture = createCapture(VIDEO);
    capture.hide()
    scaling()
    noStroke()
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
}

function scaling () {
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
    background(255)
    scaling()
    //console.log(captureScale, hAmount, vAmount, captureWidth, captureHeight)
    capture.loadPixels()

    for (let j = 0; j < vAmount; j++) {
        for (let i = 0; i < hAmount; i++) {
            let start = (captureStartY * capture.width + captureStartX) * 4
            let p = start + (j * capture.width * captureScale + i * captureScale) * 4
            console.log(start, p)
            r = capture.pixels[p]
            g = capture.pixels[p + 1]
            b = capture.pixels[p + 2]
            let brightness = (r * 2 + g * 3 + b) / 6
            if (brightness > brightnessThreshold) {
                checkboxes[j * hAmount + i].checked(false)
            } else {
                checkboxes[j * hAmount + i].checked(true)
            }
            fill(color(r, g, b))
            //circle(hPadding + i * gridSize, paddingTop + vPadding + j * gridSize, 20)
        }
    }
    capture.updatePixels()
}