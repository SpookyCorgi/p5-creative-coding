let gridSize = 50
let dominos = []
let paddingLeft = 0
let paddingTop = 0
let xAmount = 0
let yAmount = 0
let fallAmount = 0
let allFall = false
let canvas
function setup () {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
    background(255)
    fill(0)
    rectMode(CENTER)
    noStroke()
    init()
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
    init()
}

//mousepressed will be triggered twice on mobile so clicked is used
function mouseClicked () {
    //if all dominos fell and a click is detected, restart
    if (allFall) {
        for (let i = 0; i < xAmount; i++) {
            for (let j = 0; j < yAmount; j++) {
                dominos[i][j].standUp()
            }
        }
        fallAmount = 0
    } else {
        //make the domino pointed fall
        let x = int((mouseX - paddingLeft) / gridSize)
        let y = int((mouseY - paddingTop) / gridSize)
        dominos[x][y].fall()
    }
}

function init () {
    //responsive padding and amount of dominos
    paddingLeft = windowWidth % gridSize / 2
    paddingTop = windowHeight % gridSize / 2 + gridSize
    xAmount = int(windowWidth / gridSize)
    yAmount = int(windowHeight / gridSize) - 1
    //setup up dominos for every window resize
    dominos = new Array(xAmount)
    for (let i = 0; i < xAmount; i++) {
        dominos[i] = new Array(yAmount)
        for (let j = 0; j < yAmount; j++) {
            let domino = new Domino(i, j, paddingLeft + i * gridSize, paddingTop + j * gridSize, gridSize, gridSize)
            dominos[i][j] = domino
        }
    }
}

function draw () {
    background(255)
    stroke(0)
    //display the dominos
    for (let i = 0; i < xAmount; i++) {
        for (let j = 0; j < yAmount; j++) {
            dominos[i][j].display()
        }
    }
    //if the amount of fell dominos are the same as the total amount, return true
    allFall = (fallAmount == xAmount * yAmount) ? true : false
    //show restart screen
    if (allFall) {
        fill(color(0, 0, 0, 150))
        rect(windowWidth / 2, windowHeight / 2, windowWidth, windowHeight)
        fill(255)
        textSize(32)
        textAlign(CENTER)
        text('Click to restart!!', windowWidth / 2, windowHeight / 2);
    }
}

class Domino {
    state = "still"
    angle = 0
    dir = 1
    constructor(i, j, x, y, w, h) {
        this.i = i
        this.j = j
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
    display () {
        fill(0)
        //if the state is not fall, wiggle according to where the cursor is pointing at
        if (this.state != "fall") {
            if (mouseX > this.x && mouseX <= this.x + this.w && mouseY > this.y && mouseY <= this.y + this.h) {
                this.state = "wiggle"
            } else {
                this.state = "still"
            }
        }
        //angle according to the state
        if (this.state == "wiggle") {
            if (this.angle > PI / 4 || this.angle < -PI / 4) {
                this.dir = -this.dir
            }
            this.angle += this.dir * 0.2
        } else if (this.state == "still") {
            this.angle = 0
        }
        //wiggle animation
        push()
        translate(this.x + this.w / 2, this.y + this.h / 2)
        rotate(this.angle)
        rect(0, 0, this.w / 5, this.h / 5 * 3)
        pop()
    }

    //fall function
    fall () {
        //this if is ultra important cuz if you don't do this the fall function will run through dominos multiple times and the pc will lagged out
        if (this.state != "fall") {
            fallAmount++
            this.state = "fall"
            this.angle = PI / 2
            setTimeout(() => {
                //make surrounding dominos fall too
                if (this.i < xAmount - 1) {
                    dominos[this.i + 1][this.j].fall()
                }
                if (this.i > 0) {
                    dominos[this.i - 1][this.j].fall()
                }
                if (this.j < yAmount - 1) {
                    dominos[this.i][this.j + 1].fall()
                }
                if (this.j > 0) {
                    dominos[this.i][this.j - 1].fall()
                }
            }, 200)
        }
    }
    //stand up my little dominos
    standUp () {
        this.state = "still"
        this.angle = 0
    }
}
//prevent context menu when long touch
window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};