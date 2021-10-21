let textureCount = 361
let texture = []
let textureSize = 256
let boxSize = 4
let boxHeight = 40.0
let canvas
let myShader
let scaling = 1

let t = 0
let now = 0
let then = 0
function setup () {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
    camera(0, 250, 500, 0, 0, 0)
    customScale()
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
    customScale()
}

function preload () {
    //the shader is based on last weeks shader and a loooot of try and error, I don't really know what Im doing tbh
    myShader = loadShader("shader.vert", "shader.frag")
    for (let i = 0; i < textureCount; i++) {
        let t = loadImage(`assets/${i}.png`)
        texture.push(t)
    }
}

function mouseClicked () {
    t = 0
}

function customScale () {
    if (windowWidth <= 1920) {
        scaling = map(windowWidth / 1920, 0, 2, 1.6, 2)
    } else {
        scaling = windowWidth / 1920
    }
}

function smoothstep (edge0, edge1, x) {
    // Scale, bias and saturate x to 0..1 range
    x = constrain((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    // Evaluate polynomial
    return x * x * (3 - 2 * x);
}

function draw () {
    background(color('#fcfdbf'))
    fill(color(0))
    //change frames
    now = millis()
    let delta = now - then
    if (delta > (1000 / 30)) {
        then = now
        if (t < 360) {
            t++
        }
    }
    //apply shader
    shader(myShader);
    myShader.setUniform("uBaseHeight", boxHeight * scaling);
    //load pixel arrays
    texture[t].loadPixels()
    for (let j = 0; j < textureSize / boxSize; j++) {
        for (let i = 0; i < textureSize / boxSize; i++) {
            let p = (j * boxSize * textureSize + i * boxSize) * 4
            let r = texture[t].pixels[p] / 255
            push()
            //scale according to screen
            scale(scaling)
            //translate to the pixel position
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

    $('#day').text(int(t / 12))
}