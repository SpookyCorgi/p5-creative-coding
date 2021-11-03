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
let img
let mediaStartX = 0
let mediaStartY = 0
let mediaScale = 1
let screenCaptureScale = 1
let captureStartX = 0
let captureStartY = 0
//note playing
let noteX = 0
let noteY = 0
let smallGridMatrix = []
//time
let now = 0
let then = 0
//state
let state = 'play'
let mode = 'capture'
//osc
let colR = 0
let colG = 0
let colB = 0
let oscillators = []
let oscillatorLimit = 16
//input
let gridAmountInput
let soundAmountInput
let inputMargin = 0

//main variables, assume each note is a eighth note, with 120 bpm, 16 notes will 2 bars, 8 second
let gridAmount = 4
let noteAmount = 1

//bpm
let timeInterval = 500

function preload () {
    //img = loadImage('img.png');
}

function setup () {
    //p5 stuff
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
    noStroke()
    rectMode(CENTER)
    textAlign(RIGHT)
    createCanvas(windowWidth, windowHeight)

    //draw the input
    gridAmountInput = createSlider(1, 10, 4)
    gridAmountInput.position(windowWidth / 2, 25)
    gridAmountInput.size(100)
    gridAmountInput.input(gridAmountInputChange)
    soundAmountInput = createSlider(1, 4, 1)
    soundAmountInput.position(windowWidth / 2, 50)
    soundAmountInput.size(100)
    soundAmountInput.input(noteAmountInputChange)

    //capture and scale
    capture = createCapture(VIDEO)
    capture.hide()

    gridMatrix = new Array(gridAmount * gridAmount).fill(0)
    for (let i = 0; i < gridAmount * noteAmount * gridAmount * noteAmount; i++) {
        let obj = { r: 0, g: 0, b: 0 }
        smallGridMatrix.push(obj)
    }

    //create oscillators
    for (let i = 0; i < oscillatorLimit; i++) {
        let o = new p5.Oscillator("sine");
        o.freq(0, 0);
        o.amp(0, 0);
        oscillators.push(o);
        o.start()
    }
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
    if (windowWidth < 1080 && extraMarginTop) {
        extraMarginTop = 0
        inputMargin = 50
        gridAmountInput.position(windowWidth / 2, 25 + inputMargin)
        soundAmountInput.position(windowWidth / 2, 50 + inputMargin)
        sizing()
    }
}

function imgScaling (media) {
    //auto scale and clip capture to the screensize
    mediaScale = int(media.width / smallGridAmount)
}

function captureScaling (media) {
    let mediaRatio = media.width / media.height
    let screenRatio = windowWidth / windowHeight
    if (screenRatio > mediaRatio) {
        screenCaptureScale = windowWidth / media.width
        captureStartY = abs(windowHeight - media.height * screenCaptureScale) / 2
    } else {
        screenCaptureScale = windowHeight / media.height
        captureStartX = abs(windowWidth - media.width * screenCaptureScale) / 2
    }
}

function mouseClicked () {
    //if mouse is not at the input area
    if (mouseY > marginTop) {
        if (state == 'play') {
            state = 'pause'
            oscillators.forEach(d => {
                d.stop()
            })
        } else {
            state = 'play'
            oscillators.forEach(d => {
                d.start()
            })
        }

        if (mode == 'capture') {
            img = capture.get(int((captureStartX + marginLeft) / screenCaptureScale),
                int((captureStartY + marginTop) / screenCaptureScale),
                int(gridAmount * smallGridSize * noteAmount / screenCaptureScale),
                int(gridAmount * smallGridSize * noteAmount / screenCaptureScale))
            mode = 'play'
        }
    }
}
//callback function when there is inputs
function gridAmountInputChange () {
    gridAmount = this.value()
    noteX = 0
    noteY = 0
    smallGridMatrix = []
    for (let i = 0; i < gridAmount * noteAmount * gridAmount * noteAmount; i++) {
        let obj = { r: 0, g: 0, b: 0 }
        smallGridMatrix.push(obj)
    }
    oscillators.forEach(d => {
        d.freq(0, 0);
        d.amp(0, 0);
    })
}

function noteAmountInputChange () {
    noteAmount = this.value()
    smallGridMatrix = []
    for (let i = 0; i < gridAmount * noteAmount * gridAmount * noteAmount; i++) {
        let obj = { r: 0, g: 0, b: 0 }
        smallGridMatrix.push(obj)
    }
    oscillators.forEach(d => {
        d.freq(0, 0);
        d.amp(0, 0);
    })
}

function draw () {
    sizing()
    if (mode == 'capture') {
        //scale capture
        captureScaling(capture)
        //draw capture
        image(capture, -captureStartX, -captureStartY, capture.width * screenCaptureScale, capture.height * screenCaptureScale)
        //black border
        let c = color(0, 0, 0)
        c.setAlpha(160)
        noStroke()
        fill(c)
        rect(windowWidth / 2, marginTop / 2, windowWidth, marginTop)
        rect(marginLeft / 2, marginTop + (windowHeight - marginTop) / 2, marginLeft, (windowHeight - marginTop))
        rect(marginLeft + gridAmount * smallGridSize * noteAmount + marginLeft / 2, marginTop + (windowHeight - marginTop) / 2, marginLeft, (windowHeight - marginTop))
        rect(windowWidth / 2, (marginTop + gridAmount * smallGridSize * noteAmount) / 2 + windowHeight / 2, windowWidth - marginLeft * 2, windowHeight - (marginTop + gridAmount * smallGridSize * noteAmount))
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
        //draw smallgrids
        for (let j = 0; j < smallGridAmount; j++) {
            for (let i = 0; i < smallGridAmount; i++) {
                noFill()
                stroke(color(0))
                strokeWeight(3)
                rect(marginLeft + i * smallGridSize + smallGridSize / 2, marginTop + j * smallGridSize + smallGridSize / 2, smallGridSize, smallGridSize)
            }
        }
        //draw input text
        textSize(16)
        fill(255)
        //strokeWidth(1)
        text('Grid per side: ', windowWidth / 2, 40 + inputMargin)
        text('Notes per grid: ', windowWidth / 2, 65 + inputMargin)
    } else {
        imgScaling(img)
        background(255)
        //draw text for inputs
        textSize(16)
        fill(0)
        text('Grid per side: ', windowWidth / 2, 40 + inputMargin)
        text('Notes per grid: ', windowWidth / 2, 65 + inputMargin)
        //draw base
        fill(0)
        rect(marginLeft + smallGridSize * smallGridAmount / 2, marginTop + smallGridSize * smallGridAmount / 2, smallGridSize * smallGridAmount)

        colR = 0
        colG = 0
        colB = 0

        img.loadPixels()
        //draw grids from capture color
        for (let j = 0; j < smallGridAmount; j++) {
            for (let i = 0; i < smallGridAmount; i++) {
                let start = (mediaStartY * img.width + mediaStartX) * 4
                let p = start + (int((j + 0.5) * img.width * mediaScale) + int((i + 0.5) * mediaScale)) * 4
                let r = img.pixels[p]
                let g = img.pixels[p + 1]
                let b = img.pixels[p + 2]
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
        img.updatePixels()

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

        //play the current note
        let startNote = noteX * noteAmount + noteY * smallGridAmount * noteAmount
        for (let i = 0; i < noteAmount; i++) {
            for (let j = 0; j < noteAmount; j++) {
                let note = smallGridMatrix[startNote + i + j * smallGridAmount]
                if (note) {
                    oscillators[i + j * noteAmount].freq(pow((note.r + note.g + note.b) / 3 / 4, 2));
                    oscillators[i + j * noteAmount].amp(1 / noteAmount / noteAmount)
                }
            }
        }

        //timer
        now = millis()
        if (state == 'play') {
            if (now - then > timeInterval) {
                then = millis()

                noteX++
                if (noteX == gridAmount) {
                    noteX = 0
                    noteY++
                }
                if (noteY == gridAmount) {
                    noteY = 0
                }
            }
        }
    }

}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
}
