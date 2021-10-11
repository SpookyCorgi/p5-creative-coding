let canvas
let rot = []
const count = 5
function setup () {
    canvas = createCanvas(windowWidth * 2, windowHeight * 2, WEBGL);
    noFill()
    stroke("#ccffff66")
    strokeWeight(1)
    rectMode(CENTER)
    canvas.position(-windowWidth / 2, -windowHeight / 2)
    canvas.style('z-index', '-1')
    for (let i = 0; i < count; i++) {
        let v = createVector(random(PI * 2), random(PI * 2), random(PI * 2))
        rot.push(v)
    }
}


function draw () {
    background(0);
    rot.forEach(d => {
        push()
        rotateX(d.x + millis() / 100000)
        rotateY(d.y + millis() / 200000)
        rotateZ(d.z + millis() / 500000)
        rect(0, 0, width, height)
        pop()
    })
}