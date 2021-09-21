let creatingShape = false
let shapeSize = 0
let shapeSizeIncreasingSpeed = 1
let newShape = {}
let shapeQueue = []
const shapePerCircle = 200
const shapeInterval = 20
let graphic

function setup () {
    createCanvas(windowWidth, windowHeight)
    background(0)
    stroke(255)
    rectMode(CENTER)
    noFill()
    graphic = createGraphics(windowWidth, windowHeight);
    graphic.rectMode(CENTER)
    graphic.noFill()

}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
    graphic.resizeCanvas(windowWidth, windowHeight)
}

function mousePressed () {
    creatingShape = true
}

function mouseReleased () {
    creatingShape = false
    //shapeQueue.push({ shape: newShape, count: 1 })
    shapeSize = 0
    let s = newShape
    for (let i = 0; i < shapePerCircle; i++) {
        setTimeout(() => {
            graphic.push()
            graphic.translate(windowWidth / 2, windowHeight / 2)
            graphic.rotate(i * PI / shapePerCircle * 2)
            graphic.rect(s.x - windowWidth / 2, s.y - windowHeight / 2, s.size, s.size)
            graphic.pop()
        }, i * shapeInterval)
    }
}

function draw () {
    background(255)
    stroke(0)

    if (creatingShape) {
        shapeSize += shapeSizeIncreasingSpeed
        newShape = { x: mouseX, y: mouseY, size: shapeSize }
        rect(newShape.x, newShape.y, newShape.size, newShape.size)
    }

    image(graphic, 0, 0, windowWidth, windowHeight)

    /*
    shapeQueue.forEach(d => {
        for (let i = 0; i < d.count; i++) {
            push()
            translate(windowWidth / 2, windowHeight / 2)
            rotate(i * PI / shapePerCircle * 2)
            rect(d.shape.x - windowWidth / 2, d.shape.y - windowHeight / 2, d.shape.size, d.shape.size)
            pop()
        }
        if (d.count < shapePerCircle) {
            d.count++
        }
    })*/
}