let canvas
function setup () {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    noLoop()
    noFill()
    stroke("#ccffff66")
    strokeWeight(1)
    rectMode(CENTER)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)//resize canvas when window is resized
}

let count = 5
function draw () {
    background(0);
    for (let i = 0; i < count; i++) {
        rotateX(random(PI * 2))
        rotateY(random(PI * 2))
        rotateZ(random(PI * 2))
        rect(0, 0, width, height)
    }
}