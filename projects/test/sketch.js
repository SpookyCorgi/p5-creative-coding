function preload () {

}

function setup () {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
    rectMode(CENTER)
    noLoop()
}

function draw () {
    background(255)
    for (let i = 0; i < 10; i++) {
        let x1 = random(windowWidth)
        let y1 = random(windowHeight)
        let angle = random(TWO_PI)
        push()
        fill(0)
        rotate(angle)
        rect(x1, y1, 2000, 100)
        pop()
    }
}