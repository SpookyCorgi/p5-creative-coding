let canvas
function setup () {
    canvas = createCanvas(windowWidth * 2, windowHeight * 2, WEBGL);
    noLoop()
    noFill()
    stroke("#ccffff66")
    strokeWeight(1)
    rectMode(CENTER)
    canvas.position(-windowWidth / 2, -windowHeight / 2)
    canvas.style('z-index', '-1')
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