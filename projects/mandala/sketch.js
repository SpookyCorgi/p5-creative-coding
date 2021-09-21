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
    if (windowWidth > windowHeight) {
        graphic = createGraphics(windowWidth, windowWidth);
    } else {
        graphic = createGraphics(windowHeight, windowHeight);
    }

    graphic.rectMode(CENTER)
    graphic.noFill()

}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
    if (windowWidth > windowHeight) {
        graphic.resizeCanvas(windowWidth, windowWidth)
    } else {
        graphic.resizeCanvas(windowHeight, windowHeight)
    }
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
            if (windowWidth > windowHeight) {
                graphic.translate(windowWidth / 2, windowWidth / 2)
            } else {
                graphic.translate(windowHeight / 2, windowHeight / 2)
            }
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
    if (windowWidth > windowHeight) {
        image(graphic, 0, (windowHeight - windowWidth) / 2, windowWidth, windowWidth)
    } else {
        image(graphic, (windowWidth - windowHeight) / 2, 0, windowHeight, windowHeight)
    }

    if (windowWidth > windowHeight) {
        image(graphic, windowWidth / 2 - windowHeight / 2 - windowHeight / 4 - windowWidth / 4, windowHeight / 2 - windowWidth / 4, windowWidth / 2, windowWidth / 2)
        image(graphic, windowWidth / 2 + windowHeight / 2 + windowHeight / 4 - windowWidth / 4, windowHeight / 2 - windowWidth / 4, windowWidth / 2, windowWidth / 2)
        //image(graphic, windowWidth / 2 - windowHeight, windowHeight / 2 - windowWidth / 8, windowWidth / 4, windowWidth / 4)
        //image(graphic, windowWidth / 2 + windowHeight / 2, windowHeight / 2 - windowWidth / 8, windowWidth / 4, windowWidth / 4)
    } else {
        image(graphic, windowWidth / 2 - windowHeight / 4, windowHeight / 2 - windowWidth / 2 - windowWidth / 4 - windowHeight / 4, windowHeight / 2, windowHeight / 2)
        image(graphic, windowWidth / 2 - windowHeight / 4, windowHeight / 2 + windowWidth / 2 + windowWidth / 4 - windowHeight / 4, windowHeight / 2, windowHeight / 2)
        //image(graphic, windowWidth / 2 - windowHeight / 8, windowHeight / 2 - windowWidth, windowHeight / 4, windowHeight / 4)
        //image(graphic, windowWidth / 2 - windowHeight / 8, windowHeight / 2 + windowWidth / 2, windowHeight / 4, windowHeight / 4)
    }

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

window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};