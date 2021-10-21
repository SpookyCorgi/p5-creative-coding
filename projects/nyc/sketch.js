let textureCount = 361
let texture = []
let textureSize = 256
let boxSize = 4
let boxHeight = 40
let canvas
let myShader
function setup () {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
    pixelDensity(1);
    camera(0, 250, 500, 0, 0, 0)
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
}
function preload () {
    //the shader is based on https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/2_texture-coordinates/2-3_gradient
    myShader = loadShader("shader.vert", "shader.frag")
    for (let i = 0; i < textureCount; i++) {
        let t = loadImage(`assets/${i}.png`)
        texture.push(t)
    }
}

function mouseClicked () {

}

function smoothstep (edge0, edge1, x) {
    // Scale, bias and saturate x to 0..1 range
    x = constrain((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    // Evaluate polynomial
    return x * x * (3 - 2 * x);
}
let t = 0
let now = 0
let then = 0
function draw () {
    shader(myShader);
    myShader.setUniform("uBaseHeight", boxHeight / 2);
    background(color('#fcfdbf'))
    //image(texture[0], -textureSize / 2, -textureSize / 2)
    now = millis()
    let delta = now - then
    if (delta > (1000 / 30)) {
        then = now
        t++
    }
    console.log(frameRate())
    if (t > 360) {
        t = 0
    }

    texture[t].loadPixels()
    for (let j = 0; j < textureSize / boxSize; j++) {
        for (let i = 0; i < textureSize / boxSize; i++) {
            let p = (j * boxSize * textureSize + i * boxSize) * 4
            let r = texture[t].pixels[p] / 255
            push()
            //scale according to screem
            if (windowWidth <= 1920) {
                scale(map(windowWidth / 1920, 0, 2, 1.6, 2))
            } else {
                scale(windowWidth / 1920)
            }
            if (r == 0) {
                fill(255 * 0.3)
            } else if (r > 0 && r < 0.15) {
                fill(0)
            } else {
                let cr = constrain((pow(r, 1.5) * 0.8 + 0.2) * (smoothstep(0, 0.35, r) + r * 0.5), 0.0, 1.0) * 255
                let cg = constrain((pow(r, 1.5) * 0.8 + 0.2) * (smoothstep(0.5, 1, r)), 0.0, 1.0) * 255
                let cb = constrain((pow(r, 1.5) * 0.8 + 0.2) * max(1.0 - r * 1.7, r * 7.0 - 6.0), 0.0, 1.0) * 255
                fill(color(cr, cg, cb))
            }

            translate(-textureSize / 2, -textureSize / 2)
            translate(i * boxSize, j * boxSize)
            if ((1 - r)) {
                translate(0, 0, (1 - r) * boxHeight / 2)
                box(boxSize, boxSize, (1 - r) * boxHeight)
            }
            pop()
        }
    }
    texture[t].updatePixels()
}