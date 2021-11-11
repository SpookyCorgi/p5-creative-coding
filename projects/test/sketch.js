let londonMap
let mapWidth
let mapHeight
let mapScale

let data
let wellData
let fatalityData
let fatalityMin = 1000
let fatalityMax = 0

let West = -0.1424;
let East = -0.131;
let North = 51.5164;
let South = 51.5093;

let lonWidth
let latWidth

let canvas
function setup () {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')

    scaling()
    ellipseMode(CENTER)
    rectMode(CENTER)
    textAlign(RIGHT)

    lonWidth = East - West
    latWidth = North - South
}

function preload () {
    londonMap = loadImage('snow.png')
    data = loadTable('cholera.csv', 'csv', 'header', d => {
        fatalityData = d.rows.filter(d => d.obj.count != -999)
        fatalityData.forEach(d => {
            if (d.obj.count < fatalityMin) {
                fatalityMin = d.obj.count - 1 + 1
            }
            if (d.obj.count > fatalityMax) {
                fatalityMax = d.obj.count - 1 + 1
            }
        })
        wellData = d.rows.filter(d => d.obj.count == -999)
    })
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
    scaling()
}


function scaling () {
    mapRatio = londonMap.width / londonMap.height
    if (mapRatio > windowWidth / windowHeight) {
        mapHeight = londonMap.height * windowWidth / londonMap.width
        mapWidth = windowWidth
        mapScale = windowWidth / londonMap.width
    } else {
        mapHeight = windowHeight
        mapWidth = londonMap.width * windowHeight / londonMap.height
        mapScale = windowHeight / londonMap.height
    }
}

function draw () {
    scaling()
    background(0)
    image(londonMap, (windowWidth - mapWidth) / 2, (windowHeight - mapHeight) / 2, mapWidth, mapHeight)
    fatalityData.forEach(d => {
        let obj = d.obj
        fill(0)
        let r = map(obj.count, fatalityMin, fatalityMax, 3, 40)
        ellipse((windowWidth - mapWidth) / 2 + (obj.lon - West) / lonWidth * mapWidth,
            (windowHeight - mapHeight) / 2 + (North - obj.lat) / latWidth * mapHeight, r, r)
    })

    wellData.forEach(d => {
        let obj = d.obj
        fill(255, 0, 0)
        ellipse((windowWidth - mapWidth) / 2 + (obj.lon - West) / lonWidth * mapWidth,
            (windowHeight - mapHeight) / 2 + (North - obj.lat) / latWidth * mapHeight, 10, 10)
    })

    fill(255)
    rect((windowWidth - mapWidth) / 2 + 50, (windowHeight - mapHeight) / 2 + mapHeight - 50, 80, 80)
    noFill()
    stroke(0)
    textSize(12)
    ellipse((windowWidth - mapWidth) / 2 + 40, (windowHeight - mapHeight) / 2 + mapHeight - 50, 40, 40)
    text(fatalityMax, (windowWidth - mapWidth) / 2 + 75, (windowHeight - mapHeight) / 2 + mapHeight - 60)
    ellipse((windowWidth - mapWidth) / 2 + 40, (windowHeight - mapHeight) / 2 + mapHeight - 40, 20, 20)
    text(int(map(20, 3, 40, fatalityMin, fatalityMax)), (windowWidth - mapWidth) / 2 + 75, (windowHeight - mapHeight) / 2 + mapHeight - 45)
    ellipse((windowWidth - mapWidth) / 2 + 40, (windowHeight - mapHeight) / 2 + mapHeight - 35, 10, 10)
    text(int(map(10, 3, 40, fatalityMin, fatalityMax)), (windowWidth - mapWidth) / 2 + 75, (windowHeight - mapHeight) / 2 + mapHeight - 30)
}
