let subjects = ['HUMAN', 'RABBITS', 'FOXES']
let animations = ['slideOutDown', 'slideOutUp', 'zoomOut']
let actions = {
    'slideOutDown': 'FALL OUT OF THE WORLD',
    'slideOutUp': 'JUMP THROUGH THE SKY',
    'zoomOut': 'COLLAPSE INTO A VOID',
}
let textHeight = 20

let subject
let animation

let oldSubject
let oldAnimation

let animatedText
let firstTextQueue = []
let secondTextQueue = []

let canvas;
function setup () {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
    textSize(32)
    if (windowWidth < 960) {
        textSize(16)
    }
    newLine()
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
    if (windowWidth < 960) {
        textSize(16)
    }
}

let count = 0
let max = 3
let delta = 2000

function newLine () {
    count++
    while (subject == oldSubject) {
        subject = random(subjects);
    }
    oldSubject = subject;

    while (animation == oldAnimation) {
        animation = random(animations);
    }
    oldAnimation = animation;

    animatedText = new AnimatedText(subject, width / 6 + 220, 200 * count, color(255), animation, delta)
    if (windowWidth < 960) {
        animatedText = new AnimatedText(subject, width / 6 + 110, 200 * count, color(255), animation, delta)
    }

    firstTextQueue.push(({ str: "A GROUP OF ", x1: width / 6, y1: 200 * count }))
    secondTextQueue.push(({ str: actions[animation], x1: width / 6, y1: 200 * count + 50 }))

    if (count < 3) {
        setTimeout(newLine, delta)
    }
}

function draw () {
    background(0)

    fill(255)
    firstTextQueue.forEach(d => {
        text(d.str, d.x1, d.y1)
    })

    secondTextQueue.forEach(d => {
        if (windowWidth < 960) {
            text(d.str, d.x1, d.y1)
        } else {
            text(d.str, d.x1 + 500, d.y1 - 50)
        }
    })

    animatedText.render()

}
