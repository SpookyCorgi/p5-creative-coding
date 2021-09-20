let rot = 0
let wScl = 1
let hScl = 1
let sclDir = 1
let xTrans = 0
let yTrans = 0

let creatingShape = false
let shapeSize = 0
let shapeSizeIncreasingSpeed = 1
let newShape = {}
let shapeQueue = []

function setup () {
    createCanvas(windowWidth, windowHeight)
    background(0)
    stroke(255, 100)
    rectMode(CENTER)
    noFill()
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
}

function mousePressed () {
    creatingShape = true
}

function mouseReleased () {
    creatingShape = false
    shapeQueue.push([newShape])
    shapeSize = 0
}

function draw () {
    background(255)
    stroke(0)

    if (creatingShape) {
        shapeSize += shapeSizeIncreasingSpeed
        let obj = { x: mouseX, y: mouseY, size: shapeSize, rot: 0 }
        newShape = Object.assign({}, obj)
        rect(obj.x, obj.y, obj.size, obj.size)
    }

    shapeQueue.forEach(shape => {
        shape.forEach(d => {
            push()
            translate(windowWidth / 2, windowHeight / 2)
            rotate(d.rot)
            rect(d.x - windowWidth / 2, d.y - windowHeight / 2, d.size, d.size)
            pop()
        })
        if (shape.length < 200) {
            shape.push({ x: shape[0].x, y: shape[0].y, size: shape[0].size, rot: shape.length * PI / 100 })
        }
    })
}