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
let fileInput
let inputMargin = 0

//main variables, assume each note is a eighth note, with 120 bpm, 16 notes will 2 bars, 8 second
let gridAmount = 4
let noteAmount = 2

//bpm
let timeInterval = 500

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
    fileInput = createFileInput(handleFile);
    fileInput.position(windowWidth / 2 + 40, 90);

    //calculate the composition of grids and their padding
    sizing()

    //capture and scale
    capture = createCapture(VIDEO)
    capture.hide()
    scaling(capture)

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
    let vdistance = (windowHeight - smallGridSize * smallGridAmount) / 2
    if (extraMarginTop > 0) {
        if (vdistance > 200) {
            extraMarginTop = 0
            inputMargin = 50
            gridAmountInput.position(windowWidth / 2 + 40, 30 + inputMargin)
            soundAmountInput.position(windowWidth / 2 + 40, 60 + inputMargin)
            fileInput.position(windowWidth / 2 + 40, 90 + inputMargin)
            sizing()
        }
    }
}

function scaling (media) {
    //auto scale and clip capture to the screensize
    let mediaRatio = media.width / media.height
    if (mediaRatio < 1) {
        mediaStartY = int((media.height - media.width) / 2)
        mediaScale = int(media.width / smallGridAmount)
    } else {
        mediaStartX = int((media.width - media.height) / 2)
        mediaScale = int(media.height / smallGridAmount)
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
    }
}
//callback function when there is inputs
function gridAmountInputChange () {
    gridAmount = this.value()
    restartLoop()
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

function handleFile (file) {
    if (file.type === 'image') {
        loadImage(file.data, d => {
            img = d
        })
    } else {
        console.log('a')
        img = null
    }
}

function restartLoop () {
    gridMatrix = new Array(gridAmount * gridAmount).fill(0)
    noteX = -1
    noteY = 0
    direction = 0
}

function draw () {
    //loadPixels
    let media = img ? img : capture
    sizing()
    scaling(media)

    background(255)

    //draw text for inputs
    textSize(24)
    fill(0)
    text('Grid per side: ', windowWidth / 2 - 133, 47 + inputMargin)
    text('Notes per grid: ', windowWidth / 2 - 146, 77 + inputMargin)
    text('Upload image: ', windowWidth / 2 - 130, 107 + inputMargin)
    //draw base
    fill(0)
    rect(marginLeft + smallGridSize * smallGridAmount / 2, marginTop + smallGridSize * smallGridAmount / 2, smallGridSize * smallGridAmount)
    //fill(64)
    //rect(marginLeft + smallGridSize * smallGridAmount / 2, marginTop + marginTop + smallGridSize * smallGridAmount / 2, smallGridSize * smallGridAmount + 20)



    colR = 0
    colG = 0
    colB = 0

    media.loadPixels()
    //draw grids from capture color
    for (let j = 0; j < smallGridAmount; j++) {
        for (let i = 0; i < smallGridAmount; i++) {
            let start = (mediaStartY * media.width + mediaStartX) * 4
            let p = start + (j * media.width * mediaScale + i * mediaScale) * 4
            let r = media.pixels[p]
            let g = media.pixels[p + 1]
            let b = media.pixels[p + 2]
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
    media.updatePixels()

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


}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
}
