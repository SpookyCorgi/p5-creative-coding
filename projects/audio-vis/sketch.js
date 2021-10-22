let canvas
let myShader
let matcap
let song
let amp
let translation

function preload () {
    soundFormats('wav');
    song = loadSound('2.35am.wav')

    myShader = loadShader("shader.vert", "shader.frag");
    matcap = loadImage("422509_C89536_824512_0A0604.png");
}

function setup () {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
    amp = new p5.Amplitude()
    noStroke()
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
}

function mouseClicked () {
    if (!song.isPlaying()) {
        song.play(0, 1, 1, 16)
    } else {
        song.stop()
    }
}

function draw () {
    let vol = map(amp.getLevel(), 0, 1, 0.7, 1.3)
    shader(myShader)
    myShader.setUniform("uMatcapTexture", matcap)
    background(0)

    push()
    rotateX(millis() / 2000)
    rotateY(millis() / 3000)
    rotateZ(millis() / 4000)
    torus(height / 4 * vol, height / 12 * vol, 48, 32)
    pop()

    push()
    rotateX(millis() / 4000)
    rotateY(millis() / 2000)
    rotateZ(millis() / 3000)
    torus(height / 12 * vol, height / 36 * vol, 48, 32)
    pop()
}