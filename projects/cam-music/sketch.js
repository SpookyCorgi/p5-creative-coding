let canvas

let amount
let hPadding
let vPadding
let paddingTop = 120
let gridSize

let capture
let captureStartX = 0
let captureStartY = 0
let captureScale = 1
let captureWidth
let captureHeight

let round = 0
let side = 0
let noteAtSide = 0
let playX = 0
let playY = 0

let now = 0
let then = 0

let state = 'play'

let sinOsc
let triOsc
let sqrOsc
let colR = 0
let colG = 0
let colB = 0

let gridAmountInput
let soundAmountInput

//assume each note is a eighth note, with 120 bpm, 16 notes will 2 bars, 8 second
let gridAmount = 4
let soundAmount = 2

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

    gridAmountInput = createInput(gridAmount)
    gridAmountInput.position(windowWidth / 2 + 40, 80)
    gridAmountInput.size(40)
    gridAmountInput.input(gridAmountInputChange)
    soundAmountInput = createInput(soundAmount)
    soundAmountInput.position(windowWidth / 2 + 40, 110)
    soundAmountInput.size(40)
    soundAmountInput.input(soundAmountInputChange)

    sinOsc = new p5.Oscillator('sine')
    triOsc = new p5.Oscillator('triangle')
    sqrOsc = new p5.Oscillator('square')

    sinOsc.start()
    triOsc.start()
    sqrOsc.start()
}

function sizing () {
    //checkboxes
    amount = gridAmount * soundAmount
    if (windowWidth > windowHeight) {
        gridSize = int((windowHeight - paddingTop) / amount)
    } else {
        gridSize = int(windowWidth / amount)
    }
    hPadding = (windowWidth - gridSize * amount) / 2
    vPadding = (windowHeight - paddingTop - gridSize * amount) / 2
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
}

function scaling () {
    //auto scale and clip capture to the screensize
    let captureRatio = capture.width / capture.height

    if (captureRatio < 1) {
        captureStartY = int((capture.height - capture.width) / 2)
        captureScale = int(capture.width / amount)
    } else {
        captureStartX = int((capture.width - capture.height) / 2)
        captureScale = int(capture.height / amount)
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

function gridAmountInputChange () {
    gridAmount = this.value()
}

function soundAmountInputChange () {
    soundAmount = this.value()
}

function draw () {
    sizing()
    scaling()

    background(0)

    textSize(24)
    fill(255)
    text('Note per side: ', windowWidth / 2 - 120, 100)
    text('Sound per note: ', windowWidth / 2 - 142, 130)

    colR = 0
    colG = 0
    colB = 0
    capture.loadPixels()
    for (let j = 0; j < amount; j++) {
        for (let i = 0; i < amount; i++) {
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

    for (let i = 0; i < gridAmount; i++) {
        for (let j = 0; j < gridAmount; j++) {
            push()
            translate(hPadding + i * gridSize * soundAmount + gridSize * soundAmount / 2, paddingTop + vPadding + j * gridSize * soundAmount + gridSize * soundAmount / 2)

            noFill()
            stroke(color(0))
            strokeWeight(5)
            rect(0, 0, gridSize * soundAmount, gridSize * soundAmount)

            pop()
        }
    }
    colR = colR / amount
    colG = colG / amount
    colB = colB / amount

    capture.updatePixels()
    let c = color(0, 255, 0)
    c.setAlpha(128)
    fill(c)
    rect(hPadding + gridSize / 2 + gridSize * step, vPadding + paddingTop + gridSize * amount / 2, gridSize, gridSize * amount)

    now = millis()
    if (state == 'play') {
        if (now - then > 100) {
            then = millis()
            switch (side) {
                case 0:
                    x++
                case 1:
                    y++
                case 2:
                    x--
                case 3:
                    y--
            }
        }
    }
    if (step >= amount) {
        step = 0
    }

    sinOsc.freq(pow(colR, 1.4), 0.1);
    triOsc.freq(pow(colG, 1.4), 0.1);
    sqrOsc.freq(pow(colB, 1.4), 0.1);
    sinOsc.amp(0.3, 0.1)
    triOsc.amp(0.3, 0.1)
    sqrOsc.amp(0.3, 0.1)
}