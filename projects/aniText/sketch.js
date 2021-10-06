let sel
let t
let str
let canvas
let button
let selectList = ['slideInLeft', 'slideInRight', 'slideInUp', 'slideInDown']
function setup () {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')

    sel = createSelect();
    sel.position(windowWidth / 2 - 160, windowHeight / 6)
    selectList.forEach(d => {
        sel.option(d)
    })
    sel.selected(selectList[0]);
    sel.changed(changeAnimation);

    textSize(64)
    changeAnimation()

    button = createButton('Repeat!')
    button.position(windowWidth / 2 + 60, windowHeight / 6)
    button.mousePressed(replayAnimation)
}

function changeAnimation () {
    let item = sel.value();
    t = new AniText(item, windowWidth / 2 - textWidth(item) / 2, windowHeight / 2 - 50, item)
}

function replayAnimation () {
    t.start()
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
}

function draw () {
    background(255)
    t.render()
}
//prevent context menu when long touch
window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};