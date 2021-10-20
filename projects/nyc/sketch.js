let textureCount = 361
let texture = []
let textureSize = 512
let boxSize = 4
let boxHeight = 40
let canvas;
function setup () {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
    pixelDensity(1);
    camera(0, 200, 500, 0, 0, 0)
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
}
function preload () {
    for (let i = 0; i < textureCount; i++) {
        let t = loadImage(`assets/${i}.png`)
        texture.push(t)
    }
}

function mouseClicked () {

}

function draw () {
    background(color('#fcfdbf'))
    //image(texture[0], -textureSize / 2, -textureSize / 2)
    texture[360].loadPixels()
    for (let j = 0; j < textureSize / boxSize; j++) {
        for (let i = 0; i < textureSize / boxSize; i++) {
            let p = (j * boxSize * textureSize + i * boxSize) * 4
            let r = texture[360].pixels[p] / 255
            push()
            //scale according to screem
            if (windowWidth <= 1920) {
                scale(map(windowWidth / 1920, 0, 1, 0.8, 1))
            } else {
                scale(windowWidth / 1920)
            }

            let cr = constrain((pow(r, 1.5) * 0.8 + 0.2) * r * 0.85, 0.0, 1.0) * 255
            let cg = constrain((pow(r, 1.5) * 0.8 + 0.2) * (r * 0.5), 0.0, 1.0) * 255
            let cb = constrain((pow(r, 1.5) * 0.8 + 0.2) * max(1.0 - r * 1.7, r * 7.0 - 6.0), 0.0, 1.0) * 255
            fill(color(cr, cg, cb))

            translate(-256, -256)
            translate(i * boxSize, j * boxSize)
            if ((1 - r)) {
                translate(0, 0, (1 - r) * boxHeight / 2)
                box(boxSize, boxSize, (1 - r) * boxHeight)
            }
            pop()
        }
    }
    texture[360].updatePixels()
}