let canvas

//composition
let smallGridAmount
let marginLeft
let extraMarginTop = 120
let extraMarginDown = 20
let extraMarginX = 20
let smallGridSize
//capture
let capture
let captureStartX = 0
let captureStartY = 0
let captureScale = 1
let captureWidth
let captureHeight
//note playing
let gridMatrix = []
let noteX = 0
let noteY = 0
let direction = 0
let smallGridMatrix = []
//time
let now = 0
let then = 0
//state
let state = 'play'
//osc
let sinOsc
let triOsc
let sqrOsc
let colR = 0
let colG = 0
let colB = 0
//input
let gridAmountInput
let soundAmountInput
let inputMargin = 0

//main variables, assume each note is a eighth note, with 120 bpm, 16 notes will 2 bars, 8 second
let gridAmount = 4
let noteAmount = 2

function setup () {
    //p5 stuff
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
    noStroke()
    rectMode(CENTER)
    createCanvas(windowWidth, windowHeight)

    //draw the input
    gridAmountInput = createInput(gridAmount.toString(), 'number')
    gridAmountInput.position(windowWidth / 2 + 40, 30)
    gridAmountInput.size(40)
    gridAmountInput.input(gridAmountInputChange)
    soundAmountInput = createInput(noteAmount.toString(), 'number')
    soundAmountInput.position(windowWidth / 2 + 40, 60)
    soundAmountInput.size(40)
    soundAmountInput.input(noteAmountInputChange)


    //calculate the composition of grids and their padding
    sizing()

    //capture and scale
    capture = createCapture(VIDEO)
    capture.hide()
    scaling()

    //create osc
    sinOsc = new p5.Oscillator('sine')
    triOsc = new p5.Oscillator('triangle')
    sqrOsc = new p5.Oscillator('square')
    //sinOsc.start()
    //triOsc.start()
    //sqrOsc.start()

    gridMatrix = new Array(gridAmount * gridAmount).fill(0)
    smallGridMatrix = new Array(gridAmount * noteAmount * gridAmount * noteAmount).fill({ r: 0, g: 0, b: 0 })
}

function sizing () {
    //amount of grid per side
    smallGridAmount = gridAmount * noteAmount
    //calculate size of each grid
    if (windowWidth > windowHeight) {
        smallGridSize = int((windowHeight - extraMarginTop - extraMarginDown) / smallGridAmount)
    } else {
        smallGridSize = int((windowWidth - extraMarginX * 2) / smallGridAmount)
    }
    //calculate the padding outside grids
    marginLeft = (windowWidth - extraMarginX * 2 - smallGridSize * smallGridAmount) / 2 + extraMarginX
    marginTop = (windowHeight - extraMarginTop - extraMarginDown - smallGridSize * smallGridAmount) / 2 + extraMarginTop
    let vdistance = (windowHeight - smallGridSize * smallGridAmount) / 2
    if (extraMarginTop > 0) {
        if (vdistance > 200) {
            extraMarginTop = 0
            inputMargin = 50
            gridAmountInput.position(windowWidth / 2 + 40, 30 + inputMargin)
            soundAmountInput.position(windowWidth / 2 + 40, 60 + inputMargin)
            sizing()
        }
    }
}

function scaling () {
    //auto scale and clip capture to the screensize
    let captureRatio = capture.width / capture.height
    if (captureRatio < 1) {
        captureStartY = int((capture.height - capture.width) / 2)
        captureScale = int(capture.width / smallGridAmount)
    } else {
        captureStartX = int((capture.width - capture.height) / 2)
        captureScale = int(capture.height / smallGridAmount)
    }
}

function mouseClicked () {
    //if mouse is not at the input area
    if (mouseY > marginTop) {
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
//callback function when there is inputs
function gridAmountInputChange () {
    gridAmount = this.value()
    restartLoop()
}

function noteAmountInputChange () {
    noteAmount = this.value()
}

function restartLoop () {
    gridMatrix = new Array(gridAmount * gridAmount).fill(0)
    noteX = -1
    noteY = 0
    direction = 0

    smallGridMatrix = new Array(gridAmount * noteAmount * gridAmount * noteAmount).fill({ r: 0, g: 0, b: 0 })
}

function draw () {
    console.log(smallGridMatrix)
    sizing()
    scaling()

    background(255)

    //draw text for inputs
    textSize(24)
    fill(0)
    text('Grid per side: ', windowWidth / 2 - 133, 47 + inputMargin)
    text('Notes per grid: ', windowWidth / 2 - 146, 77 + inputMargin)
    //draw base
    fill(0)
    rect(marginLeft + smallGridSize * smallGridAmount / 2, marginTop + smallGridSize * smallGridAmount / 2, smallGridSize * smallGridAmount)
    //fill(64)
    //rect(marginLeft + smallGridSize * smallGridAmount / 2, marginTop + marginTop + smallGridSize * smallGridAmount / 2, smallGridSize * smallGridAmount + 20)

    //loadPixels
    colR = 0
    colG = 0
    colB = 0
    capture.loadPixels()
    //draw grids from capture color
    for (let j = 0; j < smallGridAmount; j++) {
        for (let i = 0; i < smallGridAmount; i++) {
            let start = (captureStartY * capture.width + captureStartX) * 4
            let p = start + (j * capture.width * captureScale + i * captureScale) * 4
            r = capture.pixels[p]
            g = capture.pixels[p + 1]
            b = capture.pixels[p + 2]
            let brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b
            push()
            translate(marginLeft + i * smallGridSize + smallGridSize / 2, marginTop + j * smallGridSize + smallGridSize / 2)
            noStroke()
            fill(r, g, b)
            rect(0, 0, smallGridSize * 19 / 20)
            pop()

            smallGridMatrix[smallGridAmount * j + i].r = r
            smallGridMatrix[smallGridAmount * j + i].g = g
            smallGridMatrix[smallGridAmount * j + i].b = b
        }
    }
    capture.updatePixels()

    //draw grid outline
    for (let i = 0; i < gridAmount; i++) {
        for (let j = 0; j < gridAmount; j++) {
            push()
            translate(marginLeft + i * smallGridSize * noteAmount + smallGridSize * noteAmount / 2, marginTop + j * smallGridSize * noteAmount + smallGridSize * noteAmount / 2)
            noFill()
            stroke(color(0))
            strokeWeight(10)
            rect(0, 0, smallGridSize * noteAmount, smallGridSize * noteAmount, 10)
            pop()
        }
    }

    //draw the current play note
    let c = color(255)
    stroke(c)
    strokeWeight(5)
    noFill()
    rect(marginLeft + noteX * smallGridSize * noteAmount + smallGridSize * noteAmount / 2, marginTop + noteY * smallGridSize * noteAmount + smallGridSize * noteAmount / 2, smallGridSize * noteAmount, smallGridSize * noteAmount, 10)
    c.setAlpha(128)
    fill(c)
    noStroke()
    rect(marginLeft + noteX * smallGridSize * noteAmount + smallGridSize * noteAmount / 2, marginTop + noteY * smallGridSize * noteAmount + smallGridSize * noteAmount / 2, smallGridSize * noteAmount)

    //timer
    now = millis()
    if (state == 'play') {
        if (now - then > 500) {
            then = millis()
            //if reached center restart the loop
            if (noteX == int((gridAmount - 1) / 2) && noteY == int(gridAmount / 2)) {
                restartLoop()
            }
            //set traversed grid as true
            gridMatrix[noteX + noteY * gridAmount] = 1
            //change directions
            switch (direction) {
                case 0:
                    noteX++
                    if (noteX == gridAmount || gridMatrix[noteX + noteY * gridAmount]) {
                        noteX--
                        noteY++
                        direction = 1
                    }
                    break
                case 1:
                    noteY++
                    if (noteY == gridAmount || gridMatrix[noteX + noteY * gridAmount]) {
                        noteY--
                        noteX--
                        direction = 2
                    }
                    break
                case 2:
                    noteX--
                    if (noteX == -1 || gridMatrix[noteX + noteY * gridAmount]) {
                        noteX++
                        noteY--
                        direction = 3
                    }
                    break
                case 3:
                    noteY--
                    if (noteY == -1 || gridMatrix[noteX + noteY * gridAmount]) {
                        noteY++
                        noteX++
                        direction = 0
                    }
                    break
            }
        }
    }

    //osc
    sinOsc.freq(pow(colR, 1.4), 0.1);
    triOsc.freq(pow(colG, 1.4), 0.1);
    sqrOsc.freq(pow(colB, 1.4), 0.1);
    sinOsc.amp(0.3, 0.1)
    triOsc.amp(0.3, 0.1)
    sqrOsc.amp(0.3, 0.1)
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
}
