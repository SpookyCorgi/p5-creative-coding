let gridSize = 50
let dominos = []
let paddingLeft = 0
let paddingTop = 0
let xAmount = 0
let yAmount = 0
function setup () {
    createCanvas(windowWidth, windowHeight)
    background(255)
    fill(0)
    rectMode(CENTER)
    init()
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
    init()
}

function mousePressed () {
    let allFall = true
    for (let i = 0; i < xAmount; i++) {
        for (let j = 0; j < yAmount; j++) {
            if (dominos[i][j].state != "fall") {
                allFall = false
            }
        }
    }

    if (allFall) {
        for (let i = 0; i < xAmount; i++) {
            for (let j = 0; j < yAmount; j++) {
                dominos[i][j].standUp()
            }
        }
        console.log('a')
    } else {
        let x = int((mouseX - paddingLeft) / gridSize)
        let y = int((mouseY - paddingTop) / gridSize)
        dominos[x][y].fall()
        console.log('b')
    }
}

function init () {
    paddingLeft = windowWidth % gridSize / 2
    paddingTop = windowHeight % gridSize / 2
    xAmount = int(windowWidth / gridSize)
    yAmount = int(windowHeight / gridSize)
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

    for (let i = 0; i < xAmount; i++) {
        for (let j = 0; j < yAmount; j++) {
            dominos[i][j].display()
        }
    }
}

class Domino {
    state = "still"
    x = 0
    y = 0
    w = 0
    h = 0
    i = 0
    j = 0
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
        if (this.state != "fall") {
            if (mouseX > this.x && mouseX <= this.x + this.w && mouseY > this.y && mouseY <= this.y + this.h) {
                this.state = "wiggle"
            } else {
                this.state = "still"
            }
        }

        if (this.state == "wiggle") {
            if (this.angle > PI / 4 || this.angle < -PI / 4) {
                this.dir = -this.dir
            }
            this.angle += this.dir * 0.2
        } else if (this.state == "still") {
            this.angle = 0
        }

        push()
        translate(this.x + this.w / 2, this.y + this.h / 2)
        rotate(this.angle)
        rect(0, 0, this.w / 5, this.h / 5 * 3)
        pop()
    }

    fall () {
        if (this.state != "fall") {
            this.state = "fall"
            this.angle = PI / 2
            setTimeout(() => {
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

    standUp () {
        this.state = "still"
    }
}
//prevent context menu when long touch
window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};