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

let div

function setup () {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')

    createCanvas(windowWidth, windowHeight)

    div = createDiv('');
    createCheckboxes()

    //capture and scale
    capture = createCapture(VIDEO)
    capture.hide()
    scaling()
    noStroke()
}

function createCheckboxes () {
    //clean up check boxes
    div.remove()
    div = createDiv('');
    checkboxes = []
    //checkboxes
    hAmount = int(windowWidth / gridSize)
    vAmount = int((windowHeight - paddingTop) / gridSize)
    hPadding = windowWidth % gridSize / 2
    vPadding = (windowHeight - paddingTop) % gridSize / 2
    for (let j = 0; j < vAmount; j++) {
        for (let i = 0; i < hAmount; i++) {
            let checkbox = createCheckbox('', true).parent(div)
            checkbox.position(hPadding + i * gridSize, paddingTop + vPadding + j * gridSize);
            checkboxes.push(checkbox)
        }
    }
}
function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
    createCheckboxes()
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
    background(0)
    scaling()
    capture.loadPixels()
    for (let j = 0; j < vAmount; j++) {
        for (let i = 0; i < hAmount; i++) {
            let start = (captureStartY * capture.width + captureStartX) * 4
            let p = start + (j * capture.width * captureScale + i * captureScale) * 4
            r = capture.pixels[p]
            g = capture.pixels[p + 1]
            b = capture.pixels[p + 2]
            let brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b
            if (brightness > brightnessThreshold) {
                checkboxes[j * hAmount + i].checked(false)
            } else {
                checkboxes[j * hAmount + i].checked(true)
            }
        }
    }
    capture.updatePixels()
}