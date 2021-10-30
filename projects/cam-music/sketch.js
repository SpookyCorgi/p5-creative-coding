let canvas

let hAmount
let vAmount
let hPadding
let vPadding
let paddingTop = 60
let gridSize = 40

let capture
let captureStartX = 0
let captureStartY = 0
let captureScale = 1
let captureWidth
let captureHeight

let slider

let step = 0
let now = 0
let then = 0

let state = 'play'

let sinOsc
let triOsc
let sqrOsc
let colR = 0
let colG = 0
let colB = 0

function setup () {
    canvas = createCanvas(windowWidth, windowHeight)
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
    slider = createSlider(10, 100, 20);
    slider.position(windowWidth / 2 - 80, 30);
    slider.style('width', '160px')

    sinOsc = new p5.Oscillator('sine')
    triOsc = new p5.Oscillator('triangle')
    sqrOsc = new p5.Oscillator('square')

    sinOsc.start()
    triOsc.start()
    sqrOsc.start()
}

function sizing () {
    //checkboxes
    hAmount = Math.floor(windowWidth / gridSize)
    vAmount = Math.floor((windowHeight - paddingTop) / gridSize)
    hPadding = (windowWidth - gridSize * hAmount) / 2
    vPadding = (windowHeight - paddingTop - gridSize * vAmount) / 2
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

function mouseClicked () {
    if (mouseY > paddingTop) {
        if (state == 'play') {
            state = 'pause'
            sinOsc.stop()
            triOsc.stop()
            sqrOsc.stop()
        } else {
            state = 'play'
            sinOsc.start()
            triOsc.start()
            sqrOsc.start()
        }
    }
}

function draw () {
    gridSize = slider.value()
    sizing()
    scaling()

    background(0)
    colR = 0
    colG = 0
    colB = 0
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
            translate(hPadding + i * gridSize + gridSize / 2, paddingTop + vPadding + j * gridSize + gridSize / 2)
            fill(r, g, b)
            rect(0, 0, gridSize, gridSize)
            pop()

            if (i == step) {
                colR += r
                colG += g
                colB += b
            }
        }
    }
    colR = colR / vAmount
    colG = colG / vAmount
    colB = colB / vAmount

    capture.updatePixels()
    let c = color(0, 255, 0)
    c.setAlpha(128)
    fill(c)
    rect(hPadding + gridSize / 2 + gridSize * step, vPadding + paddingTop + gridSize * vAmount / 2, gridSize, gridSize * vAmount)

    now = millis()
    if (state == 'play') {
        if (now - then > 100) {
            then = millis()
            step++
        }
    }
    if (step >= hAmount) {
        step = 0
    }

    sinOsc.freq(pow(colR, 1.4), 0.1);
    triOsc.freq(pow(colG, 1.4), 0.1);
    sqrOsc.freq(pow(colB, 1.4), 0.1);
    sinOsc.amp(0.3, 0.1)
    triOsc.amp(0.3, 0.1)
    sqrOsc.amp(0.3, 0.1)
}